import { useActionState, useState } from "react";

import { editProject } from "@/actions/projects/edit-project";
import { deleteTimeEntry } from "@/actions/time-entries/delete-time-entry";
import { projects } from "@/db/schema";
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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function EditDialog({
  id,
  name,
  description,
  color,
  isActive,
}: typeof projects.$inferSelect) {
  const [isOpen, setOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(editProject, null);

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
        <form id="edit-task-form" className="space-y-4 py-4" action={formAction}>
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
              <FieldLabel htmlFor="description">توضیحات</FieldLabel>
              <Input
                id="description"
                name="description"
                placeholder="توضیحات پروژه خود را وارد کنید"
                defaultValue={description!}
                minLength={4}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="color">رنگ</FieldLabel>
              <Input
                id="color"
                name="color"
                type="color"
                placeholder="رنگ پروژه خود را وارد کنید"
                defaultValue={color!}
                minLength={4}
              />
            </Field>
            <FieldSet>
              <FieldLegend variant="label">وضعیت</FieldLegend>
              <FieldDescription>وضعیت پروژه (فعال یا غیرفعال)</FieldDescription>
              <RadioGroup name="isActive" defaultValue={String(isActive)}>
                <Field orientation="horizontal">
                  <RadioGroupItem value="true" id="isActive-true" />
                  <FieldLabel htmlFor="isActive-true">فعال</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem value="false" id="isActive-false" />
                  <FieldLabel htmlFor="isActive-false">غیرفعال</FieldLabel>
                </Field>
              </RadioGroup>
            </FieldSet>
          </FieldGroup>
        </form>
        <StatusMessage status={state?.success ? "success" : "error"} message={state?.message} />
        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            className="sm:me-auto"
            onClick={() => {
              deleteTimeEntry(id);
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
