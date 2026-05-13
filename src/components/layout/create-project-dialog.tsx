"use client";

import { Dispatch, SetStateAction, useActionState, useEffect } from "react";

import { createProject } from "@/actions/projects/create-project";
import { SWRResponse } from "swr";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

interface CreateProjectDialogProps {
  isOpen?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  mutate?: SWRResponse["mutate"];
}

export default function CreateProjectDialog({ isOpen, setOpen, mutate }: CreateProjectDialogProps) {
  const [state, formAction, isPending] = useActionState(createProject, null);

  useEffect(() => {
    if (!mutate) return;

    if (state?.success && state.project) {
      // Refresh the projects list
      mutate();
    }
  }, [state, mutate]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
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
            Cancel
          </Button>
          <Button type="submit" form="new-project-form" disabled={isPending}>
            {isPending ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
