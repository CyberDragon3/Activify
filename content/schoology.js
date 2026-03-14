// content/schoology.js
(function () {
  const SOURCE = 'schoology';

  function makeId(course, title) {
    const str = `${SOURCE}:${course}:${title}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
    }
    return `${SOURCE}_${Math.abs(hash).toString(36)}`;
  }

  function parseDue(text, epochAttr) {
    if (epochAttr) {
      const ms = parseInt(epochAttr) * 1000;
      if (!isNaN(ms)) {
        const d = new Date(ms);
        const y = d.getFullYear();
        const mo = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const h = String(d.getHours()).padStart(2, '0');
        const m = String(d.getMinutes()).padStart(2, '0');
        return { dueDate: `${y}-${mo}-${day}`, dueTime: `${h}:${m}` };
      }
    }

    if (!text) return { dueDate: null, dueTime: null };
    text = text.replace(/due:\s*/i, '').trim();

    const match = text.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?(?:\s+at\s+(\d+:\d+\s*[AP]M))?/i);
    if (!match) return { dueDate: null, dueTime: null };

    const now = new Date();
    const month = parseInt(match[1]);
    const day = parseInt(match[2]);
    const year = match[3] ? parseInt(match[3]) : now.getFullYear();
    const date = new Date(year, month - 1, day);

    let dueTime = null;
    if (match[4]) {
      const t = match[4].trim();
      const isPm = /pm/i.test(t);
      const [rawH, rawM] = t.replace(/\s*[AP]M/i, '').split(':').map(Number);
      let h = rawH;
      if (isPm && h !== 12) h += 12;
      if (!isPm && h === 12) h = 0;
      dueTime = `${String(h).padStart(2, '0')}:${String(rawM).padStart(2, '0')}`;
    }

    const y = date.getFullYear();
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return { dueDate: `${y}-${mo}-${d}`, dueTime };
  }

  function scrape() {
    const assignments = [];

    document.querySelectorAll('.upcoming-item, .s-upcoming-item').forEach(item => {
      const titleEl = item.querySelector('.item-title a, .s-item-title a');
      const dueEl = item.querySelector('.due-date, .s-due-date, [data-epoch]');
      const courseEl = item.querySelector('.course-name, .s-course-name');

      const title = titleEl?.textContent?.trim();
      if (!title) return;

      const epoch = dueEl?.getAttribute('data-epoch');
      const { dueDate, dueTime } = parseDue(dueEl?.textContent, epoch);
      const course = courseEl?.textContent?.trim() || 'Schoology Course';
      const url = titleEl?.href || location.href;

      assignments.push({
        id: makeId(course, title),
        source: SOURCE,
        course,
        title,
        dueDate,
        dueTime,
        type: 'assignment',
        url,
        completed: false,
        scannedAt: Date.now(),
      });
    });

    document.querySelectorAll('.material-row, .s-material-row').forEach(row => {
      const titleEl = row.querySelector('.title a, .s-title a');
      const dueEl = row.querySelector('.due-date, [data-epoch]');
      const title = titleEl?.textContent?.trim();
      if (!title) return;

      const breadcrumb = document.querySelector('.course-header h1, #course-title');
      const course = breadcrumb?.textContent?.trim() || 'Schoology Course';

      const epoch = dueEl?.getAttribute('data-epoch');
      const { dueDate, dueTime } = parseDue(dueEl?.textContent, epoch);
      const url = titleEl?.href || location.href;

      assignments.push({
        id: makeId(course, title),
        source: SOURCE,
        course,
        title,
        dueDate,
        dueTime,
        type: 'assignment',
        url,
        completed: false,
        scannedAt: Date.now(),
      });
    });

    return assignments;
  }

  function run() {
    const assignments = scrape();
    if (assignments.length === 0) return;
    chrome.runtime.sendMessage({
      type: 'ACTIVIFY_ASSIGNMENTS_SCRAPED',
      source: SOURCE,
      assignments,
    });
  }

  run();
  document.addEventListener('schoology:navigate', () => setTimeout(run, 800));

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'ACTIVIFY_SCAN') run();
  });
})();