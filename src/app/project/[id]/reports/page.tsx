import { Suspense } from "react";

import ReportsPageContent from "./components/page-content";

export default async function ReportsPage({
  searchParams,
  params,
}: {
  searchParams?: Promise<{
    startDate?: string;
    endDate?: string;
  }>;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const startDate = sp?.startDate ? new Date(Number(sp.startDate)) : undefined;
  const endDate = sp?.endDate ? new Date(Number(sp.endDate)) : undefined;

  return (
    <div className="space-y-6">
      <Suspense
        key={`reports-page-suspense-${sp?.startDate}-${sp?.endDate}`}
        fallback={<div>loading...</div>}
      >
        <ReportsPageContent id={id} startDate={startDate} endDate={endDate} />
      </Suspense>
    </div>
  );
}
