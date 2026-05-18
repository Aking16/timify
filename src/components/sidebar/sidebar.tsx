import { Suspense } from "react";

import { getProjects } from "@/actions/projects/get-projects";
import {
  CalendarIcon,
  ClockIcon,
  FolderIcon,
  HomeIcon,
  TimerIcon,
} from "@hugeicons/core-free-icons";

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

import { Skeleton } from "../ui/skeleton";
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

export async function AppSidebar() {
  const projects = await getProjects();

  return (
    <Sidebar variant="inset" collapsible="icon" side="right" dir="rtl">
      <SidebarHeader>
        <Suspense fallback={<Skeleton className="h-12 w-full" />}>
          <ProjectSelector data={projects} />
        </Suspense>
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
                    projectsData={projects}
                    {...item}
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
