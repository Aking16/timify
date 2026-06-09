import { getCountdowns } from "@/actions/countdowns/get-countdowns";

import CountdownCard from "./components/countdown-card";
import CreateCountdownDialog from "./components/create-countdown-dialog";

export default async function CountdownPage() {
  const countdowns = await getCountdowns();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">شمارش معکوس</h2>
        <CreateCountdownDialog />
      </div>
      {countdowns.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p>هیچ شمارش معکوسی وجود ندارد</p>
          <p className="mt-2 text-sm">یک شمارش معکوس جدید بسازید</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {countdowns.map((item) => (
            <CountdownCard key={`countdown-card-${item.updatedAt}`} countdown={item} />
          ))}
        </div>
      )}
    </div>
  );
}
