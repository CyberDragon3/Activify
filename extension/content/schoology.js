// content/schoology.js
(function () {
  console.log('ACTIVIFY: schoology script loaded');
  const SOURCE = 'schoology';

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

    const seen = new Set();

    // Walk every date-header and its sibling upcoming-event blocks
    const dateHeaders = document.querySelectorAll('.date-header');

    dateHeaders.forEach(header => {
      // Skip overdue headers — only want upcoming
      if (header.closest('.overdue-submissions, .overdue-submissions-wrapper')) return;

      const headerText = header.innerText?.trim();
      if (!headerText) return;

      const dateISO = toISOFromMonthDay(headerText);
      if (!dateISO) return;

      // Skip past dates
      const dateObj = new Date(dateISO + 'T00:00:00');
      if (dateObj < todayObj) return;

      // Walk siblings until the next date-header or end of parent
      let sib = header.nextElementSibling;
      while (sib && !sib.classList.contains('date-header')) {
        if (
          sib.classList.contains('upcoming-event') &&
          sib.classList.contains('course-event') &&
          !sib.classList.contains('hidden-important')
        ) {
          try {
            const link = sib.querySelector('a[href]');
            const href = link?.href;

            if (!href || !href.includes('/assignment/')) {
              sib = sib.nextElementSibling;
              continue;
            }

            const rawText = sib.innerText || '';
            const lines = rawText
              .split('\n')
              .map(l => l.trim())
              .filter(Boolean);

            // Skip "Assignment." / "." type labels at start
            const skipPrefixes = ['assignment.', '.', 'event.'];
            const contentLines = lines.filter(l => !skipPrefixes.includes(l.toLowerCase()));

            // Title is first meaningful line
            const title = contentLines[0] || '';
            if (!title) {
              sib = sib.nextElementSibling;
              continue;
            }

            // Due time from raw text
            const dueTimeMatch = rawText.match(/at\s+(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))/i);
            const dueTime = dueTimeMatch ? normalizeTime(dueTimeMatch[1]) : null;

            // Course: look for lines matching "Subject - NNNN" pattern
            // e.g. "Biology - 3110: LernerL p1 T2 Monta Vista High School"
            let course = 'Unknown Course';
            const courseLineRaw = contentLines.find(l =>
              /\d{3,}/.test(l) &&
              (l.includes('-') || l.includes('–')) &&
              !l.toLowerCase().includes('due') &&
              !l.toLowerCase().includes('overdue')
            );
            if (courseLineRaw) {
              // Take only the part before the colon (e.g. "Biology - 3110")
              course = courseLineRaw.split(':')[0].trim();
            }

            const id = makeId(course, title);
            if (seen.has(id)) {
              sib = sib.nextElementSibling;
              continue;
            }
            seen.add(id);

            assignments.push({
              id,
              source: SOURCE,
              course,
              title,
              dueDate: dateISO,
              dueTime,
              type: 'assignment',
              url: href,
              completed: false,
              scannedAt: Date.now(),
            });
          } catch (err) {
            console.warn('ACTIVIFY: error scraping schoology item', err);
          }
        }
        sib = sib.nextElementSibling;
      }
    });

    return assignments;
  }

  function run() {
    const assignments = scrape();
    if (!assignments.length) {
      console.log('ACTIVIFY: schoology — no assignments scraped');
    } else {
      console.log('ACTIVIFY: schoology scraped', assignments.length, assignments);
    }
    chrome.runtime.sendMessage({
      type: 'ACTIVIFY_ASSIGNMENTS_SCRAPED',
      source: SOURCE,
      assignments,
    });
  }

  function debugScan() {
    return {
      dateHeaders: Array.from(document.querySelectorAll('.date-header')).map(h => h.innerText.trim()),
      upcomingEvents: Array.from(document.querySelectorAll('.upcoming-event.course-event')).map(el => ({
        class: el.className,
        text: el.innerText.trim().substring(0, 200),
        href: el.querySelector('a[href]')?.href,
      })),
      assignments: scrape(),
    };
  }

  try {
    window.__ACTIVIFY_SCHOOLOGY__ = { scrape, run, debugScan };
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
    if (msg?.type === 'ACTIVIFY_SCAN') run();
  });
})();