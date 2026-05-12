"use client";

import { Button } from "@/components/ui/button";
import { handleLogout } from "@/lib/auth-libs";
import { LogoutIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function LogoutButton() {
  return (
    <Button variant="destructive" onClick={handleLogout}>
      <HugeiconsIcon icon={LogoutIcon} />
      خروج
    </Button>
  );
}
