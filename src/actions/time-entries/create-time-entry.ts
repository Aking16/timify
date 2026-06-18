"use server";

import { db } from "@/db";
import { timeEntries } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";

const schema = z.object({
  projectID: z.string(),
});

export type CreateTimeEntryState = {
  message?: string;
  success?: boolean;
} | null;

export async function createTimeEntry(
  _prevState: CreateTimeEntryState,
  formData: FormData
): Promise<CreateTimeEntryState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      message: "آیدی کاربر وارد نشد!",
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

  const projectID = validatedFields.data.projectID;

  try {
    // Get all running time entries for the current user to calculate their durations
    const runningEntries = await db
      .select()
      .from(timeEntries)
      .where(and(eq(timeEntries.userId, session.user.id), eq(timeEntries.isRunning, true)));

    // Stop all running time entries and calculate their durations
    const now = new Date();
    for (const entry of runningEntries) {
      if (!entry.startTime) {
        console.error(`Time entry ${entry.id} has no startTime`);
        continue; // Skip this entry or handle as needed
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
    }

    await db.insert(timeEntries).values({
      userId: session.user.id,
      projectId: projectID,
      title: "تسک جدید",
    });

    revalidatePath("/project/");
    revalidateTag("get-time-entries", "max");

    return {
      success: true,
      message: "تسک شروع شد!",
    };
  } catch (error) {
    console.error("Failed to create project:", error);
    return {
      message: "خطایی در شروع تسک رخ داد!",
      success: false,
    };
  }
}
