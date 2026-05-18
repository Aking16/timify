"use client";

import { getTimeEntries } from "@/actions/time-entries/get-time-entry";
import { getActiveProject } from "@/data/get-active-project";
import { projects } from "@/db/schema";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";
import Link from "next/link";
import useSWR from "swr";

import { SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

interface SidebarItemProps {
  title: string;
  icon: IconSvgElement;
  href: string;
  badge: string | null;
  projectsData?: (typeof projects.$inferSelect)[];
}

export default function SidebarItem({ title, icon, href, badge, projectsData }: SidebarItemProps) {
  const activeProject = getActiveProject();

  const timeEntries = useSWR("all-time-entries", () => getTimeEntries(activeProject.id ?? ""));

  if (href === "/") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={title}>
          <Link href={href}>
            <HugeiconsIcon icon={icon} data-icon="inline-start" />
            <span>{title}</span>
          </Link>
        </SidebarMenuButton>
        <SidebarMenuBadge>{timeEntries.data?.length}</SidebarMenuBadge>
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
        <SidebarMenuBadge>{projectsData?.length}</SidebarMenuBadge>
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
