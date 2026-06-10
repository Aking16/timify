"use server";

import { db } from "@/db";
import { projects, tags, timeEntries, timeEntryTags } from "@/db/schema";
import { and, eq, gte, lte, InferSelectModel } from "drizzle-orm";
import { cacheTag } from "next/cache";

export type TimeEntryWithRelations = typeof timeEntries.$inferSelect & {
  tags: (typeof tags.$inferSelect)[];
  project: (typeof projects.$inferSelect) | null;
};

export async function getTimeEntriesByRange(startDate: Date, endDate: Date) {
  "use cache";
  cacheTag("get-time-entries-range");

  const data = await db
    .select({
      timeEntry: timeEntries,
      tag: tags,
      project: projects,
    })
    .from(timeEntries)
    .leftJoin(timeEntryTags, eq(timeEntries.id, timeEntryTags.timeEntryId))
    .leftJoin(tags, eq(timeEntryTags.tagId, tags.id))
    .leftJoin(projects, eq(timeEntries.projectId, projects.id))
    .where(
      and(
        gte(timeEntries.startTime, startDate),
        lte(timeEntries.startTime, endDate)
      )
    )
    .orderBy(timeEntries.startTime);

  const timeEntriesWithRelations = data.reduce(
    (acc, row) => {
      const existingEntry = acc.find((e) => e.id === row.timeEntry.id);
      if (existingEntry) {
        if (row.tag) existingEntry.tags.push(row.tag);
      } else {
        acc.push({
          ...row.timeEntry,
          tags: row.tag ? [row.tag] : [],
          project: row.project ?? null,
        });
      }
      return acc;
    },
    [] as Array<
      InferSelectModel<typeof timeEntries> & {
        tags: InferSelectModel<typeof tags>[];
        project: InferSelectModel<typeof projects> | null;
      }
    >
  );

  return timeEntriesWithRelations;
}
