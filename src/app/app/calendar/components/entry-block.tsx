import { formatEntryDuration, getEntryDuration, LayoutEntry } from "./utils";

interface EntryBlockProps {
  layout: LayoutEntry;
}

export default function EntryBlock({ layout }: EntryBlockProps) {
  const entry = layout.entry;
  const duration = getEntryDuration(entry);
  const projectColor = entry.project?.color ?? "#006045";

  return (
    <div
      className="absolute rounded border px-1 py-0.5 overflow-hidden"
      style={{
        top: `${Math.max(0, layout.top)}%`,
        height: `${Math.max(1.5, layout.height)}%`,
        minHeight: "20px",
        left: `${layout.left}%`,
        width: `${layout.width}%`,
        backgroundColor: `${projectColor}20`,
        borderColor: `${projectColor}40`,
      }}
    >
      <div className="flex h-full items-center gap-1 text-xs">
        {entry.title && <span className="truncate font-medium">{entry.title}</span>}
        <span className="shrink-0 text-muted-foreground tabular-nums" dir="ltr">
          {formatEntryDuration(duration)}
        </span>
      </div>
    </div>
  );
}
