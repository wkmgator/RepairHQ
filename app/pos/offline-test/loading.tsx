import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function POSOfflineTestLoading() {
  return (
    <div className="container mx-auto py-6">
      <Skeleton className="h-10 w-[300px] mb-6" />

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[250px] mb-2" />
          <Skeleton className="h-4 w-[350px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Skeleton className="h-4 w-[150px]" />
          <div className="space-x-2">
            <Skeleton className="h-10 w-[100px] inline-block" />
            <Skeleton className="h-10 w-[150px] inline-block" />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
