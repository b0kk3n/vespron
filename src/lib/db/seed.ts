import { createChore, createRoom, getRooms } from "./client";

export async function seedDb(): Promise<void> {
  const existing = await getRooms();
  if (existing.length > 0) return;

  const kitchen = await createRoom("Kitchen", "🍳", 0);
  const bathroom = await createRoom("Bathroom", "🚿", 1);
  const livingRoom = await createRoom("Living Room", "🛋️", 2);
  const bedroom = await createRoom("Bedroom", "🛏️", 3);

  await createChore(kitchen.id, "Wipe counters", 5, 2, 0);
  await createChore(kitchen.id, "Wash dishes", 15, 1, 1);
  await createChore(kitchen.id, "Mop floor", 20, 7, 2);

  await createChore(bathroom.id, "Clean toilet", 10, 7, 0);
  await createChore(bathroom.id, "Wipe sink", 5, 3, 1);
  await createChore(bathroom.id, "Scrub shower", 15, 14, 2);

  await createChore(livingRoom.id, "Vacuum", 20, 7, 0);
  await createChore(livingRoom.id, "Dust shelves", 10, 14, 1);

  await createChore(bedroom.id, "Make bed", 5, 1, 0);
  await createChore(bedroom.id, "Change sheets", 15, 14, 1);
}
