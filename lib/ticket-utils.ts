export const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "in_progress":
      return "bg-blue-100 text-blue-800"
    case "waiting_for_parts":
      return "bg-purple-100 text-purple-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-800"
    case "high":
      return "bg-orange-100 text-orange-800"
    case "medium":
      return "bg-blue-100 text-blue-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const calculateDaysOpen = (createdAt: Date) => {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - createdAt.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
