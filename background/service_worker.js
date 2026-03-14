// background/service_worker.js
import { mergeAssignments, getTasks, getSettings, setLastScan } from '../shared/storage.js';

chrome.runtime.onInstalled.addListener(() => {
  console.log('[Activify] Installed. Setting up alarms...');
  setupAlarms();
});

chrome.runtime.onStartup.addListener(setupAlarms);

function setupAlarms() {
  chrome.alarms.create('scan', { periodInMinutes: 30 });
  chrome.alarms.create('reminders', { periodInMinutes: 1 });
}

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'scan') await triggerScanOnSchoolSites();
  if (alarm.name === 'reminders') await checkReminders();

  if (alarm.name.startsWith('task_remind_')) {
    const taskId = alarm.name.replace('task_remind_', '');
    const tasks = await getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '../icons/icon48.png',
      title: '⏰ Activify Reminder',
      message: `Starting soon: ${task.title}`,
      priority: 2,
    });
  }
});

async function triggerScanOnSchoolSites() {
  const tabs = await chrome.tabs.query({});
  const scriptMap = [
    { pattern: /classroom\.google\.com/, file: 'content/google_classroom.js' },
    { pattern: /\.instructure\.com/, file: 'content/canvas.js' },
    { pattern: /\.schoology\.com/, file: 'content/schoology.js' },
  ];
  for (const tab of tabs) {
    if (!tab.url) continue;
    const match = scriptMap.find(s => s.pattern.test(tab.url));
    if (!match) continue;
    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'ACTIVIFY_SCAN' });
    } catch {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: [match.file],
        });
      } catch (e) {
        console.error('[Activify] Failed to inject:', e);
      }
    }
  }
}

async function checkReminders() {
  const settings = await getSettings();
  const tasks = await getTasks();
  const now = new Date();
  const windowMs = settings.reminderMinsBefore * 60 * 1000;

  for (const task of tasks) {
    if (task.completed || !task.startTime) continue;
    const [h, m] = task.startTime.split(':').map(Number);
    const taskDate = new Date(task.date + 'T00:00:00');
    taskDate.setHours(h, m, 0, 0);
    const diffMs = taskDate - now;
    if (diffMs > 0 && diffMs <= windowMs) {
      const alarmId = `task_remind_${task.id}`;
      const existing = await chrome.alarms.get(alarmId);
      if (!existing) {
        chrome.alarms.create(alarmId, { when: taskDate.getTime() - 60_000 });
      }
    }
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ACTIVIFY_ASSIGNMENTS_SCRAPED') {
    const { source, assignments } = message;
    mergeAssignments(assignments)
      .then(async () => {
        await setLastScan(source);
        chrome.runtime.sendMessage({ type: 'ACTIVIFY_REFRESH' }).catch(() => {});
        sendResponse({ ok: true });
      })
      .catch(err => sendResponse({ ok: false, error: err.message }));
    return true;
  }

  if (message.type === 'ACTIVIFY_REQUEST_SCAN') {
    triggerScanOnSchoolSites().then(() => sendResponse({ ok: true }));
    return true;
  }
});