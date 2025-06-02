import { UsageDashboard } from "@/components/usage-dashboard"

export const metadata = {
  title: "Usage & Plan Limits | RepairHQ",
  description: "Monitor your usage and plan limits",
}

export default function UsagePage() {
  return (
    <div className="container mx-auto py-10">
      <UsageDashboard />
    </div>
  )
}
