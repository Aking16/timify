import { ArrowLeft01Icon, ArrowRight01Icon, CalendarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface WeekNavigationProps {
  weekStart: Date;
  weekEndDisplay: Date;
  weekPickerOpen: boolean;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
  onWeekSelect: (date: Date | undefined) => void;
  onWeekPickerOpenChange: (open: boolean) => void;
}

export default function WeekNavigation({
  weekStart,
  weekEndDisplay,
  weekPickerOpen,
  onPreviousWeek,
  onNextWeek,
  onCurrentWeek,
  onWeekSelect,
  onWeekPickerOpenChange,
}: WeekNavigationProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onPreviousWeek}>
          <HugeiconsIcon icon={ArrowRight01Icon} />
        </Button>
        <Button variant="outline" size="icon" onClick={onNextWeek}>
          <HugeiconsIcon icon={ArrowLeft01Icon} />
        </Button>
        <Button variant="outline" size="sm" onClick={onCurrentWeek}>
          این هفته
        </Button>
      </div>

      <Popover open={weekPickerOpen} onOpenChange={onWeekPickerOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start px-2.5 font-normal">
            <HugeiconsIcon icon={CalendarIcon} />
            {format(weekStart, "d MMMM", { locale: faIR })} —{" "}
            {format(weekEndDisplay, "d MMMM yyyy", { locale: faIR })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            defaultMonth={weekStart}
            selected={weekStart}
            onSelect={onWeekSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
