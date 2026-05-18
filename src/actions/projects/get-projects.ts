"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { cacheTag } from "next/cache";

export async function getProjects(): Promise<InferSelectModel<typeof projects>[]> {
  "use cache";
  cacheTag("get-projects");

  const data = await db.select().from(projects);

  return data;
}
