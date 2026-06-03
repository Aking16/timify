"use client";

import { Moon02Icon, Sun02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

import { useSidebar } from "../ui/sidebar";

const THEME_CYCLE = ["light", "dark"] as const;

export function ThemeSwitcher() {
  const { state } = useSidebar();
  const { resolvedTheme, setTheme } = useTheme();

  function cycleTheme() {
    if (!resolvedTheme) return;

    const currentIndex = THEME_CYCLE.indexOf(resolvedTheme as (typeof THEME_CYCLE)[number]);
    const nextTheme = THEME_CYCLE[(currentIndex + 1) % THEME_CYCLE.length];

    setTheme(nextTheme);
  }

  if (state === "collapsed") return null;

  return (
    <Button
      variant="outline"
      className="rounded-none md:rounded-lg"
      size="icon-lg"
      aria-label={`Current theme: ${resolvedTheme}. Click to cycle themes`}
      onClick={cycleTheme}
    >
      <HugeiconsIcon icon={resolvedTheme === "dark" ? Moon02Icon : Sun02Icon} />
    </Button>
  );
}
