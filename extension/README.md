# Activify - Student Planner Chrome Extension

Activify is a Chrome side-panel planner for students. It lets users manually scan supported school platforms, review upcoming assignments, create tasks, and use the Groq-powered assistant to build study schedules.

## Project Structure

```text
extension/
|-- manifest.json
|-- icons/
|   |-- icon16.png
|   |-- icon48.png
|   `-- icon128.png
|-- shared/
|   |-- storage.js
|   |-- storage.bundle.js
|   `-- supabase-lib.js
|-- background/
|   `-- service_worker.js
|-- content/
|   `-- ai_scraper.js
`-- sidepanel/
    |-- auth.html
    |-- auth.js
    |-- index.html
    |-- panel.css
    |-- panel.js
    |-- ai.js
    `-- lucide.min.js
```

## Development

Install dependencies from this directory:

```bash
npm install
```

Build the shared storage bundle before loading or testing the extension:

```bash
npm run build
```

This bundles `shared/storage.js` into `shared/storage.bundle.js`.

## Load in Chrome

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select the `extension/` folder.

Reload the extension after JavaScript changes. Re-run `npm run build` after changing `shared/storage.js`.

## How Scanning Works

Scanning is user-initiated. The side panel's scan button sends a message to the active school-platform tab, and the content script collects visible assignment text from that page.

Supported platforms:

- Google Classroom
- Canvas
- Schoology

The extracted page text is sent to the Groq API only when the user starts a scan and has saved a Groq API key in Settings.

## How the AI Assistant Works

The AI assistant uses the Groq API with `llama-3.3-70b-versatile`. Each request includes the user's current assignments and tasks as scheduling context.

Quick actions:

- Plan my day
- What should I do now?
- Estimate my homework

When the assistant suggests a schedule, it returns a `tasks` JSON block. Activify replaces previous AI-generated tasks with the new suggestions while preserving manual tasks.
