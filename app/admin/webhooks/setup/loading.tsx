import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function WebhookSetupLoading() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>

      <Skeleton className="h-20 w-full" />

      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div>
              <Skeleton className="h-4 w-40 mb-2" />
              <div className="space-y-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-6 w-40" />
              </div>
            </div>

            <div>
              <Skeleton className="h-4 w-36 mb-2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
