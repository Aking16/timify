"use client";

import { Dots, LogoutIcon, User02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { authClient } from "@/lib/auth-client";
import { handleLogout } from "@/lib/auth-libs";

import { Skeleton } from "../ui/skeleton";

export default function SidebarProfile() {
  const { isMobile } = useSidebar();
  const user = authClient.useSession();

  if (user.isPending) return <Skeleton className="w-full h-12" />;

  if (!user.data) return <p>Error fetching user profile</p>;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.data.user.image ?? undefined} alt={user.data.user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.data.user.name.substring(0, 3)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-sm leading-tight">
                <span className="truncate font-medium">{user.data.user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.data.user.email}
                </span>
              </div>
              <HugeiconsIcon icon={Dots} className="ms-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.data.user.image ?? undefined} alt={user.data.user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.data.user.name.substring(0, 3)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.data.user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.data.user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <HugeiconsIcon icon={User02Icon} />
                پروفایل
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover:bg-destructive/20! hover:text-destructive! group"
              onClick={handleLogout}
            >
              <HugeiconsIcon icon={LogoutIcon} className="group-hover:text-destructive!" />
              خروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
