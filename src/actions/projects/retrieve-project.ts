"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, InferSelectModel } from "drizzle-orm";
import { cacheTag } from "next/cache";

export async function retrieveProject(id: string): Promise<InferSelectModel<typeof projects>> {
  "use cache";
  cacheTag("retrieve-project");

  const [data] = await db.select().from(projects).where(eq(projects.id, id));

  return data;
}
