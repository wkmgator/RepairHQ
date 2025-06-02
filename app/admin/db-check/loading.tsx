import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingDbCheckPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-72 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="p-6 pt-0 space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="flex items-center p-6 pt-0">
              <Skeleton className="h-9 w-36" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
