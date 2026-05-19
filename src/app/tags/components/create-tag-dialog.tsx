"use client";

import { useActionState, useState } from "react";

import { createTag } from "@/actions/tags/create-tag";
import { AddIcon } from "@hugeicons/core-free-icons";
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

export default function CreateTagDialog() {
  const [isOpen, setOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(createTag, null);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <HugeiconsIcon icon={AddIcon} />
          ساختن برچسب
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ویرایش پروژه</DialogTitle>
          <DialogDescription>پروژه خود را ویرایش کن</DialogDescription>
        </DialogHeader>
        <form
          id="create-tag-form"
          className="space-y-4 py-4 max-h-[52svh] pe-2 scroll-bar"
          action={formAction}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">نام پروژه</FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="نام پروژه خود را وارد کنید"
                autoFocus
                required
                maxLength={16}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="color">رنگ</FieldLabel>
              <input
                id="color"
                name="color"
                type="color"
                placeholder="رنگ پروژه خود را وارد کنید"
                defaultValue="#CA3500"
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
          <Button type="submit" form="create-tag-form" disabled={isPending}>
            {isPending ? "در حال ساختن..." : "ساختن"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
