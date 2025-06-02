import { Skeleton } from "@/components/ui/skeleton"

export default function NewTicketForIndustryLoading() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-6 w-3/4" />

      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  )
}
