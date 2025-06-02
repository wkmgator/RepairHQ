import { Skeleton } from "@/components/ui/skeleton"

export default function StripeProductionLoading() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-96" />
        <Skeleton className="h-4 w-64" />
      </div>

      <Skeleton className="h-12 w-full" />

      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  )
}
