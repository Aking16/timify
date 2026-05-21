"use server";

import { db } from "@/db";
import { timeEntryTags } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export type RemoveTagFromTimeEntryState = {
  message?: string;
  success?: boolean;
} | null;

export async function removeTagFromTimeEntry(
  timeEntryId: string,
  tagId: string
): Promise<RemoveTagFromTimeEntryState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      message: "آیدی کاربر وارد نشد!",
      success: false,
    };
  }

  if (!timeEntryId) {
    return {
      message: "آیدی تسک وارد نشد!",
      success: false,
    };
  }

  if (!tagId) {
    return {
      message: "آیدی برچسب وارد نشد!",
      success: false,
    };
  }

  console.log("removed:", tagId);

  try {
    await db
      .delete(timeEntryTags)
      .where(and(eq(timeEntryTags.tagId, tagId), eq(timeEntryTags.timeEntryId, timeEntryId)));

    revalidatePath("/project/");

    return {
      success: true,
      message: "برچسب اضافه شد!",
    };
  } catch (error) {
    console.error("Failed to toggle tag on time entry:", error);
    return {
      message: "خطایی در تغییر وضعیت برچسب رخ داد!",
      success: false,
    };
  }
}
