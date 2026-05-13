"use client";

import { DailyHoursData } from "@/actions/reports/get-daily-hours";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DailyHoursBarChartProps {
  data: DailyHoursData[];
}

const chartConfig: ChartConfig = {
  hours: {
    label: "ساعت",
    color: "var(--chart-2)",
  },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return format(date, "dd MMM", { locale: faIR });
}

export function DailyHoursBarChart({ data }: DailyHoursBarChartProps) {
  // Calculate average for reference
  const avgHours =
    data.length > 0
      ? Math.round((data.reduce((sum, d) => sum + d.hours, 0) / data.length) * 10) / 10
      : 0;

  return (
    <div className="w-full">
      <ChartContainer config={chartConfig} className="w-full h-75">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 12 }}
            className="fill-muted-foreground"
            interval={Math.floor(data.length / 7)}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            className="fill-muted-foreground"
            tickMargin={24}
            tickFormatter={(value) => `${value}`}
            allowDecimals={false}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            formatter={(value) => `${value} ساعت`}
            labelFormatter={(label) => formatDate(label as string)}
          />
          <Bar dataKey="hours" fill="var(--color-hours)" radius={[8, 8, 0, 0]} name="hours" />
        </BarChart>
      </ChartContainer>
      {data.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            مجموع:{" "}
            <span className="font-medium text-foreground">
              {data.reduce((sum, d) => sum + d.hours, 0).toFixed(1)} ساعت
            </span>
          </span>
          <span>
            میانگین روزانه: <span className="font-medium text-foreground">{avgHours} ساعت</span>
          </span>
        </div>
      )}
    </div>
  );
}
