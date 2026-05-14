import { Skeleton } from "@/components/ui/skeleton";

export default function RecetteLoading() {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <Skeleton className="h-4 w-16 mb-4" />
      <Skeleton className="h-7 w-40 mb-1" />
      <Skeleton className="h-4 w-32 mb-5" />

      {/* Parameters grid */}
      <Skeleton className="h-3 w-20 mb-3" />
      <div className="grid grid-cols-2 gap-2 mb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border px-4 py-3">
            <Skeleton className="h-3 w-14 mb-1" />
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>

      {/* Steps */}
      <Skeleton className="h-3 w-16 mb-3" />
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-6 w-6 rounded-full shrink-0" />
            <div className="flex-1 flex flex-col gap-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
