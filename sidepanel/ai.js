// sidepanel/ai.js
import { 
  getAssignments, 
  getTasks, 
  today, 
  clearAiTasks, 
  batchUpsertTasks 
} from '../shared/storage.js';

const MODEL = 'llama-3.3-70b-versatile';

// ─── Get API key from storage ─────────────────────────────────────────────────
async function getApiKey() {
  const result = await chrome.storage.local.get('groqApiKey');
  return result.groqApiKey || null;
}

// ─── Build context ────────────────────────────────────────────────────────────
async function buildScheduleContext() {
  const [assignments, tasks] = await Promise.all([getAssignments(), getTasks()]);
  const todayStr = today();

  const upcoming = assignments
    .filter(a => !a.completed && a.dueDate >= todayStr)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 20)
    .map(a => `- "${a.title}" (${a.course}) due ${a.dueDate}${a.dueTime ? ' at ' + a.dueTime : ''} [${a.source}]`)
    .join('\n');

  const todayTasks = tasks
    .filter(t => t.date === todayStr)
    .sort((a, b) => (a.startTime || '99:99').localeCompare(b.startTime || '99:99'))
    .map(t => `- "${t.title}" ${t.startTime ? 'at ' + t.startTime : '(no time set)'} ${t.durationMins ? t.durationMins + 'min' : ''} [${t.category}] ${t.completed ? '✓' : ''}`)
    .join('\n');

  return `
Today is ${todayStr} (${new Date().toLocaleDateString('en-US', { weekday: 'long' })}).

UPCOMING ASSIGNMENTS:
${upcoming || 'None found yet.'}

TODAY'S PLANNED TASKS:
${todayTasks || 'Nothing scheduled yet.'}
`.trim();
}

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Planr AI, a scheduling assistant built into a Chrome extension for high school students. You have access to the student's assignments scraped from Google Classroom, Canvas, and Schoology.

Your job is to help students:
1. Plan their day by scheduling study blocks
2. Estimate how long assignments will take
3. Suggest what to work on right now based on due dates and urgency
4. Adjust their schedule when they ask

When scheduling tasks, be realistic:
- High schoolers need breaks.
- After-school activities typically run 3-6pm.
- Use 30-60 min focused blocks.
- When the user asks to "Plan my day", provide a COMPLETE revised schedule. Your new suggestions will overwrite any previous AI suggestions.

When you create or suggest tasks, format them as JSON in a code block:
\`\`\`tasks
[
  { "title": "Study for Calc test", "date": "YYYY-MM-DD", "startTime": "HH:MM", "durationMins": 45, "category": "study" },
  { "title": "English essay outline", "date": "YYYY-MM-DD", "startTime": "HH:MM", "durationMins": 30, "category": "assignment" }
]
\`\`\`

Only output a \`\`\`tasks block when the user explicitly asks for scheduling. Keep other replies conversational and concise.`;

// ─── Send message to Groq ─────────────────────────────────────────────────────
export async function sendMessage(conversationHistory) {
  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error('No API key set. Please add your Groq API key in Settings.');
  }

  const scheduleContext = await buildScheduleContext();

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory.map((msg, i) => {
      const isLast = i === conversationHistory.length - 1;
      const isUser = msg.role === 'user';
      const content = isLast && isUser
        ? `[Student's current schedule context]\n${scheduleContext}\n\n[Student's message]\n${msg.content}`
        : msg.content;
      return { role: msg.role, content };
    }),
  ];

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Groq API error');
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// ─── Parse and apply suggested tasks ─────────────────────────────────────────
export async function applyTasksFromResponse(responseText) {
  const match = responseText.match(/```tasks\n([\s\S]*?)```/);
  if (!match) return [];

  let suggested;
  try {
    suggested = JSON.parse(match[1]);
  } catch (e) {
    console.error('[Planr AI] Failed to parse JSON block:', e);
    return [];
  }

  if (!Array.isArray(suggested) || suggested.length === 0) return [];

  // Normalize suggested tasks
  const normalized = [];
  const seenKeys = new Set();
  for (const raw of suggested) {
    if (!raw || !raw.title || !raw.date) continue;
    
    const title = String(raw.title).trim();
    const date = String(raw.date).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    
    const startTime = raw.startTime ? String(raw.startTime).trim() : null;
    const durationMins = raw.durationMins ? Number(raw.durationMins) : null;
    const category = raw.category ? String(raw.category).trim() : 'study';

    const key = `${title}|${date}|${startTime || ''}`;
    if (seenKeys.has(key)) continue; 
    seenKeys.add(key);

    normalized.push({ title, date, startTime, durationMins, category });
  }

  if (normalized.length === 0) return [];

  try {
    // 1) ATOMIC WIPE: Remove all previous AI tasks first
    await clearAiTasks();

    // 2) BATCH PREP: Create the new task objects
    const timestamp = Date.now();
    const tasksToApply = normalized.map((t, i) => ({
      id: `ai_${timestamp}_${i}`,
      assignmentId: null,
      title: t.title,
      date: t.date,
      startTime: t.startTime || null,
      durationMins: t.durationMins || null,
      completed: false,
      category: t.category,
      color: null,
    }));

    // 3) ATOMIC WRITE: Insert all new tasks in one storage call
    await batchUpsertTasks(tasksToApply);

    return tasksToApply;
  } catch (e) {
    console.error('[Planr AI] Failed to apply tasks:', e);
    return [];
  }
}

// ─── Quick action prompts ─────────────────────────────────────────────────────
export const QUICK_PROMPTS = [
  { label: '📅 Plan my day', prompt: 'Plan out the rest of my day with study blocks for my upcoming assignments.' },
  { label: '🎯 What should I do now?', prompt: 'What should I work on right now based on my upcoming deadlines?' },
  { label: '⏱ Estimate my homework', prompt: 'How long do you think my upcoming assignments will take? Give me a realistic estimate for each.' },
];