"use server";

import { defaultRoutes } from "@/constants/routes";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth"; // path to your Better Auth server instance

export async function requireSession() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!session) {
    redirect(defaultRoutes.authPage);
  }

  return session;
}
