// shared/storage.js
// Central data model and chrome.storage helpers used by all extension contexts.

/**
 * @typedef {Object} Assignment
 * @property {string} id           - Unique ID (source + course + title hash)
 * @property {string} source       - 'google_classroom' | 'canvas' | 'schoology'
 * @property {string} course       - Course/class name
 * @property {string} title        - Assignment title
 * @property {string|null} dueDate - ISO 8601 string or null
 * @property {string|null} dueTime - "HH:MM" 24h or null
 * @property {'assignment'|'quiz'|'announcement'|'other'} type
 * @property {string|null} url     - Link to the assignment
 * @property {boolean} completed   - User-marked complete
 * @property {number} scannedAt    - Unix timestamp of when we scraped it
 */

/**
 * @typedef {Object} PlannerTask
 * @property {string} id
 * @property {string|null} assignmentId  - Linked assignment id, or null for manual tasks
 * @property {string} title
 * @property {string} date               - "YYYY-MM-DD"
 * @property {string|null} startTime     - "HH:MM"
 * @property {number|null} durationMins
 * @property {boolean} completed
 * @property {'assignment'|'study'|'extracurricular'|'manual'} category
 * @property {string|null} color         - hex override
 */

const KEYS = {
  ASSIGNMENTS: 'assignments',
  TASKS: 'tasks',
  LAST_SCAN: 'lastScan',
  SETTINGS: 'settings',
};

// --- Assignment Helpers ---

export async function getAssignments() {
  const result = await chrome.storage.local.get(KEYS.ASSIGNMENTS);
  return result[KEYS.ASSIGNMENTS] || [];
}

export async function mergeAssignments(scraped) {
  const existing = await getAssignments();
  const todayStr = new Date().toISOString().slice(0, 10);
  const filtered = existing.filter(a => !a.dueDate || a.dueDate >= todayStr);
  const map = Object.fromEntries(filtered.map(a => [a.id, a]));
  for (const a of scraped) {
    if (map[a.id]) {
      map[a.id] = { ...a, completed: map[a.id].completed };
    } else {
      map[a.id] = a;
    }
  }
  const merged = Object.values(map);
  await chrome.storage.local.set({ [KEYS.ASSIGNMENTS]: merged });
  return merged;
}

export async function setAssignmentCompleted(id, completed) {
  const assignments = await getAssignments();
  const updated = assignments.map(a => a.id === id ? { ...a, completed } : a);
  await chrome.storage.local.set({ [KEYS.ASSIGNMENTS]: updated });
}

// --- Task Helpers ---

export async function getTasks() {
  const result = await chrome.storage.local.get(KEYS.TASKS);
  return result[KEYS.TASKS] || [];
}

export async function saveTasks(tasks) {
  await chrome.storage.local.set({ [KEYS.TASKS]: tasks });
}

/**
 * Replaces all AI-generated tasks (IDs starting with 'ai_') 
 * with a single storage write.
 */
export async function clearAiTasks() {
  const tasks = await getTasks();
  const filtered = tasks.filter(t => t && !String(t.id).startsWith('ai_'));
  await saveTasks(filtered);
}

/**
 * Updates or inserts multiple tasks in a single storage write.
 */
export async function batchUpsertTasks(newTasks) {
  const tasks = await getTasks();
  const taskMap = Object.fromEntries(tasks.map(t => [t.id, t]));
  
  for (const nt of newTasks) {
    taskMap[nt.id] = nt;
  }
  
  await saveTasks(Object.values(taskMap));
}

export async function upsertTask(task) {
  const tasks = await getTasks();
  const idx = tasks.findIndex(t => t.id === task.id);
  if (idx >= 0) tasks[idx] = task;
  else tasks.push(task);
  await saveTasks(tasks);
}

export async function deleteTask(id) {
  const tasks = await getTasks();
  await saveTasks(tasks.filter(t => t.id !== id));
}

// --- Metadata & Settings ---

export async function getLastScan() {
  const result = await chrome.storage.local.get(KEYS.LAST_SCAN);
  return result[KEYS.LAST_SCAN] || {};
}

export async function setLastScan(source) {
  const current = await getLastScan();
  await chrome.storage.local.set({ [KEYS.LAST_SCAN]: { ...current, [source]: Date.now() } });
}

export async function getSettings() {
  const result = await chrome.storage.local.get(KEYS.SETTINGS);
  return result[KEYS.SETTINGS] || {
    reminderMinsBefore: 30,
    defaultTaskDuration: 45,
    theme: 'light',
  };
}

export async function saveSettings(settings) {
  await chrome.storage.local.set({ [KEYS.SETTINGS]: settings });
}

// --- Utility Functions ---

export function makeId(source, course, title) {
  const str = `${source}:${course}:${title}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return `${source}_${Math.abs(hash).toString(36)}`;
}

export function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function today() {
  return formatDate(new Date());
}