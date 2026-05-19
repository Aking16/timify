"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export type DeleteProjectState = {
  message?: string;
  success?: boolean;
} | null;

export async function deleteProject(id: string): Promise<DeleteProjectState> {
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
    await db.delete(projects).where(eq(projects.id, id));

    revalidatePath("/projects/");
    revalidateTag("get-projects", "max");
    revalidateTag("retrieve-project", "max");

    return {
      success: true,
      message: "پروژه حذف شد!",
    };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return {
      message: "خطایی در حذف پروژه رخ داد!",
      success: false,
    };
  }
}
