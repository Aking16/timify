"use server";

import { db } from "@/db";
import { timeEntries } from "@/db/schema";
import { and, eq } from "drizzle-orm";
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

  try {
    // Stop all running time entries for the current user
    await db
      .update(timeEntries)
      .set({ isRunning: false, endTime: new Date() })
      .where(and(eq(timeEntries.userId, session.user.id), eq(timeEntries.isRunning, true)));

    await db.insert(timeEntries).values({
      userId: session.user.id,
      projectId: validatedFields.data.projectID,
      description: "تسک جدید",
    });

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
