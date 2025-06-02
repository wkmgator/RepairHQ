import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function NewAutomotiveTicketLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-4 w-[400px] mt-2" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[250px]" />
          <Skeleton className="h-4 w-[350px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Skeleton className="h-[300px] w-full" />
              </div>
              <div>
                <Skeleton className="h-[300px] w-full" />
              </div>
            </div>

            <Skeleton className="h-10 w-[150px] ml-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
