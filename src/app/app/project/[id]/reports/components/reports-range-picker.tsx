"use client";

import { useState } from "react";

import { CalendarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { addDays, format } from "date-fns-jalali";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function ReportsRangePicker() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });

  function handleSelect(range: DateRange) {
    setDate(range);

    const params = new URLSearchParams(searchParams);

    params.set("startDate", range.from?.getTime().toString() ?? "");
    params.set("endDate", range.to?.getTime().toString() ?? "");

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Field className="w-60 ms-auto">
      <FieldLabel htmlFor="date-picker-range" className="sr-only">
        تاریخ:
      </FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-range"
            className="justify-start px-2.5 font-normal"
          >
            <HugeiconsIcon icon={CalendarIcon} />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "y/LL/dd")} - {format(date.to, "y/LL/dd")}
                </>
              ) : (
                format(date.from, "y/LL/dd")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={1}
            required
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
