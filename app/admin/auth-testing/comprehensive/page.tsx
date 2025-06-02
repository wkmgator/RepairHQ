import { Suspense } from "react"
import { AuthTestExecutor } from "@/components/auth-test-executor"

export default function ComprehensiveAuthTestingPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Comprehensive Authentication Testing</h1>
        <p className="text-muted-foreground">
          Execute a complete test suite to verify all authentication flows, route protection, and security measures
        </p>
      </div>

      <Suspense fallback={<div>Loading authentication test suite...</div>}>
        <AuthTestExecutor />
      </Suspense>
    </div>
  )
}
