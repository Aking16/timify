import LogoutButton from "@/components/layout/logout-button";
import ProtectedRoute from "@/components/routes/protected-route";
import { UserCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function Home() {
  return (
    <ProtectedRoute>
      <div>
        <HugeiconsIcon icon={UserCircle02Icon} />
        <LogoutButton />
      </div>
    </ProtectedRoute>
  );
}
