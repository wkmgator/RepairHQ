import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-10 text-center">
        <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-2/3 mx-auto" />
      </div>

      <Skeleton className="h-12 w-full mb-8" />

      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="mb-8">
            <Skeleton className="h-16 w-full mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array(8)
                .fill(0)
                .map((_, j) => (
                  <Skeleton key={j} className="h-32 w-full" />
                ))}
            </div>
          </div>
        ))}
    </div>
  )
}
