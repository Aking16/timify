"use server";

import { db } from "@/db";
import { tags } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { cacheTag } from "next/cache";

export async function getTags(): Promise<InferSelectModel<typeof tags>[]> {
  "use cache";
  cacheTag("get-tags");

  const data = await db.select().from(tags);

  return data;
}
