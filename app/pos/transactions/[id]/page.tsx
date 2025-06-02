import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase-pos"
import { notFound } from "next/navigation"
import TransactionDetailsComponent from "./TransactionDetailsClient"

export const metadata: Metadata = {
  title: "Transaction Details - RepairHQ",
  description: "View transaction details and receipt",
}

async function getTransaction(id: string) {
  const supabase = createServerSupabaseClient()

  const { data: transaction, error } = await supabase
    .from("pos_transactions")
    .select(`
      *,
      customer:customers(id, first_name, last_name, email, phone),
      employee:profiles(id, first_name, last_name),
      items:pos_transaction_items(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching transaction:", error)
    return null
  }

  return transaction
}

export default async function TransactionDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const transaction = await getTransaction(params.id)

  if (!transaction) {
    notFound()
  }

  return <TransactionDetailsComponent transaction={transaction} />
}
