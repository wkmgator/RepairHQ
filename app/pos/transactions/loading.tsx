import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function TransactionsLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <Card>
          <CardHeader className="pb-0">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
