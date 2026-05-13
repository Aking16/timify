"use client";

import { getProjects } from "@/actions/projects/get-projects";
import { getTimeEntries } from "@/actions/time-entries/get-time-entry";
import {
  CalendarIcon,
  ClockIcon,
  FolderIcon,
  HomeIcon,
  TimerIcon,
} from "@hugeicons/core-free-icons";
import useSWR from "swr";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { ProjectSelector } from "./project-selector";
import SidebarItem from "./sidebar-item";
import SidebarSecondaryItems from "./sidebar-secondary-items";
import { StartTimer } from "./start-timer";

const navItems = [
  {
    label: "عمومی",
    items: [
      { title: "داشبورد", icon: HomeIcon, href: "/", badge: null },
      { title: "زمان‌ها", icon: ClockIcon, href: "#", badge: null },
    ],
  },
  {
    label: "پروژه‌ها",
    items: [
      { title: "همه پروژه‌ها", icon: FolderIcon, href: "/projects", badge: null },
      { title: "تقویم", icon: CalendarIcon, href: "#", badge: null },
      { title: "گزارش‌ها", icon: TimerIcon, href: "/reports", badge: null },
    ],
  },
];

export function AppSidebar() {
  const projects = useSWR("all-projects", getProjects);
  const timeEntries = useSWR("all-time-entries", getTimeEntries);

  return (
    <Sidebar variant="inset" collapsible="icon" side="right" dir="rtl">
      <SidebarHeader>
        <ProjectSelector {...projects} />
      </SidebarHeader>
      <SidebarSeparator />
      <StartTimer />
      <SidebarContent>
        {navItems.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarItem
                    key={`sidebar-item-menu-${item.href}`}
                    {...item}
                    projectsData={projects}
                    timeEntriesData={timeEntries}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <SidebarSeparator />
        <SidebarSecondaryItems />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

export function SidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
