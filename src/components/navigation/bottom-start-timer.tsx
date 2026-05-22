"use client";

import { startTransition, useActionState, useEffect } from "react";

import { createTimeEntry } from "@/actions/time-entries/create-time-entry";
import { getActiveProject } from "@/data/get-active-project";
import { TimerIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { toast } from "sonner";

import { Button, buttonVariants } from "../ui/button";

export function BottomStartTimer() {
  const [state, formAction, isPending] = useActionState(createTimeEntry, null);

  const activeProject = getActiveProject();

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

  return (
    <Button
      className="size-fit! p-2 rounded-full right-1/2 translate-x-1/2 -top-6 absolute"
      title="شروع تسک"
      disabled={isPending}
      onClick={handleStartClick}
    >
      <HugeiconsIcon icon={TimerIcon} className="size-8!" />
    </Button>
  );
}
