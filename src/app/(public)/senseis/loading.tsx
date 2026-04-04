import { Skeleton } from "@/components/ui/skeleton";

export default function SenseisLoading() {
  return (
    <div className="container mx-auto space-y-12 py-16">
      <Skeleton className="h-64 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
