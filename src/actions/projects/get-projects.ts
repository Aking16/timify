"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export async function getProjects(): Promise<InferSelectModel<typeof projects>[]> {
  const data = await db.select().from(projects);

  return data;
}
