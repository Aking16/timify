"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { convertStringToBoolean } from "@/lib/converter";

const schema = z.object({
  id: z.string({
    error: "آیدی الزامی است",
  }),
  name: z
    .string({
      error: "نام الزامی است",
    })
    .min(4, "نام باید حداقل ۴ کاراکتر باشد")
    .max(32, "نام باید حداکثر ۳۲ کاراکتر باشد"),
  description: z.string().optional(),
  hourlyRate: z.string().optional(),
  color: z.string().optional(),
  isActive: z.string(),
});

export type EditProjectState = {
  message?: string;
  success?: boolean;
} | null;

export async function editProject(
  _prevState: EditProjectState,
  formData: FormData
): Promise<EditProjectState> {
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

  const { id, name, description, hourlyRate, isActive, color } = validatedFields.data;

  try {
    await db
      .update(projects)
      .set({
        isActive: convertStringToBoolean(isActive),
        hourlyRate: Number(hourlyRate),
        name,
        description,
        color,
      })
      .where(eq(projects.id, id));

    revalidatePath("/projects/");
    revalidateTag("get-projects", "max");

    return {
      success: true,
      message: "پروژه ویرایش شد!",
    };
  } catch (error) {
    console.error("Failed to edit time entry:", error);
    return {
      message: "خطایی در ویرایش پروژه رخ داد!",
      success: false,
    };
  }
}
