"use client";

import { useMemo } from "react";

import { TimeEntryWithRelations } from "@/actions/time-entries/get-time-entries-by-range";
import { addDays, format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";

import { Skeleton } from "@/components/ui/skeleton";

import DayColumn from "./day-column";
import {
  getEntryDuration,
  groupEntriesByDay,
  layoutDayEntries,
  type LayoutEntry,
} from "./utils";
import WeekSummary from "./week-summary";

interface WeekGridProps {
  weekStart: Date;
  entries: TimeEntryWithRelations[];
  isLoading?: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function WeekGrid({ weekStart, entries, isLoading }: WeekGridProps) {
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const entriesByDay = useMemo(() => groupEntriesByDay(entries, days), [entries, days]);

  const layoutByDay = useMemo(() => {
    const map = new Map<string, LayoutEntry[]>();
    for (const day of days) {
      const dayStr = format(day, "yyyy-MM-dd");
      map.set(dayStr, layoutDayEntries(entriesByDay.get(dayStr) ?? [], day));
    }
    return map;
  }, [entriesByDay, days]);

  const dailyTotals = useMemo(() => {
    return days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      return (entriesByDay.get(dayStr) ?? []).reduce(
        (sum, e) => sum + getEntryDuration(e),
        0
      );
    });
  }, [entriesByDay, days]);

  const weekTotal = dailyTotals.reduce((sum, t) => sum + t, 0);

  if (isLoading) {
    return <Skeleton className="h-[650px] w-full rounded-xl" />;
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card" dir="ltr">
      <div className="grid grid-cols-[4rem_repeat(7,1fr)] border-b">
        <div />
        {days.map((day) => (
          <div key={day.toISOString()} className="py-2 text-center">
            <div className="text-sm font-medium">{format(day, "EEEE", { locale: faIR })}</div>
            <div className="text-xs text-muted-foreground">{format(day, "d")}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[4rem_repeat(7,1fr)]">
        <div className="flex flex-col">
          {HOURS.map((i) => (
            <div
              key={i}
              className="flex h-12 items-start justify-end border-t border-border/30 px-1.5 pt-1 text-xs text-muted-foreground"
            >
              {i.toString().padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {days.map((day) => {
          const dayStr = format(day, "yyyy-MM-dd");
          return <DayColumn key={day.toISOString()} layouts={layoutByDay.get(dayStr) ?? []} />;
        })}
      </div>

      <WeekSummary dailyTotals={dailyTotals} weekTotal={weekTotal} />
    </div>
  );
}
