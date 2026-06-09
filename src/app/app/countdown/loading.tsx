import CountdownCardSkeleton from "./components/countdown-card-skeleton";

export default function CountdownLoading() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <CountdownCardSkeleton key={`countdown-card-skeleton-${index}`} />
      ))}
    </div>
  );
}
