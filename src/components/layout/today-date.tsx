"use client";

import { useState } from "react";

import { useInterval } from "ahooks";
import { format } from "date-fns-jalali";

import { useMounted } from "@/hooks/use-mounted";

import { Clock } from "../animate-ui/icons/clock";

export default function TodayDate() {
  const isMounted = useMounted();
  const [today, setToday] = useState<Date | null>();

  useInterval(() => {
    setToday(new Date());
  }, 1000);

  if (!isMounted) return null;
  if (!today) return null;

  return (
    <div className="flex items-center gap-2">
      <Clock className="size-5 text-primary" animateOnView loop />
      <p>{format(today, "E MMMM d، hh:mm B")}</p>
    </div>
  );
}
