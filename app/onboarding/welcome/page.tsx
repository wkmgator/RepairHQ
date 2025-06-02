"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Smartphone, Users, Wrench, BarChart3 } from "lucide-react"

export default function WelcomePage() {
  const { userProfile } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to RepairHQ!",
      description: "You're all set up and ready to start managing your repair business.",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Your Plan is Active",
      description: `You're on the ${userProfile?.plan.name} with a 30-day free trial.`,
      icon: Smartphone,
      color: "text-blue-600",
    },
    {
      title: "What's Next?",
      description: "Let's get your repair business up and running with these key features.",
      icon: ArrowRight,
      color: "text-purple-600",
    },
  ]

  const features = [
    {
      icon: Wrench,
      title: "Create Repair Tickets",
      description: "Track repairs from intake to completion",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Users,
      title: "Manage Customers",
      description: "Store customer information and history",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: BarChart3,
      title: "View Analytics",
      description: "Monitor your business performance",
      color: "bg-purple-100 text-purple-600",
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/dashboard")
    }
  }

  const handleSkip = () => {
    router.push("/dashboard")
  }

  if (!userProfile) {
    return <div>Loading...</div>
  }

  const currentStepData = steps[currentStep]
  const StepIcon = currentStepData.icon

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 rounded-full ${index <= currentStep ? "bg-blue-600" : "bg-gray-200"}`}
            />
          ))}
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className={`p-3 rounded-full bg-gray-100`}>
                <StepIcon className={`h-8 w-8 ${currentStepData.color}`} />
              </div>
            </div>
            <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
            <CardDescription className="text-lg">{currentStepData.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentStep === 0 && (
              <div className="text-center space-y-4">
                <div className="p-6 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Account Created Successfully!</h3>
                  <p className="text-green-700">
                    Welcome to RepairHQ, {userProfile.firstName}! Your account for{" "}
                    <strong>{userProfile.businessName}</strong> is ready to go.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="p-6 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-blue-900">Your Current Plan</h3>
                    <Badge className="bg-blue-600">{userProfile.plan.name}</Badge>
                  </div>
                  <div className="grid gap-3">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Monthly Price:</span>
                      <span className="font-semibold text-blue-900">${userProfile.plan.price}/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Trial Period:</span>
                      <span className="font-semibold text-blue-900">30 days free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Trial Ends:</span>
                      <span className="font-semibold text-blue-900">
                        {userProfile.subscription.trialEndDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-600">
                  You'll need to add a payment method before your trial ends to continue using RepairHQ.
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className={`p-2 rounded-lg ${feature.color}`}>
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">💡 Pro Tip</h4>
                  <p className="text-yellow-800 text-sm">
                    Start by creating your first repair ticket to get familiar with the system. You can always add more
                    features later!
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handleSkip}>
                Skip to Dashboard
              </Button>
              <Button onClick={handleNext}>
                {currentStep < steps.length - 1 ? "Next" : "Go to Dashboard"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
