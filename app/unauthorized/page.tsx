import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="bg-red-100 p-4 rounded-full mb-6">
        <Shield className="h-12 w-12 text-red-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
      <p className="text-gray-500 max-w-md mb-8">
        You don't have permission to access this page. Please contact your administrator if you believe this is an
        error.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Return Home</Button>
        </Link>
      </div>
    </div>
  )
}
