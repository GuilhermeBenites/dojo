import { Skeleton } from "@/components/ui/skeleton";

export default function GaleriaLoading() {
  return (
    <div className="container mx-auto columns-1 gap-4 space-y-4 py-16 sm:columns-2 lg:columns-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton
          key={i}
          className={`w-full rounded-xl ${i % 3 === 0 ? "h-64" : "h-48"}`}
        />
      ))}
    </div>
  );
}
