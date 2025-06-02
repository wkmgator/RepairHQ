"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  GraduationCap,
  Building,
  Monitor,
  PartyPopper,
  Users,
  Calendar,
  Phone,
  Mail,
} from "lucide-react"

interface OnboardingStep {
  id: string
  step: string
  title: string
  description: string
  status: "pending" | "in_progress" | "completed" | "blocked"
  order: number
  estimated_days: number
  assigned_to?: string
  due_date?: string
  completed_date?: string
  notes?: string
  checklist: ChecklistItem[]
}

interface ChecklistItem {
  id: string
  title: string
  completed: boolean
  required: boolean
}

interface FranchiseOnboarding {
  franchise_id: string
  franchise_name: string
  franchisee_name: string
  franchisee_email: string
  franchisee_phone: string
  start_date: string
  target_completion: string
  overall_progress: number
  current_step: string
  steps: OnboardingStep[]
}

export function FranchiseOnboardingWorkflow() {
  const { toast } = useToast()
  const [onboardingData, setOnboardingData] = useState<FranchiseOnboarding[]>([])
  const [selectedFranchise, setSelectedFranchise] = useState<FranchiseOnboarding | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOnboardingData()
  }, [])

  const fetchOnboardingData = async () => {
    try {
      setIsLoading(true)
      // Mock data - replace with actual API call
      const mockData: FranchiseOnboarding[] = [
        {
          franchise_id: "1",
          franchise_name: "Downtown Mobile Repair",
          franchisee_name: "John Smith",
          franchisee_email: "john@example.com",
          franchisee_phone: "(555) 123-4567",
          start_date: "2024-01-15",
          target_completion: "2024-03-15",
          overall_progress: 65,
          current_step: "location_setup",
          steps: [
            {
              id: "1",
              step: "contract_signed",
              title: "Contract Signing",
              description: "Complete franchise agreement and legal documentation",
              status: "completed",
              order: 1,
              estimated_days: 7,
              completed_date: "2024-01-20",
              checklist: [
                { id: "1", title: "Franchise agreement signed", completed: true, required: true },
                { id: "2", title: "Initial franchise fee paid", completed: true, required: true },
                { id: "3", title: "Background check completed", completed: true, required: true },
                { id: "4", title: "Financial verification", completed: true, required: true },
              ],
            },
            {
              id: "2",
              step: "initial_training",
              title: "Initial Training Program",
              description: "Complete comprehensive franchise training program",
              status: "completed",
              order: 2,
              estimated_days: 14,
              completed_date: "2024-02-05",
              checklist: [
                { id: "1", title: "Business operations training", completed: true, required: true },
                { id: "2", title: "Technical repair training", completed: true, required: true },
                { id: "3", title: "Customer service training", completed: true, required: true },
                { id: "4", title: "Marketing and sales training", completed: true, required: true },
                { id: "5", title: "Training assessment passed", completed: true, required: true },
              ],
            },
            {
              id: "3",
              step: "location_setup",
              title: "Location Setup",
              description: "Prepare and setup the franchise location",
              status: "in_progress",
              order: 3,
              estimated_days: 21,
              assigned_to: "Setup Team",
              due_date: "2024-02-28",
              checklist: [
                { id: "1", title: "Lease agreement signed", completed: true, required: true },
                { id: "2", title: "Store design approved", completed: true, required: true },
                { id: "3", title: "Equipment ordered", completed: true, required: true },
                { id: "4", title: "Renovation completed", completed: false, required: true },
                { id: "5", title: "Equipment installed", completed: false, required: true },
                { id: "6", title: "Signage installed", completed: false, required: true },
                { id: "7", title: "Inventory stocked", completed: false, required: true },
              ],
            },
            {
              id: "4",
              step: "system_training",
              title: "System Training",
              description: "Learn RepairHQ system and operational procedures",
              status: "pending",
              order: 4,
              estimated_days: 5,
              checklist: [
                { id: "1", title: "RepairHQ system access setup", completed: false, required: true },
                { id: "2", title: "POS system training", completed: false, required: true },
                { id: "3", title: "Inventory management training", completed: false, required: true },
                { id: "4", title: "Reporting system training", completed: false, required: true },
                { id: "5", title: "System proficiency test", completed: false, required: true },
              ],
            },
            {
              id: "5",
              step: "grand_opening",
              title: "Grand Opening",
              description: "Launch the franchise location",
              status: "pending",
              order: 5,
              estimated_days: 7,
              checklist: [
                { id: "1", title: "Marketing campaign launched", completed: false, required: true },
                { id: "2", title: "Staff hired and trained", completed: false, required: true },
                { id: "3", title: "Grand opening event planned", completed: false, required: false },
                { id: "4", title: "Local permits obtained", completed: false, required: true },
                { id: "5", title: "Insurance activated", completed: false, required: true },
                { id: "6", title: "Official opening", completed: false, required: true },
              ],
            },
          ],
        },
        {
          franchise_id: "2",
          franchise_name: "Westside Tech Repair",
          franchisee_name: "Sarah Johnson",
          franchisee_email: "sarah@example.com",
          franchisee_phone: "(555) 987-6543",
          start_date: "2024-02-01",
          target_completion: "2024-04-01",
          overall_progress: 25,
          current_step: "initial_training",
          steps: [
            {
              id: "1",
              step: "contract_signed",
              title: "Contract Signing",
              description: "Complete franchise agreement and legal documentation",
              status: "completed",
              order: 1,
              estimated_days: 7,
              completed_date: "2024-02-05",
              checklist: [
                { id: "1", title: "Franchise agreement signed", completed: true, required: true },
                { id: "2", title: "Initial franchise fee paid", completed: true, required: true },
                { id: "3", title: "Background check completed", completed: true, required: true },
                { id: "4", title: "Financial verification", completed: true, required: true },
              ],
            },
            {
              id: "2",
              step: "initial_training",
              title: "Initial Training Program",
              description: "Complete comprehensive franchise training program",
              status: "in_progress",
              order: 2,
              estimated_days: 14,
              assigned_to: "Training Team",
              due_date: "2024-02-25",
              checklist: [
                { id: "1", title: "Business operations training", completed: true, required: true },
                { id: "2", title: "Technical repair training", completed: false, required: true },
                { id: "3", title: "Customer service training", completed: false, required: true },
                { id: "4", title: "Marketing and sales training", completed: false, required: true },
                { id: "5", title: "Training assessment passed", completed: false, required: true },
              ],
            },
            // ... other steps would be pending
          ],
        },
      ]
      setOnboardingData(mockData)
      if (mockData.length > 0) {
        setSelectedFranchise(mockData[0])
      }
    } catch (error) {
      console.error("Error fetching onboarding data:", error)
      toast({
        title: "Error",
        description: "Failed to load onboarding data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-600" />
      case "blocked":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStepIcon = (step: string) => {
    switch (step) {
      case "contract_signed":
        return <FileText className="h-6 w-6" />
      case "initial_training":
        return <GraduationCap className="h-6 w-6" />
      case "location_setup":
        return <Building className="h-6 w-6" />
      case "system_training":
        return <Monitor className="h-6 w-6" />
      case "grand_opening":
        return <PartyPopper className="h-6 w-6" />
      default:
        return <Clock className="h-6 w-6" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "blocked":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading onboarding data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Franchise Onboarding</h2>
          <p className="text-muted-foreground">Track and manage franchise partner onboarding progress</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Step Details</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Franchise List */}
            <Card>
              <CardHeader>
                <CardTitle>Active Onboarding</CardTitle>
                <CardDescription>Franchises currently in onboarding</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {onboardingData.map((franchise) => (
                    <div
                      key={franchise.franchise_id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedFranchise?.franchise_id === franchise.franchise_id
                          ? "border-blue-500 bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedFranchise(franchise)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{franchise.franchise_name}</h3>
                        <Badge variant="outline">{franchise.overall_progress}%</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{franchise.franchisee_name}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{franchise.overall_progress}%</span>
                        </div>
                        <Progress value={franchise.overall_progress} className="h-2" />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Current: {franchise.steps.find((s) => s.step === franchise.current_step)?.title}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Franchise Details */}
            {selectedFranchise && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>{selectedFranchise.franchise_name}</CardTitle>
                  <CardDescription>Onboarding progress and details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Franchisee Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Franchisee Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-gray-400" />
                          {selectedFranchise.franchisee_name}
                        </div>
                        <div className="flex items-center">
                          <Mail className="mr-2 h-4 w-4 text-gray-400" />
                          {selectedFranchise.franchisee_email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4 text-gray-400" />
                          {selectedFranchise.franchisee_phone}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Timeline</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                          Started: {new Date(selectedFranchise.start_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                          Target: {new Date(selectedFranchise.target_completion).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Overview */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Overall Progress</h4>
                      <span className="text-sm font-medium">{selectedFranchise.overall_progress}%</span>
                    </div>
                    <Progress value={selectedFranchise.overall_progress} className="h-3" />
                  </div>

                  {/* Steps Overview */}
                  <div>
                    <h4 className="font-medium mb-4">Onboarding Steps</h4>
                    <div className="space-y-3">
                      {selectedFranchise.steps.map((step) => (
                        <div key={step.id} className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                            {getStepIcon(step.step)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium">{step.title}</h5>
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(step.status)}
                                <Badge className={getStatusColor(step.status)}>{step.status.replace("_", " ")}</Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{step.description}</p>
                            {step.due_date && step.status !== "completed" && (
                              <p className="text-xs text-gray-500">
                                Due: {new Date(step.due_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="details">
          {selectedFranchise && (
            <div className="space-y-6">
              {selectedFranchise.steps.map((step) => (
                <Card key={step.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                          {getStepIcon(step.step)}
                        </div>
                        <div>
                          <h3>{step.title}</h3>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(step.status)}>{step.status.replace("_", " ")}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium mb-3">Checklist</h4>
                        <div className="space-y-2">
                          {step.checklist.map((item) => (
                            <div key={item.id} className="flex items-center space-x-2">
                              <div
                                className={`h-4 w-4 rounded border-2 flex items-center justify-center ${
                                  item.completed ? "bg-green-500 border-green-500" : "border-gray-300"
                                }`}
                              >
                                {item.completed && <CheckCircle className="h-3 w-3 text-white" />}
                              </div>
                              <span className={`text-sm ${item.completed ? "line-through text-gray-500" : ""}`}>
                                {item.title}
                                {item.required && <span className="text-red-500 ml-1">*</span>}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Step Information</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">Estimated Duration:</span>
                            <span className="ml-2 font-medium">{step.estimated_days} days</span>
                          </div>
                          {step.assigned_to && (
                            <div>
                              <span className="text-gray-600">Assigned To:</span>
                              <span className="ml-2 font-medium">{step.assigned_to}</span>
                            </div>
                          )}
                          {step.due_date && (
                            <div>
                              <span className="text-gray-600">Due Date:</span>
                              <span className="ml-2 font-medium">{new Date(step.due_date).toLocaleDateString()}</span>
                            </div>
                          )}
                          {step.completed_date && (
                            <div>
                              <span className="text-gray-600">Completed:</span>
                              <span className="ml-2 font-medium">
                                {new Date(step.completed_date).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                        {step.status === "in_progress" && (
                          <div className="mt-4">
                            <Button size="sm">Mark as Complete</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Timeline</CardTitle>
              <CardDescription>Visual timeline of the onboarding process</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedFranchise && (
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    {selectedFranchise.steps.map((step, index) => (
                      <div key={step.id} className="relative flex items-start space-x-4">
                        <div
                          className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 ${
                            step.status === "completed"
                              ? "bg-green-500 border-green-500"
                              : step.status === "in_progress"
                                ? "bg-blue-500 border-blue-500"
                                : "bg-gray-100 border-gray-300"
                          }`}
                        >
                          {getStepIcon(step.step)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{step.title}</h3>
                            <Badge className={getStatusColor(step.status)}>{step.status.replace("_", " ")}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>Duration: {step.estimated_days} days</span>
                            {step.completed_date && (
                              <span>Completed: {new Date(step.completed_date).toLocaleDateString()}</span>
                            )}
                            {step.due_date && step.status !== "completed" && (
                              <span>Due: {new Date(step.due_date).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
