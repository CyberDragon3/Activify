import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uoetcnbpvgovjqnvpvtz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZXRjbmJwdmdvdmpxbnZwdnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMjk1MDAsImV4cCI6MjA4OTcwNTUwMH0.064TFKLxXCCRZPmJEK47O_QiRcxllJA2Bjx6TxdSNsY';

const ChromeStorageAdapter = {
  getItem: async (key, userId) => {
    const result = await chrome.storage.local.get(`${userId}_${key}`);
    return result[`${userId}_${key}`] ?? null;
  },
  setItem: async (key, value, userId) => {
    await chrome.storage.local.set({ [`${userId}_${key}`]: value });
  },
  removeItem: async (key, userId) => {
    await chrome.storage.local.remove(`${userId}_${key}`);
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ChromeStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

supabase.auth.getSession();

const KEYS = {
  ASSIGNMENTS: 'assignments',
  TASKS: 'tasks',
  LAST_SCAN: 'lastScan',
  SETTINGS: 'settings',
};

async function getToken() {
  const result = await chrome.storage.local.get('sb-uoetcnbpvgovjqnvpvtz-auth-token');
  const raw = result['sb-uoetcnbpvgovjqnvpvtz-auth-token'];
  if (!raw) return null;
  return JSON.parse(raw);
}

export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: chrome.identity.getRedirectURL() }
  });
  return { data, error };
}

export async function signOut() {
  await supabase.auth.signOut();
}

// ── Assignment Helpers ────────────────────────────────────────────────────────

export async function getAssignments(userId) {
  const result = await chrome.storage.local.get(`${userId}_${KEYS.ASSIGNMENTS}`);
  return result[`${userId}_${KEYS.ASSIGNMENTS}`] || [];
}

export async function mergeAssignments(scraped, userId) {
  // 1. GUARD: If no new assignments were found, stop here.
  // This prevents an empty scan from wiping out your existing data.
  if (!scraped || scraped.length === 0) {
    console.log('[Activify] Empty scrape detected; skipping merge to protect existing data.');
    return await getAssignments(); 
  }

  const existing = await getAssignments(userId);
  const source = scraped[0].source; // We know it exists because of the guard above
  const todayStr = new Date().toISOString().slice(0, 10);

  // 2. Keep assignments from OTHER sources.
  // Also clean up legacy source keys (e.g. old 'classroom' → now 'google_classroom')
  // and filter out past-due assignments.
  const SOURCE_ALIASES = { google_classroom: ['classroom'] };
  const aliasesToDrop = SOURCE_ALIASES[source] || [];
  const otherSources = existing.filter(a =>
    a.source !== source &&
    !aliasesToDrop.includes(a.source) &&
    (!a.dueDate || a.dueDate >= todayStr)
  );

  // 3. Build a map starting with other sources AND existing same-source assignments.
  // This allows multiple accounts (e.g. two Google Classroom accounts) to coexist:
  // scanning Account 2 won't wipe Account 1's assignments.
  // Past-due same-source assignments are filtered out here too.
  const existingSameSource = existing.filter(a =>
    a.source === source && (!a.dueDate || a.dueDate >= todayStr)
  );
  const existingSourceMap = Object.fromEntries(existingSameSource.map(a => [a.id, a]));
  const map = Object.fromEntries([...otherSources, ...existingSameSource].map(a => [a.id, a]));

  // 4. Update/add assignments from this scan, preserving completed state.
  for (const a of scraped) {
    map[a.id] = { ...a, completed: existingSourceMap[a.id]?.completed ?? a.completed };
  }

  const merged = Object.values(map);
  
  // 5. Save to local storage
  await chrome.storage.local.set({ [`${userId}_${KEYS.ASSIGNMENTS}`]: merged });

  // 6. Sync to Supabase
  // We pass 'source' so the background script knows which specific source to refresh
  syncAssignmentsToSupabase(merged, source).catch(e =>
    console.warn('[Activify] Supabase assignment sync failed:', e)
  );

  return merged;
}

async function syncAssignmentsToSupabase(assignments, source) {
  const token = await getToken();
  if (!token) return;
  const { access_token, user } = token;

  // Delete all existing assignments for this source from Supabase
  if (source) {
    await fetch(`https://uoetcnbpvgovjqnvpvtz.supabase.co/rest/v1/assignments?source=eq.${source}&user_id=eq.${user.id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${access_token}`,
      },
    });
  }

  // Insert fresh assignments
  if (!assignments.length) return;
  const rows = assignments.map(a => ({
    id: a.id,
    user_id: user.id,
    source: a.source,
    course: a.course,
    title: a.title,
    due_date: a.dueDate,
    due_time: a.dueTime,
    type: a.type || 'assignment',
    url: a.url,
    completed: a.completed,
    scanned_at: a.scannedAt,
  }));

  await fetch('https://uoetcnbpvgovjqnvpvtz.supabase.co/rest/v1/assignments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${access_token}`,
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify(rows),
  });
}

export async function setAssignmentCompleted(id, completed) {
  const assignments = await getAssignments();
  const updated = assignments.map(a => a.id === id ? { ...a, completed } : a);
  await chrome.storage.local.set({ [KEYS.ASSIGNMENTS]: updated });
  const user = await getCurrentUser();
  if (user) {
    await supabase.from('assignments').update({ completed }).eq('id', id).eq('user_id', user.id);
  }
}

// ── Task Helpers ──────────────────────────────────────────────────────────────

export async function getTasks() {
  const result = await chrome.storage.local.get(KEYS.TASKS);
  return result[KEYS.TASKS] || [];
}

export async function saveTasks(tasks) {
  await chrome.storage.local.set({ [KEYS.TASKS]: tasks });
}

export async function upsertTask(task) {
  const tasks = await getTasks();
  const idx = tasks.findIndex(t => t.id === task.id);
  if (idx >= 0) tasks[idx] = task;
  else tasks.push(task);
  await saveTasks(tasks);

  try {
    const token = await getToken();
    if (!token) return;
    const { access_token, user } = token;
    const res = await fetch('https://uoetcnbpvgovjqnvpvtz.supabase.co/rest/v1/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${access_token}`,
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        id: task.id,
        user_id: user.id,
        title: task.title,
        date: task.date,
        start_time: task.startTime,
        duration_mins: task.durationMins,
        completed: task.completed,
        category: task.category,
        color: task.color,
        assignment_id: task.assignmentId,
      }),
    });
    if (res.status !== 201 && res.status !== 200) {
      console.warn('[Activify] upsertTask failed:', res.status, await res.text());
    }
  } catch (e) {
    console.warn('[Activify] Supabase task sync failed:', e.message);
  }
}

export async function deleteTask(id) {
  const tasks = await getTasks();
  await saveTasks(tasks.filter(t => t.id !== id));

  try {
    const token = await getToken();
    if (!token) return;
    const { access_token, user } = token;
    const res = await fetch(`https://uoetcnbpvgovjqnvpvtz.supabase.co/rest/v1/tasks?id=eq.${encodeURIComponent(id)}&user_id=eq.${user.id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${access_token}`,
      },
    });
    console.log('[Activify] deleteTask status:', res.status);
  } catch (e) {
    console.warn('[Activify] Supabase delete failed:', e.message);
  }
}

export async function clearAiTasks() {
  const tasks = await getTasks();
  const filtered = tasks.filter(t => t && !String(t.id).startsWith('ai_'));
  await saveTasks(filtered);

  try {
    const token = await getToken();
    if (!token) return;
    const { access_token, user } = token;
    // Use ilike with %25 encoded % for URL safety
    const res = await fetch(`https://uoetcnbpvgovjqnvpvtz.supabase.co/rest/v1/tasks?id=like.ai_%25&user_id=eq.${user.id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${access_token}`,
      },
    });
    console.log('[Activify] clearAiTasks status:', res.status);
  } catch (e) {
    console.warn('[Activify] Supabase clearAiTasks failed:', e.message);
  }
}

export async function batchUpsertTasks(newTasks) {
  const tasks = await getTasks();
  const taskMap = Object.fromEntries(tasks.map(t => [t.id, t]));
  for (const nt of newTasks) taskMap[nt.id] = nt;
  await saveTasks(Object.values(taskMap));

  try {
    const token = await getToken();
    if (!token) return;
    const { access_token, user } = token;
    const rows = newTasks.map(task => ({
      id: task.id,
      user_id: user.id,
      title: task.title,
      date: task.date,
      start_time: task.startTime,
      duration_mins: task.durationMins,
      completed: task.completed,
      category: task.category,
      color: task.color,
      assignment_id: task.assignmentId,
    }));
    await fetch('https://uoetcnbpvgovjqnvpvtz.supabase.co/rest/v1/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${access_token}`,
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify(rows),
    });
  } catch (e) {
    console.warn('[Activify] Supabase batch sync failed:', e.message);
  }
}

// ── Pull from Supabase into local cache ───────────────────────────────────────

export async function pullFromSupabase() {
  const user = await getCurrentUser();
  if (!user) return;

  const [{ data: tasks }, { data: assignments }] = await Promise.all([
    supabase.from('tasks').select('*').eq('user_id', user.id),
    supabase.from('assignments').select('*').eq('user_id', user.id),
  ]);

  if (tasks) {
    const mapped = tasks.map(t => ({
      id: t.id,
      assignmentId: t.assignment_id,
      title: t.title,
      date: t.date,
      startTime: t.start_time,
      durationMins: t.duration_mins,
      completed: t.completed,
      category: t.category,
      color: t.color,
    }));
    await chrome.storage.local.set({ [KEYS.TASKS]: mapped });
  }

  if (assignments) {
    const mapped = assignments.map(a => ({
      id: a.id,
      source: a.source,
      course: a.course,
      title: a.title,
      dueDate: a.due_date,
      dueTime: a.due_time,
      type: a.type,
      url: a.url,
      completed: a.completed,
      scannedAt: a.scanned_at,
    }));
    await chrome.storage.local.set({ [KEYS.ASSIGNMENTS]: mapped });
  }
}

// ── Metadata & Settings ───────────────────────────────────────────────────────

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

// ── Utility ───────────────────────────────────────────────────────────────────

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
