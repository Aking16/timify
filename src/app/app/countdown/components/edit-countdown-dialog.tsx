"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useActionState, useEffect, useState } from "react";

import { updateCountdown } from "@/actions/countdowns/update-countdown";
import { countdowns } from "@/db/schema";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import StatusMessage from "@/components/cards/status-message";
import TimePicker from "@/components/custom-ui/time-picker";
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

export default function EditCountdownDialog({
  id,
  title,
  duration,
}: typeof countdowns.$inferSelect) {
  const [isOpen, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(updateCountdown, null);

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <HugeiconsIcon icon={Edit02Icon} />
          ویرایش
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ویرایش شمارش معکوس</DialogTitle>
          <DialogDescription className="sr-only">ویرایش شمارش معکوس</DialogDescription>
        </DialogHeader>
        <form id="edit-countdown-form" action={formAction}>
          <input type="hidden" name="id" value={id} />
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">نام</FieldLabel>
              <Input
                id="title"
                name="title"
                defaultValue={title}
                maxLength={64}
                disabled={isPending}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="duration">مدت (ثانیه)</FieldLabel>
              <TimePicker
                id="duration"
                name="duration"
                type="number"
                min={1}
                max={86400}
                className="justify-center"
                defaultValue={duration}
                disabled={isPending}
                required
              />
            </Field>
          </FieldGroup>
        </form>
        <StatusMessage status={state?.success ? "success" : "error"} message={state?.message} />
        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => setOpen(false)}>
            لغو
          </Button>
          <Button type="submit" form="edit-countdown-form" disabled={isPending}>
            {isPending ? "در حال ویرایش..." : "ویرایش"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
