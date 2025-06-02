"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlanSelector } from "@/components/plan-selector"
import { Loader2, Wrench, ArrowRight, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Plan } from "@/lib/supabase-types"

export default function OnboardingPage() {
  const { user, userProfile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [mounted, setMounted] = useState(false)

  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    website: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push("/auth/signin")
    }
  }, [user, authLoading, router, mounted])

  useEffect(() => {
    if (userProfile?.business_name) {
      setBusinessInfo((prev) => ({
        ...prev,
        businessName: userProfile.business_name || "",
      }))
    }
  }, [userProfile])

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleBusinessInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase
        .from("users")
        .update({
          business_name: businessInfo.businessName,
          address: businessInfo.address,
          city: businessInfo.city,
          state: businessInfo.state,
          zip_code: businessInfo.zipCode,
          phone: businessInfo.phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      setCurrentStep(2)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handlePlanSelection = async () => {
    if (!selectedPlan) {
      setError("Please select a plan")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Create Stripe checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          billingCycle,
          businessName: businessInfo.businessName,
        }),
      })

      const { url, error } = await response.json()

      if (error) throw new Error(error)

      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (err: any) {
      setError(err.message || "An error occurred")
      setLoading(false)
    }
  }

  const renderStep1 = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wrench className="h-6 w-6 mr-2 text-blue-600" />
          Tell us about your business
        </CardTitle>
        <CardDescription>Help us set up your repair shop management system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBusinessInfoSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              value={businessInfo.businessName}
              onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
              placeholder="Acme Repair Shop"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={businessInfo.address}
              onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
              placeholder="123 Main Street"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={businessInfo.city}
                onChange={(e) => setBusinessInfo({ ...businessInfo, city: e.target.value })}
                placeholder="New York"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={businessInfo.state}
                onChange={(e) => setBusinessInfo({ ...businessInfo, state: e.target.value })}
                placeholder="NY"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={businessInfo.zipCode}
                onChange={(e) => setBusinessInfo({ ...businessInfo, zipCode: e.target.value })}
                placeholder="10001"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={businessInfo.phone}
                onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                placeholder="(555) 123-4567"
                disabled={loading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue to Plan Selection
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )

  const renderStep2 = () => (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
        <p className="text-gray-600 mb-6">Select the plan that best fits your repair shop's needs</p>

        <Tabs value={billingCycle} onValueChange={(value) => setBillingCycle(value as "monthly" | "yearly")}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">
              Yearly
              <Badge variant="secondary" className="ml-2">
                Save 20%
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <PlanSelector onPlanSelect={setSelectedPlan} selectedPlan={selectedPlan} billingCycle={billingCycle} />

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => setCurrentStep(1)} disabled={loading}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button
          onClick={handlePlanSelection}
          disabled={!selectedPlan || loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue to Payment
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${currentStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                1
              </div>
              <span className="ml-2 font-medium">Business Info</span>
            </div>
            <div className={`w-8 h-0.5 ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
            <div className={`flex items-center ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                2
              </div>
              <span className="ml-2 font-medium">Choose Plan</span>
            </div>
          </div>
        </div>

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
      </div>
    </div>
  )
}
