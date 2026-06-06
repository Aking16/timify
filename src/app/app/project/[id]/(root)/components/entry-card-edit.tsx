import { useActionState, useState } from "react";

import { editTimeEntry } from "@/actions/time-entries/edit-time-entry";
import { timeEntries } from "@/db/schema";
import { ChevronDown, Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";

import StatusMessage from "@/components/cards/status-message";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function EntryCardEdit({
  id,
  title,
  description,
  startTime,
  endTime,
}: typeof timeEntries.$inferSelect) {
  const [isOpen, setOpen] = useState(false);
  const [isStartPopoverOpen, setStartPopoverOpen] = useState(false);
  const [isEndPopoverOpen, setEndPopoverOpen] = useState(false);

  const [startDate, setStartDate] = useState<Date | undefined>(
    startTime ? new Date(startTime) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(endTime ? new Date(endTime) : undefined);

  const [startTimeValue, setStartTimeValue] = useState<string>(
    startTime ? format(startTime, "HH:mm") : ""
  );
  const [endTimeValue, setEndTimeValue] = useState<string>(endTime ? format(endTime, "HH:mm") : "");

  const [state, formAction, isPending] = useActionState(editTimeEntry, null);

  // Combine date and time for startTime
  function getCombinedStartDateTime() {
    if (!startDate) return startTime?.toISOString() ?? "";

    const [hours, minutes] = startTimeValue.split(":");
    const combined = new Date(startDate);

    combined.setHours(parseInt(hours) ?? 0, parseInt(minutes) ?? 0);

    return combined.toISOString();
  }

  // Combine date and time for endTime
  function getCombinedEndDateTime() {
    if (!endDate) return endTime?.toISOString() ?? "";

    const [hours, minutes] = endTimeValue.split(":");
    const combined = new Date(endDate);

    combined.setHours(parseInt(hours) ?? 0, parseInt(minutes) ?? 0);

    return combined.toISOString();
  }

  const handleSubmit = (formData: FormData) => {
    // Set the combined datetime values
    formData.set("startTime", getCombinedStartDateTime());
    formData.set("endTime", getCombinedEndDateTime());
    formAction(formData);
  };

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
          <DialogTitle>ویرایش تسک</DialogTitle>
          <DialogDescription>تسک خود را ویرایش کن</DialogDescription>
        </DialogHeader>
        <form id="edit-task-form" className="space-y-4 py-4" action={handleSubmit}>
          <input type="hidden" name="id" value={id} />

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
              <FieldLabel htmlFor="description">توضیحات</FieldLabel>
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
              <FieldLabel htmlFor="start-date">تاریخ شروع</FieldLabel>
              <Popover open={isStartPopoverOpen} onOpenChange={setStartPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="start-date"
                    className="w-full justify-between font-normal"
                    type="button"
                  >
                    {startDate ? format(startDate, "P") : "انتخاب تاریخ"}
                    <HugeiconsIcon icon={ChevronDown} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    captionLayout="dropdown"
                    locale={faIR}
                    defaultMonth={startDate ?? startTime ?? undefined}
                    onSelect={(date) => {
                      setStartDate(date);
                      setStartPopoverOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </Field>
            <Field>
              <FieldLabel htmlFor="start-time">زمان شروع</FieldLabel>
              <Input
                id="start-time"
                type="time"
                value={startTimeValue}
                onChange={(e) => setStartTimeValue(e.target.value)}
                required
              />
            </Field>
          </FieldGroup>
          <FieldGroup className="grid grid-cols-2">
            <Field>
              <FieldLabel htmlFor="end-date">تاریخ پایان</FieldLabel>
              <Popover open={isEndPopoverOpen} onOpenChange={setEndPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="end-date"
                    className="w-full justify-between font-normal"
                    type="button"
                  >
                    {endDate ? format(endDate, "P") : "انتخاب تاریخ"}
                    <HugeiconsIcon icon={ChevronDown} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    captionLayout="dropdown"
                    locale={faIR}
                    defaultMonth={endDate ?? endTime ?? undefined}
                    onSelect={(date) => {
                      setEndDate(date);
                      setEndPopoverOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </Field>
            <Field>
              <FieldLabel htmlFor="end-time">زمان پایان</FieldLabel>
              <Input
                id="end-time"
                type="time"
                value={endTimeValue}
                onChange={(e) => setEndTimeValue(e.target.value)}
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
