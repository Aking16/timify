"use client";

import { useState } from "react";

import {
  ExternalLinkIcon,
  Flag03Icon,
  PauseIcon,
  PlayIcon,
  Redo02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useInterval } from "ahooks";

import { Button } from "@/components/ui/button";

import { timeDisplay } from "@/lib/time-display";
import {
  deleteRunningTimerStorage,
  deleteTimeStorage,
  getTimeStorage,
  saveRunningTimerStorage,
  saveTimeStorage,
} from "@/lib/time-local-storage";

import SavedTimeTable from "./components/saved-time-table";

export default function TimerPage() {
  const localTimes = getTimeStorage();

  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(localTimes?.total ?? 0);
  const [savedTimes, setSavedTime] = useState<number[]>(localTimes?.savedTimes ?? []);

  useInterval(
    () => {
      setSeconds((s) => s + 1);
    },
    isRunning ? 1000 : undefined
  );

  const handleStart = () => {
    setIsRunning(true);
    saveRunningTimerStorage({ isRunning: true, seconds: seconds });
  };

  const handleStop = () => {
    setIsRunning(false);
    saveTimeStorage({ total: seconds, savedTimes });
    saveRunningTimerStorage({ isRunning: false, seconds: seconds });
  };

  const handleFlag = () => {
    setSavedTime((prev) => [...prev, seconds]);
    saveTimeStorage({ total: seconds, savedTimes });
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    setSavedTime([]);
    deleteTimeStorage();
    deleteRunningTimerStorage();
  };

  const showPopup = () => {
    saveRunningTimerStorage({ isRunning: isRunning, seconds: seconds });
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center">
      <div className="flex items-start gap-4">
        <p className="text-center text-6xl font-bold tabular-nums tracking-tight">
          {timeDisplay(seconds)}
        </p>
        <Button variant="outline" size="icon" onClick={showPopup}>
          <HugeiconsIcon icon={ExternalLinkIcon} />
        </Button>
      </div>
      <div className="flex items-center justify-center gap-4">
        {isRunning ? (
          <Button size="icon-lg" className="size-14 rounded-full" onClick={handleStop}>
            <HugeiconsIcon icon={PauseIcon} className="size-6 fill-foreground" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon-lg"
            className="size-14 rounded-full"
            onClick={handleStart}
          >
            <HugeiconsIcon icon={PlayIcon} className="fill-foreground size-6" />
          </Button>
        )}
        <Button
          variant="outline"
          size="icon-lg"
          className="size-14 rounded-full"
          disabled={!isRunning}
          onClick={handleFlag}
        >
          <HugeiconsIcon icon={Flag03Icon} className="fill-foreground size-6" />
        </Button>
        <Button
          variant="outline"
          size="icon-lg"
          className="size-14 rounded-full"
          onClick={handleReset}
        >
          <HugeiconsIcon icon={Redo02Icon} className="size-6" />
        </Button>
      </div>
      <SavedTimeTable times={savedTimes} />
    </div>
  );
}
