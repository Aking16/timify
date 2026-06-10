import { format } from "date-fns-jalali";

import { TimeEntryWithRelations } from "@/actions/time-entries/get-time-entries-by-range";

export interface LayoutEntry {
  entry: TimeEntryWithRelations;
  top: number;
  height: number;
  left: number;
  width: number;
}

export function getEntryDuration(entry: TimeEntryWithRelations): number {
  if (entry.isRunning) {
    if (!entry.startTime) return 0;
    return Math.floor((Date.now() - new Date(entry.startTime).getTime()) / 1000);
  }
  if (entry.duration) return entry.duration;
  if (entry.endTime && entry.startTime) {
    return Math.floor(
      (new Date(entry.endTime).getTime() - new Date(entry.startTime).getTime()) / 1000
    );
  }
  return 0;
}

export function getPositionInDay(entry: TimeEntryWithRelations, dayDate: Date) {
  const dayStart = new Date(dayDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setHours(23, 59, 59, 999);

  const entryStart = entry.startTime ? new Date(entry.startTime) : dayStart;
  const entryEnd = entry.endTime ? new Date(entry.endTime) : new Date();

  const effectiveStart = entryStart < dayStart ? dayStart : entryStart;
  const effectiveEnd = entryEnd > dayEnd ? dayEnd : entryEnd;

  const startMinutes = effectiveStart.getHours() * 60 + effectiveStart.getMinutes();
  const endMinutes = effectiveEnd.getHours() * 60 + effectiveEnd.getMinutes();
  const durationMinutes = Math.max(1, endMinutes - startMinutes);

  return {
    top: (startMinutes / 1440) * 100,
    height: (durationMinutes / 1440) * 100,
  };
}

export function groupEntriesByDay(
  entries: TimeEntryWithRelations[],
  days: Date[]
): Map<string, TimeEntryWithRelations[]> {
  const map = new Map<string, TimeEntryWithRelations[]>();

  for (const day of days) {
    const dayStr = format(day, "yyyy-MM-dd");
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    const dayEntries = entries.filter((e) => {
      if (!e.startTime) return false;
      const entryDate = new Date(e.startTime);
      return entryDate >= dayStart && entryDate <= dayEnd;
    });

    map.set(dayStr, dayEntries);
  }

  return map;
}

export function layoutDayEntries(entries: TimeEntryWithRelations[], dayDate: Date): LayoutEntry[] {
  if (entries.length === 0) return [];

  const items = entries
    .map((entry) => ({ entry, ...getPositionInDay(entry, dayDate), lane: 0 }))
    .sort((a, b) => a.top - b.top);

  let totalLanes = 0;
  for (const item of items) {
    let lane = 0;
    let placed = false;
    while (!placed) {
      const hasConflict = items.some(
        (other) =>
          other.lane === lane &&
          other.entry.id !== item.entry.id &&
          other.top < item.top + item.height &&
          other.top + other.height > item.top
      );
      if (!hasConflict) {
        item.lane = lane;
        totalLanes = Math.max(totalLanes, lane + 1);
        placed = true;
      }
      lane++;
    }
  }

  return items.map((item) => ({
    ...item,
    left: (item.lane / totalLanes) * 100,
    width: (1 / totalLanes) * 100,
  }));
}

export function formatEntryDuration(duration: number): string {
  if (duration >= 3600) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const secs = duration % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, "0")}`;
}
