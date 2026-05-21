import * as SQLite from "expo-sqlite";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import {
  Checklist,
  ChecklistChore,
  Chore,
  Completion,
  DDL,
  Room,
} from "./schema";

let db: SQLite.SQLiteDatabase | null = null;

function getDb(): SQLite.SQLiteDatabase {
  if (!db) throw new Error("DB not initialised — call initDb() first");
  return db;
}

function now(): string {
  return new Date().toISOString();
}

export async function initDb(): Promise<void> {
  db = await SQLite.openDatabaseAsync("vespron.db");
  await db.execAsync(DDL);
}

// ── Rooms ──────────────────────────────────────────────────────────────────

export async function getRooms(): Promise<Room[]> {
  return getDb().getAllAsync<Room>(
    "SELECT * FROM rooms WHERE deleted_at IS NULL ORDER BY sort_order ASC",
  );
}

export async function createRoom(
  name: string,
  icon: string | null = null,
  sort_order = 0,
): Promise<Room> {
  const room: Room = {
    id: uuidv4(),
    name,
    icon,
    sort_order,
    created_at: now(),
    updated_at: now(),
    deleted_at: null,
  };
  await getDb().runAsync(
    `INSERT INTO rooms (id, name, icon, sort_order, created_at, updated_at, deleted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      room.id,
      room.name,
      room.icon,
      room.sort_order,
      room.created_at,
      room.updated_at,
      room.deleted_at,
    ],
  );
  return room;
}

export async function updateRoom(
  id: string,
  patch: Partial<Pick<Room, "name" | "icon" | "sort_order">>,
): Promise<void> {
  const sets = Object.keys(patch)
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = [...Object.values(patch), now(), id];
  await getDb().runAsync(
    `UPDATE rooms SET ${sets}, updated_at = ? WHERE id = ? AND deleted_at IS NULL`,
    values,
  );
}

export async function deleteRoom(id: string): Promise<void> {
  await getDb().runAsync(
    "UPDATE rooms SET deleted_at = ?, updated_at = ? WHERE id = ?",
    [now(), now(), id],
  );
}

// ── Chores ─────────────────────────────────────────────────────────────────

export async function getChoresByRoom(room_id: string): Promise<Chore[]> {
  return getDb().getAllAsync<Chore>(
    "SELECT * FROM chores WHERE room_id = ? AND deleted_at IS NULL ORDER BY sort_order ASC",
    [room_id],
  );
}

export async function createChore(
  room_id: string,
  name: string,
  duration_minutes: number | null = null,
  freshness_days: number | null = null,
  sort_order = 0,
): Promise<Chore> {
  const chore: Chore = {
    id: uuidv4(),
    room_id,
    name,
    duration_minutes,
    freshness_days,
    sort_order,
    created_at: now(),
    updated_at: now(),
    deleted_at: null,
  };
  await getDb().runAsync(
    `INSERT INTO chores (id, room_id, name, duration_minutes, freshness_days, sort_order, created_at, updated_at, deleted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      chore.id,
      chore.room_id,
      chore.name,
      chore.duration_minutes,
      chore.freshness_days,
      chore.sort_order,
      chore.created_at,
      chore.updated_at,
      chore.deleted_at,
    ],
  );
  return chore;
}

export async function updateChore(
  id: string,
  patch: Partial<
    Pick<Chore, "name" | "duration_minutes" | "freshness_days" | "sort_order">
  >,
): Promise<void> {
  const sets = Object.keys(patch)
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = [...Object.values(patch), now(), id];
  await getDb().runAsync(
    `UPDATE chores SET ${sets}, updated_at = ? WHERE id = ? AND deleted_at IS NULL`,
    values,
  );
}

export async function deleteChore(id: string): Promise<void> {
  await getDb().runAsync(
    "UPDATE chores SET deleted_at = ?, updated_at = ? WHERE id = ?",
    [now(), now(), id],
  );
}

// ── Completions ────────────────────────────────────────────────────────────

export async function createCompletion(chore_id: string): Promise<Completion> {
  const completion: Completion = {
    id: uuidv4(),
    chore_id,
    completed_at: now(),
    created_at: now(),
    updated_at: now(),
    deleted_at: null,
  };
  await getDb().runAsync(
    `INSERT INTO completions (id, chore_id, completed_at, created_at, updated_at, deleted_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      completion.id,
      completion.chore_id,
      completion.completed_at,
      completion.created_at,
      completion.updated_at,
      completion.deleted_at,
    ],
  );
  return completion;
}

export async function getRecentCompletions(
  chore_id: string,
  limit = 5,
): Promise<Completion[]> {
  return getDb().getAllAsync<Completion>(
    "SELECT * FROM completions WHERE chore_id = ? AND deleted_at IS NULL ORDER BY completed_at DESC LIMIT ?",
    [chore_id, limit],
  );
}

// ── Checklists ─────────────────────────────────────────────────────────────

export async function getChecklists(): Promise<Checklist[]> {
  return getDb().getAllAsync<Checklist>(
    "SELECT * FROM checklists WHERE deleted_at IS NULL ORDER BY created_at ASC",
  );
}

export async function createChecklist(name: string): Promise<Checklist> {
  const checklist: Checklist = {
    id: uuidv4(),
    name,
    created_at: now(),
    updated_at: now(),
    deleted_at: null,
  };
  await getDb().runAsync(
    `INSERT INTO checklists (id, name, created_at, updated_at, deleted_at) VALUES (?, ?, ?, ?, ?)`,
    [
      checklist.id,
      checklist.name,
      checklist.created_at,
      checklist.updated_at,
      checklist.deleted_at,
    ],
  );
  return checklist;
}

// ── Checklist chores ───────────────────────────────────────────────────────

export async function addChoreToChecklist(
  checklist_id: string,
  chore_id: string,
  sort_order = 0,
): Promise<ChecklistChore> {
  const entry: ChecklistChore = {
    id: uuidv4(),
    checklist_id,
    chore_id,
    sort_order,
    created_at: now(),
    updated_at: now(),
    deleted_at: null,
  };
  await getDb().runAsync(
    `INSERT INTO checklist_chores (id, checklist_id, chore_id, sort_order, created_at, updated_at, deleted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      entry.id,
      entry.checklist_id,
      entry.chore_id,
      entry.sort_order,
      entry.created_at,
      entry.updated_at,
      entry.deleted_at,
    ],
  );
  return entry;
}
export interface ChoreWithFreshness extends Chore {
  room_name: string;
  room_icon: string | null;
  last_completed_at: string | null;
}

export async function getChoresWithFreshness(): Promise<ChoreWithFreshness[]> {
  return getDb().getAllAsync<ChoreWithFreshness>(`
    SELECT
      c.*,
      r.name  AS room_name,
      r.icon  AS room_icon,
      (
        SELECT completed_at FROM completions
        WHERE chore_id = c.id AND deleted_at IS NULL
        ORDER BY completed_at DESC LIMIT 1
      ) AS last_completed_at
    FROM chores c
    JOIN rooms r ON r.id = c.room_id
    WHERE c.deleted_at IS NULL AND r.deleted_at IS NULL
    ORDER BY r.sort_order ASC, c.sort_order ASC
  `);
}
