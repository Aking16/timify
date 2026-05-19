"use server";

import { db } from "@/db";
import { tags } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";

const schema = z.object({
  id: z.string({
    error: "آیدی الزامی است",
  }),
  name: z
    .string({
      error: "نام الزامی است",
    })
    .nonempty("نام برچسب الزامی است")
    .max(16, "نام برچسب باید حداکثر ۳۲ کاراکتر باشد"),
  color: z.string().optional(),
});

export type EditTagState = {
  message?: string;
  success?: boolean;
} | null;

export async function editTag(_prevState: EditTagState, formData: FormData): Promise<EditTagState> {
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

  const { id, name, color } = validatedFields.data;

  try {
    await db
      .update(tags)
      .set({
        name,
        color,
      })
      .where(eq(tags.id, id));

    revalidatePath("/tags/");
    revalidateTag("get-tags", "max");

    return {
      success: true,
      message: "برچسب ویرایش شد!",
    };
  } catch (error) {
    console.error("Failed to edit tag:", error);
    return {
      message: "خطایی در ویرایش برچسب رخ داد!",
      success: false,
    };
  }
}
