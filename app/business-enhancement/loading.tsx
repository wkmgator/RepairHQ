export default function BusinessEnhancementLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="animate-pulse space-y-6">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>

        <div className="h-12 bg-gray-200 rounded"></div>

        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>

        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}
