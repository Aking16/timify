/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

import { useInterval } from "ahooks";

import { calculateDuration, formatDuration } from "@/lib/calculate-duration";

export function useRealtimeDuration(
  startTime: Date | null,
  isRunning: boolean,
  staticDuration?: number | null
) {
  const [duration, setDuration] = useState<string | number>(() =>
    isRunning
      ? calculateDuration({ startTime, showFormatted: true })
      : formatDuration(staticDuration ?? 0)
  );

  // Update duration when staticDuration changes (for non‑running entries)
  useEffect(() => {
    if (!isRunning) {
      setDuration(formatDuration(staticDuration ?? 0));
    }
  }, [staticDuration, isRunning]);

  // Use ahooks useInterval – automatically pauses when delay is undefined
  useInterval(
    () => {
      if (startTime) {
        const newDuration = calculateDuration({
          startTime,
          showFormatted: true,
        });
        setDuration(newDuration);
      }
    },
    isRunning ? 1000 : undefined
  );

  return duration;
}
