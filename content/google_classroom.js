// content/google_classroom.js
(function () {
  console.log("PLANR: classroom script loaded");
  const SOURCE = 'google_classroom';

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

  // robust href extraction for a candidate element
  function extractHref(el) {
    try {
      if (!el) return null;
      if (el.href) return el.href;
      // data-href or data-* attributes
      const dataHref = el.getAttribute && (el.getAttribute('data-href') || el.getAttribute('data-target') || el.dataset?.href);
      if (dataHref) return dataHref;
      // child anchor fallback
      const childA = el.querySelector && el.querySelector('a[href]');
      if (childA && childA.href) return childA.href;
    } catch (e) {
      return null;
    }
    return null;
  }

  // MAIN: scrape DOM for classroom assignment detail links and produce objects
  function scrape() {
    const assignments = [];

    // gather candidate clickable elements
    const candidates = Array.from(document.querySelectorAll('a[href], a[role="link"], div[role="link"], span[role="link"], [data-href]'));

    // debug counts (visible in console)
    const candidateCount = candidates.length;

    // map to hrefs and filter for assignment detail links
    const assignmentCandidates = candidates
      .map(el => ({ el, href: extractHref(el) }))
      .filter(x => x.href && x.href.includes('/c/') && x.href.includes('/a/'));

    // dedupe by href
    const seen = new Set();
    const links = [];
    for (const item of assignmentCandidates) {
      const href = item.href;
      if (!href || seen.has(href)) continue;
      seen.add(href);
      links.push(item.el);
    }

    // debug visibility
    console.log('PLANR: candidate clickable elements found', candidateCount);
    console.log('PLANR: assignment hrefs filtered & deduped found', links.length);

    // regex helpers
    const monthNames = '(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\.?';
    const strictDateRegex = new RegExp('\\b(?:Today|Tomorrow|(?:' + monthNames + ')\\s*\\d{1,2}(?:,\\s*\\d{4})?)\\b', 'i');
    const monthExtractRegex = new RegExp('(' + monthNames + '\\s*\\d{1,2}(?:,\\s*\\d{4})?)', 'i');
    const timeRegex = /(\d{1,2}:\d{2})\s*(AM|PM)?/i;
    const titleCutLookahead = new RegExp('(Posted\\b|\\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)day\\b|\\b' + monthNames + '\\b|Period\\s*\\d+)', 'i');

    for (const link of links) {
      try {
        // final href (best effort)
        const href = extractHref(link);
        if (!href) continue;

        // title: prefer span inside the link, otherwise the link text or fallback to last path segment
        let rawTitle = '';
        if (link.querySelector) {
          const span = link.querySelector('span');
          if (span && span.innerText) rawTitle = span.innerText.trim();
        }
        if (!rawTitle) rawTitle = (link.innerText || '').trim();

        let title = rawTitle.split('\n')[0].trim();
        const cutIndex = title.search(titleCutLookahead);
        if (cutIndex > 0) title = title.slice(0, cutIndex).trim();
        title = title.replace(/\s{2,}/g, ' ').replace(/^\uFEFF/, '').trim();
        if (!title) title = href.split('/').pop() || 'Untitled';

        // course: climb ancestors for nearest h2/h3 text
        let course = 'Unknown Course';
        let p = link.parentElement;
        while (p) {
          try {
            const heading = p.querySelector && p.querySelector('h2, h3');
            if (heading && heading.innerText && heading.innerText.trim()) {
              course = heading.innerText.trim();
              break;
            }
          } catch (e) {}
          p = p.parentElement;
        }

        // flattened nearby text to extract due info
        const container = (link.closest && link.closest('div')) || link.parentElement;
        const allText = (container?.innerText || '').replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim();

        // due text detection (multiple fallbacks)
        let dueText = null;
        const dueLabelMatch = allText.match(/\bDue\s*[:\-]?\s*([A-Za-z0-9\s,]+?(?:AM|PM|am|pm)?)(?=\s|$)/);
        if (dueLabelMatch) dueText = dueLabelMatch[1].trim();

        if (!dueText) {
          const mStrict = allText.match(strictDateRegex);
          dueText = mStrict ? mStrict[0].trim() : null;
        }
        if (!dueText) {
          const loose = allText.match(monthExtractRegex);
          dueText = loose ? loose[1].trim() : null;
        }

        // due time extraction
        let dueTime = null;
        if (dueText) {
          const tmInside = dueText.match(timeRegex);
          if (tmInside) {
            dueTime = normalizeTime(tmInside[0]);
            dueText = dueText.replace(timeRegex, '').trim();
          }
        }
        if (!dueTime) {
          const tm = allText.match(timeRegex);
          if (tm) dueTime = normalizeTime(tm[0]);
        }

        if (dueText) {
          const maybe = dueText.replace(/\bDue\b/ig, '').trim();
          if (maybe) dueText = maybe;
        }

        const dueDateISO = dueText ? toISOFromMonthDay(dueText) : null;

        // skip past-due assignments if date is known
        if (dueDateISO) {
          const dueObj = new Date(dueDateISO + 'T00:00:00');
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (dueObj < today) continue;
        }

        assignments.push({
          id: makeId(course, title),
          source: SOURCE,
          course,
          title,
          rawTitle,
          dueText: dueText || null,
          dueDate: dueDateISO,
          dueTime: dueTime,
          type: 'assignment',
          url: href,
          completed: false,
          scannedAt: Date.now()
        });
      } catch (err) {
        console.warn('PLANR: error scraping one link', err);
        continue;
      }
    }

    return assignments;
  }

  function run() {
    const assignments = scrape();
    if (!assignments.length) {
      console.log('PLANR: no assignments scraped');
      chrome.runtime.sendMessage({
        type: 'PLANR_ASSIGNMENTS_SCRAPED',
        source: SOURCE,
        assignments: [],
      });
      return;
    }
    console.log('PLANR: scraped assignments', assignments.length, assignments);
    chrome.runtime.sendMessage({
      type: 'PLANR_ASSIGNMENTS_SCRAPED',
      source: SOURCE,
      assignments,
    });
  }

  // tiny debug helper (inspect why links were/weren't picked)
  function debugScan() {
    const candidates = Array.from(document.querySelectorAll('a[href], a[role="link"], div[role="link"], span[role="link"], [data-href]'));
    const mapped = candidates.map(el => ({ el, href: extractHref(el), text: (el.innerText||'').slice(0,200) }));
    const assignmentHrefs = mapped.filter(x => x.href && x.href.includes('/c/') && x.href.includes('/a/'));
    return {
      candidateCount: candidates.length,
      assignmentHrefCount: assignmentHrefs.length,
      sampleCandidates: mapped.slice(0, 200).map(x => ({ href: x.href, text: x.text })),
      assignments: scrape()
    };
  }

  // expose debug API
  try {
    window.__PLANR__ = {
      scrape,
      run,
      toISOFromMonthDay,
      normalizeTime,
      debugScan
    };
  } catch (e) {}

  // initial run
  run();

  // rerun when SPA URL changes
  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(run, 1200);
    }
  }).observe(document.body, { childList: true, subtree: true });

  chrome.runtime.onMessage.addListener(msg => {
    if (msg && msg.type === 'PLANR_SCAN') run();
  });
})();