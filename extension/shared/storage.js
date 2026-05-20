import { createClient } from './supabase-lib.js';

const SUPABASE_URL = 'https://uoetcnbpvgovjqnvpvtz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZXRjbmJwdmdvdmpxbnZwdnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMjk1MDAsImV4cCI6MjA4OTcwNTUwMH0.064TFKLxXCCRZPmJEK47O_QiRcxllJA2Bjx6TxdSNsY';

const ChromeStorageAdapter = {
  getItem: async (key) => {
    try {
      const result = await chrome.storage.local.get(key);
      const value = result[key] ?? null;
      console.log(`[Activify] Storage GET ${key}:`, value ? 'Found' : 'Null');
      return value;
    } catch (err) {
      console.error(`[Activify] Storage GET Error ${key}:`, err);
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      console.log(`[Activify] Storage SET ${key}`);
      await chrome.storage.local.set({ [key]: value });
    } catch (err) {
      console.error(`[Activify] Storage SET Error ${key}:`, err);
    }
  },
  removeItem: async (key) => {
    try {
      console.log(`[Activify] Storage REMOVE ${key}`);
      await chrome.storage.local.remove(key);
    } catch (err) {
      console.error(`[Activify] Storage REMOVE Error ${key}:`, err);
    }
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

const KEYS = {
  ASSIGNMENTS: 'assignments',
  TASKS: 'tasks',
  LAST_SCAN: 'lastScan',
  SETTINGS: 'settings',
};

// --- AUTH HELPERS ---

export async function getCurrentUser() {
  // 1. Check local session (fast)
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (session?.user) return session.user;

  // 2. If no session, wait a brief moment and try getUser (more robust)
  // This helps when storage is still initializing
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (user) return user;

  if (sessionError) console.error('[Activify] getSession error:', sessionError.message);
  if (userError) console.debug('[Activify] getUser error (expected if logged out):', userError.message);
  
  return null;
}

export async function clearAuth() {
  console.log('[Activify] Clearing all auth keys...');
  const all = await chrome.storage.local.get(null);
  const keys = Object.keys(all).filter(k => k.startsWith('sb-') || k.includes('auth-token'));
  if (keys.length > 0) {
    await chrome.storage.local.remove(keys);
  }
  await supabase.auth.signOut();
  console.log('[Activify] Auth cleared.');
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
  window.location.replace('auth.html');
}

// ── Assignment Helpers ────────────────────────────────────────────────────────

export async function getAssignments() {
  const result = await chrome.storage.local.get(KEYS.ASSIGNMENTS);
  return result[KEYS.ASSIGNMENTS] || [];
}

export async function mergeAssignments(scraped, accountKey = 'default', scanUrl = '') {
  if (!scraped || scraped.length === 0) return await getAssignments();

  const user = await getCurrentUser();
  if (!user) {
    console.error('[Activify] Cannot merge: No authenticated user.');
    return await getAssignments();
  }

  const existing = await getAssignments();
  const source = scraped[0].source;
  const todayStr = new Date().toISOString().slice(0, 10);
  const normalizedAccountKey = accountKey || 'default';

  const isExhaustive = scanUrl.includes('/to-do') || scanUrl.includes('/dashboard') || scanUrl.includes('/planner') || scanUrl.includes('/app/home');
  const coursesInScan = new Set(scraped.map(a => a.course));

  const otherAssignments = existing.filter(a => {
    const isSameAccount = a.source === source && (a.accountKey || 'default') === normalizedAccountKey;
    if (!isSameAccount) return true;
    if (isExhaustive) return false;
    return !coursesInScan.has(a.course);
  });

  const existingAccountMap = Object.fromEntries(
    existing.filter(a => a.source === source && (a.accountKey || 'default') === normalizedAccountKey).map(a => [a.id, a])
  );
  
  const newAssignments = scraped.map(a => {
    const id = makeId(a.source, a.course, a.title);
    return {
      ...a,
      id,
      accountKey: normalizedAccountKey,
      completed: existingAccountMap[id]?.completed ?? false
    };
  });

  const merged = [...otherAssignments, ...newAssignments].filter(a => !a.dueDate || a.dueDate >= todayStr);
  await chrome.storage.local.set({ [KEYS.ASSIGNMENTS]: merged });

  syncAssignmentsToSupabase(merged, source, normalizedAccountKey, user.id, isExhaustive, Array.from(coursesInScan)).catch(e =>
    console.error('[Activify] Supabase Sync Error (Assignments):', e.message)
  );

  return merged;
}

async function syncAssignmentsToSupabase(allAssignments, source, accountKey, userId, isExhaustive, coursesInScan) {
  console.log(`[Activify] 🔄 Syncing Assignments to Supabase. User: ${userId}, Source: ${source}`);
  
  const { error: deleteError } = await supabase.from('assignments')
    .delete()
    .eq('user_id', userId)
    .eq('source', source)
    .eq('account_key', accountKey)
    .in('course', isExhaustive ? allAssignments.map(a => a.course) : coursesInScan);

  if (deleteError) {
    console.error('[Activify] ❌ Supabase Delete Error:', deleteError.message, deleteError);
    return;
  }

  const rowsToSync = allAssignments
    .filter(a => a.source === source && (a.accountKey || 'default') === accountKey)
    .filter(a => isExhaustive || coursesInScan.includes(a.course))
    .map(a => ({
      id: a.id,
      user_id: userId,
      source: a.source,
      account_key: accountKey,
      course: a.course,
      title: a.title,
      due_date: a.dueDate,
      due_time: a.dueTime,
      type: a.type || 'assignment',
      url: a.url,
      completed: a.completed,
      scanned_at: a.scannedAt,
    }));

  console.log(`[Activify] 📤 Upserting ${rowsToSync.length} assignment rows...`);

  if (rowsToSync.length > 0) {
    const { data, error: insertError } = await supabase.from('assignments').upsert(rowsToSync, { onConflict: 'id' });
    if (insertError) {
      console.error('[Activify] ❌ Supabase Insert Error:', insertError.message, insertError);
    } else {
      console.log('[Activify] ✅ Assignments sync complete.', data);
    }
  } else {
    console.log('[Activify] ℹ️ No assignments to sync.');
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
  console.log('[Activify] 💾 Local upsert task:', task.title);
  const tasks = await getTasks();
  const idx = tasks.findIndex(t => t.id === task.id);
  if (idx >= 0) tasks[idx] = task;
  else tasks.push(task);
  await saveTasks(tasks);

  const user = await getCurrentUser();
  if (user) {
    console.log(`[Activify] 🔄 Syncing task "${task.title}" to Supabase for user ${user.id}`);
    const { data, error } = await supabase.from('tasks').upsert({
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
    }, { onConflict: 'id' });
    
    if (error) {
      console.error('[Activify] ❌ Supabase Upsert Error (Task):', error.message, error);
    } else {
      console.log('[Activify] ✅ Task sync complete.', data);
    }
  } else {
    console.warn('[Activify] ⚠️ Cannot sync task: No user logged in.');
  }
}

export async function deleteTask(id) {
  const tasks = await getTasks();
  await saveTasks(tasks.filter(t => t.id !== id));
  const user = await getCurrentUser();
  if (user) {
    console.log(`[Activify] 🗑️ Deleting task ${id} from Supabase...`);
    const { error } = await supabase.from('tasks').delete().eq('id', id).eq('user_id', user.id);
    if (error) console.error('[Activify] ❌ Supabase Delete Error (Task):', error.message);
    else console.log('[Activify] ✅ Task deletion synced.');
  }
}

export async function clearAiTasks() {
  const tasks = await getTasks();
  await saveTasks(tasks.filter(t => !String(t.id).startsWith('ai_')));
  const user = await getCurrentUser();
  if (user) {
    console.log('[Activify] 🧹 Clearing AI tasks from Supabase...');
    const { error } = await supabase.from('tasks').delete().like('id', 'ai_%').eq('user_id', user.id);
    if (error) console.error('[Activify] ❌ Supabase Clear AI Error:', error.message);
    else console.log('[Activify] ✅ AI tasks cleared from Supabase.');
  }
}

export async function batchUpsertTasks(newTasks) {
  const tasks = await getTasks();
  const taskMap = Object.fromEntries(tasks.map(t => [t.id, t]));
  for (const nt of newTasks) taskMap[nt.id] = nt;
  await saveTasks(Object.values(taskMap));

  const user = await getCurrentUser();
  if (user && newTasks.length > 0) {
    console.log(`[Activify] 🔄 Batch syncing ${newTasks.length} tasks to Supabase...`);
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
    const { data, error } = await supabase.from('tasks').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.error('[Activify] ❌ Supabase Batch Upsert Error:', error.message, error);
    } else {
      console.log('[Activify] ✅ Batch task sync complete.', data);
    }
  }
}

// ── Pull from Supabase into local cache ───────────────────────────────────────

export async function pullFromSupabase() {
  const user = await getCurrentUser();
  if (!user) {
    console.log('[Activify] ℹ️ Skipping pullFromSupabase: No user.');
    return;
  }

  console.log(`[Activify] 📥 Pulling data from Supabase for user ${user.id}...`);

  const [{ data: tasks, error: taskErr }, { data: assignments, error: assignErr }] = await Promise.all([
    supabase.from('tasks').select('*').eq('user_id', user.id),
    supabase.from('assignments').select('*').eq('user_id', user.id),
  ]);

  if (taskErr?.status === 401 || assignErr?.status === 401) {
    console.error('[Activify] ❌ 401 Unauthorized. Token might be expired or RLS is blocking.');
    await signOut();
    return;
  }

  if (taskErr) console.error('[Activify] ❌ Supabase Pull Error (Tasks):', taskErr.message, taskErr);
  if (assignErr) console.error('[Activify] ❌ Supabase Pull Error (Assignments):', assignErr.message, assignErr);

  if (tasks) {
    console.log(`[Activify] 📥 Received ${tasks.length} tasks from Supabase.`);
    if (tasks.length > 0) {
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
  }

  if (assignments) {
    console.log(`[Activify] 📥 Received ${assignments.length} assignments from Supabase.`);
    if (assignments.length > 0) {
      const mapped = assignments.map(a => ({
        id: a.id,
        source: a.source,
        accountKey: a.account_key || 'default',
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
