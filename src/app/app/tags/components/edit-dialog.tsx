import { useActionState, useState } from "react";

import { deleteTag } from "@/actions/tags/delete-tag";
import { editTag } from "@/actions/tags/edit-tag";
import { tags } from "@/db/schema";
import { Edit02Icon, Trash } from "@hugeicons/core-free-icons";
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

export default function EditDialog({ id, name, color }: typeof tags.$inferSelect) {
  const [isOpen, setOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(editTag, null);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon-sm">
          <HugeiconsIcon icon={Edit02Icon} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ویرایش پروژه</DialogTitle>
          <DialogDescription>پروژه خود را ویرایش کن</DialogDescription>
        </DialogHeader>
        <form
          id="edit-task-form"
          className="space-y-4 py-4 max-h-[52svh] pe-2 scroll-bar"
          action={formAction}
        >
          <input type="text" name="id" value={id} readOnly className="hidden" />

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">نام پروژه</FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="نام پروژه خود را وارد کنید"
                defaultValue={name}
                autoFocus
                required
                minLength={4}
                maxLength={32}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="color">رنگ</FieldLabel>
              <input
                id="color"
                name="color"
                type="color"
                placeholder="رنگ پروژه خود را وارد کنید"
                defaultValue={color!}
                minLength={4}
              />
            </Field>
          </FieldGroup>
        </form>
        <StatusMessage status={state?.success ? "success" : "error"} message={state?.message} />
        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            className="sm:me-auto"
            onClick={() => {
              deleteTag(id);
            }}
          >
            <HugeiconsIcon icon={Trash} />
            حذف
          </Button>
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
