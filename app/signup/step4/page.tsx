"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, ArrowLeft, Loader2, Check, Star } from "lucide-react"
import { planConfigs } from "@/lib/plan-config"

export default function SignupStep4() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState("pro")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user came from previous steps
    const signupData = localStorage.getItem("signup_data")
    if (!signupData) {
      router.push("/signup/step1")
      return
    }

    const data = JSON.parse(signupData)
    if (!data.businessName || !data.firstName) {
      router.push("/signup/step3")
      return
    }
  }, [router])

  const handleContinue = async () => {
    setError("")
    setLoading(true)

    try {
      // Update signup data with plan selection
      const signupData = JSON.parse(localStorage.getItem("signup_data") || "{}")
      const updatedData = {
        ...signupData,
        selectedPlan,
        step: 4,
      }
      localStorage.setItem("signup_data", JSON.stringify(updatedData))

      router.push("/signup/complete")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/signup/step3")
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
        <p className="text-slate-300">Start with a 30-day free trial • No credit card required</p>
      </div>

      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4">
          {Object.values(planConfigs).map((plan) => (
            <Card
              key={plan.name}
              className={`cursor-pointer transition-all border-2 ${
                selectedPlan === plan.name
                  ? "border-green-500 bg-green-500/10"
                  : "border-slate-600 bg-slate-800/50 hover:border-slate-500"
              }`}
              onClick={() => setSelectedPlan(plan.name)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      {plan.displayName}
                      {plan.popular && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Most Popular
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1 text-slate-300">
                      <span className="text-3xl font-bold text-white">${plan.price.monthly}</span>
                      <span className="text-slate-400">/month</span>
                    </CardDescription>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === plan.name ? "border-green-500 bg-green-500" : "border-slate-400 bg-transparent"
                    }`}
                  >
                    {selectedPlan === plan.name && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4 text-slate-300">
                    <div className="flex justify-between">
                      <span>Locations:</span>
                      <span className="font-medium text-white">
                        {plan.limits.locations === "unlimited" ? "Unlimited" : plan.limits.locations}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Users:</span>
                      <span className="font-medium text-white">
                        {plan.limits.users === "unlimited" ? "Unlimited" : plan.limits.users}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customers:</span>
                      <span className="font-medium text-white">
                        {plan.limits.customers === "unlimited" ? "Unlimited" : plan.limits.customers?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage:</span>
                      <span className="font-medium text-white">{plan.limits.storage}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-600">
                    <p className="text-slate-400 text-xs mb-2">Key Features:</p>
                    <ul className="space-y-1">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-slate-300 text-xs">
                          <Check className="w-3 h-3 text-green-400" />
                          {feature}
                        </li>
                      ))}
                      {plan.features.length > 3 && (
                        <li className="text-slate-400 text-xs">+ {plan.features.length - 3} more features</li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trial Info */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <h3 className="font-semibold text-blue-300 mb-2">🎉 30-Day Free Trial</h3>
          <p className="text-blue-200 text-sm">
            Start with a full-featured trial. No credit card required. Cancel anytime during the trial period.
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="flex-1 border-slate-600 text-slate-200 hover:bg-slate-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button
            onClick={handleContinue}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Complete Setup
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
