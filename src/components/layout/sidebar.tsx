"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  CalendarIcon,
  ClockIcon,
  FolderIcon,
  HomeIcon,
  PlusSignCircleIcon,
  TagIcon,
  TimerIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ProjectSelector } from "./project-selector";

const navItems = [
  {
    label: "عمومی",
    items: [
      { title: "داشبورد", icon: HomeIcon, href: "#", badge: null },
      { title: "زمان‌ها", icon: ClockIcon, href: "#", badge: "12" },
    ],
  },
  {
    label: "پروژه‌ها",
    items: [
      { title: "همه پروژه‌ها", icon: FolderIcon, href: "#", badge: null },
      { title: "تقویم", icon: CalendarIcon, href: "#", badge: null },
      { title: "گزارش‌ها", icon: TimerIcon, href: "#", badge: null },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon" side="right" dir="rtl">
      <SidebarHeader>
        <ProjectSelector />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {navItems.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a href={item.href}>
                        <HugeiconsIcon icon={item.icon} data-icon="inline-start" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                    {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="افزودن پروژه">
                  <HugeiconsIcon icon={PlusSignCircleIcon} data-icon="inline-start" />
                  <span>افزودن پروژه</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="برچسب‌ها">
                  <HugeiconsIcon icon={TagIcon} data-icon="inline-start" />
                  <span>برچسب‌ها</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
