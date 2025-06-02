export default function UsageLoading() {
  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-8 w-64 bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-96 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
      </div>

      <div className="h-24 bg-muted rounded animate-pulse"></div>

      <div className="h-10 w-96 bg-muted rounded animate-pulse"></div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
        ))}
      </div>

      <div className="h-64 bg-muted rounded animate-pulse"></div>
    </div>
  )
}
