import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function IndustrySettingsLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-64" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array(10)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
            </div>

            <div className="flex justify-end">
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <div className="flex flex-wrap gap-2">
                      {Array(5)
                        .fill(0)
                        .map((_, j) => (
                          <Skeleton key={j} className="h-6 w-20" />
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
