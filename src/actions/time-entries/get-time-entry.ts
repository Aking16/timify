"use server";

import { db } from "@/db";
import { tags, timeEntries, timeEntryTags } from "@/db/schema";
import { eq, InferSelectModel } from "drizzle-orm";
import { cacheTag } from "next/cache";

export type TimeEntryWithTags = typeof timeEntries.$inferSelect & {
  tags: (typeof tags.$inferSelect)[];
};

export async function getTimeEntries(id: string) {
   "use cache";
  cacheTag("get-time-entries");

  const data = await db
    .select({
      timeEntry: timeEntries,
      tag: tags,
    })
    .from(timeEntries)
    .leftJoin(timeEntryTags, eq(timeEntries.id, timeEntryTags.timeEntryId))
    .leftJoin(tags, eq(timeEntryTags.tagId, tags.id))
    .where(eq(timeEntries.projectId, id))
    .orderBy(timeEntries.createdAt);

  // Transform to group tags
  const timeEntriesWithTags = data.reduce(
    (acc, row) => {
      const existingEntry = acc.find((e) => e.id === row.timeEntry.id);
      if (existingEntry) {
        if (row.tag) existingEntry.tags.push(row.tag);
      } else {
        acc.push({
          ...row.timeEntry,
          tags: row.tag ? [row.tag] : [],
        });
      }
      return acc;
    },
    [] as Array<InferSelectModel<typeof timeEntries> & { tags: InferSelectModel<typeof tags>[] }>
  );

  return timeEntriesWithTags;
}
