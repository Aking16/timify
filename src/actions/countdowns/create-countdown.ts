"use server";

import { db } from "@/db";
import { countdowns } from "@/db/schema";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(1).max(64).default(""),
  duration: z.coerce.number().min(1).max(86400),
});

export type CreateCountdownState = {
  message?: string;
  success?: boolean;
} | null;

export async function createCountdown(
  _prevState: CreateCountdownState,
  formData: FormData
): Promise<CreateCountdownState> {
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

  const { title, duration } = validatedFields.data;

  try {
    await db.insert(countdowns).values({
      userId: session.user.id,
      title,
      duration,
    });

    revalidatePath("/app/countdown");
    revalidateTag("get-countdowns", "max");

    return {
      success: true,
      message: "شمارش معکوس ساخته شد!",
    };
  } catch (error) {
    console.error("Failed to create countdown:", error);
    return {
      message: "خطا در ایجاد شمارش معکوس",
      success: false,
    };
  }
}
