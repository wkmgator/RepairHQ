import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, MessageSquare, Clock, BarChart3, Tag } from "lucide-react"

export default function AIDashboardLoading() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* AI System Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>AI System Status</CardTitle>
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Features Tabs */}
      <Tabs defaultValue="repair-time" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5">
          <TabsTrigger value="repair-time">
            <Clock className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Repair Time</span>
            <span className="sm:hidden">Time</span>
          </TabsTrigger>
          <TabsTrigger value="diagnostics">
            <Brain className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Diagnostics</span>
            <span className="sm:hidden">Diag</span>
          </TabsTrigger>
          <TabsTrigger value="chatbot">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Chatbot</span>
            <span className="sm:hidden">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="pricing">
            <Tag className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Dynamic Pricing</span>
            <span className="sm:hidden">Price</span>
          </TabsTrigger>
        </TabsList>

        <div className="space-y-4">
          <Skeleton className="h-[600px] w-full" />
        </div>
      </Tabs>
    </div>
  )
}
