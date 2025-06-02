"use client"

import { useState, type ChangeEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Brain,
  Camera,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
  Cpu,
  BarChart3,
  Upload,
  Scan,
  AlertTriangle,
  FileImage,
} from "lucide-react"
import { generateRepairEstimate, type DeviceInfo, type IssueInfo, type RepairEstimate } from "@/lib/ai-chatbot-service" // Ensure this path is correct

const diagnosticResults = [
  {
    id: 1,
    device: "iPhone 14 Pro",
    issue: "Screen Damage",
    confidence: 95,
    diagnosis: "Cracked LCD with touch functionality intact",
    estimatedCost: 299,
    repairTime: 45,
    severity: "medium",
    images: 3,
    timestamp: "2024-01-15 10:30 AM",
  },
  {
    id: 2,
    device: "Samsung Galaxy S23",
    issue: "Battery Degradation",
    confidence: 88,
    diagnosis: "Battery capacity reduced to 67% of original",
    estimatedCost: 89,
    repairTime: 30,
    severity: "low",
    images: 2,
    timestamp: "2024-01-15 11:15 AM",
  },
  {
    id: 3,
    device: "iPad Air",
    issue: "Water Damage",
    confidence: 92,
    diagnosis: "Liquid damage detected in charging port and speakers",
    estimatedCost: 450,
    repairTime: 120,
    severity: "high",
    images: 5,
    timestamp: "2024-01-15 2:20 PM",
  },
]

const aiModels = [
  {
    name: "Screen Damage Detection",
    accuracy: 94.5,
    version: "v2.1",
    lastTrained: "2024-01-10",
    status: "active",
    predictions: 1247,
  },
  {
    name: "Battery Health Analysis",
    accuracy: 91.2,
    version: "v1.8",
    lastTrained: "2024-01-08",
    status: "active",
    predictions: 892,
  },
  {
    name: "Water Damage Assessment",
    accuracy: 89.7,
    version: "v1.5",
    lastTrained: "2024-01-05",
    status: "training",
    predictions: 456,
  },
]

export function AIPoweredDiagnostics() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([])
  const [analysisResult, setAnalysisResult] = useState<RepairEstimate | null>(null)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const names = Array.from(files).map((file) => file.name)
      setUploadedFileNames((prev) => [...prev, ...names].slice(0, 3)) // Limit to 3 for display
      setAnalysisResult(null)
      setAnalysisError(null)
      // Reset file input to allow re-uploading the same file
      event.target.value = ""
    }
  }

  const startAnalysis = async () => {
    if (uploadedFileNames.length === 0) {
      setAnalysisError("Please upload images first.")
      return
    }

    setIsAnalyzing(true)
    setAnalysisResult(null)
    setAnalysisError(null)
    setCurrentProgress(0)

    // Simulate analysis steps
    await new Promise((resolve) => setTimeout(resolve, 300))
    setCurrentProgress(20) // Step 1: Uploading images

    await new Promise((resolve) => setTimeout(resolve, 700))
    setCurrentProgress(40) // Step 2: Image preprocessing

    // Simulate device/issue identification from images
    // In a real scenario, this would come from an image analysis AI model
    const mockDeviceInfo: DeviceInfo = {
      brand: "Apple",
      model: "iPhone 13",
      type: "phone",
      // releaseYear: 2021 // Optional
    }
    const mockIssueInfo: IssueInfo = {
      category: "Screen Damage",
      severity: "medium",
      description: "Cracked front glass with minor display artifacts.",
      symptoms: ["Visible cracks", "Flickering display"],
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
    setCurrentProgress(70) // Step 3: AI model processing

    try {
      const estimate = await generateRepairEstimate(mockDeviceInfo, mockIssueInfo)
      setAnalysisResult(estimate)
    } catch (error) {
      console.error("Error generating repair estimate:", error)
      setAnalysisError("Failed to generate repair estimate. Please try again.")
      setAnalysisResult(null) // Explicitly clear any partial results
    }

    setCurrentProgress(100) // Step 4: Generating recommendations
    await new Promise((resolve) => setTimeout(resolve, 500))

    setIsAnalyzing(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <input
        type="file"
        id="imageUploadInput"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI-Powered Diagnostics</h2>
          <p className="text-muted-foreground">Automated device analysis and repair recommendations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => document.getElementById("imageUploadInput")?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Images
          </Button>
          <Button onClick={startAnalysis} disabled={isAnalyzing || uploadedFileNames.length === 0}>
            <Brain className="mr-2 h-4 w-4" />
            {isAnalyzing ? "Analyzing..." : "Start Analysis"}
          </Button>
        </div>
      </div>

      {/* AI Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.8%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline mr-1 h-3 w-3 text-green-500" />
              +2.3% this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diagnoses Today</CardTitle>
            <Scan className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+12 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Confidence</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91.5%</div>
            <p className="text-xs text-muted-foreground">High confidence rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5h</div>
            <p className="text-xs text-muted-foreground">Per day average</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analysis" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analysis">Live Analysis</TabsTrigger>
          <TabsTrigger value="results">Recent Results</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="training">Training Data</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Image Upload & Analysis</CardTitle>
                <CardDescription>Upload device images for AI-powered diagnosis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-primary"
                  onClick={() => document.getElementById("imageUploadInput")?.click()}
                >
                  {isAnalyzing ? (
                    <div className="space-y-4">
                      <Brain className="mx-auto h-12 w-12 text-purple-500 animate-pulse" />
                      <div>
                        <h3 className="text-lg font-medium">Analyzing Images...</h3>
                        <p className="text-sm text-muted-foreground">AI is processing your images</p>
                      </div>
                      <Progress value={currentProgress} className="w-full" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Camera className="mx-auto h-12 w-12 text-gray-400" />
                      <div>
                        <h3 className="text-lg font-medium">Upload Device Images</h3>
                        <p className="text-sm text-muted-foreground">Drag and drop images or click to browse</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          document.getElementById("imageUploadInput")?.click()
                        }}
                      >
                        Choose Files
                      </Button>
                    </div>
                  )}
                </div>

                {uploadedFileNames.length > 0 && !isAnalyzing && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Uploaded files:</h4>
                    <ul className="list-disc list-inside pl-4 text-sm text-muted-foreground">
                      {uploadedFileNames.map((name, idx) => (
                        <li key={idx} className="flex items-center">
                          <FileImage className="h-4 w-4 mr-2 text-gray-500" />
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysisError && !isAnalyzing && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-md text-red-700 dark:text-red-300 text-sm flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {analysisError}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>AI-generated diagnosis and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                {isAnalyzing ? (
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Cpu className="h-4 w-4 text-blue-500 animate-spin" />
                      <span>Processing images... ({currentProgress}%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Brain className="h-4 w-4 text-purple-500 animate-pulse" />
                      <span>Running AI models...</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-green-500" />
                      <span>Calculating confidence & recommendations...</span>
                    </div>
                  </div>
                ) : analysisResult ? (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Device: {analysisResult.device}</h4>
                    <p>
                      <span className="font-medium">Detected Issue:</span> {analysisResult.issue}
                    </p>
                    <p>
                      <span className="font-medium">Estimated Cost:</span> ${analysisResult.estimatedCost.min} - $
                      {analysisResult.estimatedCost.max}
                    </p>
                    <p>
                      <span className="font-medium">Estimated Repair Time:</span> {analysisResult.estimatedTime}
                    </p>
                    <p>
                      <span className="font-medium">Confidence Score:</span>{" "}
                      {(analysisResult.confidence * 100).toFixed(1)}%
                    </p>
                    {analysisResult.parts && analysisResult.parts.length > 0 && (
                      <div>
                        <p className="font-medium">Recommended Parts:</p>
                        <ul className="list-disc list-inside pl-4 text-sm">
                          {analysisResult.parts.map((part, idx) => (
                            <li key={idx}>{part}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysisResult.labor && (
                      <p>
                        <span className="font-medium">Estimated Labor:</span> {analysisResult.labor} units/hours
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Warranty:</span> {analysisResult.warranty}
                    </p>
                    <Button className="w-full mt-4">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Proceed with Recommendation
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Eye className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {uploadedFileNames.length > 0
                        ? "Ready for analysis. Click 'Start Analysis'."
                        : "Upload images to view AI-powered recommendations."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Recent Diagnostic Results</CardTitle>
              <CardDescription>AI-powered analysis results from recent diagnoses</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Issue Detected</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Estimated Cost</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {diagnosticResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{result.device}</div>
                          <div className="text-sm text-muted-foreground">{result.images} images</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{result.issue}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">{result.diagnosis}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={result.confidence}
                            className="w-16 h-2"
                            aria-label={`${result.confidence}% confidence`}
                          />
                          <span className="text-sm font-medium">{result.confidence}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">${result.estimatedCost}</div>
                          <div className="text-sm text-muted-foreground">{result.repairTime} min</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(result.severity)}>{result.severity}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{result.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Performance</CardTitle>
              <CardDescription>Monitor and manage AI diagnostic models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiModels.map((model, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4 sm:gap-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Brain className="h-6 w-6 text-purple-500" />
                      </div>
                      <div>
                        <div className="font-medium">{model.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Version {model.version} • Last trained {model.lastTrained}
                        </div>
                        <div className="text-sm text-muted-foreground">{model.predictions} predictions made</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="font-medium">{model.accuracy}%</div>
                        <div className="text-sm text-muted-foreground">Accuracy</div>
                      </div>
                      <Badge variant={model.status === "active" ? "default" : "secondary"} className="capitalize">
                        {model.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        {model.status === "training" ? "View Progress" : "Retrain"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>Training Data Management</CardTitle>
              <CardDescription>View, upload, and manage training data for AI models.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-end">
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Training Data
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image Preview</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Annotated Issue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                        <Camera className="h-6 w-6 text-gray-400" />
                      </div>
                    </TableCell>
                    <TableCell>iPhone 12 Pro</TableCell>
                    <TableCell>Cracked Back Glass</TableCell>
                    <TableCell>
                      <Badge variant="default">Verified</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                        <Camera className="h-6 w-6 text-gray-400" />
                      </div>
                    </TableCell>
                    <TableCell>Samsung Galaxy S21</TableCell>
                    <TableCell>Battery Swelling</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Pending Review</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No further training data available.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
