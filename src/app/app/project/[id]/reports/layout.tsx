import { Suspense } from "react";

import { SidebarLayout } from "@/components/sidebar/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

import ReportsRangePicker from "./components/reports-range-picker";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarLayout>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
        <div className="flex items-center gap-2 w-full">
          <SidebarTrigger />
          <span>گزارش‌ ها</span>
          <Suspense fallback={<Skeleton className="w-60 h-8 ms-auto" />}>
            <ReportsRangePicker />
          </Suspense>
        </div>
      </header>
      <main className="p-4 ">{children}</main>
    </SidebarLayout>
  );
}
