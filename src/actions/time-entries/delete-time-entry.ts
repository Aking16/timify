"use server";

import { db } from "@/db";
import { timeEntries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export type DeleteTimeEntryState = {
  message?: string;
  success?: boolean;
} | null;

export async function deleteTimeEntry(id: string): Promise<DeleteTimeEntryState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      message: "کاربر وارد نشده است!",
      success: false,
    };
  }

  if (!id) {
    return {
      message: "آیدی الزامی است!",
      success: false,
    };
  }

  try {
    await db.delete(timeEntries).where(eq(timeEntries.id, id));

    revalidatePath("/project/");

    return {
      success: true,
      message: "تسک حذف شد!",
    };
  } catch (error) {
    console.error("Failed to edit time entry:", error);
    return {
      message: "خطایی در حذف تسک رخ داد!",
      success: false,
    };
  }
}
