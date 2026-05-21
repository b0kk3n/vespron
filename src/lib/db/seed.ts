import {
  addChoreToChecklist,
  createChecklist,
  createChore,
  createRoom,
  getRooms,
} from "./client";

export async function seedDb(): Promise<void> {
  const existing = await getRooms();
  if (existing.length > 0) return;

  const kitchen = await createRoom("Kitchen", "🍳", 0);
  const bathroom = await createRoom("Bathroom", "🚿", 1);
  const livingRoom = await createRoom("Living Room", "🛋️", 2);
  const bedroom = await createRoom("Bedroom", "🛏️", 3);

  const wipeCounters = await createChore(kitchen.id, "Wipe counters", 5, 2, 0);
  const washDishes = await createChore(kitchen.id, "Wash dishes", 15, 1, 1);
  const mopFloor = await createChore(kitchen.id, "Mop floor", 20, 7, 2);
  const cleanToilet = await createChore(bathroom.id, "Clean toilet", 10, 7, 0);
  const wipeSink = await createChore(bathroom.id, "Wipe sink", 5, 3, 1);
  const scrubShower = await createChore(bathroom.id, "Scrub shower", 15, 14, 2);
  const vacuum = await createChore(livingRoom.id, "Vacuum", 20, 7, 0);
  const dustShelves = await createChore(
    livingRoom.id,
    "Dust shelves",
    10,
    14,
    1,
  );
  const makeBed = await createChore(bedroom.id, "Make bed", 5, 1, 0);
  const changeSheets = await createChore(
    bedroom.id,
    "Change sheets",
    15,
    14,
    1,
  );

  const weekly = await createChecklist("Weekly Clean");
  await addChoreToChecklist(weekly.id, mopFloor.id, 0);
  await addChoreToChecklist(weekly.id, cleanToilet.id, 1);
  await addChoreToChecklist(weekly.id, scrubShower.id, 2);
  await addChoreToChecklist(weekly.id, vacuum.id, 3);
  await addChoreToChecklist(weekly.id, changeSheets.id, 4);

  const quickTidy = await createChecklist("Quick Tidy");
  await addChoreToChecklist(quickTidy.id, wipeCounters.id, 0);
  await addChoreToChecklist(quickTidy.id, wipeSink.id, 1);
  await addChoreToChecklist(quickTidy.id, makeBed.id, 2);
  await addChoreToChecklist(quickTidy.id, dustShelves.id, 3);
}
