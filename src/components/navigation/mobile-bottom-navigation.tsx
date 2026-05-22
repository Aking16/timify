import { bottomNavItems } from "@/data/navigation-data";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { buttonVariants } from "../ui/button";
import { BottomStartTimer } from "./bottom-start-timer";

export default function MobileBottomNavigation() {
  return (
    <div className="fixed bottom-0 right-0 z-10 bg-background w-full md:hidden">
      <div className="flex justify-between items-center relative">
        {bottomNavItems.map((item) => (
          <Link
            key={`bottom-navigation-link-${item.title}`}
            href={item.href}
            className={cn(
              "grow h-20! p-0! flex-col aspect-square rounded-none!",
              buttonVariants({ variant: "ghost" })
            )}
          >
            <HugeiconsIcon icon={item.icon} />
            {item.title}
          </Link>
        ))}
        <BottomStartTimer />
      </div>
    </div>
  );
}
