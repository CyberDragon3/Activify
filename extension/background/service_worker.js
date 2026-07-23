import { 
  getTasks, 
  getSettings, 
  setLastScan, 
  mergeAssignments, 
  supabase, 
  getCurrentUser 
} from '../shared/storage.js';

import { initPostHog } from '../shared/analytics.bundle.js';

let analytics = null;

async function getAnalytics() {
  if (!analytics) analytics = await initPostHog('background');
  return analytics;
}

chrome.runtime.onInstalled.addListener(async () => {
  const ph = await getAnalytics();
  ph.capture('Extension Installed');
});

chrome.runtime.onStartup.addListener(async () => {
  const ph = await getAnalytics();
  ph.capture('Extension Started');
});

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

// --- AI PARSING LOGIC ---
async function parseAssignmentsWithAI(rawText, source) {
  const storage = await chrome.storage.local.get(['groqApiKey']);
  const apiKey = storage.groqApiKey;
  if (!apiKey) {
    console.warn('[Activify] Cannot parse: No Groq API Key found in storage.');
    return null;
  }

  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const yyyy = now.getFullYear();
  const mm = now.getMonth() + 1;
  const dd = now.getDate();
  const todayDate = `${yyyy}-${pad(mm)}-${pad(dd)}`;
  const todayName = days[now.getDay()];

  // Pre-process rawText: replace relative day names with actual dates
  // so the AI never needs to interpret "Today" / "Tomorrow" / weekday names
  const dayNameToDate = { Today: todayDate, today: todayDate };
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const k = days[d.getDay()];
    dayNameToDate[k] = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  let cleanText = rawText;
  for (const name of Object.keys(dayNameToDate).sort((a, b) => b.length - a.length)) {
    cleanText = cleanText.replace(new RegExp(`\\b${name}\\b`, 'g'), dayNameToDate[name]);
  }



  const systemPrompt = `You are a school assignment extractor. Today is ${todayName}, ${todayDate}.

CRITICAL RULES — violating any rule means a wrong answer:
1. Output ONLY valid JSON: { "assignments": [ { "title": "...", "dueDate": "YYYY-MM-DD", "course": "...", "url": "..." } ] }
2. ONLY extract assignments EXPLICITLY visible in the text. Do NOT invent, infer, or guess any assignment.
3. SKIP any item that says "Done", "Turned In", "Graded", "No due date", or has no clear title.
4. SKIP any assignment whose due date is BEFORE ${todayDate} (already past).
5. Year is always 2026 if not stated.
6. If you are unsure about a due date, set dueDate to null — do NOT guess.
7. If no assignments found, return { "assignments": [] }.
8. The "course" field should be the class/subject name, not a teacher name.
9. Assignment titles often contain date ranges like "3/30 - 4/2" or "Week 13". These are just the assignment NAME, NOT the due date. Always use the separately listed due date/time as the dueDate, never the dates inside the title.`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Extract assignments from this school page content:\n\n${cleanText.slice(0, 7000)}` }
        ],
        temperature: 0,
        response_format: { type: 'json_object' }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('[Activify] Groq API Error:', data);
      return null;
    }

    if (!data.choices?.[0]?.message?.content) {
      console.warn('[Activify] Groq returned empty content');
      return [];
    }

    const content = JSON.parse(data.choices[0].message.content);
    if (!content.assignments || !Array.isArray(content.assignments)) return [];

    const todayStr = todayDate;

    return content.assignments
      .filter(a => {
        if (!a.title || a.title.length < 2) return false;
        const titleLower = a.title.toLowerCase();
        if (titleLower.includes('done') || titleLower.includes('turned in') || titleLower.includes('graded')) return false;
        if (a.dueDate && a.dueDate < todayStr) return false;
        return true;
      })
      .map(a => ({
        source,
        title: a.title,
        course: a.course || 'Unknown Course',
        dueDate: a.dueDate || null,
        dueTime: null,
        type: 'assignment',
        url: a.url || null,
        completed: false,
        scannedAt: Date.now(),
      }));

  } catch (err) {
    console.error('[Activify] AI Parsing failed:', err);
    return null;
  }
}

// --- MESSAGE HANDLER ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ACTIVIFY_AI_DATA_COLLECTED') {
    const { source, rawText, accountKey, url } = message;

    // Helper to process with user
    const processData = async (user) => {
      const newAssignments = await parseAssignmentsWithAI(rawText, source);
      if (!newAssignments) {
        console.warn(`[Activify] AI parsing failed or returned null for ${source}`);
      } else {
        await mergeAssignments(newAssignments, accountKey, url);
      }
      const ph = await getAnalytics();
      ph.capture('Scan Performed');
      chrome.runtime.sendMessage({ type: 'ACTIVIFY_REFRESH' }).catch(() => {});
      sendResponse({ ok: true });
    };

    // Try getting user immediately, then retry once after 1.5s if null
    getCurrentUser().then(async user => {
      if (user) {
        await processData(user);
      } else {
        setTimeout(async () => {
          const userRetry = await getCurrentUser();
          if (userRetry) {
            await processData(userRetry);
          } else {
            console.error('[Activify] No user found in background script after retry. Are you logged in?');
            sendResponse({ ok: false, error: 'No user' });
          }
        }, 1500);
      }
    }).catch(err => {
      console.error('[Activify] Error in message handler:', err);
      sendResponse({ ok: false });
    });

    return true; // Keep channel open
  }

  if (message.type === 'ACTIVIFY_REQUEST_SCAN') {
    triggerScanOnSchoolSites(true).then((triggered) => {
      sendResponse({ ok: triggered });
    });
    return true;
  }
});

async function triggerScanOnSchoolSites(activeOnly = false) {
  const tabs = await chrome.tabs.query(activeOnly ? { active: true, lastFocusedWindow: true } : {});
  const patterns = [
    /classroom\.google\.com/,
    /\.instructure\.com/,
    /\.schoology\.com/,
  ];

  let delivered = false;
  for (const tab of tabs) {
    if (!tab.url) continue;
    if (!patterns.some(p => p.test(tab.url))) continue;

    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'ACTIVIFY_SCAN' });
      delivered = true;
    } catch {
      // Content script not injected into this tab
    }
  }
  return delivered;
}
