"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Loader2, ArrowRight } from "lucide-react"
import { onboardingService } from "@/lib/onboarding-service"

export default function SignupComplete() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const completeSignup = async () => {
      try {
        const signupData = localStorage.getItem("signup_data")
        if (!signupData) {
          router.push("/signup/step1")
          return
        }

        const data = JSON.parse(signupData)

        // Validate all required data is present
        if (!data.userId || !data.email || !data.selectedPlan || !data.verticalGroup || !data.vertical) {
          setError("Missing required signup information. Please start over.")
          return
        }

        // Create the complete user account and store
        const result = await onboardingService.createUserAccount(data.email, "", {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          businessName: data.businessName,
          verticalGroup: data.verticalGroup,
          vertical: data.vertical,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
          selectedPlan: data.selectedPlan,
        })

        if (result.success) {
          setSuccess(true)
          // Clear signup data
          localStorage.removeItem("signup_data")
        } else {
          setError(result.error || "Failed to complete account setup")
        }
      } catch (err) {
        setError("An unexpected error occurred during setup")
      } finally {
        setLoading(false)
      }
    }

    completeSignup()
  }, [router])

  const handleGetStarted = () => {
    router.push("/dashboard")
  }

  if (loading) {
    return (
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-green-500" />
        <h2 className="text-2xl font-bold">Setting up your account...</h2>
        <p className="text-slate-300">This will just take a moment</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/signup/step1")} className="w-full">
          Start Over
        </Button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center space-y-6">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <div>
          <h2 className="text-3xl font-bold mb-2">Welcome to RepairHQ! 🎉</h2>
          <p className="text-slate-300 text-lg">Your account has been successfully created</p>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 space-y-3">
          <h3 className="font-semibold text-green-300">Your 30-Day Free Trial is Active!</h3>
          <p className="text-green-200 text-sm">
            Explore all features with no limitations. No credit card required during trial.
          </p>
        </div>

        <div className="space-y-4 text-left">
          <h3 className="font-semibold text-slate-200">Quick Start Checklist:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                1
              </div>
              <span className="text-slate-200">Add your first customer</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                2
              </div>
              <span className="text-slate-200">Set up your inventory</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                3
              </div>
              <span className="text-slate-200">Create your first work order</span>
            </div>
          </div>
        </div>

        <Button onClick={handleGetStarted} size="lg" className="w-full bg-green-600 hover:bg-green-700">
          Get Started with RepairHQ
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <p className="text-xs text-slate-400">
          Need help?{" "}
          <a href="/support" className="text-green-400 hover:text-green-300">
            Contact our support team
          </a>
        </p>
      </div>
    )
  }

  return null
}
