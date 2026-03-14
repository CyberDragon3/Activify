# Activify – Student Planner Chrome Extension

Auto-scans Google Classroom, Canvas, and Schoology to build a daily planner
as a Chrome side panel, with an AI assistant powered by Claude.

---

## Project Structure
```
activify-extension/
├── manifest.json
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── shared/
│   └── storage.js
├── background/
│   └── service_worker.js
├── content/
│   ├── google_classroom.js
│   ├── canvas.js
│   └── schoology.js
└── sidepanel/
    ├── index.html
    ├── panel.css
    ├── panel.js
    └── ai.js
```

---

## How to Load in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `activify-extension/` folder

---

## How the AI Works

The AI chat bubble uses Claude via the Anthropic API. Every message
automatically includes your current assignments and tasks as context
so Claude can give personalized scheduling advice.

**Quick actions:**
- 📅 Plan my day
- 🎯 What should I do now?
- ⏱ Estimate my homework

When Claude suggests tasks, they are automatically added to your planner.
```

---

That's all 11 files! Here's your final checklist before loading:
```
activify/
├── manifest.json          ✓
├── icons/
│   ├── icon16.png         ✓
│   ├── icon48.png         ✓
│   └── icon128.png        ✓
├── shared/
│   └── storage.js         ✓
├── background/
│   └── service_worker.js  ✓
├── content/
│   ├── google_classroom.js ✓
│   ├── canvas.js          ✓
│   └── schoology.js       ✓
└── sidepanel/
    ├── index.html         ✓
    ├── panel.css          ✓
    ├── panel.js           ✓
    └── ai.js              ✓