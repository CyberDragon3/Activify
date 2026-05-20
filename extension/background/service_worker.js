console.log('[Activify] Service Worker Loading...');

import { 
  getTasks, 
  getSettings, 
  setLastScan, 
  mergeAssignments, 
  supabase, 
  getCurrentUser 
} from '../shared/storage.js';

console.log('[Activify] Service Worker Dependencies Loaded.');

chrome.runtime.onInstalled.addListener(() => {
  console.log('[Activify] Installed. Setting up alarms...');
  // setupAlarms();
});

chrome.runtime.onStartup.addListener(() => {
  console.log('[Activify] Startup. Setting up alarms...');
  // setupAlarms();
});

function setupAlarms() {
  // chrome.alarms.create('scan', { periodInMinutes: 30 });
  // chrome.alarms.create('reminders', { periodInMinutes: 1 });
}

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
  const todayDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;

  const systemPrompt = `You are a school assignment extractor. TODAY IS ${todayDate}.

CRITICAL RULES — violating any rule means a wrong answer:
1. Output ONLY valid JSON: { "assignments": [ { "title": "...", "dueDate": "YYYY-MM-DD", "course": "...", "url": "..." } ] }
2. ONLY extract assignments EXPLICITLY visible in the text. Do NOT invent, infer, or guess any assignment.
3. SKIP any item that says "Done", "Turned In", "Graded", "No due date", or has no clear title.
4. SKIP any assignment whose due date is BEFORE ${todayDate} (already past).
5. "Tomorrow" = ${tomorrowDate}. Year is always 2026 if not stated.
6. If you are unsure about a due date, set dueDate to null — do NOT guess.
7. If no assignments found, return { "assignments": [] }.
8. The "course" field should be the class/subject name, not a teacher name.
9. IMPORTANT: Assignment titles often contain date ranges like "3/30 - 4/2" or "Week 13". These are just the assignment NAME, NOT the due date. Always use the separately listed due date/time (e.g. "Today, 10:00 PM", "Wednesday, 8:00 PM") as the dueDate, never the dates inside the title.
10. "Today" = ${todayDate}. For named days like "Wednesday", calculate the actual calendar date relative to today.`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    console.log('[Activify] Fetching from Groq API...');
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
          { role: 'user', content: `Extract assignments from this school page content:\n\n${rawText.slice(0, 7000)}` }
        ],
        temperature: 0,
        response_format: { type: 'json_object' }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log(`[Activify] Groq API Response status: ${response.status}`);
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
    console.log(`[Activify] AI extracted ${content.assignments?.length || 0} potential assignments`);
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
  console.log(`[Activify] Message received: ${message.type}`);

  if (message.type === 'ACTIVIFY_AI_DATA_COLLECTED') {
    const { source, rawText, accountKey, url } = message;
    console.log(`[Activify] Processing AI data from ${source} (${accountKey}), rawText length: ${rawText.length}`);

    // Helper to process with user
    const processData = async (user) => {
      console.log(`[Activify] Processing for user: ${user.id}`);
      const newAssignments = await parseAssignmentsWithAI(rawText, source);
      if (!newAssignments) {
        console.warn(`[Activify] AI parsing failed or returned null for ${source}`);
      } else {
        console.log(`[Activify] AI found ${newAssignments.length} assignments for ${source}`);
        await mergeAssignments(newAssignments, accountKey, url); 
      }
      console.log(`[Activify] Sending ACTIVIFY_REFRESH after processing ${source}`);
      chrome.runtime.sendMessage({ type: 'ACTIVIFY_REFRESH' }).catch(() => {});
      sendResponse({ ok: true });
    };

    // Try getting user immediately, then retry once after 1.5s if null
    getCurrentUser().then(async user => {
      if (user) {
        await processData(user);
      } else {
        console.log('[Activify] User not found immediately in SW, retrying in 1.5s...');
        setTimeout(async () => {
          const userRetry = await getCurrentUser();
          if (userRetry) {
            console.log('[Activify] User found after retry.');
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

  if (message.type === 'ACTIVIFY_ASSIGNMENTS_SCRAPED') {
    const { source, assignments, accountKey, url } = message;
    getCurrentUser().then(user => {
      if (!user) {
        console.warn('[Activify] Legacy Scrape: No user found.');
        sendResponse({ ok: false, error: 'No user' });
        return;
      }
      mergeAssignments(assignments, user.id, accountKey || 'default', url || '').then(async () => {
        await setLastScan(source);
        console.log(`[Activify] Sending ACTIVIFY_REFRESH after legacy scrape for ${source}`);
        chrome.runtime.sendMessage({ type: 'ACTIVIFY_REFRESH' }).catch(() => {});
        sendResponse({ ok: true });
      }).catch(() => sendResponse({ ok: false }));
    });
    return true;
  }

  if (message.type === 'ACTIVIFY_REQUEST_SCAN') {
    triggerScanOnSchoolSites(true).then((triggered) => {
      console.log(`[Activify] Scan request result: triggered=${triggered}`);
      sendResponse({ ok: triggered });
    });
    return true;
  }
});

async function triggerScanOnSchoolSites(activeOnly = false) {
  const tabs = await chrome.tabs.query(activeOnly ? { active: true } : {});
  const patterns = [
    /classroom\.google\.com/,
    /\.instructure\.com/,
    /\.schoology\.com/,
  ];

  let triggered = false;
  for (const tab of tabs) {
    if (!tab.url) continue;
    if (!patterns.some(p => p.test(tab.url))) continue;

    console.log(`[Activify] Triggering scan on tab ${tab.id}: ${tab.url}`);
    chrome.tabs.sendMessage(tab.id, { type: 'ACTIVIFY_SCAN' }).catch(() => {
      console.warn(`[Activify] Failed to send ACTIVIFY_SCAN to tab ${tab.id}`);
    });
    triggered = true;
  }
  return triggered;
}
