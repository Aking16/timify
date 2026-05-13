import { getTimeEntries } from "@/actions/time-entries/get-time-entry";

import EntryCard from "./components/entry-card";

export default async function Test() {
  const timeEntries = await getTimeEntries();

  return (
    <div className="grid grid-cols-4 gap-4">
      {timeEntries.map((item) => (
        <EntryCard key={`time-entry-task-${item.id}`} {...item} />
      ))}
    </div>
  );
}
