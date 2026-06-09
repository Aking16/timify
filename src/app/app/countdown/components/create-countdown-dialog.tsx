"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useActionState, useEffect, useState } from "react";

import { createCountdown } from "@/actions/countdowns/create-countdown";
import { AddIcon } from "@hugeicons/core-free-icons";
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

export default function CreateCountdownDialog() {
  const [isOpen, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createCountdown, null);

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <HugeiconsIcon icon={AddIcon} />
          ساخت شمارش معکوس
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>شمارش معکوس جدید</DialogTitle>
          <DialogDescription className="sr-only">شمارش معکوس جدید</DialogDescription>
        </DialogHeader>
        <form id="create-countdown-form" action={formAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">نام</FieldLabel>
              <Input id="title" name="title" placeholder="نام شمارش معکوس" maxLength={64} />
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
                required
                placeholder="مثلاً ۳۶۰۰"
              />
            </Field>
          </FieldGroup>
        </form>
        <StatusMessage status={state?.success ? "success" : "error"} message={state?.message} />
        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => setOpen(false)}>
            لغو
          </Button>
          <Button type="submit" form="create-countdown-form" disabled={isPending}>
            {isPending ? "در حال ساخت..." : "ساخت"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
