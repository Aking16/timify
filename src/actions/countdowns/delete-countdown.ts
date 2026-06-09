"use server";

import { db } from "@/db";
import { countdowns } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export type DeleteCountdownState = {
  message?: string;
  success?: boolean;
} | null;

export async function deleteCountdown(
  _prevState: DeleteCountdownState,
  id: string
): Promise<DeleteCountdownState> {
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
    await db
      .delete(countdowns)
      .where(and(eq(countdowns.id, id), eq(countdowns.userId, session.user.id)));

    revalidatePath("/app/countdown");
    revalidateTag("get-countdowns", "max");

    return {
      success: true,
      message: "شمارش معکوس حذف شد!",
    };
  } catch (error) {
    console.error("Failed to delete countdown:", error);
    return {
      message: "خطا در حذف شمارش معکوس",
      success: false,
    };
  }
}
