import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilLoading() {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <Skeleton className="h-7 w-20 mb-1" />
      <Skeleton className="h-4 w-40 mb-6" />
      <Skeleton className="h-3 w-24 mb-3" />
      <div className="rounded-xl border px-4 py-3 mb-4">
        <Skeleton className="h-5 w-36 mb-1" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-9 w-full rounded-md" />
    </div>
  );
}
