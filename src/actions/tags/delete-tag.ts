"use server";

import { db } from "@/db";
import { tags } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export type DeleteTagState = {
  message?: string;
  success?: boolean;
} | null;

export async function deleteTag(id: string): Promise<DeleteTagState> {
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
    await db.delete(tags).where(eq(tags.id, id));

    revalidatePath("/tags/");
    revalidateTag("get-tags", "max");

    return {
      success: true,
      message: "برچسب حذف شد!",
    };
  } catch (error) {
    console.error("Failed to delete tag:", error);
    return {
      message: "خطایی در حذف برچسب رخ داد!",
      success: false,
    };
  }
}
