"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Wrench, ArrowRight } from "lucide-react"
import Link from "next/link"
import { verticalGroups, type VerticalGroup, type Vertical } from "@/lib/vertical-groups"
import { planConfigs } from "@/lib/plan-config"
import { onboardingService, type OnboardingData } from "@/lib/onboarding-service"

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<OnboardingData & { password: string; confirmPassword: string }>({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // Business Info
    businessName: "",
    verticalGroup: "Electronics" as VerticalGroup,
    vertical: "Cell Phone Repair" as Vertical,

    // Location Info
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",

    // Plan
    selectedPlan: "starter",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleVerticalGroupChange = (group: VerticalGroup) => {
    setFormData((prev) => ({
      ...prev,
      verticalGroup: group,
      vertical: verticalGroups[group][0], // Set first vertical in group as default
    }))
  }

  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.email) {
          setError("Please fill in all required fields")
          return false
        }
        if (!formData.email.includes("@")) {
          setError("Please enter a valid email address")
          return false
        }
        return true

      case 2:
        if (!formData.password || !formData.confirmPassword) {
          setError("Please enter and confirm your password")
          return false
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match")
          return false
        }
        if (formData.password.length < 8) {
          setError("Password must be at least 8 characters long")
          return false
        }
        return true

      case 3:
        if (!formData.businessName || !formData.verticalGroup || !formData.vertical) {
          setError("Please fill in all business information")
          return false
        }
        return true

      case 4:
        return true // Location info is optional

      case 5:
        if (!formData.selectedPlan) {
          setError("Please select a plan")
          return false
        }
        return true

      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1)
      setError("")
    }
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
    setError("")
  }

  const handleSubmit = async () => {
    if (!validateStep(5)) return

    setLoading(true)
    setError("")

    try {
      const result = await onboardingService.createUserAccount(formData.email, formData.password, formData)

      if (result.success) {
        router.push("/onboarding/setup-complete")
      } else {
        setError(result.error || "Failed to create account")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Personal Information</h2>
              <p className="text-gray-600">Let's start with your basic information</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Create Password</h2>
              <p className="text-gray-600">Choose a secure password for your account</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter a strong password"
                required
              />
              <p className="text-sm text-gray-500">Must be at least 8 characters long</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Business Information</h2>
              <p className="text-gray-600">Tell us about your repair business</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
                placeholder="Acme Repair Shop"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="verticalGroup">Industry Category *</Label>
              <Select
                value={formData.verticalGroup}
                onValueChange={(value) => handleVerticalGroupChange(value as VerticalGroup)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(verticalGroups).map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vertical">Specific Service *</Label>
              <Select value={formData.vertical} onValueChange={(value) => handleInputChange("vertical", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your service type" />
                </SelectTrigger>
                <SelectContent>
                  {verticalGroups[formData.verticalGroup].map((vertical) => (
                    <SelectItem key={vertical} value={vertical}>
                      {vertical}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Business Location</h2>
              <p className="text-gray-600">Where is your business located? (Optional)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="New York"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="NY"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  placeholder="10001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Choose Your Plan</h2>
              <p className="text-gray-600">Start with a 30-day free trial</p>
            </div>

            <div className="grid gap-4">
              {Object.values(planConfigs).map((plan) => (
                <Card
                  key={plan.name}
                  className={`cursor-pointer transition-all ${
                    formData.selectedPlan === plan.name
                      ? "ring-2 ring-blue-500 border-blue-500"
                      : "hover:border-gray-300"
                  } ${plan.popular ? "border-blue-200" : ""}`}
                  onClick={() => handleInputChange("selectedPlan", plan.name)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {plan.displayName}
                          {plan.popular && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              Most Popular
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          <span className="text-2xl font-bold">${plan.price.monthly}</span>
                          <span className="text-gray-500">/month</span>
                        </CardDescription>
                      </div>
                      <input
                        type="radio"
                        checked={formData.selectedPlan === plan.name}
                        onChange={() => handleInputChange("selectedPlan", plan.name)}
                        className="mt-1"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Locations:</span>
                        <span className="font-medium">
                          {plan.limits.locations === "unlimited" ? "Unlimited" : plan.limits.locations}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Users:</span>
                        <span className="font-medium">
                          {plan.limits.users === "unlimited" ? "Unlimited" : plan.limits.users}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Storage:</span>
                        <span className="font-medium">{plan.limits.storage}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Wrench className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">RepairHQ</h1>
          </div>
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNumber <= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {stepNumber}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardContent className="p-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1}>
                Previous
              </Button>

              {step < 5 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-xs text-gray-600 text-center mt-4">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
