import { Skeleton } from "@/components/ui/skeleton"

export default function PushTestLoading() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Skeleton className="h-8 w-64 mb-6" />
      <Skeleton className="h-[600px] w-full rounded-lg" />
    </div>
  )
}
