import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogueLoading() {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <Skeleton className="h-8 w-24 mb-6" />
      {[1, 2].map((section) => (
        <div key={section} className="mb-6">
          <Skeleton className="h-4 w-20 mb-3" />
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-xl border px-4 py-3 flex items-center justify-between"
              >
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-44" />
                </div>
                <Skeleton className="h-5 w-8 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
