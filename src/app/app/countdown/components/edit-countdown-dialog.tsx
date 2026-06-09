"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useActionState, useEffect, useState } from "react";

import { updateCountdown } from "@/actions/countdowns/update-countdown";
import { countdowns } from "@/db/schema";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { InferSelectModel } from "drizzle-orm";

import StatusMessage from "@/components/cards/status-message";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface EditCountdownDialogProps extends InferSelectModel<typeof countdowns> {
  isRunning: boolean;
}

export default function EditCountdownDialog({
  id,
  title,
  duration,
  isRunning,
}: EditCountdownDialogProps) {
  const [isOpen, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(updateCountdown, null);

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
    }
  }, [state]);

  const isDisabled = isRunning || isPending;

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
        </DialogHeader>
        {isRunning && (
          <p className="text-sm text-destructive">
            نمی‌توان شمارش معکوس در حال اجرا را ویرایش کرد. ابتدا آن را متوقف کنید.
          </p>
        )}
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
                disabled={isDisabled}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="duration">مدت (ثانیه)</FieldLabel>
              <Input
                id="duration"
                name="duration"
                type="number"
                min={1}
                max={86400}
                defaultValue={duration}
                disabled={isDisabled}
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
          <Button type="submit" form="edit-countdown-form" disabled={isDisabled}>
            {isPending ? "در حال ویرایش..." : "ویرایش"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
