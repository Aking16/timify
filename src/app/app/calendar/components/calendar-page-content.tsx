"use client";

import { useCallback, useMemo, useState } from "react";

import { getProjects } from "@/actions/projects/get-projects";
import { getTimeEntriesByRange } from "@/actions/time-entries/get-time-entries-by-range";
import { addWeeks, startOfWeek, subWeeks } from "date-fns-jalali";
import useSWR from "swr";

import FilterBar from "./filter-bar";
import WeekGrid from "./week-grid";
import WeekNavigation from "./week-navigation";

export default function CalendarPageContent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [projectId, setProjectId] = useState<string>("all");
  const [billable, setBillable] = useState<string>("all");
  const [weekPickerOpen, setWeekPickerOpen] = useState(false);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const weekEndDisplay = new Date(weekStart);
  weekEndDisplay.setDate(weekEndDisplay.getDate() + 6);

  const { data: entries, isLoading } = useSWR(
    ["time-entries-range", weekStart.getTime()],
    ([, startTime]) => getTimeEntriesByRange(new Date(startTime), weekEnd),
    { revalidateOnFocus: false }
  );

  const { data: projects } = useSWR("projects", () => getProjects(), {
    revalidateOnFocus: false,
  });

  const filteredEntries = useMemo(() => {
    if (!entries) return [];

    return entries.filter((e) => {
      if (projectId !== "all" && e.projectId !== projectId) return false;
      if (billable === "billable" && !e.billable) return false;
      if (billable === "non-billable" && e.billable) return false;
      return true;
    });
  }, [entries, projectId, billable]);

  const goToPreviousWeek = useCallback(() => setCurrentDate((d) => subWeeks(d, 1)), []);
  const goToNextWeek = useCallback(() => setCurrentDate((d) => addWeeks(d, 1)), []);
  const goToCurrentWeek = useCallback(() => {
    setCurrentDate(new Date());
    setWeekPickerOpen(false);
  }, []);
  const handleWeekSelect = useCallback((date: Date | undefined) => {
    if (!date) return;
    setCurrentDate(date);
    setWeekPickerOpen(false);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <WeekNavigation
        weekStart={weekStart}
        weekEndDisplay={weekEndDisplay}
        weekPickerOpen={weekPickerOpen}
        onPreviousWeek={goToPreviousWeek}
        onNextWeek={goToNextWeek}
        onCurrentWeek={goToCurrentWeek}
        onWeekSelect={handleWeekSelect}
        onWeekPickerOpenChange={setWeekPickerOpen}
      />

      <FilterBar
        projectId={projectId}
        billable={billable}
        projects={projects}
        onProjectChange={setProjectId}
        onBillableChange={setBillable}
        onClear={() => {
          setProjectId("all");
          setBillable("all");
        }}
      />

      <WeekGrid weekStart={weekStart} entries={filteredEntries} isLoading={isLoading} />
    </div>
  );
}
