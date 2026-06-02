import { retrieveProject } from "@/actions/projects/retrieve-project";
import { getReports } from "@/actions/reports/get-daily-hours";

import { DailyHoursBarChart } from "@/components/charts/daily-hours-bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import SummaryCards from "./summary-cards";

export default async function ReportsPageContent({
  id,
  startDate,
  endDate,
}: {
  id: string;
  startDate?: Date;
  endDate?: Date;
}) {
  const dailyHoursData = await getReports(id, startDate, endDate);
  const project = await retrieveProject(id);

  return (
    <div className="space-y-6">
      <SummaryCards dailyHoursData={dailyHoursData} project={project} />
      <Card>
        <CardHeader>
          <CardTitle>ساعت های کاری روزانه</CardTitle>
        </CardHeader>
        <CardContent>
          {dailyHoursData.length > 0 ? (
            <DailyHoursBarChart data={dailyHoursData} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p>داده‌ای برای نمایش وجود ندارد</p>
              <p className="text-sm">زمانی که فعالیتی ثبت کنید، در اینجا نمایش داده می‌شود</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
