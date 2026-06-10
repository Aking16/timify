"use client";

import { useState } from "react";

import { countdowns } from "@/db/schema";
import { MoreVerticalIcon, PauseIcon, PlayIcon, Redo02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useInterval } from "ahooks";
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { timeDisplay } from "@/lib/time-display";

import DeleteCountdownDialog from "./delete-countdown-dialog";
import EditCountdownDialog from "./edit-countdown-dialog";

interface CountdownCardProps {
  countdown: typeof countdowns.$inferSelect;
}

const chartConfig = {
  remaining: {
    label: "باقی‌مانده",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function CountdownCard({ countdown }: CountdownCardProps) {
  const [remaining, setRemaining] = useState(countdown.duration);
  const [isRunning, setIsRunning] = useState(false);

  // Real-time countdown: tick down every second when running
  useInterval(
    () => {
      setRemaining((prev) => {
        const next = Math.max(0, prev - 1);
        if (next === 0) setIsRunning(false);

        return next;
      });
    },
    isRunning && remaining > 0 ? 1000 : undefined
  );

  function handleStart() {
    setIsRunning(true);
    const formData = new FormData();
    formData.set("id", countdown.id);
  }

  function handlePause() {
    setIsRunning(false);
    const formData = new FormData();
    formData.set("id", countdown.id);
  }

  function handleReset() {
    setIsRunning(false);
    setRemaining(countdown.duration);
    const formData = new FormData();
    formData.set("id", countdown.id);
  }

  const isCompleted = remaining === 0;
  const progress = countdown.duration > 0 ? remaining / countdown.duration : 0;
  const endAngle = 360 * progress;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">{countdown.title ?? "شمارش معکوس"}</CardTitle>
        <CardDescription className="sr-only">{`${countdown.title} شمارش معکوس`}</CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" title="مشاهده بیشتر">
                <HugeiconsIcon icon={MoreVerticalIcon} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                <EditCountdownDialog {...countdown} />
                <DeleteCountdownDialog {...countdown} />
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-62">
          <RadialBarChart
            data={[{ remaining: remaining, fill: "var(--chart-1)" }]}
            startAngle={0}
            endAngle={endAngle}
            outerRadius={90}
            innerRadius={80}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[90, 80]}
            />
            <RadialBar dataKey="remaining" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {timeDisplay(remaining)}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-center gap-3">
        {isRunning ? (
          <Button
            variant="default"
            size="icon-lg"
            className="size-12 rounded-full"
            onClick={handlePause}
          >
            <HugeiconsIcon icon={PauseIcon} className="size-5 fill-foreground" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon-lg"
            className="size-12 rounded-full"
            onClick={handleStart}
            disabled={isCompleted}
          >
            <HugeiconsIcon icon={PlayIcon} className="size-5 fill-foreground" />
          </Button>
        )}
        <Button
          variant="outline"
          size="icon-lg"
          className="size-12 rounded-full"
          onClick={handleReset}
        >
          <HugeiconsIcon icon={Redo02Icon} className="size-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
