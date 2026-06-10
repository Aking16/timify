import { LayoutEntry } from "./utils";
import EntryBlock from "./entry-block";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface DayColumnProps {
  layouts: LayoutEntry[];
}

export default function DayColumn({ layouts }: DayColumnProps) {
  return (
    <div className="relative border-l border-border/30 last:border-l-0">
      <div className="flex flex-col">
        {HOURS.map((i) => (
          <div key={i} className="h-12 border-t border-border/30" />
        ))}
      </div>

      {layouts.length > 0 && (
        <div className="absolute inset-0">
          {layouts.map((layout) => (
            <EntryBlock key={layout.entry.id} layout={layout} />
          ))}
        </div>
      )}
    </div>
  );
}
