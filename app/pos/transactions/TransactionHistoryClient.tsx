"use client"
import type { POSTransaction } from "@/lib/supabase-pos"
import TransactionHistory from "@/components/transaction-history"

interface TransactionHistoryClientProps {
  initialTransactions: POSTransaction[]
  totalCount: number
  currentPage: number
}

export default function TransactionHistoryClient({
  initialTransactions,
  totalCount,
  currentPage,
}: TransactionHistoryClientProps) {
  return (
    <TransactionHistory initialTransactions={initialTransactions} totalCount={totalCount} currentPage={currentPage} />
  )
}
