"use server";

import { db } from "@/db";
import { timeEntries } from "@/db/schema";
import { eq, InferSelectModel } from "drizzle-orm";

export async function getTimeEntries(id: string): Promise<InferSelectModel<typeof timeEntries>[]> {
  const data = (await db.select().from(timeEntries).where(eq(timeEntries.projectId, id))).sort(
    (a, b) => (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0)
  );

  return data;
}
