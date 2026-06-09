"use server";

import { db } from "@/db";
import { countdowns } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";

const schema = z.object({
  id: z.string(),
  title: z.string().min(1).max(64).optional(),
  duration: z.coerce.number().min(1).max(86400).optional(),
});

export type UpdateCountdownState = {
  message?: string;
  success?: boolean;
} | null;

export async function updateCountdown(
  _prevState: UpdateCountdownState,
  formData: FormData
): Promise<UpdateCountdownState> {
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

  const { id, title, duration } = validatedFields.data;

  try {
    const entries = await db
      .select()
      .from(countdowns)
      .where(and(eq(countdowns.id, id), eq(countdowns.userId, session.user.id)));

    if (entries.length === 0) {
      return {
        message: "شمارش معکوس یافت نشد!",
        success: false,
      };
    }

    const updateData: Record<string, string | number> = {};

    if (title !== undefined) {
      updateData.title = title;
    }

    if (duration !== undefined) {
      updateData.duration = duration;
      updateData.remaining = duration;
    }

    await db.update(countdowns).set(updateData).where(eq(countdowns.id, id));

    revalidatePath("/app/countdown");
    revalidateTag("get-countdowns", "max");

    return {
      success: true,
      message: "شمارش معکوس ویرایش شد!",
    };
  } catch (error) {
    console.error("Failed to update countdown:", error);
    return {
      message: "خطا در ویرایش شمارش معکوس",
      success: false,
    };
  }
}
