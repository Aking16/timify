"use client";

import { useEffect, useState } from "react";

import { ArrowUpRightIcon, CancelIcon, TimerIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useInterval } from "ahooks";
import Link from "next/link";

import { timeDisplay } from "@/lib/time-display";
import { deleteRunningTimerStorage, getRunningTimerStorage } from "@/lib/time-local-storage";
import { cn } from "@/lib/utils";

import { useMounted } from "@/hooks/use-mounted";

import { Button } from "../ui/button";

export default function TimerPopup() {
  const isMounted = useMounted();

  const [runningTimer, setRunningTimer] = useState(getRunningTimerStorage());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleLecturesUpdate = () => {
      const updatedRunningTimer = getRunningTimerStorage();
      setRunningTimer(updatedRunningTimer);
      if (updatedRunningTimer) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("runningTimerUpdated", handleLecturesUpdate);
    return () => {
      window.removeEventListener("runningTimerUpdated", handleLecturesUpdate);
    };
  }, []);

  useInterval(
    () => {
      setRunningTimer((prev) => {
        if (!prev) return prev;

        return { ...prev, seconds: prev.seconds + 1 };
      });
    },
    runningTimer?.isRunning ? 1000 : undefined
  );

  if (!isMounted) return null;
  if (!runningTimer && !isVisible) return null;

  const animationClass = isVisible ? "animate-slide-up" : "animate-slide-down";

  return (
    <div
      className={cn(
        "fixed bottom-0 inset-e-0 z-50 m-4 bg-card/70 backdrop-blur-2xl px-4 py-2 space-y-1 rounded-lg border shadow-xl w-48",
        animationClass
      )}
    >
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <HugeiconsIcon icon={TimerIcon} className="size-4" />
          زمان سنج
        </p>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => {
            setIsVisible(false);
            setTimeout(deleteRunningTimerStorage, 300);
          }}
        >
          <HugeiconsIcon icon={CancelIcon} />
        </Button>
      </div>
      <p className="text-center text-3xl font-bold tabular-nums tracking-tight my-3">
        {timeDisplay(runningTimer?.seconds ?? 0)}
      </p>
      <Button variant="secondary" className="w-full" asChild>
        <Link href="/app/timer">
          <HugeiconsIcon icon={ArrowUpRightIcon} />
          برو به زمان سنج
        </Link>
      </Button>
    </div>
  );
}
