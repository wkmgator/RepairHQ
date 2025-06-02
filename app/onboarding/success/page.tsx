"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Wrench, ArrowRight } from "lucide-react"

export default function OnboardingSuccessPage() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleContinue = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Welcome to RepairHQ!</CardTitle>
          <CardDescription className="text-lg">
            Your account has been successfully set up and your subscription is active.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <Wrench className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-medium text-green-800">
                {userProfile?.business_name || "Your repair shop"} is ready to go!
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">What's next?</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">1</span>
                </div>
                <div>
                  <p className="font-medium">Set up your first store location</p>
                  <p className="text-sm text-gray-600">Add your store details and operating hours</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">2</span>
                </div>
                <div>
                  <p className="font-medium">Add your first customer</p>
                  <p className="text-sm text-gray-600">Start building your customer database</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">3</span>
                </div>
                <div>
                  <p className="font-medium">Set up your inventory</p>
                  <p className="text-sm text-gray-600">Add parts and supplies to track stock levels</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">4</span>
                </div>
                <div>
                  <p className="font-medium">Create your first work order</p>
                  <p className="text-sm text-gray-600">Start managing repair tickets and invoices</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={handleContinue} className="w-full bg-blue-600 hover:bg-blue-700">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {sessionId && <div className="text-center text-sm text-gray-500">Session ID: {sessionId}</div>}
        </CardContent>
      </Card>
    </div>
  )
}
