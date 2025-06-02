"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import { verticalGroups, type VerticalGroup, type Vertical } from "@/lib/vertical-groups"

export default function SignupStep2() {
  const router = useRouter()
  const [verticalGroup, setVerticalGroup] = useState<VerticalGroup>("Electronics")
  const [vertical, setVertical] = useState<Vertical>("Cell Phone Repair")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user came from step 1
    const signupData = localStorage.getItem("signup_data")
    if (!signupData) {
      router.push("/signup/step1")
      return
    }
  }, [router])

  const handleVerticalGroupChange = (group: VerticalGroup) => {
    setVerticalGroup(group)
    setVertical(verticalGroups[group][0]) // Set first vertical in group as default
  }

  const handleContinue = async () => {
    setError("")
    setLoading(true)

    try {
      // Update signup data with vertical selection
      const signupData = JSON.parse(localStorage.getItem("signup_data") || "{}")
      const updatedData = {
        ...signupData,
        verticalGroup,
        vertical,
        step: 2,
      }
      localStorage.setItem("signup_data", JSON.stringify(updatedData))

      router.push("/signup/step3")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/signup/step1")
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">What Type of Business Do You Run?</h2>
        <p className="text-slate-300">Help us customize RepairHQ for your specific industry</p>
      </div>

      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verticalGroup" className="text-slate-200 text-lg">
              Industry Category
            </Label>
            <Select value={verticalGroup} onValueChange={handleVerticalGroupChange}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white h-12">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {Object.keys(verticalGroups).map((group) => (
                  <SelectItem key={group} value={group} className="text-white hover:bg-slate-700">
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vertical" className="text-slate-200 text-lg">
              Specific Service Type
            </Label>
            <Select value={vertical} onValueChange={(value) => setVertical(value as Vertical)}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white h-12">
                <SelectValue placeholder="Select your service type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {verticalGroups[verticalGroup].map((verticalOption) => (
                  <SelectItem key={verticalOption} value={verticalOption} className="text-white hover:bg-slate-700">
                    {verticalOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
          <h3 className="font-semibold text-green-400 mb-2">Your Selection:</h3>
          <p className="text-slate-200">
            <span className="font-medium">{verticalGroup}</span> → <span className="font-medium">{vertical}</span>
          </p>
          <p className="text-sm text-slate-400 mt-2">
            We'll customize your dashboard and features specifically for {vertical.toLowerCase()} businesses.
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
            Continue to Business Info
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
