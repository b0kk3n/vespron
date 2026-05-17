# Vespron

A calm, ADHD-friendly app for managing the mental load of keeping a home running.

## What it is

Vespron tracks the rhythm of cleaning chores around your home so you don't have to. Instead of nagging you with a never-ending to-do list, it tells you what genuinely needs attention right now — and respects when nothing does.

Built for people who've tried Todoist, Tody, and every other productivity app, and quietly given up after three weeks.

## Philosophy

- **Offload, don't add** — reduces mental load, never creates more
- **Flexible, not strict** — life happens, soft deadlines, no nagging
- **Adaptive** — learns your patterns, asks before adjusting
- **"All caught up" is a real state** — the app never manufactures work

## Core features (MVP)

- Chores organized by room, each with a custom interval
- Freshness scores — room health at a glance, decays only in the final stretch
- **"I have X minutes"** — surfaces only the chores that fit your time and need attention
- Daily briefing — opinionated, low-volume entry point
- Checklists — curated lists for scenarios like "Guests coming" or "Sunday reset"

## Status

Early development. Working toward MVP, not yet on App Store or Play Store.

## Stack

- [Expo](https://expo.dev/) (React Native + TypeScript)
- [Expo Router](https://docs.expo.dev/router/introduction/) — file-based navigation
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) — local-first storage
- UUIDs everywhere, soft deletes, ISO 8601 timestamps — built for future cloud sync without a rewrite

## Project structure

```text
src/
├── app/                    Expo Router screens
│   ├── _layout.tsx        Root layout (providers, DB init)
│   └── (tabs)/            Bottom tab group
│       ├── _layout.tsx    Tab bar
│       ├── index.tsx      Home
│       ├── rooms.tsx
│       ├── checklists.tsx
│       └── settings.tsx
├── components/             Reusable UI
├── lib/
│   ├── db/                Single data-access layer
│   └── freshness/         Freshness calculation utilities
└── theme/                  Design tokens (colors, spacing, typography)
```

## Architecture rules

- All DB access goes through `src/lib/db/client.ts`. No SQL anywhere else.
- All records use UUIDs, not auto-increment IDs.
- All owned tables have `created_at`, `updated_at`, and `deleted_at` columns (ISO 8601 strings).
- Soft deletes only — never `DELETE FROM`.

These rules exist so a future cloud sync is a refactor, not a rewrite.

## Development

Requirements: Node.js 20+, Expo Go on your phone (or iOS Simulator / Android Emulator).

```bash
npm install
npx expo start --tunnel
```

Scan the QR code with the Camera app (iOS) or from within Expo Go (Android).

> **Note:** SQLite doesn't run in web preview. Use a phone or simulator for anything beyond the initial scaffold.

## Inspiration

Vespron is the public version of Aether — a Raspberry Pi-based home assistant I built for myself. Aether works great, but it lives on my Pi, so it only helps me. Vespron is the same philosophy in a form anyone can install on their phone.

## License

TBD.
