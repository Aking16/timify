import { projects, timeEntries } from "@/db/schema";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";
import Link from "next/link";
import { SWRResponse } from "swr";

import { SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

interface SidebarItemProps {
  title: string;
  icon: IconSvgElement;
  href: string;
  badge: string | null;
  projectsData?: SWRResponse<(typeof projects.$inferSelect)[]>;
  timeEntriesData?: SWRResponse<(typeof timeEntries.$inferSelect)[]>;
}

export default function SidebarItem({
  title,
  icon,
  href,
  badge,
  projectsData,
  timeEntriesData,
}: SidebarItemProps) {
  if (href === "/") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={title}>
          <Link href={href}>
            <HugeiconsIcon icon={icon} data-icon="inline-start" />
            <span>{title}</span>
          </Link>
        </SidebarMenuButton>
        <SidebarMenuBadge>{timeEntriesData?.data?.length}</SidebarMenuBadge>
      </SidebarMenuItem>
    );
  }

  if (href === "/projects") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={title}>
          <Link href={href}>
            <HugeiconsIcon icon={icon} data-icon="inline-start" />
            <span>{title}</span>
          </Link>
        </SidebarMenuButton>
        <SidebarMenuBadge>{projectsData?.data?.length}</SidebarMenuBadge>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={title}>
        <Link href={href}>
          <HugeiconsIcon icon={icon} data-icon="inline-start" />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
      {badge && <SidebarMenuBadge>{badge}</SidebarMenuBadge>}
    </SidebarMenuItem>
  );
}
