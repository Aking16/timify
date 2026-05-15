"use server";

import { db } from "@/db";
import { timeEntries } from "@/db/schema";
import { and, gte, lte } from "drizzle-orm";

export interface DailyHoursData {
  date: string;
  hours: number;
}

export async function getDailyHours(startDate?: Date, endDate?: Date): Promise<DailyHoursData[]> {
  const now = new Date();
  const defaultStartDate = new Date(now);
  defaultStartDate.setDate(now.getDate() - 30); // Last 30 days by default

  const start = startDate ?? defaultStartDate;
  const end = endDate ?? now;

  // Get all time entries within the date range
  const entries = await db
    .select()
    .from(timeEntries)
    .where(and(gte(timeEntries.startTime, start), lte(timeEntries.startTime, end)));

  // Group by date and calculate total hours
  const dailyMap = new Map<string, number>();

  for (const entry of entries) {
    if (!entry.startTime) continue;

    // Get the date string (YYYY-MM-DD)
    const dateStr = entry.startTime.toISOString().split("T")[0];

    let seconds = 0;

    if (entry.isRunning) {
      // For running entries, calculate from start time to now
      const startTimestamp = new Date(entry.startTime).getTime();
      const nowTimestamp = Date.now();
      seconds = Math.floor((nowTimestamp - startTimestamp) / 1000);
    } else if (entry.duration) {
      // Use the stored duration for completed entries
      seconds = entry.duration;
    } else if (entry.endTime) {
      // Calculate duration from start and end times
      const startTimestamp = new Date(entry.startTime).getTime();
      const endTimestamp = new Date(entry.endTime).getTime();
      seconds = Math.floor((endTimestamp - startTimestamp) / 1000);
    }

    // Add to the daily total
    const current = dailyMap.get(dateStr) ?? 0;
    dailyMap.set(dateStr, current + seconds);
  }

  // Convert to array with hours (divide seconds by 3600)
  const result: DailyHoursData[] = Array.from(dailyMap.entries())
    .map(([date, totalSeconds]) => ({
      date,
      hours: Math.round((totalSeconds / 3600) * 100) / 100, // Round to 2 decimal places
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return result;
}
