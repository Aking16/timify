"use server";

import { db } from "@/db";
import { timeEntries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";

const schema = z.object({
  id: z.string({
    error: "آیدی الزامی است",
  }),
  title: z
    .string({
      error: "عنوان الزامی است",
    })
    .min(4, "عنوان باید حداقل ۴ کاراکتر باشد")
    .max(32, "عنوان باید حداکثر ۳۲ کاراکتر باشد"),
  description: z
    .string({
      error: "توضیحات الزامی است",
    })
    .min(4, "توضیحات باید حداقل ۴ کاراکتر باشد"),
  startTime: z.string({
    error: "زمان شروع الزامی است",
  }),
  endTime: z.string().optional(),
});

export type EditTimeEntryState = {
  message?: string;
  success?: boolean;
} | null;

export async function editTimeEntry(
  _prevState: EditTimeEntryState,
  formData: FormData
): Promise<EditTimeEntryState> {
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
      message: validatedFields.error?.issues[0].message,
      success: false,
    };
  }

  const id = validatedFields.data.id;
  const startTime = new Date(validatedFields.data.startTime + "Z");
  const endTime = validatedFields.data.endTime
    ? new Date(validatedFields.data.endTime + "Z")
    : null;

  const durationInSeconds = Math.floor(((endTime?.getTime() ?? 0) - startTime.getTime()) / 1000);

  try {
    await db
      .update(timeEntries)
      .set({
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        duration: durationInSeconds,
        startTime,
        endTime,
      })
      .where(eq(timeEntries.id, id));

    revalidatePath("/project/");

    return {
      success: true,
      message: "تسک ویرایش شد!",
    };
  } catch (error) {
    console.error("Failed to edit time entry:", error);
    return {
      message: "خطایی در ویرایش تسک رخ داد!",
      success: false,
    };
  }
}
