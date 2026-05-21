// sidepanel/panel.js
import {
  getAssignments, getTasks, upsertTask, deleteTask,
  formatDate, today, parseDate,
  getCurrentUser, pullFromSupabase, clearAuth, dedupeAssignmentsWithAI,
} from '../shared/storage.js';

// Expose helper to console for Task 5
window.activifyClearAuth = clearAuth;
import { sendMessage, applyTasksFromResponse, QUICK_PROMPTS } from './ai.js';

// ─── State ────────────────────────────────────────────────────────────────────
let currentTab = 'today';
let selectedWeekDay = today();
let upcomingFilter = 'all';
let editingTask = null;
let aiHistory = [];
let aiLoading = false;
let todayViewMode = 'list';
let weekViewMode = 'list';

// ─── Boot ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);

async function init() {
  // SINGLE auth check — remove all others
  const user = await getCurrentUser();
  if (!user) {
    window.location.replace('auth.html');
    return;
  }

  await pullFromSupabase().catch(() => {});
  await dedupeAssignmentsWithAI().catch(() => {});
  renderDateHero();
  renderWeekStrip();
  bindNav();
  bindScan();
  bindModal();
  bindSettings();
  bindAI();
  bindViewToggles();
  await renderAll();
}

// Global listener (outside init)
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'ACTIVIFY_REFRESH') {
    console.log('[Activify] Received ACTIVIFY_REFRESH message');
    dedupeAssignmentsWithAI().then(() => renderAll()).finally(() => {
      // Stop scan animations
      const btn = document.getElementById('btn-scan');
      if (btn) btn.classList.remove('spinning');
      const banner = document.getElementById('scan-banner');
      if (banner) banner.classList.add('hidden');
    });
  }
});

// ─── Date helpers ─────────────────────────────────────────────────────────────
function renderDateHero() {
  const now = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('today-day').textContent = days[now.getDay()];
  document.getElementById('today-date').textContent =
    `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}

function getWeekDates() {
  const now = new Date();
  const dow = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dow + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

// ─── View toggles ─────────────────────────────────────────────────────────────
function bindViewToggles() {
  document.getElementById('today-toggle-list').addEventListener('click', () => {
    todayViewMode = 'list';
    updateToggleUI('today');
    renderToday();
  });
  document.getElementById('today-toggle-cal').addEventListener('click', () => {
    todayViewMode = 'calendar';
    updateToggleUI('today');
    renderToday();
  });
  document.getElementById('week-toggle-list').addEventListener('click', () => {
    weekViewMode = 'list';
    updateToggleUI('week');
    renderWeekDay();
  });
  document.getElementById('week-toggle-cal').addEventListener('click', () => {
    weekViewMode = 'calendar';
    updateToggleUI('week');
    renderWeekDay();
  });
}

function updateToggleUI(view) {
  const mode = view === 'today' ? todayViewMode : weekViewMode;
  document.getElementById(`${view}-toggle-list`).classList.toggle('active', mode === 'list');
  document.getElementById(`${view}-toggle-cal`).classList.toggle('active', mode === 'calendar');
}

// ─── Week strip ───────────────────────────────────────────────────────────────
function renderWeekStrip() {
  const strip = document.getElementById('week-strip');
  const dates = getWeekDates();
  const todayStr = today();
  const dows = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  strip.innerHTML = '';
  dates.forEach((d, i) => {
    const str = formatDate(d);
    const btn = document.createElement('button');
    btn.className = 'week-day' +
      (str === todayStr ? ' today' : '') +
      (str === selectedWeekDay ? ' active' : '');
    btn.dataset.date = str;
    btn.innerHTML = `
      <span class="week-dow">${dows[i]}</span>
      <span class="week-num">${d.getDate()}</span>
      <span class="week-dot" style="display:none" id="dot-${str}"></span>
    `;
    btn.addEventListener('click', () => {
      selectedWeekDay = str;
      renderWeekStrip();
      renderWeekDay();
    });
    strip.appendChild(btn);
  });
}

// ─── Tab navigation ───────────────────────────────────────────────────────────
function bindNav() {
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      currentTab = btn.dataset.tab;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      document.getElementById(`view-${currentTab}`).classList.add('active');
      renderAll();
    });
  });

  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      upcomingFilter = chip.dataset.source;
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderUpcoming();
    });
  });
}

// ─── Scan ─────────────────────────────────────────────────────────────────────
function bindScan() {
  const btn = document.getElementById('btn-scan');
  
  btn.addEventListener('click', async () => {
    // 1. Check if API Key exists before even trying
    const { groqApiKey } = await chrome.storage.local.get('groqApiKey');
    if (!groqApiKey || groqApiKey.trim() === '') {
      showScanBanner('⚠️ Please add Groq API Key in Settings', 5000);
      return;
    }

    // 2. Start UI animations
    btn.classList.add('spinning');
    showScanBanner('AI is analyzing page content...');

    // Safety timeout: if we don't hear back in 30s, clear the banner
    setTimeout(() => {
      if (btn.classList.contains('spinning')) {
        btn.classList.remove('spinning');
        const banner = document.getElementById('scan-banner');
        if (banner && !banner.classList.contains('hidden')) {
          showScanBanner('Scan timed out. Check your connection or API key.', 4000);
        }
      }
    }, 30000);

    // 3. Request the scan from the Service Worker
    chrome.runtime.sendMessage({ type: 'ACTIVIFY_REQUEST_SCAN' }, (response) => {
      // Note: The AI takes a few seconds, so we wait for the message back 
      // from the service worker via the listener below, not just this callback.
      if (chrome.runtime.lastError || !response || !response.ok) {
        btn.classList.remove('spinning');
        showScanBanner('Error: Make sure a school site is open', 3000);
      }
    });
  });
}

// ─── Helper for UI Feedback ──────────────────────────────────────────────────
function showScanBanner(text, hideAfterMs = 0) {
  const banner = document.getElementById('scan-banner');
  const textEl = document.getElementById('scan-text');
  if (!banner || !textEl) return;

  textEl.textContent = text;
  banner.classList.remove('hidden');
  
  if (hideAfterMs) {
    setTimeout(() => banner.classList.add('hidden'), hideAfterMs);
  }
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function bindSettings() {
  const overlay = document.getElementById('settings-overlay');
  const closeBtn = document.getElementById('settings-close');
  const saveKeyBtn = document.getElementById('btn-save-key');
  const apiKeyInput = document.getElementById('field-api-key');
  const statusEl = document.getElementById('api-key-status');
  const clearTasksBtn = document.getElementById('btn-clear-tasks');

  document.getElementById('btn-settings').addEventListener('click', async () => {
    const result = await chrome.storage.local.get('groqApiKey');
    if (result.groqApiKey) {
      apiKeyInput.value = result.groqApiKey;
      apiKeyInput.placeholder = '••••••••••••••••••••' + result.groqApiKey.slice(-4);
    }
    overlay.classList.remove('hidden');
  });

  closeBtn.addEventListener('click', () => overlay.classList.add('hidden'));
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.add('hidden');
  });

  saveKeyBtn.addEventListener('click', async () => {
    const key = apiKeyInput.value.trim();
    if (!key) {
      showKeyStatus('Please enter an API key', 'error');
      return;
    }
    await chrome.storage.local.set({ groqApiKey: key });
    apiKeyInput.value = '';
    apiKeyInput.placeholder = '••••••••••••••••••••' + key.slice(-4);
    showKeyStatus('✓ API key saved!', 'success');
  });

  clearTasksBtn.addEventListener('click', async () => {
    if (!confirm('Clear all tasks? This cannot be undone.')) return;
    await chrome.storage.local.set({ tasks: [] });
    await renderAll();
    showKeyStatus('✓ Tasks cleared', 'success');
  });

  function showKeyStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = `api-key-status ${type}`;
    setTimeout(() => statusEl.classList.add('hidden'), 3000);
  }
}

// ─── Render all ───────────────────────────────────────────────────────────────
async function renderAll() {
  await Promise.all([renderToday(), renderWeekDay(), renderUpcoming()]);
}

// ─── Streak ───────────────────────────────────────────────────────────────────
async function updateStreak(todayTasks) {
  const todayStr = today();
  const allDone = todayTasks.length > 0 && todayTasks.every(t => t.completed);

  const result = await chrome.storage.local.get('streakData');
  let { count = 0, lastCompletedDate = '' } = result.streakData || {};

  const yesterday = formatDate(new Date(Date.now() - 86400000));

  if (allDone) {
    if (lastCompletedDate !== todayStr) {
      count = lastCompletedDate === yesterday ? count + 1 : 1;
      await chrome.storage.local.set({ streakData: { count, lastCompletedDate: todayStr } });
    }
  } else {
    if (lastCompletedDate === todayStr) {
      count = count > 1 ? count - 1 : 0;
      const revertDate = count > 0 ? yesterday : '';
      await chrome.storage.local.set({ streakData: { count, lastCompletedDate: revertDate } });
    } else if (lastCompletedDate !== yesterday) {
      count = 0;
    }
  }

  const badge = document.getElementById('streak-badge');
  const countEl = document.getElementById('streak-count');

  if (count > 0) {
    badge.classList.remove('streak-frozen');
    badge.classList.add('streak-active');
  } else {
    badge.classList.remove('streak-active');
    badge.classList.add('streak-frozen');
  }
  countEl.textContent = count;
}

// ─── Drag-to-strike ───────────────────────────────────────────────────────────
function bindDragStrike(card, titleWrap, canvas, task, undoBtn) {
  const ctx = canvas.getContext('2d');
  let dragging = false;
  let startX = 0;
  let lastX = 0;
  let lastTime = 0;
  let points = [];
  const COMMIT_RATIO = 0.88;

  function resizeCanvas() {
    canvas.width = titleWrap.offsetWidth;
    canvas.height = titleWrap.offsetHeight;
  }

  function drawLine(pts, progress) {
    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (pts.length < 2) return;

    const midY = canvas.height / 2;
    ctx.save();
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const grad = ctx.createLinearGradient(0, 0, canvas.width * progress, 0);
    grad.addColorStop(0, 'hsl(210, 100%, 65%)');
    grad.addColorStop(0.5, 'hsl(180, 100%, 60%)');
    grad.addColorStop(1, 'hsl(50, 100%, 65%)');
    ctx.strokeStyle = grad;

    ctx.beginPath();
    ctx.moveTo(pts[0].x, midY + pts[0].jitter);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, midY + pts[i].jitter);
    }
    ctx.stroke();

    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 6;
    ctx.filter = 'blur(2px)';
    ctx.strokeStyle = 'hsl(210, 100%, 70%)';
    ctx.beginPath();
    ctx.moveTo(pts[0].x, midY + pts[0].jitter);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, midY + pts[i].jitter);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawCommitted() {
    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const midY = canvas.height / 2;
    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0, 'hsl(210, 100%, 65%)');
    grad.addColorStop(0.5, 'hsl(180, 100%, 60%)');
    grad.addColorStop(1, 'hsl(50, 100%, 65%)');
    ctx.save();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(canvas.width, midY);
    ctx.stroke();
    ctx.restore();
  }

  // ── listeners on CARD not titleWrap ──
  card.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  if (task.completed) return;
  if (e.target.closest('button')) return;
  const cardRect = card.getBoundingClientRect();
  const titleRect = titleWrap.getBoundingClientRect();
  dragging = true;
  // startX relative to card left edge
  startX = e.clientX - cardRect.left;
  // offset so line starts at left edge of titleWrap
  const titleOffset = titleRect.left - cardRect.left;
  startX = Math.max(0, startX - titleOffset);
  lastX = startX;
  lastTime = Date.now();
  points = [{ x: startX, jitter: 0 }];
  resizeCanvas();
  card.setPointerCapture(e.pointerId);
});

card.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const cardRect = card.getBoundingClientRect();
  const titleRect = titleWrap.getBoundingClientRect();
  const titleOffset = titleRect.left - cardRect.left;
  const x = Math.max(0, (e.clientX - cardRect.left) - titleOffset);

  if (x < lastX - 5) {
    points = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lastX = x;
    return;
  }

  const now = Date.now();
  const speed = Math.abs(x - lastX) / Math.max(now - lastTime, 1);
  const jitter = Math.min(speed * 1.5, 3) * (Math.random() - 0.5) * 2;

  points.push({ x, jitter });
  lastX = x;
  lastTime = now;

  const progress = Math.min((x - startX) / (canvas.width - startX), 1);
  drawLine(points, progress);
});

card.addEventListener('pointerup', async (e) => {
  if (!dragging) return;
  dragging = false;

  const cardRect = card.getBoundingClientRect();
  const titleRect = titleWrap.getBoundingClientRect();
  const titleOffset = titleRect.left - cardRect.left;
  const x = Math.max(0, (e.clientX - cardRect.left) - titleOffset);
  const progress = (x - startX) / (canvas.width - startX);

  if (progress >= COMMIT_RATIO) {
    drawCommitted();
    card.classList.add('shimmer');
    setTimeout(() => card.classList.remove('shimmer'), 500);

    task.completed = true;
    await upsertTask(task);
    undoBtn.classList.add('visible');

    card.style.transition = 'opacity 0.3s ease';
    setTimeout(() => { card.style.opacity = '0.35'; }, 400);
    getTasks().then(t => updateStreak(t.filter(t => t.date === today())));
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
  }
});

  card.addEventListener('pointercancel', () => {
    dragging = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
  });
}

// ─── TODAY VIEW ───────────────────────────────────────────────────────────────
async function renderToday() {
  const todayStr = today();
  const [tasks, assignments] = await Promise.all([getTasks(), getAssignments()]);
  const todayTasks = tasks.filter(t => t.date === todayStr);
  const dueTodayAssignments = assignments.filter(a => a.dueDate === todayStr && !a.completed);

  const contentEl = document.getElementById('today-content');
  contentEl.innerHTML = '';

  if (todayViewMode === 'calendar') {
    contentEl.appendChild(buildCalendarGrid(todayTasks, dueTodayAssignments));
  } else {
    const tasksLabel = makeLabel('My Tasks', true);
    contentEl.appendChild(tasksLabel);
    const taskListEl = document.createElement('div');
    taskListEl.className = 'task-list';
    renderTaskList(taskListEl, todayTasks, true);
    contentEl.appendChild(taskListEl);

    const dueLabel = makeLabel('Due Today');
    dueLabel.style.marginTop = '20px';
    contentEl.appendChild(dueLabel);
    const dueListEl = document.createElement('div');
    dueListEl.className = 'task-list';
    renderAssignmentTaskList(dueListEl, dueTodayAssignments, true);
    contentEl.appendChild(dueListEl);
  }

  await updateStreak(todayTasks);
}

function makeLabel(text, withAdd = false) {
  const el = document.createElement('div');
  el.className = 'section-label';
  el.innerHTML = `<span>${text}</span>`;
  if (withAdd) {
    const btn = document.createElement('button');
    btn.className = 'add-btn';
    btn.textContent = '+ Add';
    btn.addEventListener('click', openModal);
    el.appendChild(btn);
  }
  return el;
}

// ─── WEEK VIEW ────────────────────────────────────────────────────────────────
async function renderWeekDay() {
  const [tasks, assignments] = await Promise.all([getTasks(), getAssignments()]);
  const list = document.getElementById('week-task-list');

  getWeekDates().forEach(d => {
    const str = formatDate(d);
    const hasItems = tasks.some(t => t.date === str) || assignments.some(a => a.dueDate === str);
    const dot = document.getElementById(`dot-${str}`);
    if (dot) dot.style.display = hasItems ? 'block' : 'none';
  });

  const dayTasks = tasks.filter(t => t.date === selectedWeekDay);
  const dayAssignments = assignments.filter(a => a.dueDate === selectedWeekDay && !a.completed);

  list.innerHTML = '';

  const label = document.createElement('div');
  label.className = 'assignment-group-label';
  const d = parseDate(selectedWeekDay);
  label.textContent = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  list.appendChild(label);

  if (weekViewMode === 'calendar') {
    list.appendChild(buildCalendarGrid(dayTasks, dayAssignments));
    return;
  }

  if (dayTasks.length === 0 && dayAssignments.length === 0) {
    list.innerHTML += '<div class="empty-state">Nothing planned for this day.</div>';
    return;
  }

  if (dayTasks.length > 0) {
    const taskSection = document.createElement('div');
    taskSection.className = 'task-list';
    renderTaskList(taskSection, dayTasks, true);
    list.appendChild(taskSection);
  }

  if (dayAssignments.length > 0) {
    const subLabel = document.createElement('div');
    subLabel.className = 'section-label';
    subLabel.innerHTML = '<span>Due this day</span>';
    subLabel.style.marginTop = '16px';
    list.appendChild(subLabel);
    const aSection = document.createElement('div');
    aSection.className = 'task-list';
    renderAssignmentTaskList(aSection, dayAssignments, true);
    list.appendChild(aSection);
  }
}

// ─── CALENDAR GRID ────────────────────────────────────────────────────────────
const CAL_START_HOUR = 6;
const CAL_END_HOUR   = 23;
const HOUR_HEIGHT    = 80;

function buildCalendarGrid(tasks, assignments) {
  const wrapper = document.createElement('div');
  wrapper.className = 'cal-wrapper';

  const grid = document.createElement('div');
  grid.className = 'cal-grid';
  grid.style.height = `${(CAL_END_HOUR - CAL_START_HOUR) * HOUR_HEIGHT}px`;

  for (let h = CAL_START_HOUR; h < CAL_END_HOUR; h++) {
    const top = (h - CAL_START_HOUR) * HOUR_HEIGHT;
    const label = document.createElement('div');
    label.className = 'cal-hour-label';
    label.style.top = `${top}px`;
    label.textContent = fmtHour(h);
    grid.appendChild(label);
    const line = document.createElement('div');
    line.className = 'cal-hour-line';
    line.style.top = `${top}px`;
    grid.appendChild(line);
  }

  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const startMins = CAL_START_HOUR * 60;
  const endMins = CAL_END_HOUR * 60;
  if (nowMins >= startMins && nowMins <= endMins) {
    const nowTop = ((nowMins - startMins) / 60) * HOUR_HEIGHT;
    const nowLine = document.createElement('div');
    nowLine.className = 'cal-now-line';
    nowLine.style.top = `${nowTop}px`;
    const dot = document.createElement('div');
    dot.className = 'cal-now-dot';
    dot.style.top = `${nowTop - 4}px`;
    grid.appendChild(dot);
    grid.appendChild(nowLine);
  }

  const blockData = [];
  tasks.forEach(task => {
    if (!task.startTime) return;
    const [h, m] = task.startTime.split(':').map(Number);
    const taskMins = h * 60 + m;
    if (taskMins < startMins || taskMins > endMins) return;
    const duration = task.durationMins || 45;
    blockData.push({ task, taskMins, endMins: taskMins + duration, col: 0, totalCols: 1 });
  });

  blockData.sort((a, b) => a.taskMins - b.taskMins);

  blockData.forEach((item, i) => {
    item.col = 0;
    const usedCols = new Set();
    for (let j = 0; j < i; j++) {
      if (blockData[j].endMins > item.taskMins) usedCols.add(blockData[j].col);
    }
    while (usedCols.has(item.col)) item.col++;
  });

  blockData.forEach((item, i) => {
    let maxCol = item.col;
    for (let j = 0; j < blockData.length; j++) {
      if (j === i) continue;
      if (blockData[j].taskMins < item.endMins && blockData[j].endMins > item.taskMins) {
        maxCol = Math.max(maxCol, blockData[j].col);
      }
    }
    item.totalCols = maxCol + 1;
  });

  blockData.forEach(({ task, taskMins, col, totalCols }) => {
    const top = ((taskMins - startMins) / 60) * HOUR_HEIGHT;
    const duration = task.durationMins || 45;
    const height = Math.max((duration / 60) * HOUR_HEIGHT, 16) - 3;
    const colWidth = 100 / totalCols;
    const leftPct = col * colWidth;

    const block = document.createElement('div');
    block.className = 'cal-block' + (task.completed ? ' done' : '');
    block.style.top = `${top}px`;
    block.style.height = `${height}px`;
    block.style.left = `${leftPct}%`;
    block.style.right = `${100 - leftPct - colWidth + 0.5}%`;
    block.style.background = categoryColor(task.category);
    block.style.borderLeftColor = categoryBorderColor(task.category);
    block.innerHTML = `
      <div class="cal-block-title">${task.title}</div>
      <div class="cal-block-time">${fmtTime(task.startTime)}${duration ? ' · ' + duration + 'min' : ''}</div>
    `;
    block.addEventListener('click', async () => {
      task.completed = !task.completed;
      await upsertTask(task);
      block.classList.toggle('done', task.completed);
    });
    grid.appendChild(block);
  });

  assignments.forEach(a => {
    const h = a.dueTime ? parseInt(a.dueTime.split(':')[0]) : null;
    const m = a.dueTime ? parseInt(a.dueTime.split(':')[1]) : null;
    const taskMins = h !== null ? h * 60 + m : startMins;
    if (taskMins < startMins || taskMins > endMins) return;
    const top = ((taskMins - startMins) / 60) * HOUR_HEIGHT;
    const marker = document.createElement('div');
    marker.className = 'cal-due-marker';
    marker.style.top = `${top}px`;
    marker.style.borderLeftColor = sourceColor(a.source);
    marker.innerHTML = `<span>📌 ${a.title}</span>`;
    if (a.url) {
      marker.style.cursor = 'pointer';
      marker.addEventListener('click', () => window.open(a.url, '_blank'));
    }
    grid.appendChild(marker);
  });

  wrapper.appendChild(grid);
  const scrollTo = nowMins >= startMins
    ? Math.max(0, ((nowMins - startMins) / 60) * HOUR_HEIGHT - 80)
    : ((8 - CAL_START_HOUR) * HOUR_HEIGHT);
  setTimeout(() => wrapper.scrollTop = scrollTo, 50);
  return wrapper;
}

function fmtHour(h) {
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function categoryColor(cat) {
  return {
    assignment:      'rgba(66,133,244,0.22)',
    study:           'rgba(45,160,100,0.22)',
    extracurricular: 'rgba(140,90,220,0.22)',
    manual:          'rgba(180,180,180,0.15)',
  }[cat] || 'rgba(45,160,100,0.22)';
}

function categoryBorderColor(cat) {
  return {
    assignment:      'rgba(66,133,244,0.8)',
    study:           'rgba(45,160,100,0.8)',
    extracurricular: 'rgba(140,90,220,0.8)',
    manual:          'rgba(180,180,180,0.5)',
  }[cat] || 'rgba(45,160,100,0.8)';
}

// ─── UPCOMING VIEW ────────────────────────────────────────────────────────────
async function renderUpcoming() {
  const assignments = await getAssignments(); // no args
  const container = document.getElementById('upcoming-list');
  container.innerHTML = '';

  const todayStr = today();
  let filtered = assignments
    .filter(a => !a.completed && a.dueDate && a.dueDate >= todayStr)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  if (upcomingFilter !== 'all') {
    filtered = filtered.filter(a => a.source === upcomingFilter);
  }

  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state">No upcoming assignments found.<br>Visit your school sites and hit scan!</div>';
    return;
  }

  const groups = {};
  filtered.forEach(a => {
    (groups[a.dueDate] = groups[a.dueDate] || []).push(a);
  });

  Object.entries(groups).forEach(([dateStr, items]) => {
    const label = document.createElement('div');
    label.className = 'assignment-group-label';
    const d = parseDate(dateStr);
    const isToday = dateStr === todayStr;
    const isTomorrow = dateStr === formatDate(new Date(Date.now() + 86400000));
    label.textContent = isToday ? 'Today' : isTomorrow ? 'Tomorrow'
      : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    container.appendChild(label);
    items.forEach(a => container.appendChild(buildAssignmentCard(a, isToday)));
  });
}

// ─── Card builders ────────────────────────────────────────────────────────────
function renderTaskList(targetOrId, tasks, isElement = false) {
  const el = isElement ? targetOrId : document.getElementById(targetOrId);
  el.innerHTML = '';
  if (tasks.length === 0) {
    el.innerHTML = '<div class="empty-state">No tasks here.</div>';
    return;
  }
  tasks
    .sort((a, b) => (a.startTime || '99:99').localeCompare(b.startTime || '99:99'))
    .forEach(task => el.appendChild(buildTaskCard(task)));
}

function renderAssignmentTaskList(targetOrId, assignments, isElement = false) {
  const el = isElement ? targetOrId : document.getElementById(targetOrId);
  if (!isElement) el.innerHTML = '';
  if (assignments.length === 0) {
    el.innerHTML = '<div class="empty-state">Nothing due today 🎉</div>';
    return;
  }
  assignments.forEach(a => el.appendChild(buildAssignmentCard(a, true)));
}

function buildTaskCard(task) {
  const card = document.createElement('div');
  card.className = 'task-card' + (task.completed ? ' done' : '');

  const body = document.createElement('div');
  body.className = 'task-body';

  // Title wrapped for canvas overlay
  const titleWrap = document.createElement('div');
  titleWrap.className = 'task-title-wrap';
  titleWrap.style.position = 'relative';

  const title = document.createElement('div');
  title.className = 'task-title';
  title.textContent = task.title;

  const canvas = document.createElement('canvas');
  canvas.className = 'strike-canvas';

  titleWrap.appendChild(title);
  titleWrap.appendChild(canvas);

  const meta = document.createElement('div');
  meta.className = 'task-meta';

  if (task.startTime) {
    const time = document.createElement('span');
    time.className = 'task-time';
    time.textContent = fmtTime(task.startTime);
    if (task.durationMins) time.textContent += ` · ${task.durationMins}min`;
    meta.appendChild(time);
  }

  const dot = document.createElement('span');
  dot.className = `task-source-dot source-${task.category || 'manual'}`;
  meta.appendChild(dot);

  body.appendChild(titleWrap);
  body.appendChild(meta);

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  // Undo button — hidden until committed
  const undoBtn = document.createElement('button');
  undoBtn.className = 'task-btn undo';
  undoBtn.title = 'Undo';
  undoBtn.textContent = '↩';
  undoBtn.addEventListener('click', async (e) => {
  e.stopPropagation();
  task.completed = false;
  await upsertTask(task);
  card.style.opacity = '1';
  card.style.transition = '';
  card.classList.remove('fading', 'shimmer', 'struck');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  undoBtn.classList.remove('visible');
  await updateStreak(await getTasks().then(t => t.filter(t => t.date === today())));
});

  const delBtn = document.createElement('button');
  delBtn.className = 'task-btn danger';
  delBtn.title = 'Delete';
  delBtn.innerHTML = '✕';
  delBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    await deleteTask(task.id);
    card.remove();
    await updateStreak(await getTasks().then(t => t.filter(t => t.date === today())));
  });

  actions.appendChild(undoBtn);
  actions.appendChild(delBtn);

  card.appendChild(body);
  card.appendChild(actions);

  // Draw committed line if already done
  if (task.completed) {
    card.style.opacity = '0.35';
    requestAnimationFrame(() => {
      const ctx = canvas.getContext('2d');
      canvas.width = titleWrap.offsetWidth;
      canvas.height = titleWrap.offsetHeight;
      const midY = canvas.height / 2;
      const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
      grad.addColorStop(0, 'hsl(210, 100%, 65%)');
      grad.addColorStop(0.5, 'hsl(180, 100%, 60%)');
      grad.addColorStop(1, 'hsl(50, 100%, 65%)');
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(canvas.width, midY);
      ctx.stroke();
      undoBtn.classList.add('visible');
    });
  }

  bindDragStrike(card, titleWrap, canvas, task, undoBtn);

  return card;
}

function buildAssignmentCard(a, compact = false) {
  const card = document.createElement('div');
  const isOverdue = a.dueDate < today();
  card.className = 'assignment-card' + (isOverdue ? ' overdue' : '');

  const bar = document.createElement('div');
  bar.className = 'assignment-source-bar';
  bar.style.background = sourceColor(a.source);

  const body = document.createElement('div');
  body.className = 'assignment-body';

  const titleEl = document.createElement('div');
  titleEl.className = 'assignment-title';
  titleEl.textContent = a.title;

  const sub = document.createElement('div');
  sub.className = 'assignment-sub';

  const courseSpan = document.createElement('span');
  courseSpan.textContent = a.course;
  sub.appendChild(courseSpan);

  if (a.dueTime && !compact) {
    const timeSpan = document.createElement('span');
    timeSpan.className = isOverdue ? 'assignment-due' : '';
    timeSpan.textContent = `Due ${fmtTime(a.dueTime)}`;
    sub.appendChild(timeSpan);
  } else {
    const srcSpan = document.createElement('span');
    srcSpan.textContent = sourceLabel(a.source);
    sub.appendChild(srcSpan);
  }

  body.appendChild(titleEl);
  body.appendChild(sub);
  card.appendChild(bar);
  card.appendChild(body);

  if (a.url) {
    const link = document.createElement('a');
    link.className = 'assignment-link';
    link.href = a.url;
    link.target = '_blank';
    link.title = 'Open assignment';
    link.textContent = '→';
    card.appendChild(link);
  }

  return card;
}

// ─── Add Task Modal ───────────────────────────────────────────────────────────
function bindModal() {
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('btn-cancel').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });
  document.getElementById('btn-save-task').addEventListener('click', saveTask);
}

function openModal() {
  editingTask = null;
  document.getElementById('field-title').value = '';
  document.getElementById('field-date').value = today();
  document.getElementById('field-time').value = '';
  document.getElementById('field-duration').value = '45';
  document.getElementById('field-category').value = 'study';
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('field-title').focus();
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  editingTask = null;
}

async function saveTask() {
  const title = document.getElementById('field-title').value.trim();
  if (!title) { document.getElementById('field-title').focus(); return; }

  const task = {
    id: editingTask || `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    assignmentId: null,
    title,
    date: document.getElementById('field-date').value || today(),
    startTime: document.getElementById('field-time').value || null,
    durationMins: parseInt(document.getElementById('field-duration').value) || null,
    completed: false,
    category: document.getElementById('field-category').value,
    color: null,
  };

  await upsertTask(task);
  closeModal();
  await renderAll();
}

// ─── AI Chat ──────────────────────────────────────────────────────────────────
function bindAI() {
  const bubble = document.getElementById('ai-bubble');
  const drawer = document.getElementById('ai-drawer');
  const closeBtn = document.getElementById('ai-close');
  const sendBtn = document.getElementById('ai-send');
  const input = document.getElementById('ai-input');

  const qpContainer = document.getElementById('quick-prompts');
  QUICK_PROMPTS.forEach(({ label, prompt }) => {
    const btn = document.createElement('button');
    btn.className = 'quick-prompt-btn';
    btn.textContent = label;
    btn.addEventListener('click', () => submitAI(prompt));
    qpContainer.appendChild(btn);
  });

  bubble.addEventListener('click', () => {
    drawer.classList.toggle('hidden');
    if (!drawer.classList.contains('hidden')) input.focus();
  });

  closeBtn.addEventListener('click', () => drawer.classList.add('hidden'));

  sendBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (text) { submitAI(text); input.value = ''; }
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = input.value.trim();
      if (text) { submitAI(text); input.value = ''; }
    }
  });
}

async function submitAI(text) {
  if (aiLoading) return;
  aiLoading = true;

  const messagesEl = document.getElementById('ai-messages');
  const sendBtn = document.getElementById('ai-send');
  sendBtn.disabled = true;

  appendMessage(text, 'user');
  aiHistory.push({ role: 'user', content: text });
  const loadingEl = appendMessage('Thinking...', 'loading');

  try {
    const response = await sendMessage(aiHistory);
    loadingEl.remove();
    appendMessage(response, 'assistant');
    aiHistory.push({ role: 'assistant', content: response });

    const applied = await applyTasksFromResponse(response);
    if (applied.length > 0) {
      const banner = document.createElement('div');
      banner.className = 'tasks-applied-banner';
      banner.textContent = `✓ ${applied.length} task${applied.length > 1 ? 's' : ''} added to your planner`;
      messagesEl.appendChild(banner);
      await renderAll();
    }
  } catch (err) {
    loadingEl.remove();
    appendMessage(`Sorry, something went wrong: ${err.message}`, 'assistant');
  }

  messagesEl.scrollTop = messagesEl.scrollHeight;
  aiLoading = false;
  sendBtn.disabled = false;
}

function appendMessage(text, role) {
  const messagesEl = document.getElementById('ai-messages');
  const el = document.createElement('div');
  el.className = `ai-message ${role}`;
  el.textContent = text;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return el;
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function fmtTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

function sourceColor(source) {
  return { google_classroom: '#4285f4', canvas: '#e66000', schoology: '#5a3e85' }[source] || '#9c9590';
}

function sourceLabel(source) {
  return { google_classroom: 'Classroom', canvas: 'Canvas', schoology: 'Schoology' }[source] || 'Manual';
}
