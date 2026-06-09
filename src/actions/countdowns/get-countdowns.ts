"use server";

import { db } from "@/db";
import { countdowns } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/cache";

import { getSession } from "../auth/get-session";

async function getCountdownsDB(userId: string) {
  "use cache";
  cacheTag("get-countdowns");

  return db
    .select()
    .from(countdowns)
    .where(eq(countdowns.userId, userId))
    .orderBy(countdowns.createdAt);
}

export async function getCountdowns() {
  const session = await getSession();

  if (!session) return [];

  return getCountdownsDB(session.user.id);
}
