"use client";

import { useEffect, useState } from "react";

import { ArrowUpRightIcon, CancelIcon, TimerIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useInterval } from "ahooks";
import Link from "next/link";

import { timeDisplay } from "@/lib/time-display";
import {
  deleteRunningCountdownStorage,
  getRunningCountdownStorage,
} from "@/lib/time-local-storage";
import { cn } from "@/lib/utils";

import { useMounted } from "@/hooks/use-mounted";

import { Button } from "../ui/button";

export default function CountdownPopup() {
  const isMounted = useMounted();

  const [runningCountdown, setRunningCountdown] = useState(getRunningCountdownStorage());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleCountdownUpdate = () => {
      const updatedRunningCountdown = getRunningCountdownStorage();
      setRunningCountdown(updatedRunningCountdown);
      if (updatedRunningCountdown) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("runningCountdownUpdated", handleCountdownUpdate);
    return () => {
      window.removeEventListener("runningCountdownUpdated", handleCountdownUpdate);
    };
  }, []);

  useInterval(
    () => {
      setRunningCountdown((prev) => {
        if (!prev || !prev.isRunning) return prev;

        const nextRemaining = Math.max(0, prev.remaining - 1);
        if (nextRemaining === 0) {
          return { ...prev, remaining: 0, isRunning: false };
        }

        return { ...prev, remaining: nextRemaining };
      });
    },
    runningCountdown?.isRunning ? 1000 : undefined
  );

  if (!isMounted) return null;
  if (!runningCountdown && !isVisible) return null;

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
          شمارش معکوس
        </p>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => {
            setIsVisible(false);
            setTimeout(deleteRunningCountdownStorage, 300);
          }}
        >
          <HugeiconsIcon icon={CancelIcon} />
        </Button>
      </div>
      <p className="text-center text-sm text-bold truncate mt-3">{runningCountdown?.title}</p>
      <p className="text-center text-3xl font-bold tabular-nums tracking-tight mb-3">
        {timeDisplay(runningCountdown?.remaining ?? 0)}
      </p>
      <Button variant="secondary" className="w-full" asChild>
        <Link href="/app/countdown">
          <HugeiconsIcon icon={ArrowUpRightIcon} />
          برو به شمارش معکوس
        </Link>
      </Button>
    </div>
  );
}
