import { Skeleton } from "@/components/ui/skeleton";

export default function PlanosLoading() {
  return (
    <div className="container mx-auto space-y-12 py-16">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}
