"use client";

import { useState } from "react";

import { getProjects } from "@/actions/projects/get-projects";
import { CarouselVerticalIcon, ChevronsDownUpIcon, TickIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import useSWR from "swr";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function ProjectSelector() {
  const { data: projects, isLoading, error } = useSWR("all-projects", getProjects);
  const [selectedVersion, setSelectedVersion] = useState("");

  if (error || !projects) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <HugeiconsIcon icon={CarouselVerticalIcon} />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">Documentation</span>
                <span className="">v{selectedVersion}</span>
              </div>
              <HugeiconsIcon icon={ChevronsDownUpIcon} className="ms-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)" align="start">
            {projects.map((item) => (
              <DropdownMenuItem
                key={`projects-selection-${item.id}`}
                onSelect={() => setSelectedVersion(item.id)}
              >
                v{item.name}{" "}
                {item.id === selectedVersion && (
                  <HugeiconsIcon icon={TickIcon} className="ms-auto" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
