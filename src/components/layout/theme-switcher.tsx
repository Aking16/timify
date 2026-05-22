"use client";

import { Moon02Icon, Sun02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const THEME_CYCLE = ["light", "dark"] as const;

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();

  function cycleTheme() {
    if (!resolvedTheme) return;

    const currentIndex = THEME_CYCLE.indexOf(resolvedTheme as (typeof THEME_CYCLE)[number]);
    const nextTheme = THEME_CYCLE[(currentIndex + 1) % THEME_CYCLE.length];

    setTheme(nextTheme);
  }

  return (
    <Button
      variant="secondary"
      className="mt-auto justify-start h-fit py-1 rounded-none"
      aria-label={`Current theme: ${resolvedTheme}. Click to cycle themes`}
      onClick={cycleTheme}
    >
      <div className="hidden dark:flex gap-2 items-center [html[data-theme-mode=system]_&]:hidden">
        <HugeiconsIcon icon={Moon02Icon} />
        <div className="flex flex-col items-start">
          <p className="text-sm text-muted-foreground">تم فعلی:</p>
          <p className="text-xs">دارک تم</p>
        </div>
      </div>

      <div className="inline-flex dark:hidden gap-2 items-center [html[data-theme-mode=system]_&]:hidden">
        <HugeiconsIcon icon={Sun02Icon} />
        <div className="flex flex-col items-start">
          <p className="text-sm text-muted-foreground">تم فعلی:</p>
          <p className="text-xs">لایت تم</p>
        </div>
      </div>
    </Button>
  );
}
