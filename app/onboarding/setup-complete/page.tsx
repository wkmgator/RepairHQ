"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Wrench, ArrowRight, Users, Package, FileText } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function SetupCompletePage() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<{ firstName: string; businessName: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUserInfo = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from("users").select("first_name").eq("id", user.id).single()

        const { data: store } = await supabase
          .from("stores")
          .select("name")
          .eq("owner_id", user.id)
          .eq("is_primary", true)
          .single()

        if (profile && store) {
          setUserInfo({
            firstName: profile.first_name || "there",
            businessName: store.name,
          })
        }
      }
    }

    getUserInfo()
  }, [supabase])

  const handleGetStarted = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Wrench className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">RepairHQ</h1>
          </div>
        </div>

        {/* Success Card */}
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Welcome to RepairHQ{userInfo?.firstName ? `, ${userInfo.firstName}` : ""}!
            </CardTitle>
            <CardDescription className="text-lg">
              {userInfo?.businessName && (
                <>
                  Your account for <strong>{userInfo.businessName}</strong> has been successfully created.
                </>
              )}
              {!userInfo?.businessName && "Your account has been successfully created."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Trial Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">🎉 Your 30-Day Free Trial Starts Now!</h3>
              <p className="text-blue-800 text-sm">
                Explore all features with no limitations. No credit card required during trial.
              </p>
            </div>

            {/* Quick Start Checklist */}
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Start Checklist:</h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium">Add your first customer</p>
                    <p className="text-sm text-gray-600">Start building your customer database</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium">Set up your inventory</p>
                    <p className="text-sm text-gray-600">Add parts and supplies to track stock</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="font-medium">Create your first work order</p>
                    <p className="text-sm text-gray-600">Start tracking repairs and services</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button onClick={handleGetStarted} size="lg" className="w-full">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {/* Support Info */}
            <div className="text-sm text-gray-600">
              <p>Need help getting started?</p>
              <p>
                Check out our{" "}
                <a href="/help" className="text-blue-600 hover:underline">
                  Help Center
                </a>{" "}
                or{" "}
                <a href="/support" className="text-blue-600 hover:underline">
                  contact support
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
