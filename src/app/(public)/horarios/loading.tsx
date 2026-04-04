import { Skeleton } from "@/components/ui/skeleton";

export default function HorariosLoading() {
  return (
    <div className="container mx-auto space-y-8 py-16">
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
