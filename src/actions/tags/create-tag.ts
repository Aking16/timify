"use server";

import { db } from "@/db";
import { tags } from "@/db/schema";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";

const schema = z.object({
  name: z
    .string()
    .nonempty("نام برچسب الزامی است")
    .max(16, "نام برچسب باید حداکثر ۳۲ کاراکتر باشد"),
  color: z.string().optional().nullable(),
});

export type CreateTagState = {
  message?: string;
  success?: boolean;
  tag?: typeof tags.$inferSelect;
} | null;

export async function createTag(
  _prevState: CreateTagState,
  formData: FormData
): Promise<CreateTagState> {
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

  try {
    const [createdTag] = await db
      .insert(tags)
      .values({
        ...validatedFields.data,
        userId: session.user.id,
      })
      .returning();

    revalidatePath("/tags");
    revalidateTag("get-tags", "max");

    return {
      success: true,
      tag: createdTag,
      message: "برچسب با موفقیت ساخته شد!",
    };
  } catch (error) {
    console.error("Failed to create tag:", error);
    return {
      message: "خطایی در ساخت برچسب رخ داد!",
      success: false,
    };
  }
}
