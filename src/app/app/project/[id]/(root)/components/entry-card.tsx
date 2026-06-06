"use client";

import { startTransition, useActionState } from "react";

import { TimeEntryWithTags } from "@/actions/time-entries/get-time-entry";
import { stopTimeEntry } from "@/actions/time-entries/stop-time-entry";
import { getActiveProject } from "@/data/get-active-project";
import { tags } from "@/db/schema";
import { MoreVerticalIcon, PlayIcon, StopIcon, TagIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRealtimeDuration } from "@/hooks/use-realtime-duration";

import EntryCardDelete from "./entry-card-delete";
import EntryCardEdit from "./entry-card-edit";
import TagsChips from "./tags-chips";

interface EntryCardProps {
  timeEntries: TimeEntryWithTags;
  tags: (typeof tags.$inferSelect)[];
}

export default function EntryCard({ timeEntries, tags }: EntryCardProps) {
  const currentDuration = useRealtimeDuration(
    timeEntries.startTime,
    timeEntries.isRunning ?? false,
    timeEntries.duration
  );

  const [_state, formAction, isPending] = useActionState(stopTimeEntry, null);

  async function handleStartClick() {
    const activeProject = getActiveProject();

    const formData = new FormData();

    if (!activeProject.id) {
      toast.error("پروژه را انتخاب کنید!");
      return;
    }

    formData.set("id", timeEntries.id);

    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{timeEntries.title}</CardTitle>
        <CardDescription>{timeEntries.description}</CardDescription>
        <CardAction className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            title="توقف"
            disabled={isPending || !timeEntries.isRunning}
            onClick={handleStartClick}
            suppressHydrationWarning
          >
            {currentDuration}
            <HugeiconsIcon
              icon={timeEntries.isRunning ? PlayIcon : StopIcon}
              fill={timeEntries.isRunning ? "green" : "red"}
              color={timeEntries.isRunning ? "green" : "red"}
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" title="مشاهده بیشتر">
                <HugeiconsIcon icon={MoreVerticalIcon} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                <EntryCardEdit
                  key={`entry-card-dialog-${timeEntries.updatedAt}`}
                  {...timeEntries}
                />
                <EntryCardDelete
                  key={`entry-card-delete-dialog-${timeEntries.id}`}
                  {...timeEntries}
                />
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>{timeEntries.description}</p>
      </CardContent>
      <CardFooter className="block space-y-2 mt-auto">
        <p className="flex items-center gap-1">
          <HugeiconsIcon icon={TagIcon} size={16} className="text-muted-foreground" />
          <span>برچسب ها</span>
        </p>
        <TagsChips timeEntryId={timeEntries.id} tags={tags} defaultTags={timeEntries.tags} />
      </CardFooter>
    </Card>
  );
}
