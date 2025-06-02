import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function POSLoading() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Cart Section */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />

                <div className="h-[40vh] rounded-md border">
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-36" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Section */}
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <div className="flex space-x-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-10 w-full" />
              <div className="rounded-md bg-gray-100 p-2">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </div>

            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
