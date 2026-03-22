// content/canvas.js
(function () {
  console.log('ACTIVIFY: canvas script loaded');
  const SOURCE = 'canvas';

  function makeId(course, title) {
    const str = `${SOURCE}:${course}:${title}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
    }
    return `${SOURCE}_${Math.abs(hash).toString(36)}`;
  }

  function toISOFromMonthDay(text) {
    if (!text) return null;
    const now = new Date();
    const cleaned = String(text).replace(/\u00A0/g, ' ').replace(/\./g, '').trim();

    if (/^\s*Today\s*$/i.test(cleaned)) {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
    if (/^\s*Tomorrow\s*$/i.test(cleaned)) {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    const months = {
      jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
      may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7, sep: 8, sept: 8, september: 8,
      oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11
    };

    const m = cleaned.match(/([A-Za-z]+)\s+(\d{1,2})(?:\s*,\s*(\d{4}))?/);
    if (!m) return null;
    const monthName = m[1].toLowerCase();
    const day = parseInt(m[2], 10);
    const year = m[3] ? parseInt(m[3], 10) : now.getFullYear();
    const short = monthName.slice(0, 3);
    const monthIdx = (months[short] !== undefined) ? months[short] : months[monthName];

    if (typeof monthIdx === 'undefined' || Number.isNaN(day)) return null;

    const dt = new Date(year, monthIdx, day);
    if (!m[3]) {
      const diff = dt - now;
      if (diff < -180 * 24 * 3600 * 1000) dt.setFullYear(dt.getFullYear() + 1);
    }
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  }

  function normalizeTime(text) {
    if (!text) return null;
    const m = text.match(/(\d{1,2}):(\d{2})[\s\u00A0]*(AM|PM)?/i);
    if (!m) return null;
    let h = parseInt(m[1], 10);
    const min = m[2].padStart(2, '0');
    const ampm = m[3] ? m[3].toUpperCase() : null;
    if (ampm) {
      if (ampm === 'PM' && h !== 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
    }
    return `${String(h).padStart(2, '0')}:${min}`;
  }

  function scrape() {
    const assignments = [];
    const todayObj = new Date();
    todayObj.setHours(0, 0, 0, 0);

    // Canvas todo sidebar: .planner-todosidebar-item-list li
    // Each li with a link is one assignment item
    const items = Array.from(document.querySelectorAll(
      '.planner-todosidebar-item-list li, [class*="TodoListItem"], .todo-list li'
    ));

    console.log('ACTIVIFY: canvas todo items found', items.length);

    const seen = new Set();

    for (const item of items) {
      try {
        const link = item.querySelector('a[href]');
        if (!link) continue;

        const href = link.href;
        if (!href) continue;

        // Only assignments, discussions, quizzes
        const isAssignment = href.includes('/assignments/') ||
                             href.includes('/discussion_topics/') ||
                             href.includes('/quizzes/');
        if (!isAssignment) continue;

        const rawText = item.innerText || '';
        const lines = rawText
          .split('\n')
          .map(l => l.trim())
          .filter(Boolean);

        // Title is the first line (the link text)
        const title = lines[0] || link.innerText.trim() || href.split('/').pop() || 'Untitled';
        if (!title) continue;

        // Course is second line — Canvas always puts course name right below title
        const course = lines[1] || 'Unknown Course';

        // Due date/time — Canvas format: "Mar 6 at 9pm" or "Mar 9 at 12:52pm"
        // Find the line that looks like a date
        const dateLine = lines.find(l =>
          /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(l) ||
          /\bat\s+\d/i.test(l)
        );

        let dueDateISO = null;
        let dueTime = null;

        if (dateLine) {
          // Split on "at" — left side is date, right side is time
          const atIdx = dateLine.toLowerCase().indexOf(' at ');
          if (atIdx !== -1) {
            const datePart = dateLine.slice(0, atIdx).trim();
            const timePart = dateLine.slice(atIdx + 4).trim();
            dueDateISO = toISOFromMonthDay(datePart);
            dueTime = normalizeTime(timePart);
          } else {
            dueDateISO = toISOFromMonthDay(dateLine);
          }
        }

        // Skip past-due
        if (dueDateISO) {
          const dueObj = new Date(dueDateISO + 'T00:00:00');
          if (dueObj < todayObj) continue;
        }

        const id = makeId(course, title);
        if (seen.has(id)) continue;
        seen.add(id);

        assignments.push({
          id,
          source: SOURCE,
          course,
          title,
          rawTitle: title,
          dueDate: dueDateISO,
          dueTime,
          type: 'assignment',
          url: href,
          completed: false,
          scannedAt: Date.now(),
        });
      } catch (err) {
        console.warn('ACTIVIFY: error scraping canvas item', err);
        continue;
      }
    }

    return assignments;
  }

  function run() {
    const assignments = scrape();
    if (!assignments.length) {
      console.log('ACTIVIFY: canvas — no assignments scraped');
      chrome.runtime.sendMessage({
        type: 'ACTIVIFY_ASSIGNMENTS_SCRAPED',
        source: SOURCE,
        assignments: [],
      });
      return;
    }
    console.log('ACTIVIFY: canvas scraped', assignments.length, assignments);
    chrome.runtime.sendMessage({
      type: 'ACTIVIFY_ASSIGNMENTS_SCRAPED',
      source: SOURCE,
      assignments,
    });
  }

  function debugScan() {
    const items = Array.from(document.querySelectorAll(
      '.planner-todosidebar-item-list li, [class*="TodoListItem"], .todo-list li'
    ));
    return {
      itemCount: items.length,
      sampleItems: items.slice(0, 10).map(li => ({
        text: li.innerText.trim().substring(0, 200),
        href: li.querySelector('a[href]')?.href,
      })),
      assignments: scrape(),
    };
  }

  try {
    window.__ACTIVIFY_CANVAS__ = { scrape, run, debugScan };
  } catch (e) {}

  run();

  // Rerun on SPA navigation
  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(run, 1200);
    }
  }).observe(document.body, { childList: true, subtree: true });

  chrome.runtime.onMessage.addListener(msg => {
    if (msg && msg.type === 'ACTIVIFY_SCAN') run();
  });
})();