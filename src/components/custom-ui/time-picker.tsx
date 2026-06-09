"use client";

import { Dispatch, SetStateAction, useState } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Input } from "@/components/ui/input";

import { hmsToSeconds, secondsToHmsObject, timePad } from "@/lib/time-display";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

export default function TimePicker({
  className,
  defaultValue,
  ...props
}: React.ComponentProps<"input">) {
  const { hours, minutes, seconds } = secondsToHmsObject(Number(defaultValue ?? 0));

  const [hourValue, setHourValue] = useState(hours);
  const [minuteValue, setMinuteValue] = useState(minutes);
  const [secondValue, setSecondValue] = useState(seconds);

  const parsedSeconds = hmsToSeconds(`${hourValue}:${minuteValue}:${secondValue}`);

  return (
    <div className={cn("flex items-center", className)} dir="ltr">
      <input {...props} type="hidden" value={parsedSeconds} readOnly />
      <TimeInput type="hour" value={hourValue} setValue={setHourValue} />
      <span className="flex justify-center items-center text-2xl bg-input border-t border-b-2 border-b-primary h-16">
        :
      </span>
      <TimeInput type="minute" value={minuteValue} setValue={setMinuteValue} />
      <span className="flex justify-center items-center text-2xl bg-input border-t border-b-2 border-b-primary h-16">
        :
      </span>
      <TimeInput type="second" value={secondValue} setValue={setSecondValue} />
    </div>
  );
}

interface TimeInputProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  type: "hour" | "minute" | "second";
}

function TimeInput({ value, setValue, type }: TimeInputProps) {
  const max = type === "hour" ? 99 : 59;

  const normalize = (num: number): number => {
    if (num > max) return 0;
    if (num < 0) return max;

    return num;
  };

  const handleManualChange = (raw: string) => {
    const parsed = parseInt(raw, 10);

    if (isNaN(parsed)) {
      setValue("0");
      return;
    }

    const normalized = normalize(parsed);
    setValue(String(timePad(normalized)));
  };

  const handleIncrement = () => {
    setValue((prev) => {
      const current = Number(prev) || 0;
      const next = current === max ? 0 : current + 1;

      return String(timePad(next));
    });
  };

  const handleDecrement = () => {
    setValue((prev) => {
      const current = Number(prev) || 0;
      const next = current === 0 ? max : current - 1;

      return String(timePad(next));
    });
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <Button type="button" variant="ghost" size="icon" onClick={handleIncrement}>
        <HugeiconsIcon icon={ChevronUpIcon} />
      </Button>
      <Input
        min={0}
        max={max}
        className={cn(
          "text-2xl! text-center! bg-input! border border-b-2 border-b-primary rounded-lg size-16!",
          type === "hour" && "border-e-0 rounded-e-none",
          type === "minute" && "border-s-0 border-e-0 rounded-s-none rounded-e-none",
          type === "second" && "border-s-0 rounded-s-none"
        )}
        value={value}
        onChange={(e) => handleManualChange(e.target.value)}
      />
      <Button type="button" variant="ghost" size="icon" onClick={handleDecrement}>
        <HugeiconsIcon icon={ChevronDownIcon} />
      </Button>
    </div>
  );
}
