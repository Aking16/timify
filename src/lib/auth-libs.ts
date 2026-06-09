import { defaultRoutes } from "@/constants/routes";
import { redirect } from "next/navigation";
import { authClient } from "./auth-client";

export async function handleLogout() {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        redirect(defaultRoutes.authRedirectPage);
      },
    },
  });
}


