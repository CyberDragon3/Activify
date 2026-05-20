# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Activify is a student productivity tool with two sub-projects:
- `extension/` — Chrome MV3 side-panel extension that scrapes school platforms and manages a daily planner
- `mobile/` — React Native (Expo) companion app that reads synced data from Supabase

Both sub-projects share the same Supabase project for authentication and cloud storage.

## Commands

### Extension

```bash
# Install dependencies (run from extension/)
npm install

# Build the shared storage module (REQUIRED before loading/testing in Chrome)
npm run build
# This bundles extension/shared/storage.js → extension/shared/storage.bundle.js via esbuild

# Load extension in Chrome for development:
# 1. Open chrome://extensions
# 2. Enable Developer mode
# 3. Click "Load unpacked" and select the extension/ folder
# (Reload after any JS change; re-run npm run build after changes to shared/storage.js)
```

### Mobile

```bash
# Install dependencies (run from mobile/)
npm install

# Start Expo dev server
npm start           # or: expo start

# Run on specific platform
npm run android
npm run ios
npm run web
```

## Architecture

### Extension Data Flow

Content scripts (`content/google_classroom.js`, `content/canvas.js`, `content/schoology.js`) scrape assignment DOM on school sites and send `ACTIVIFY_ASSIGNMENTS_SCRAPED` messages to the service worker. The service worker calls `mergeAssignments()` from the shared storage module, which writes to `chrome.storage.local` and then fire-and-forgets a sync to Supabase. The side panel listens for `ACTIVIFY_REFRESH` messages and re-renders.

Scans are triggered two ways: automatically via a `chrome.alarms` alarm every 30 minutes (service worker injects/re-invokes content scripts on open tabs), or manually via the scan button in the side panel.

### Shared Storage Module (`extension/shared/storage.js`)

This is the single source of truth for all data access. It **must be compiled** (`npm run build`) to `storage.bundle.js` before the extension can load, since it uses `./supabase-lib.js` (an npm dependency). All other extension files import from `../shared/storage.bundle.js`.

Storage is dual-layer:
- **`chrome.storage.local`** — primary read/write cache; fast and available offline
- **Supabase** — cloud sync; writes are fire-and-forget and fail silently if unauthenticated

The Supabase client uses a custom `ChromeStorageAdapter` so session tokens are persisted in `chrome.storage.local` rather than `localStorage` (which is unavailable in service workers).

### Side Panel Auth Gate

The manifest sets `sidepanel/auth.html` as the default side panel path. On load, `auth.js` checks for an existing session and redirects to `index.html` if found. `panel.js` also checks for a user on init and redirects back to `auth.html` if unauthenticated.

### AI Assistant

The AI chat (in `sidepanel/ai.js`) uses the **Groq API** with model `llama-3.3-70b-versatile` (note: the README incorrectly states Claude). The Groq API key is stored in `chrome.storage.local` under the key `groqApiKey` and must be entered by the user in the extension's Settings panel.

When the AI suggests a schedule, it emits a ` ```tasks ` JSON block. `applyTasksFromResponse()` atomically clears all tasks whose IDs start with `ai_` and replaces them with the new suggestions. Manual/imported tasks are never affected because their IDs use a hash-based format.

### Mobile App (`mobile/App.js`)

The entire mobile app lives in a single file. It is **read-only** — tasks and assignments are created via the extension and synced to Supabase; the mobile app only reads them. Auth uses email/password (not Google OAuth). Push notifications are scheduled locally via `expo-notifications` based on task start times.

### Supabase Schema (inferred)

Two primary tables, both with a `user_id` column for row-level security:
- `tasks` — columns: `id`, `user_id`, `title`, `date`, `start_time`, `duration_mins`, `completed`, `category`, `color`, `assignment_id`
- `assignments` — columns: `id`, `user_id`, `source`, `course`, `title`, `due_date`, `due_time`, `type`, `url`, `completed`, `scanned_at`

### Key Conventions

- Assignment IDs are deterministic hashes of `source:course:title` (generated independently in each content script and in `shared/storage.js`'s `makeId`).
- AI-generated task IDs are prefixed `ai_` so they can be bulk-cleared without affecting user-created tasks.
- Dates are stored as `YYYY-MM-DD` strings throughout; times as `HH:MM` (24-hour).
- The extension uses ES modules (`"type": "module"` in the service worker); content scripts use IIFEs to avoid module scoping issues and expose a debug object (`window.__ACTIVIFY_<SOURCE>__`) for console-based testing.
