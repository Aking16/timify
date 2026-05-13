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

import EntryCardDialog from "./entry-card-dialog";

export default function EntryCard({ ...props }: typeof timeEntries.$inferSelect) {
  const currentDuration = useRealtimeDuration(
    props.startTime,
    props.isRunning ?? false,
    props.duration
  );

  const [_state, formAction, isPending] = useActionState(stopTimeEntry, null);

  async function handleStartClick() {
    const activeProject = getActiveProject();

    const formData = new FormData();

    if (!activeProject.id) {
      toast.error("پروژه را انتخاب کنید!");
      return;
    }

    formData.set("id", props.id);

    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
        <CardAction className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={isPending || !props.isRunning}
            onClick={handleStartClick}
          >
            {currentDuration}
            <HugeiconsIcon
              icon={props.isRunning ? PlayIcon : StopIcon}
              fill={props.isRunning ? "green" : "red"}
              color={props.isRunning ? "green" : "red"}
            />
          </Button>
          <EntryCardDialog {...props} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>{props.description}</p>
      </CardContent>
      <CardFooter className="block space-y-2">
        <p>تگ ها</p>
        <Badge>Test</Badge>
      </CardFooter>
    </Card>
  );
}
