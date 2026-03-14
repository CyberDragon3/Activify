// content/canvas.js
(function () {
  const SOURCE = 'canvas';

  function makeId(course, title) {
    const str = `${SOURCE}:${course}:${title}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
    }
    return `${SOURCE}_${Math.abs(hash).toString(36)}`;
  }

  function parseDue(text, isoAttr) {
    if (isoAttr) {
      const d = new Date(isoAttr);
      if (!isNaN(d)) {
        const y = d.getFullYear();
        const mo = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const h = String(d.getHours()).padStart(2, '0');
        const m = String(d.getMinutes()).padStart(2, '0');
        return { dueDate: `${y}-${mo}-${day}`, dueTime: `${h}:${m}` };
      }
    }

    if (!text) return { dueDate: null, dueTime: null };
    text = text.replace(/due\s+/i, '').trim();

    const match = text.match(/([A-Za-z]+ \d+)(?:\s+at\s+(\d+:\d+\s*[ap]m))?/i);
    if (!match) return { dueDate: null, dueTime: null };

    const now = new Date();
    const dateStr = `${match[1]} ${now.getFullYear()}`;
    let date = new Date(dateStr);
    if (now - date > 180 * 24 * 3600 * 1000) date.setFullYear(now.getFullYear() + 1);
    if (isNaN(date)) return { dueDate: null, dueTime: null };

    let dueTime = null;
    if (match[2]) {
      const lower = match[2].toLowerCase().replace(/\s+/g, '');
      const isPm = lower.includes('pm');
      const [rawH, rawM] = lower.replace(/[ap]m/, '').split(':').map(Number);
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

  function getCourse() {
    const nav = document.querySelector('#section-tabs .active, .course-title, #breadcrumbs a:last-child');
    if (nav) return nav.textContent.trim();
    return document.title.split('|').pop()?.trim() || 'Canvas Course';
  }

  function scrape() {
    const assignments = [];
    const course = getCourse();

    document.querySelectorAll('.PlannerItem, .to-do-list .context_module_sub_header').forEach(item => {
      const titleEl = item.querySelector('.PlannerItem-styles__title, .ig-title');
      const dueEl = item.querySelector('time, .PlannerItem-styles__due');
      const title = titleEl?.textContent?.trim();
      if (!title) return;

      const isoAttr = dueEl?.getAttribute('datetime') || dueEl?.getAttribute('data-html-tooltip-title');
      const { dueDate, dueTime } = parseDue(dueEl?.textContent, isoAttr);
      const url = item.querySelector('a')?.href || location.href;
      const courseEl = item.querySelector('.PlannerItem-styles__course');
      const itemCourse = courseEl?.textContent?.trim() || course;

      assignments.push({
        id: makeId(itemCourse, title),
        source: SOURCE,
        course: itemCourse,
        title,
        dueDate,
        dueTime,
        type: 'assignment',
        url,
        completed: false,
        scannedAt: Date.now(),
      });
    });

    document.querySelectorAll('.assignment, .ig-row').forEach(row => {
      const titleEl = row.querySelector('.ig-title a, .assignment_title, h3 a');
      const dueEl = row.querySelector('.assignment-due-at, .due_date_display, time');
      const title = titleEl?.textContent?.trim();
      if (!title) return;

      const isoAttr = dueEl?.getAttribute('datetime');
      const { dueDate, dueTime } = parseDue(dueEl?.textContent, isoAttr);
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
      type: 'PLANR_ASSIGNMENTS_SCRAPED',
      source: SOURCE,
      assignments,
    });
  }

  run();

  document.addEventListener('turbolinks:load', () => setTimeout(run, 500));
  document.addEventListener('DOMContentLoaded', run);

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'PLANR_SCAN') run();
  });
})();