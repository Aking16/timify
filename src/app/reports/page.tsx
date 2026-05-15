import { Suspense } from "react";

import { SidebarLayout } from "@/components/sidebar/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

import ReportsPageContent from "./components/page-content";
import ReportsRangePicker from "./components/reports-range-picker";

export default async function ReportsPage(props: {
  searchParams?: Promise<{
    startDate?: string;
    endDate?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const startDate = searchParams?.startDate ? new Date(Number(searchParams.startDate)) : undefined;
  const endDate = searchParams?.endDate ? new Date(Number(searchParams.endDate)) : undefined;

  return (
    <SidebarLayout>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
        <div className="flex items-center gap-2 w-full">
          <SidebarTrigger />
          <span>گزارش‌ ها</span>
          <ReportsRangePicker />
        </div>
      </header>
      <main className="p-4 space-y-6">
        <Suspense
          key={`reports-page-suspense-${searchParams?.startDate}-${searchParams?.endDate}`}
          fallback={<div>loading...</div>}
        >
          <ReportsPageContent startDate={startDate} endDate={endDate} />
        </Suspense>
      </main>
    </SidebarLayout>
  );
}
