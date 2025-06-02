import type { Metadata } from "next"
import { POSOfflineTester } from "@/components/pos-offline-tester"

export const metadata: Metadata = {
  title: "POS Offline Testing - RepairHQ",
  description: "Test the offline functionality of the Point of Sale system",
}

export default function POSOfflineTestPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">POS Offline Mode Testing</h1>
      <POSOfflineTester />
    </div>
  )
}
