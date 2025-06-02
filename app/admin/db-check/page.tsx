import type { Metadata } from "next"
import DbStatusChecker from "@/components/db-status-checker"

export const metadata: Metadata = {
  title: "Database Health Check | RepairHQ Admin",
  description: "Verify database connection status and configuration for RepairHQ.",
}

export default function DatabaseCheckPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <DbStatusChecker />
    </div>
  )
}
