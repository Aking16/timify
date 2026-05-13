"use client";

import { startTransition, useActionState } from "react";

import { stopTimeEntry } from "@/actions/time-entries/stop-time-entry";
import { getActiveProject } from "@/data/get-active-project";
import { timeEntries } from "@/db/schema";
import { PlayIcon, StopIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useRealtimeDuration } from "@/hooks/useRealtimeDuration";

export default function EntryCard({
  id,
  description,
  title,
  startTime,
  duration,
  isRunning,
}: typeof timeEntries.$inferSelect) {
  const currentDuration = useRealtimeDuration(startTime, isRunning ?? false, duration);

  const [_state, formAction, isPending] = useActionState(stopTimeEntry, null);

  async function handleStartClick() {
    const activeProject = getActiveProject();

    const formData = new FormData();

    if (!activeProject.id) {
      toast.error("پروژه را انتخاب کنید!");
      return;
    }

    formData.set("id", id);

    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Button
            variant="outline"
            size="sm"
            disabled={isPending || !isRunning}
            onClick={handleStartClick}
          >
            {currentDuration}
            <HugeiconsIcon
              icon={isRunning ? PlayIcon : StopIcon}
              fill={isRunning ? "green" : "red"}
              color={isRunning ? "green" : "red"}
            />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
      <CardFooter className="block space-y-2">
        <p>تگ ها</p>
        <Badge>Test</Badge>
      </CardFooter>
    </Card>
  );
}
