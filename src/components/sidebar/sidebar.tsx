import { Suspense } from "react";

import { getProjects } from "@/actions/projects/get-projects";
import { sidebarNavItems } from "@/data/navigation-data";

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

import { ThemeSwitcher } from "../layout/theme-switcher";
import { Skeleton } from "../ui/skeleton";
import { ProjectSelector } from "./project-selector";
import SidebarItem from "./sidebar-item";
import SidebarSecondaryItems from "./sidebar-secondary-items";
import { StartTimer } from "./start-timer";

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
        {sidebarNavItems.map((group) => (
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
        <ThemeSwitcher />
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
