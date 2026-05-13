import { useActionState, useState } from "react";

import { editTimeEntry } from "@/actions/time-entries/edit-time.entry";
import { timeEntries } from "@/db/schema";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import StatusMessage from "@/components/cards/status-message";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function EntryCardDialog({
  id,
  title,
  description,
  startTime,
  endTime,
}: typeof timeEntries.$inferSelect) {
  const [isOpen, setOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(editTimeEntry, null);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon-sm">
          <HugeiconsIcon icon={Edit02Icon} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ویرایش تسک</DialogTitle>
          <DialogDescription>تسک خود را ویرایش کن</DialogDescription>
        </DialogHeader>
        <form id="edit-task-form" className="space-y-4 py-4" action={formAction}>
          <input type="text" name="id" value={id} readOnly className="hidden" />

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">نام تسک</FieldLabel>
              <Input
                id="title"
                name="title"
                placeholder="نام تسک خود را وارد کنید"
                defaultValue={title!}
                autoFocus
                required
                minLength={4}
                maxLength={32}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">توضیحات </FieldLabel>
              <Input
                id="description"
                name="description"
                placeholder="توضیحات تسک خود را وارد کنید"
                defaultValue={description!}
                required
                minLength={4}
              />
            </Field>
          </FieldGroup>
          <FieldGroup className="grid grid-cols-2">
            <Field>
              <FieldLabel htmlFor="start-time">زمان شروع</FieldLabel>
              <Input
                id="start-time"
                type="datetime-local"
                name="startTime"
                defaultValue={startTime?.toISOString().slice(0, 16)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="end-time">زمان پایان</FieldLabel>
              <Input
                id="end-time"
                type="datetime-local"
                name="endTime"
                defaultValue={endTime?.toISOString().slice(0, 16)}
              />
            </Field>
          </FieldGroup>
        </form>
        <StatusMessage status={state?.success ? "success" : "error"} message={state?.message} />
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setOpen(false);
            }}
          >
            بستن
          </Button>
          <Button type="submit" form="edit-task-form" disabled={isPending}>
            {isPending ? "در حال ویرایش..." : "ویرایش"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
