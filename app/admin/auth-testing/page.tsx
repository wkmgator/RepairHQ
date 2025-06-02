import { Suspense } from "react"
import { AuthTestingClient } from "./auth-testing-client"

export default function AuthTestingPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Authentication Testing Dashboard</h1>
        <p className="text-muted-foreground">Verify all authentication flows and protected routes</p>
      </div>

      <Suspense fallback={<div>Loading authentication tests...</div>}>
        <AuthTestingClient />
      </Suspense>
    </div>
  )
}
