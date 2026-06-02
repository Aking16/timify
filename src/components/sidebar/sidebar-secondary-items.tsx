"use client";

import { useState } from "react";

import { PlusSignCircleIcon, TagIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import CreateProjectDialog from "../shared/create-project-dialog";

export default function SidebarSecondaryItems() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="برچسب‌ها" asChild>
                <Link href="/app/tags">
                  <HugeiconsIcon icon={TagIcon} data-icon="inline-start" />
                  <span>برچسب‌ها</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="افزودن پروژه" onClick={() => setOpen((prev) => !prev)}>
                <HugeiconsIcon icon={PlusSignCircleIcon} data-icon="inline-start" />
                <span>افزودن پروژه</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <CreateProjectDialog isOpen={isOpen} setOpen={setOpen} />
    </>
  );
}
