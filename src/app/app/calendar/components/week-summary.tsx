import { timeDisplay } from "@/lib/time-display";

interface WeekSummaryProps {
  dailyTotals: number[];
  weekTotal: number;
}

export default function WeekSummary({ dailyTotals, weekTotal }: WeekSummaryProps) {
  return (
    <>
      <div className="grid grid-cols-[4rem_repeat(7,1fr)] border-t bg-muted/30">
        <div className="p-2 pr-3 text-xs font-medium">مجموع</div>
        {dailyTotals.map((total, i) => (
          <div key={i} className="p-2 text-center text-xs font-medium tabular-nums" dir="ltr">
            {timeDisplay(total)}
          </div>
        ))}
      </div>

      {weekTotal > 0 && (
        <div className="flex items-center justify-end gap-2 border-t px-4 py-2 text-sm text-muted-foreground">
          <span>مجموع هفته:</span>
          <span className="font-medium text-foreground tabular-nums" dir="ltr">
            {timeDisplay(weekTotal)}
          </span>
        </div>
      )}
    </>
  );
}
