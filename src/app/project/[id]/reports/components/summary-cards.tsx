import { DailyHoursData } from "@/actions/reports/get-daily-hours";
import { projects } from "@/db/schema";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Toman from "@/components/ui/toman";

interface SummaryCardsProps {
  dailyHoursData: DailyHoursData[];
  project: typeof projects.$inferSelect;
}

export default function SummaryCards({ dailyHoursData, project }: SummaryCardsProps) {
  const totalHours = dailyHoursData.reduce((sum, d) => sum + d.hours, 0).toFixed(1);
  const sumHourlyRate = (project.hourlyRate ?? 0) * Number(totalHours);

  return (
    <div className="grid gap-4 md:grid-cols-6">
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">کل ساعات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalHours} ساعت</div>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">روزهای فعال</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dailyHoursData.length}</div>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
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
      <Card className="md:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            نرخ ساعتی پروژه
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Toman price={project.hourlyRate ?? 0} iconScale={1.5} className="text-2xl font-bold" />
        </CardContent>
      </Card>
      <Card className="md:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            مجموع نرخ ساعتی
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Toman price={sumHourlyRate} iconScale={1.5} className="text-2xl font-bold" />
        </CardContent>
      </Card>
    </div>
  );
}
