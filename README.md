# Activify

A Chrome side-panel extension that scrapes school platforms (Google Classroom, Canvas, Schoology), organizes assignments, and builds a daily study plan using Groq AI. Companion Expo React Native mobile app reads synced data.

## Structure

```
activify/
├── extension/                 # Chrome MV3 side-panel extension
│   ├── manifest.json
│   ├── background/            # Service worker
│   ├── sidepanel/             # Panel UI (HTML/CSS/JS)
│   ├── content/               # Content script (IIFE)
│   ├── shared/                # Shared modules (storage, analytics, Supabase)
│   └── package.json
└── mobile/                    # Expo React Native app (read-only viewer)
    ├── App.js
    └── app.json
```

## Quick Start — Extension

```bash
cd extension
npm install
npm run build    # Bundles shared modules via esbuild
```

1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select `extension/`
4. Open side panel: click the Activify toolbar icon or use the context menu
5. Log in via Supabase auth, then add your Groq API key in Settings

### After editing `shared/storage.js`
```bash
npm run build
# Then reload the extension at chrome://extensions
```

## Quick Start — Mobile

```bash
cd mobile
npm install
npx expo start
```

## Data Flow

Content scripts scrape assignment DOM → send message to service worker → service worker calls Groq AI to parse → stores locally + syncs to Supabase → side panel refreshes.

## Tech Stack

- **Extension:** Manifest V3, plain JavaScript (no framework), esbuild
- **AI:** Groq API (llama-3.3-70b-versatile)
- **Auth/Cloud:** Supabase (email/password)
- **Analytics:** PostHog (anonymous)
- **Mobile:** Expo / React Native
