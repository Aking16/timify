import { getDailyHours } from "@/actions/reports/get-daily-hours";

import { DailyHoursBarChart } from "@/components/charts/daily-hours-bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ReportsPageContent({
  id,
  startDate,
  endDate,
}: {
  id: string;
  startDate?: Date;
  endDate?: Date;
}) {
  const dailyHoursData = await getDailyHours(id, startDate, endDate);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">کل ساعات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dailyHoursData.reduce((sum, d) => sum + d.hours, 0).toFixed(1)} ساعت
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">روزهای فعال</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyHoursData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              میانگین روزانه
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dailyHoursData.length > 0
                ? (
                    dailyHoursData.reduce((sum, d) => sum + d.hours, 0) / dailyHoursData.length
                  ).toFixed(1)
                : 0}{" "}
              ساعت
            </div>
          </CardContent>
        </Card>
      </div>

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
