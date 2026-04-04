import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="flex flex-col gap-0">
      <Skeleton className="h-[70vh] w-full rounded-none" />
      <div className="container mx-auto grid grid-cols-1 gap-6 py-16 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
