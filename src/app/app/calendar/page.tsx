import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import CalendarPageContent from "./components/calendar-page-content";

export default function CalendarPage() {
  return (
    <Suspense
      fallback={<Skeleton className="h-[650px] w-full rounded-xl" />}
    >
      <CalendarPageContent />
    </Suspense>
  );
}
