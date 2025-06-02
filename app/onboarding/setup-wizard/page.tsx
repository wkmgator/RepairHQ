"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseClient } from "@/lib/supabase"
import { RepairVertical, getVerticalConfig } from "@/lib/industry-verticals"
import { Building2, MapPin, Users, CreditCard, Settings, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"

interface BusinessInfo {
  businessName: string
  businessType: RepairVertical
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  website: string
  description: string
}

interface TeamMember {
  name: string
  email: string
  role: string
  permissions: string[]
}

interface PaymentSettings {
  acceptCash: boolean
  acceptCard: boolean
  acceptCheck: boolean
  taxRate: number
  currency: string
}

const steps = [
  { id: 1, title: "Business Information", icon: Building2 },
  { id: 2, title: "Location & Contact", icon: MapPin },
  { id: 3, title: "Team Setup", icon: Users },
  { id: 4, title: "Payment Settings", icon: CreditCard },
  { id: 5, title: "Final Configuration", icon: Settings },
]

export default function SetupWizardPage() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    businessName: "",
    businessType: RepairVertical.GENERAL_REPAIR,
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    website: "",
    description: "",
  })
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    acceptCash: true,
    acceptCard: false,
    acceptCheck: false,
    taxRate: 8.25,
    currency: "USD",
  })

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = async () => {
    setIsLoading(true)
    try {
      const supabase = getSupabaseClient()

      // Save business information
      const { error: businessError } = await supabase.from("business_settings").upsert({
        business_name: businessInfo.businessName,
        business_type: businessInfo.businessType,
        address: businessInfo.address,
        city: businessInfo.city,
        state: businessInfo.state,
        zip_code: businessInfo.zipCode,
        phone: businessInfo.phone,
        email: businessInfo.email,
        website: businessInfo.website,
        description: businessInfo.description,
        setup_completed: true,
        updated_at: new Date().toISOString(),
      })

      if (businessError) throw businessError

      // Save payment settings
      const { error: paymentError } = await supabase.from("payment_settings").upsert({
        accept_cash: paymentSettings.acceptCash,
        accept_card: paymentSettings.acceptCard,
        accept_check: paymentSettings.acceptCheck,
        tax_rate: paymentSettings.taxRate,
        currency: paymentSettings.currency,
        updated_at: new Date().toISOString(),
      })

      if (paymentError) throw paymentError

      // Save team members
      if (teamMembers.length > 0) {
        const { error: teamError } = await supabase.from("team_members").insert(
          teamMembers.map((member) => ({
            name: member.name,
            email: member.email,
            role: member.role,
            permissions: member.permissions,
            status: "invited",
            created_at: new Date().toISOString(),
          })),
        )

        if (teamError) throw teamError
      }

      // Save user preferences
      localStorage.setItem("repairhq_vertical", businessInfo.businessType)
      localStorage.setItem("repairhq_setup_completed", "true")

      toast({
        title: "Setup Complete!",
        description: "Your RepairHQ system is ready to use.",
      })

      // Redirect to dashboard
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Setup error:", error)
      toast({
        title: "Setup Error",
        description: "There was an error completing setup. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addTeamMember = () => {
    setTeamMembers([
      ...teamMembers,
      {
        name: "",
        email: "",
        role: "technician",
        permissions: ["view_tickets", "edit_tickets"],
      },
    ])
  }

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index))
  }

  const updateTeamMember = (index: number, field: keyof TeamMember, value: any) => {
    const updated = [...teamMembers]
    updated[index] = { ...updated[index], [field]: value }
    setTeamMembers(updated)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={businessInfo.businessName}
                onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
                placeholder="Enter your business name"
              />
            </div>

            <div>
              <Label htmlFor="businessType">Business Type *</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {Object.values(RepairVertical).map((vertical) => {
                  const config = getVerticalConfig(vertical)
                  return (
                    <Button
                      key={vertical}
                      variant={businessInfo.businessType === vertical ? "default" : "outline"}
                      className="justify-start h-auto p-4"
                      onClick={() => setBusinessInfo({ ...businessInfo, businessType: vertical })}
                    >
                      <div className="text-left">
                        <div className="font-medium">{config.name}</div>
                        <div className="text-xs text-muted-foreground">{config.description}</div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                value={businessInfo.description}
                onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
                placeholder="Describe your business and services"
                rows={3}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                value={businessInfo.address}
                onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={businessInfo.city}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={businessInfo.state}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, state: e.target.value })}
                  placeholder="State"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={businessInfo.zipCode}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, zipCode: e.target.value })}
                  placeholder="12345"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={businessInfo.phone}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Business Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={businessInfo.email}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                  placeholder="contact@business.com"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={businessInfo.website}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
                  placeholder="https://www.business.com"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Team Members</h3>
                <p className="text-sm text-muted-foreground">Add team members who will use the system</p>
              </div>
              <Button onClick={addTeamMember}>Add Member</Button>
            </div>

            {teamMembers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No team members added yet</p>
                <p className="text-sm">You can add team members later in settings</p>
              </div>
            ) : (
              <div className="space-y-4">
                {teamMembers.map((member, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={member.name}
                            onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                            placeholder="Team member name"
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={member.email}
                            onChange={(e) => updateTeamMember(index, "email", e.target.value)}
                            placeholder="email@example.com"
                          />
                        </div>
                        <div>
                          <Label>Role</Label>
                          <select
                            className="w-full p-2 border rounded"
                            value={member.role}
                            onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                          >
                            <option value="technician">Technician</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                            <option value="cashier">Cashier</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <Button variant="destructive" onClick={() => removeTeamMember(index)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={paymentSettings.acceptCash}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, acceptCash: e.target.checked })}
                  />
                  <span>Accept Cash Payments</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={paymentSettings.acceptCard}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, acceptCard: e.target.checked })}
                  />
                  <span>Accept Credit/Debit Cards</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={paymentSettings.acceptCheck}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, acceptCheck: e.target.checked })}
                  />
                  <span>Accept Checks</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  value={paymentSettings.taxRate}
                  onChange={(e) =>
                    setPaymentSettings({ ...paymentSettings, taxRate: Number.parseFloat(e.target.value) })
                  }
                  placeholder="8.25"
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  className="w-full p-2 border rounded"
                  value={paymentSettings.currency}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, currency: e.target.value })}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Setup Complete!</h3>
              <p className="text-muted-foreground">Review your configuration and finish setup</p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Business Name:</strong> {businessInfo.businessName}
                    </div>
                    <div>
                      <strong>Type:</strong> {getVerticalConfig(businessInfo.businessType).name}
                    </div>
                    <div>
                      <strong>Address:</strong> {businessInfo.address}, {businessInfo.city}, {businessInfo.state}{" "}
                      {businessInfo.zipCode}
                    </div>
                    <div>
                      <strong>Phone:</strong> {businessInfo.phone}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  {teamMembers.length === 0 ? (
                    <p className="text-muted-foreground">No team members added</p>
                  ) : (
                    <div className="space-y-2">
                      {teamMembers.map((member, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>
                            {member.name} ({member.email})
                          </span>
                          <Badge>{member.role}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Payment Methods:</strong>
                      <div className="mt-1">
                        {paymentSettings.acceptCash && <Badge className="mr-1">Cash</Badge>}
                        {paymentSettings.acceptCard && <Badge className="mr-1">Card</Badge>}
                        {paymentSettings.acceptCheck && <Badge className="mr-1">Check</Badge>}
                      </div>
                    </div>
                    <div>
                      <strong>Tax Rate:</strong> {paymentSettings.taxRate}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to RepairHQ</h1>
          <p className="text-muted-foreground">Let's set up your repair business in just a few steps</p>
        </div>

        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-4">
            {steps.map((step) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span className={`text-xs text-center ${isActive ? "font-medium" : "text-muted-foreground"}`}>
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
            <CardDescription>
              Step {currentStep} of {steps.length}
            </CardDescription>
          </CardHeader>
          <CardContent>{renderStep()}</CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep === steps.length ? (
            <Button onClick={handleFinish} disabled={isLoading}>
              {isLoading ? "Setting up..." : "Finish Setup"}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
