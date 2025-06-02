import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase-pos"
import RegisterManagement from "@/components/register-management"

export const metadata: Metadata = {
  title: "Register Management - RepairHQ",
  description: "Manage your POS registers and terminals",
}

async function getRegisters() {
  const supabase = createServerSupabaseClient()

  const { data: registers, error } = await supabase.from("pos_registers").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching registers:", error)
    return { registers: [] }
  }

  return { registers: registers || [] }
}

export default async function RegistersPage() {
  const { registers } = await getRegisters()

  return <RegisterManagement initialRegisters={registers} />
}
