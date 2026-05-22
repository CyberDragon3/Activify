# AGENTS-codex.md — Activify (Codex)

Your role is **optimization, debugging, and cleanup only.**
Do not make structural or architectural changes. Do not modify `AGENTS-opencode.md`.

---

## Project Overview

Activify is a Chrome MV3 side-panel extension + Expo React Native mobile app sharing a Supabase backend.

- `extension/` — vanilla JS, no TypeScript, no framework
- `mobile/` — Expo React Native, single file (`App.js`), read-only view of Supabase data

---

## Repository Structure

```
activify/
├── extension/
│   ├── shared/
│   │   ├── storage.js              # Source — edit this
│   │   ├── storage.bundle.js       # Generated — never edit
│   │   └── supabase-lib.js         # Vendored — never edit
│   ├── sidepanel/
│   │   ├── panel.js
│   │   ├── panel.css
│   │   ├── index.html
│   │   ├── ai.js                   # Groq integration
│   │   ├── auth.js
│   │   ├── auth.html
│   │   └── weather-theme.js
│   ├── background/
│   │   └── service_worker.js       # ES module, stateless between events
│   ├── content/
│   │   └── ai_scraper.js           # IIFE — must stay IIFE
│   └── manifest.json
└── mobile/
    └── App.js                      # Entire mobile app, read-only by design
```

---

## Commands

```bash
# Extension
cd extension
npm install
npm run build   # esbuild storage.js → storage.bundle.js (run after any storage.js edit)

# Mobile
cd mobile
npm install
npm start
```

> No hot reload in extension — manually reload at chrome://extensions after any change.

---

## Key Conventions

### Data
- Dates: `YYYY-MM-DD` strings
- Times: `HH:MM` 24-hour strings
- Assignment IDs: deterministic hash of `source:course:title` via `makeId()`
- AI task IDs: prefixed `ai_` — bulk-clearable without affecting user tasks
- Manual task IDs: hash-based format

### Extension
- Message from content script → service worker: `ACTIVIFY_AI_DATA_COLLECTED`
- Message from service worker → side panel: `ACTIVIFY_REFRESH`
- Groq model: `llama-3.3-70b-versatile`
- Groq API key: stored in `chrome.storage.local` as `groqApiKey`
- Storage is dual-layer: `chrome.storage.local` (primary) + Supabase (fire-and-forget sync)
- Supabase session tokens stored in `chrome.storage.local` via `ChromeStorageAdapter` — NOT `localStorage`
- `applyTasksFromResponse()` — clears all `ai_` tasks and replaces with new AI suggestions
- Service worker uses ES modules; `ai_scraper.js` is an IIFE

### Supabase Schema
- `tasks`: `id`, `user_id`, `title`, `date`, `start_time`, `duration_mins`, `completed`, `category`, `color`, `assignment_id`
- `assignments`: `id`, `user_id`, `source`, `course`, `title`, `due_date`, `due_time`, `type`, `url`, `completed`, `scanned_at`

### Mobile
- Auth: email/password only (no Google OAuth)
- Push notifications via `expo-notifications` based on task `start_time`
- Read-only — all data created by extension, synced via Supabase

---

## Permissions (manifest.json)

- `sidePanel`, `storage`, `tabs`
- Host: `*.supabase.co`, `classroom.google.com`, `*.instructure.com`, `*.schoology.com`, `api.groq.com`

---

## Hard Rules

- Do not run any `git` command
- Do not edit `storage.bundle.js` or `supabase-lib.js`
- Do not add write operations to `mobile/App.js`
- Do not convert `ai_scraper.js` from IIFE to ES module
- Do not add new dependencies without being asked
- Do not modify `manifest.json` without being asked
- Do not modify `AGENTS-opencode.md`
- Run `npm run build` if `storage.js` was touched

## Pre-Completion Checklist
- [ ] `npm run build` run if `storage.js` was modified
- [ ] No new dependencies added
- [ ] No structural or architectural changes made
- [ ] No `git` commands run
- [ ] `storage.bundle.js` and `supabase-lib.js` untouched

---

*Pair with `AGENTS-opencode.md` for structural/architectural work via OpenCode.*