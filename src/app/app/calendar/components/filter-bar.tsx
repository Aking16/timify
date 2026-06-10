import { BankIcon, FilterIcon, Folder01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { projects } from "@/db/schema";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface FilterBarProps {
  projectId: string;
  billable: string;
  projects: (typeof projects.$inferSelect)[] | undefined;
  onProjectChange: (value: string) => void;
  onBillableChange: (value: string) => void;
  onClear: () => void;
}

export default function FilterBar({
  projectId,
  billable,
  projects: projectList,
  onProjectChange,
  onBillableChange,
  onClear,
}: FilterBarProps) {
  const hasActiveFilters = projectId !== "all" || billable !== "all";

  return (
    <div className="flex items-center gap-3">
      <HugeiconsIcon icon={FilterIcon} className="size-4 text-muted-foreground" />
      <Select value={projectId} onValueChange={onProjectChange}>
        <SelectTrigger className="w-44">
          <HugeiconsIcon icon={Folder01Icon} data-icon="inline-start" />
          <SelectValue placeholder="همه پروژه‌ها" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">همه پروژه‌ها</SelectItem>
          {projectList?.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              <div className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: p.color ?? "#3b82f6" }}
                />
                {p.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ToggleGroup
        type="single"
        value={billable}
        onValueChange={(v) => onBillableChange(v ?? "all")}
        variant="outline"
      >
        <ToggleGroupItem value="all">همه</ToggleGroupItem>
        <ToggleGroupItem value="billable">
          <HugeiconsIcon icon={BankIcon} data-icon="inline-start" />
          قابل پرداخت
        </ToggleGroupItem>
        <ToggleGroupItem value="non-billable">غیر قابل پرداخت</ToggleGroupItem>
      </ToggleGroup>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          پاک کردن فیلترها
        </Button>
      )}
    </div>
  );
}
