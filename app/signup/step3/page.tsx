"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, ArrowLeft, Loader2, Building, MapPin } from "lucide-react"

export default function SignupStep3() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  })
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
    if (!data.verticalGroup || !data.vertical) {
      router.push("/signup/step2")
      return
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.businessName) {
      setError("Please fill in all required fields")
      return false
    }
    return true
  }

  const handleContinue = async () => {
    setError("")

    if (!validateForm()) return

    setLoading(true)

    try {
      // Update signup data with business information
      const signupData = JSON.parse(localStorage.getItem("signup_data") || "{}")
      const updatedData = {
        ...signupData,
        ...formData,
        step: 3,
      }
      localStorage.setItem("signup_data", JSON.stringify(updatedData))

      router.push("/signup/step4")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/signup/step2")
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Tell Us About Your Business</h2>
        <p className="text-slate-300">We'll use this information to set up your account</p>
      </div>

      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Personal Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Building className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-semibold text-slate-200">Personal Information</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-slate-200">
                First Name *
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="John"
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-slate-200">
                Last Name *
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Doe"
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessName" className="text-slate-200">
              Business Name *
            </Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => handleInputChange("businessName", e.target.value)}
              placeholder="Acme Repair Shop"
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-200">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="(555) 123-4567"
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Business Location */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-semibold text-slate-200">Business Location (Optional)</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-slate-200">
              Street Address
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="123 Main Street"
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-slate-200">
                City
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="New York"
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-slate-200">
                State
              </Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="NY"
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-slate-200">
                ZIP Code
              </Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                placeholder="10001"
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country" className="text-slate-200">
                Country
              </Label>
              <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="US" className="text-white hover:bg-slate-700">
                    United States
                  </SelectItem>
                  <SelectItem value="CA" className="text-white hover:bg-slate-700">
                    Canada
                  </SelectItem>
                  <SelectItem value="UK" className="text-white hover:bg-slate-700">
                    United Kingdom
                  </SelectItem>
                  <SelectItem value="AU" className="text-white hover:bg-slate-700">
                    Australia
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
            Continue to Plan Selection
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
