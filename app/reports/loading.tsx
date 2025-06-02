import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsLoading() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-4 w-[450px]" />
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics" className="mt-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-8 w-[250px]" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-full" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-[300px] w-full" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="financial" className="mt-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-8 w-[250px]" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-full" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
                <Skeleton className="h-[300px] w-full" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
