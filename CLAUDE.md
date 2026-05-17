# Vespron

ADHD-friendly home chore management app. Mobile (iOS + Android) via Expo, TypeScript, `src/` layout.

## Brand philosophy

- Offload, don't add — never increase mental load
- Flexible, not strict — soft deadlines, no nagging
- Adaptive — learns user patterns, asks before adjusting
- "All caught up" is a real, achievable state — never manufacture work

## Terminology (use exactly these)

- chore, room, checklist, daily briefing
- Never: task, scenario, morning briefing

## Architecture rules

- Single data-access layer at `src/lib/db/client.ts` — no SQL or DB calls outside this file
- All records use UUIDs (not auto-increment)
- Every owned table has `created_at`, `updated_at`, `deleted_at` (ISO 8601 strings)
- Soft deletes only — never `DELETE FROM`
- These rules exist to make a future cloud sync a refactor, not a rewrite

## Stack

- Expo Router (file-based, `src/app/`)
- expo-sqlite for local storage
- uuid + react-native-get-random-values for IDs
- No state management library yet — local component state is fine until it isn't

## Data model

Rooms, chores, completions, checklists, checklist_chores. Full schema in `src/lib/db/schema.ts`.

## Design tokens

In `src/theme/` — colors, spacing, typography. Lifted from approved mockups. Don't invent new colors; extend the tokens file if needed.

## Phases

- Phase 1: scaffold ✓
- Phase 2: data layer ← current
- Phase 3: real Home screen rendering from DB
- Phase 4+: remaining screens (Rooms, Checklists, room detail, chore form)
