"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(4, "Project name must be at least 4 characters"),
  description: z.string().optional().nullable(),
  hourlyRate: z.string().optional().nullable(),
});

export type CreateProjectState = {
  message?: string;
  success?: boolean;
  project?: typeof projects.$inferSelect;
} | null;

export async function createProject(
  _prevState: CreateProjectState,
  formData: FormData
): Promise<CreateProjectState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      message: "User ID is required",
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

  const { name, description, hourlyRate } = validatedFields.data;

  try {
    const [createdProject] = await db
      .insert(projects)
      .values({
        userId: session.user.id,
        hourlyRate: Number(hourlyRate),
        name,
        description,
      })
      .returning();

    revalidatePath("/");
    revalidateTag("get-projects", "max");
    revalidateTag("retrieve-project", "max");

    return {
      success: true,
      project: createdProject,
      message: "Project created successfully",
    };
  } catch (error) {
    console.error("Failed to create project:", error);
    return {
      message: "Failed to create project",
      success: false,
    };
  }
}
