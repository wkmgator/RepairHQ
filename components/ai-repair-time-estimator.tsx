"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Brain,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  Zap,
  TrendingUp,
  Loader2,
} from "lucide-react"

interface RepairTimeEstimate {
  device: string
  issue: string
  estimatedTime: {
    min: number
    max: number
    unit: "minutes" | "hours" | "days"
  }
  complexity: "low" | "medium" | "high"
  confidence: number
  factors: string[]
  parts: {
    name: string
    availability: "in-stock" | "order-needed" | "special-order"
    leadTime?: number
  }[]
  technician: {
    skill: "junior" | "mid-level" | "senior"
    availability: "high" | "medium" | "low"
  }
}

interface HistoricalRepair {
  id: string
  device: string
  issue: string
  estimatedTime: string
  actualTime: string
  accuracy: number
  technician: string
  date: string
}

const deviceTypes = [
  { value: "iphone", label: "iPhone" },
  { value: "samsung", label: "Samsung Galaxy" },
  { value: "pixel", label: "Google Pixel" },
  { value: "ipad", label: "iPad" },
  { value: "macbook", label: "MacBook" },
  { value: "windows_laptop", label: "Windows Laptop" },
  { value: "android_tablet", label: "Android Tablet" },
  { value: "gaming_console", label: "Gaming Console" },
  { value: "smartwatch", label: "Smartwatch" },
]

const issueTypes = {
  iphone: [
    { value: "screen_replacement", label: "Screen Replacement" },
    { value: "battery_replacement", label: "Battery Replacement" },
    { value: "charging_port", label: "Charging Port Repair" },
    { value: "water_damage", label: "Water Damage" },
    { value: "camera_repair", label: "Camera Repair" },
    { value: "speaker_repair", label: "Speaker Repair" },
  ],
  samsung: [
    { value: "screen_replacement", label: "Screen Replacement" },
    { value: "battery_replacement", label: "Battery Replacement" },
    { value: "charging_port", label: "Charging Port Repair" },
    { value: "water_damage", label: "Water Damage" },
    { value: "camera_repair", label: "Camera Repair" },
  ],
  // Default issues for other device types
  default: [
    { value: "screen_replacement", label: "Screen Replacement" },
    { value: "battery_replacement", label: "Battery Replacement" },
    { value: "water_damage", label: "Water Damage" },
    { value: "hardware_repair", label: "Hardware Repair" },
    { value: "software_issue", label: "Software Issue" },
  ],
}

const historicalRepairs: HistoricalRepair[] = [
  {
    id: "1",
    device: "iPhone 13",
    issue: "Screen Replacement",
    estimatedTime: "45-60 min",
    actualTime: "52 min",
    accuracy: 96,
    technician: "John D.",
    date: "2024-05-20",
  },
  {
    id: "2",
    device: "Samsung Galaxy S22",
    issue: "Battery Replacement",
    estimatedTime: "30-45 min",
    actualTime: "40 min",
    accuracy: 94,
    technician: "Sarah M.",
    date: "2024-05-19",
  },
  {
    id: "3",
    device: "MacBook Pro",
    issue: "Keyboard Replacement",
    estimatedTime: "1.5-2 hours",
    actualTime: "2.5 hours",
    accuracy: 75,
    technician: "Mike R.",
    date: "2024-05-18",
  },
  {
    id: "4",
    device: "iPad Air",
    issue: "Charging Port Repair",
    estimatedTime: "45-60 min",
    actualTime: "50 min",
    accuracy: 92,
    technician: "Lisa K.",
    date: "2024-05-17",
  },
  {
    id: "5",
    device: "Google Pixel 6",
    issue: "Screen Replacement",
    estimatedTime: "45-60 min",
    actualTime: "55 min",
    accuracy: 98,
    technician: "John D.",
    date: "2024-05-16",
  },
]

export function AIRepairTimeEstimator() {
  const [deviceType, setDeviceType] = useState("")
  const [deviceModel, setDeviceModel] = useState("")
  const [issueType, setIssueType] = useState("")
  const [issueDescription, setIssueDescription] = useState("")
  const [complexity, setComplexity] = useState<number[]>([1])
  const [partsAvailable, setPartsAvailable] = useState(true)
  const [technicianExperience, setTechnicianExperience] = useState("mid-level")
  const [isGenerating, setIsGenerating] = useState(false)
  const [estimate, setEstimate] = useState<RepairTimeEstimate | null>(null)
  const [activeTab, setActiveTab] = useState("estimate")
  const [error, setError] = useState<string | null>(null)

  const getIssueOptions = () => {
    if (!deviceType) return []
    return issueTypes[deviceType as keyof typeof issueTypes] || issueTypes.default
  }

  const handleGenerateEstimate = async () => {
    if (!deviceType || !deviceModel || !issueType) {
      setError("Please fill in all required fields")
      return
    }

    setIsGenerating(true)
    setError(null)
    setEstimate(null)

    try {
      // In a real implementation, this would call your backend API
      // For demo purposes, we'll simulate an API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Use AI to generate a repair time estimate
      const complexityLevel = complexity[0] === 1 ? "low" : complexity[0] === 2 ? "medium" : "high"

      // This is a simplified example - in a real app, you would call your backend
      // which would use the OpenAI API to generate a more accurate estimate
      const mockEstimate: RepairTimeEstimate = {
        device: `${getDeviceTypeLabel(deviceType)} ${deviceModel}`,
        issue: getIssueTypeLabel(issueType),
        estimatedTime: {
          min: complexityLevel === "low" ? 30 : complexityLevel === "medium" ? 45 : 60,
          max: complexityLevel === "low" ? 45 : complexityLevel === "medium" ? 75 : 120,
          unit: "minutes",
        },
        complexity: complexityLevel as "low" | "medium" | "high",
        confidence: complexityLevel === "low" ? 92 : complexityLevel === "medium" ? 85 : 78,
        factors: [
          "Device type and model",
          "Issue complexity",
          "Parts availability",
          "Technician experience",
          "Historical repair data",
        ],
        parts: [
          {
            name:
              issueType === "screen_replacement"
                ? "Display Assembly"
                : issueType === "battery_replacement"
                  ? "Battery"
                  : "Replacement Component",
            availability: partsAvailable ? "in-stock" : "order-needed",
            leadTime: partsAvailable ? undefined : 2,
          },
        ],
        technician: {
          skill: technicianExperience as "junior" | "mid-level" | "senior",
          availability: "medium",
        },
      }

      setEstimate(mockEstimate)
    } catch (err) {
      console.error("Error generating estimate:", err)
      setError("Failed to generate estimate. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const getDeviceTypeLabel = (value: string) => {
    const device = deviceTypes.find((d) => d.value === value)
    return device ? device.label : value
  }

  const getIssueTypeLabel = (value: string) => {
    const issue = getIssueOptions().find((i) => i.value === value)
    return issue ? issue.label : value
  }

  const getComplexityLabel = (value: number) => {
    switch (value) {
      case 1:
        return "Low"
      case 2:
        return "Medium"
      case 3:
        return "High"
      default:
        return "Unknown"
    }
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-green-600"
    if (accuracy >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-100 text-green-800"
    if (confidence >= 75) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Repair Time Estimator</h2>
          <p className="text-muted-foreground">Predict repair times with AI-powered accuracy</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Brain className="mr-1 h-3 w-3" />
            AI-Powered
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <TrendingUp className="mr-1 h-3 w-3" />
            92% Accuracy
          </Badge>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91.8%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline mr-1 h-3 w-3 text-green-600" />
              +2.3% this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimates Today</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <Clock className="inline mr-1 h-3 w-3" />
              Last: 15 minutes ago
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.5h</div>
            <p className="text-xs text-muted-foreground">Per day on average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Model Version</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">v2.3</div>
            <p className="text-xs text-muted-foreground">
              <RefreshCw className="inline mr-1 h-3 w-3" />
              Updated 3 days ago
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="estimate">Generate Estimate</TabsTrigger>
          <TabsTrigger value="history">Historical Accuracy</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="estimate">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Repair Details</CardTitle>
                <CardDescription>Enter device and issue information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="device-type">Device Type</Label>
                  <Select value={deviceType} onValueChange={setDeviceType}>
                    <SelectTrigger id="device-type">
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                    <SelectContent>
                      {deviceTypes.map((device) => (
                        <SelectItem key={device.value} value={device.value}>
                          {device.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="device-model">Device Model</Label>
                  <Input
                    id="device-model"
                    placeholder="e.g., iPhone 13 Pro, Galaxy S22"
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue-type">Issue Type</Label>
                  <Select value={issueType} onValueChange={setIssueType} disabled={!deviceType}>
                    <SelectTrigger id="issue-type">
                      <SelectValue placeholder={deviceType ? "Select issue type" : "Select device type first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {getIssueOptions().map((issue) => (
                        <SelectItem key={issue.value} value={issue.value}>
                          {issue.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue-description">Additional Details (Optional)</Label>
                  <Input
                    id="issue-description"
                    placeholder="Describe any specific details about the issue"
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Issue Complexity</Label>
                    <span className="text-sm text-muted-foreground">{getComplexityLabel(complexity[0])}</span>
                  </div>
                  <Slider value={complexity} min={1} max={3} step={1} onValueChange={setComplexity} className="py-4" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="parts-available">Parts Available</Label>
                    <Switch id="parts-available" checked={partsAvailable} onCheckedChange={setPartsAvailable} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {partsAvailable ? "All required parts are in stock" : "Some parts may need to be ordered"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technician-experience">Technician Experience</Label>
                  <Select value={technicianExperience} onValueChange={setTechnicianExperience}>
                    <SelectTrigger id="technician-experience">
                      <SelectValue placeholder="Select technician experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior (0-1 years)</SelectItem>
                      <SelectItem value="mid-level">Mid-Level (1-3 years)</SelectItem>
                      <SelectItem value="senior">Senior (3+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {error}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleGenerateEstimate}
                  disabled={isGenerating || !deviceType || !deviceModel || !issueType}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Generate Estimate
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Repair Time Estimate</CardTitle>
                <CardDescription>AI-generated time prediction</CardDescription>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <Brain className="h-12 w-12 text-purple-500 animate-pulse" />
                    <div className="text-center">
                      <h3 className="text-lg font-medium">Analyzing Repair Parameters</h3>
                      <p className="text-sm text-muted-foreground">
                        Our AI is calculating the estimated repair time...
                      </p>
                    </div>
                    <Progress value={65} className="w-full max-w-md" />
                  </div>
                ) : estimate ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">{estimate.device}</h3>
                      <p className="text-muted-foreground">{estimate.issue}</p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Estimated Repair Time</h4>
                          <p className="text-3xl font-bold">
                            {estimate.estimatedTime.min}-{estimate.estimatedTime.max} {estimate.estimatedTime.unit}
                          </p>
                        </div>
                        <Clock className="h-12 w-12 text-blue-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Complexity</p>
                        <Badge
                          className={
                            estimate.complexity === "low"
                              ? "bg-green-100 text-green-800"
                              : estimate.complexity === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {estimate.complexity.charAt(0).toUpperCase() + estimate.complexity.slice(1)}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium">Confidence</p>
                        <Badge className={getConfidenceColor(estimate.confidence)}>{estimate.confidence}%</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Parts Required</h4>
                      <div className="space-y-2">
                        {estimate.parts.map((part, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                            <span>{part.name}</span>
                            <Badge
                              variant={part.availability === "in-stock" ? "default" : "outline"}
                              className={
                                part.availability === "in-stock"
                                  ? "bg-green-100 text-green-800"
                                  : part.availability === "order-needed"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {part.availability === "in-stock"
                                ? "In Stock"
                                : part.availability === "order-needed"
                                  ? `Order Needed (${part.leadTime} days)`
                                  : "Special Order"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Factors Considered</h4>
                      <div className="flex flex-wrap gap-2">
                        {estimate.factors.map((factor, index) => (
                          <Badge key={index} variant="outline">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                      <Button size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Repair
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                    <Clock className="h-12 w-12 text-gray-300" />
                    <h3 className="text-lg font-medium">No Estimate Generated</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Fill in the device and issue details, then click "Generate Estimate" to get an AI-powered repair
                      time prediction.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historical Repair Time Accuracy</CardTitle>
              <CardDescription>Compare estimated vs. actual repair times</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Estimated Time</TableHead>
                    <TableHead>Actual Time</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicalRepairs.map((repair) => (
                    <TableRow key={repair.id}>
                      <TableCell>{repair.device}</TableCell>
                      <TableCell>{repair.issue}</TableCell>
                      <TableCell>{repair.estimatedTime}</TableCell>
                      <TableCell>{repair.actualTime}</TableCell>
                      <TableCell>
                        <span className={getAccuracyColor(repair.accuracy)}>{repair.accuracy}%</span>
                      </TableCell>
                      <TableCell>{repair.technician}</TableCell>
                      <TableCell>{repair.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Insights</CardTitle>
              <CardDescription>Patterns and recommendations based on repair data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <h3 className="text-lg font-medium flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-blue-600" />
                  Repair Time Optimization
                </h3>
                <p>
                  Screen replacements for Samsung devices are taking 15% longer than iPhone repairs of the same type.
                  Analysis suggests this may be due to the curved edge displays requiring more careful handling.
                  Consider specialized training for technicians on Samsung screen replacements.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg space-y-2">
                <h3 className="text-lg font-medium flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                  Technician Performance
                </h3>
                <p>
                  Senior technicians complete battery replacements 22% faster than junior technicians with no reduction
                  in quality. Consider pairing junior technicians with seniors for this repair type to improve skill
                  transfer.
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg space-y-2">
                <h3 className="text-lg font-medium flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
                  Parts Availability Impact
                </h3>
                <p>
                  Repairs requiring ordered parts have a 35% longer total completion time from customer drop-off to
                  pickup. Consider increasing stock levels for high-demand parts like iPhone 13/14 screens and Samsung
                  S22 batteries to reduce wait times.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg space-y-2">
                <h3 className="text-lg font-medium flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-purple-600" />
                  Scheduling Efficiency
                </h3>
                <p>
                  The AI model predicts that grouping similar repair types together in the schedule can increase
                  technician efficiency by 12-18%. This is likely due to reduced context switching and tool setup time.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
