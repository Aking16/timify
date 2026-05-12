"use client";

import { Button } from "@/components/ui/button";
import { handleLogout } from "@/lib/auth-libs";

export default function LogoutButton() {
  return (
    <Button variant="destructive" onClick={handleLogout}>
      خروج
    </Button>
  );
}
