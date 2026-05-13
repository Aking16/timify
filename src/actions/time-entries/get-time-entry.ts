"use server";

import { db } from "@/db";
import { timeEntries } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export async function getTimeEntries(): Promise<InferSelectModel<typeof timeEntries>[]> {
  const data = await db.select().from(timeEntries);

  return data;
}
