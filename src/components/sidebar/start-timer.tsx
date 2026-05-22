"use client";

import { startTransition, useActionState } from "react";

import { createTimeEntry } from "@/actions/time-entries/create-time-entry";
import { getActiveProject } from "@/data/get-active-project";
import { TimerIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";

import { buttonVariants } from "../ui/button";

export function StartTimer() {
  const [_state, formAction, isPending] = useActionState(createTimeEntry, null);

  async function handleStartClick() {
    const activeProject = getActiveProject();

    const formData = new FormData();

    if (!activeProject.id) {
      toast.error("پروژه را انتخاب کنید!");
      return;
    }

    formData.set("projectID", activeProject.id);

    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex w-full justify-center">
        <SidebarMenuButton
          className={cn("w-[90%] mt-2 md:w-full", buttonVariants({ size: "lg" }))}
          disabled={isPending}
          onClick={handleStartClick}
        >
          <HugeiconsIcon icon={TimerIcon} />
          شروع تسک
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
