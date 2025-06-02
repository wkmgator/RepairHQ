export function generateSKU(category: string, brand: string, name: string): string {
  const categoryCode = category.substring(0, 3).toUpperCase()
  const brandCode = brand ? brand.substring(0, 2).toUpperCase() : "XX"
  const nameCode = name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 3)
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")

  return `${categoryCode}-${brandCode}-${nameCode}-${random}`
}

export function getStockStatus(item: { quantity: number; minStockLevel: number }): string {
  if (item.quantity === 0) return "out_of_stock"
  if (item.quantity <= item.minStockLevel) return "low_stock"
  return "in_stock"
}

export function getStockStatusColor(status: string): string {
  switch (status) {
    case "in_stock":
      return "bg-green-100 text-green-800 border-green-200"
    case "low_stock":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "out_of_stock":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function calculateReorderPoint(avgDailyUsage: number, leadTimeDays: number, safetyStock = 0): number {
  return Math.ceil(avgDailyUsage * leadTimeDays + safetyStock)
}

export function calculateInventoryTurnover(costOfGoodsSold: number, averageInventoryValue: number): number {
  if (averageInventoryValue === 0) return 0
  return costOfGoodsSold / averageInventoryValue
}

export function getInventoryCategories(): string[] {
  return [
    "Screen Parts",
    "Battery",
    "Charging Port",
    "Camera",
    "Speaker",
    "Microphone",
    "Tools",
    "Adhesives",
    "Cables",
    "Cases",
    "Other",
  ]
}

export function getPopularBrands(): string[] {
  return ["Apple", "Samsung", "Google", "OnePlus", "Huawei", "Xiaomi", "LG", "Sony", "Motorola", "Nokia", "Other"]
}

export const inventoryStatuses = [
  { value: "in_stock", label: "In Stock", color: "green" },
  { value: "low_stock", label: "Low Stock", color: "orange" },
  { value: "out_of_stock", label: "Out of Stock", color: "red" },
]
