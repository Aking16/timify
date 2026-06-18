import { getTags } from "@/actions/tags/get-tags";
import { getTimeEntries } from "@/actions/time-entries/get-time-entry";

import { StartTimer } from "@/components/sidebar/start-timer";

import EntryCard from "./components/entry-card";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const timeEntries = await getTimeEntries(id);
  const tags = await getTags();

  if (timeEntries.length === 0) {
    return (
      <div className="max-w-sm mx-auto space-y-2">
        <p className="text-center text-muted-foreground">هیچ تسکی یافت نشد!</p>
        <StartTimer />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {timeEntries.map((item) => (
        <EntryCard key={`time-entry-task-${item.id}`} timeEntries={item} tags={tags} />
      ))}
    </div>
  );
}
