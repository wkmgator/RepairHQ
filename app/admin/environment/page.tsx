import type { Metadata } from "next"
import EnvConfigChecker from "@/components/env-config-checker"

export const metadata: Metadata = {
  title: "Environment Configuration | RepairHQ Admin",
  description: "Configure and test environment variables for RepairHQ",
}

export default function EnvironmentConfigPage() {
  return (
    <div className="container mx-auto py-10">
      <EnvConfigChecker />
    </div>
  )
}
