"use server";

import { db } from "@/db";
import { timeEntries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";

const schema = z.object({
  id: z.string(),
});

export type StopTimeEntryState = {
  message?: string;
  success?: boolean;
} | null;

export async function stopTimeEntry(
  _prevState: StopTimeEntryState,
  formData: FormData
): Promise<StopTimeEntryState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      message: "کاربر وارد نشده است!",
      success: false,
    };
  }

  const data = Object.fromEntries(formData.entries());

  const validatedFields = schema.safeParse(data);

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.message,
      success: false,
    };
  }

  const id = validatedFields.data.id;

  try {
    // Get the entry first - need to handle array response
    const entries = await db.select().from(timeEntries).where(eq(timeEntries.id, id));

    if (entries.length === 0) {
      return {
        message: "تایم انتری یافت نشد!",
        success: false,
      };
    }

    const entry = entries[0];

    if (!entry.isRunning) {
      return {
        message: "این تسک قبلاً متوقف شده است!",
        success: false,
      };
    }

    const now = new Date();

    if (!entry.startTime) {
      return {
        message: "این تسک زمان شروع ندارد!",
        success: false,
      };
    }

    const startTime = new Date(entry.startTime);
    const durationInSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);

    await db
      .update(timeEntries)
      .set({
        isRunning: false,
        endTime: now,
        duration: durationInSeconds,
        updatedAt: now,
      })
      .where(eq(timeEntries.id, entry.id));

    revalidatePath("/project/");

    return {
      success: true,
      message: "تسک متوقف شد!",
    };
  } catch (error) {
    console.error("Failed to stop time entry:", error);
    return {
      message: "خطایی در توقف تسک رخ داد!",
      success: false,
    };
  }
}
