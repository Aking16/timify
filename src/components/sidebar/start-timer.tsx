"use client";

import { startTransition, useActionState, useEffect } from "react";

import { createTimeEntry } from "@/actions/time-entries/create-time-entry";
import { getActiveProject } from "@/data/get-active-project";
import { TimerIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { toast } from "sonner";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";

import { buttonVariants } from "../ui/button";

export function StartTimer() {
  const { state: sidebarState } = useSidebar();
  const [state, formAction, isPending] = useActionState(createTimeEntry, null);

  const activeProject = getActiveProject();

  async function handleStartClick() {
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

  // Handle toast based on state changes
  useEffect(() => {
    if (state === null) return; // Initial state

    if (state?.success) {
      toast.success(
        <div>
          <span>{state.message}</span>
          <Link
            href={`/project/${activeProject.id}`}
            className={buttonVariants({ variant: "link" })}
          >
            برو به پروژه
          </Link>
        </div>
      );
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [activeProject.id, state]);

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex w-full justify-center">
        <SidebarMenuButton
          className={cn("w-[90%] mt-2 md:w-full", buttonVariants({ size: "lg" }))}
          disabled={isPending}
          onClick={handleStartClick}
        >
          <HugeiconsIcon icon={TimerIcon} />
          {sidebarState === "expanded" && "شروع تسک"}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
