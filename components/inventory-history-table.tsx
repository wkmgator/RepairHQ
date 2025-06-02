"use client"

import { Badge } from "@/components/ui/badge"

interface InventoryTransaction {
  id: string
  item_id: string
  user_id: string
  transaction_type: string
  quantity: number
  previous_quantity: number
  new_quantity: number
  reason: string
  notes?: string
  created_at: string
}

interface InventoryHistoryTableProps {
  history: InventoryTransaction[]
}

export function InventoryHistoryTable({ history }: InventoryHistoryTableProps) {
  if (history.length === 0) {
    return <div className="text-center py-8 text-gray-500">No stock history available for this item.</div>
  }

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "add":
        return { label: "Stock Added", color: "bg-green-100 text-green-800" }
      case "remove":
        return { label: "Stock Removed", color: "bg-red-100 text-red-800" }
      case "set":
        return { label: "Stock Set", color: "bg-blue-100 text-blue-800" }
      default:
        return { label: type, color: "bg-gray-100 text-gray-800" }
    }
  }

  const getReasonLabel = (reason: string) => {
    const reasons: Record<string, string> = {
      purchase: "New Purchase",
      return: "Customer Return",
      damaged: "Damaged/Defective",
      loss: "Lost/Stolen",
      correction: "Inventory Correction",
      sale: "Sale",
      transfer: "Location Transfer",
      other: "Other",
    }
    return reasons[reason] || reason
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium">Date</th>
            <th className="text-left py-3 px-4 font-medium">Transaction</th>
            <th className="text-left py-3 px-4 font-medium">Quantity</th>
            <th className="text-left py-3 px-4 font-medium">Stock Level</th>
            <th className="text-left py-3 px-4 font-medium">Reason</th>
            <th className="text-left py-3 px-4 font-medium">Notes</th>
          </tr>
        </thead>
        <tbody>
          {history.map((transaction) => (
            <tr key={transaction.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4 text-sm">{new Date(transaction.created_at).toLocaleString()}</td>
              <td className="py-3 px-4">
                <Badge className={getTransactionTypeLabel(transaction.transaction_type).color}>
                  {getTransactionTypeLabel(transaction.transaction_type).label}
                </Badge>
              </td>
              <td className="py-3 px-4">
                {transaction.transaction_type === "add" && `+${transaction.quantity}`}
                {transaction.transaction_type === "remove" && `-${transaction.quantity}`}
                {transaction.transaction_type === "set" && `=${transaction.quantity}`}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">{transaction.previous_quantity}</span>
                  <span className="text-gray-400">→</span>
                  <span className="font-medium">{transaction.new_quantity}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-sm">{getReasonLabel(transaction.reason)}</td>
              <td className="py-3 px-4 text-sm text-gray-500">{transaction.notes || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
