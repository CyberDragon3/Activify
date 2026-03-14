// sidepanel/panel.js
import {
  getAssignments, getTasks, upsertTask, deleteTask,
  formatDate, today, parseDate,
} from '../shared/storage.js';
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
  renderDateHero();
  renderWeekStrip();
  bindNav();
  bindScan();
  bindModal();
  bindSettings();
  bindAI();
  bindViewToggles();
  await renderAll();

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'PLANR_REFRESH') renderAll();
  });
}

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
    btn.classList.add('spinning');
    showScanBanner('Scanning school sites...');
    chrome.runtime.sendMessage({ type: 'PLANR_REQUEST_SCAN' }, () => {
      setTimeout(() => {
        btn.classList.remove('spinning');
        showScanBanner('Scan complete ✓', 2000);
        renderAll();
      }, 2500);
    });
  });
}

function showScanBanner(text, hideAfterMs = 0) {
  const banner = document.getElementById('scan-banner');
  document.getElementById('scan-text').textContent = text;
  banner.classList.remove('hidden');
  if (hideAfterMs) setTimeout(() => banner.classList.add('hidden'), hideAfterMs);
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function bindSettings() {
  const overlay = document.getElementById('settings-overlay');
  const closeBtn = document.getElementById('settings-close');
  const saveKeyBtn = document.getElementById('btn-save-key');
  const apiKeyInput = document.getElementById('field-api-key');
  const statusEl = document.getElementById('api-key-status');
  const clearTasksBtn = document.getElementById('btn-clear-tasks');

  // Open settings
  document.getElementById('btn-settings').addEventListener('click', async () => {
    const result = await chrome.storage.local.get('groqApiKey');
    if (result.groqApiKey) {
      apiKeyInput.placeholder = '••••••••••••••••••••' + result.groqApiKey.slice(-4);
    }
    const settings = await chrome.storage.local.get('settings');
    if (settings.settings?.reminderMinsBefore) {
      document.getElementById('field-reminder-mins').value = settings.settings.reminderMinsBefore;
    }
    overlay.classList.remove('hidden');
  });

  // Close settings
  closeBtn.addEventListener('click', () => overlay.classList.add('hidden'));
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.add('hidden');
  });

  // Save API key
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

  // Save reminder setting
  document.getElementById('field-reminder-mins').addEventListener('change', async (e) => {
    const result = await chrome.storage.local.get('settings');
    const current = result.settings || {};
    await chrome.storage.local.set({
      settings: { ...current, reminderMinsBefore: parseInt(e.target.value) }
    });
  });

  // Clear tasks
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
const HOUR_HEIGHT    = 56;

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

  tasks.forEach(task => {
    if (!task.startTime) return;
    const [h, m] = task.startTime.split(':').map(Number);
    const taskMins = h * 60 + m;
    if (taskMins < startMins || taskMins > endMins) return;
    const top = ((taskMins - startMins) / 60) * HOUR_HEIGHT;
    const duration = task.durationMins || 45;
    const height = Math.max((duration / 60) * HOUR_HEIGHT, 28);
    const block = document.createElement('div');
    block.className = 'cal-block' + (task.completed ? ' done' : '');
    block.style.top = `${top}px`;
    block.style.height = `${height}px`;
    block.style.background = categoryColor(task.category);
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
    assignment:      'rgba(66,133,244,0.15)',
    study:           'rgba(45,106,79,0.15)',
    extracurricular: 'rgba(90,62,133,0.15)',
    manual:          'rgba(156,149,144,0.12)',
  }[cat] || 'rgba(45,106,79,0.15)';
}

// ─── UPCOMING VIEW ────────────────────────────────────────────────────────────
async function renderUpcoming() {
  const assignments = await getAssignments();
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

  const check = document.createElement('div');
  check.className = 'task-check' + (task.completed ? ' checked' : '');
  check.addEventListener('click', async () => {
    task.completed = !task.completed;
    await upsertTask(task);
    card.classList.toggle('done', task.completed);
    check.classList.toggle('checked', task.completed);
  });

  const body = document.createElement('div');
  body.className = 'task-body';

  const title = document.createElement('div');
  title.className = 'task-title';
  title.textContent = task.title;

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

  body.appendChild(title);
  body.appendChild(meta);

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const delBtn = document.createElement('button');
  delBtn.className = 'task-btn danger';
  delBtn.title = 'Delete';
  delBtn.innerHTML = '✕';
  delBtn.addEventListener('click', async () => {
    await deleteTask(task.id);
    card.remove();
  });
  actions.appendChild(delBtn);

  card.appendChild(check);
  card.appendChild(body);
  card.appendChild(actions);
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