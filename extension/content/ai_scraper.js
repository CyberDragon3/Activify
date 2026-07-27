(function () {
  const DEBUG = false;

  function getType() {
    const domain = window.location.hostname;
    if (domain.includes('classroom.google.com')) return 'google_classroom';
    if (domain.includes('.instructure.com')) return 'canvas';
    if (domain.includes('schoology.com')) return 'schoology';
    return null;
  }

  function getAccountKey() {
    try {
      if (window.location.hostname.includes('classroom.google.com')) {
        // Look for the account identifier in the top right
        const emailEl = document.querySelector('.gb_d[aria-label*="@"]');
        if (emailEl) return emailEl.getAttribute('aria-label');
      }
      if (window.location.hostname.includes('.instructure.com')) {
        // Canvas usually has a user ID in the ENV global
        if (window.ENV?.current_user_id) return `canvas_${window.ENV.current_user_id}`;
      }
      if (window.location.hostname.includes('.schoology.com')) {
        const profileLink = document.querySelector('a[href*="/user/"]');
        if (profileLink) return profileLink.href;
      }
    } catch (e) {}
    return 'default';
  }

  // Returns an array of { text, link } using stable, non-obfuscated selectors
  function scrapeEntries(type) {
    const seen = new Set();
    const entries = [];

    function addRow(el, linkOverride) {
      if (!el) return;
      if (el.closest('nav, header, [role="navigation"], [aria-label="Main menu"]')) return;
      const raw = el.innerText?.trim() || '';
      if (!raw || raw.length < 10) return;
      if (/^(Assigned|Missing|Done|To Do|Graded)$/i.test(raw)) return;
      const text = raw.replace(/\s*\n\s*/g, ' | ');
      if (seen.has(text)) return;
      seen.add(text);
      const link = linkOverride || el.querySelector('a[href]')?.href || '';
      entries.push({ text, link });
    }

    if (type === 'google_classroom') {
      const links = Array.from(document.querySelectorAll('a[href*="/c/"][href*="/a/"]'));
      const dedupedLinks = [...new Map(links.map(a => [a.href, a])).values()];
      for (const a of dedupedLinks) {
        const container = a.closest('li, [role="listitem"], div[class]') || a;
        addRow(container, a.href);
      }
      for (const el of document.querySelectorAll('[data-assignment-done], [jsaction*="assignment"]')) {
        addRow(el);
      }
    } else if (type === 'canvas') {
      const canvasLinks = Array.from(document.querySelectorAll(
        'a[href*="/assignments/"], a[href*="/discussion_topics/"], a[href*="/quizzes/"]'
      ));
      for (const a of canvasLinks) {
        if (a.closest('nav, [role="navigation"]')) continue;
        const container = a.closest('li, [class*="TodoListItem"], [class*="planner-item"]') || a;
        addRow(container, a.href);
      }
    } else if (type === 'schoology') {
      for (const el of document.querySelectorAll(
        '[class*="upcoming-event"], [class*="course-event"], .s-upcoming-events-list li'
      )) {
        addRow(el);
      }
    }

    return entries;
  }

  function localDateString() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  }

  async function run() {
    const type = getType();
    if (!type) return;

    const entries = scrapeEntries(type);
    const accountKey = getAccountKey();

    let payload = `SOURCE_TYPE: ${type}\n`;
    payload += `ACCOUNT_KEY: ${accountKey}\n`;
    payload += `TODAY_IS: ${localDateString()}\n\n`;

    for (const { text, link } of entries) {
      payload += `[ENTRY]: ${text} | LINK: ${link}\n`;
    }

    // Fallback: grab main content text if no structured entries found
    if (entries.length === 0) {
      const main = document.querySelector('main, [role="main"], #content, body');
      if (main) {
        payload += '[FALLBACK PAGE TEXT]:\n';
        payload += main.innerText.replace(/\s\s+/g, ' ').slice(0, 5000);
      }
    }

    if (DEBUG) console.log(`[Activify] ${type} (${accountKey}) scraped ${entries.length} entries`);

    try {
      await chrome.runtime.sendMessage({
        type: 'ACTIVIFY_AI_DATA_COLLECTED',
        source: type,
        accountKey: accountKey,
        rawText: payload.slice(0, 8500),
        url: window.location.href,
      });
    } catch (err) {
      console.warn('[Activify] Could not send scan data:', err.message);
    }
  }

  chrome.runtime.onMessage.addListener(msg => {
    if (msg.type === 'ACTIVIFY_SCAN') run();
  });

  if (DEBUG) console.log('[Activify] Scraper ready. Waiting for manual scan.');
})();
