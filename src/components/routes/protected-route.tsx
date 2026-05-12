import { requireSession } from "@/lib/auth-guard";
import React from "react";

export default async function ProtectedRoute({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireSession();

  return children;
}
