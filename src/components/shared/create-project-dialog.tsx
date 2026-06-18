"use client";

import { Dispatch, SetStateAction, useActionState, useState } from "react";

import { createProject } from "@/actions/projects/create-project";
import { PlusSignCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { numberToPersianWords } from "@/lib/persian-number-to-words";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

interface CreateProjectDialogProps {
  isOpen?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  hasTrigger?: boolean;
}

export default function CreateProjectDialog({
  isOpen,
  setOpen,
  hasTrigger = false,
}: CreateProjectDialogProps) {
  const [hourlyRate, setHourlyRate] = useState(0);

  const [state, formAction, isPending] = useActionState(createProject, null);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {hasTrigger && (
        <DialogTrigger>
          <Button>
            <HugeiconsIcon icon={PlusSignCircleIcon} data-icon="inline-start" />
            <span>افزودن پروژه</span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ساخت پروژه جدید</DialogTitle>
          <DialogDescription>پروژه جدید برای مدیریت تسک هات بساز</DialogDescription>
        </DialogHeader>

        <form id="new-project-form" className="space-y-4 py-4" action={formAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">نام پروژه</FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="نام پروژه خود را وارد کنید"
                autoFocus
                required
                minLength={4}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">توضیحات (اختیاری)</FieldLabel>
              <Input
                id="description"
                name="description"
                placeholder="توضیحات پروژه خود را وارد کنید"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="hourlyRate">نرخ ساعتی (اختیاری)</FieldLabel>
              <Input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                placeholder="نرخ ساعتی پروژه خود را وارد کنید"
                value={String(hourlyRate)}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
              />
            </Field>
            <FieldDescription>{numberToPersianWords(hourlyRate)}</FieldDescription>
          </FieldGroup>
        </form>

        {state?.message && !state.success && (
          <p className="text-sm  bg-destructive rounded-sm p-2">{state.message}</p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setOpen?.(false);
            }}
          >
            لغو
          </Button>
          <Button type="submit" form="new-project-form" disabled={isPending}>
            {isPending ? "در حال ساختن..." : "ساخت پروژه"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
