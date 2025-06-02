import { AIRepairTimeEstimator } from "@/components/ai-repair-time-estimator"
import { AIPoweredDiagnostics } from "@/components/ai-powered-diagnostics"
import { AIChatbotSupport } from "@/components/ai-chatbot-support"
import AIAnalyticsEngine from "@/components/ai-analytics-engine"
import DynamicPricingAI from "@/components/dynamic-pricing-ai"
import { AIErrorBoundary } from "@/components/ai-error-boundary"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import {
  Brain,
  MessageSquare,
  Clock,
  BarChart3,
  Tag,
  Settings,
  RefreshCw,
  Zap,
  Cpu,
  Database,
  Layers,
  TestTube,
  CheckCircle,
} from "lucide-react"

export default function AIDashboardPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">AI Command Center</h1>
          <p className="text-muted-foreground">Centralized dashboard for all AI-powered features in RepairHQ</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/ai-dashboard/test">
            <Button variant="outline">
              <TestTube className="mr-2 h-4 w-4" />
              Run Tests
            </Button>
          </Link>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            AI Settings
          </Button>
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Models
          </Button>
        </div>
      </div>

      {/* Integration Status Alert */}
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle>AI Systems Operational</AlertTitle>
        <AlertDescription>
          All AI components are integrated and functioning properly.
          <Link href="/ai-dashboard/test" className="underline ml-1">
            View integration test results
          </Link>
        </AlertDescription>
      </Alert>

      {/* AI System Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>AI System Status</CardTitle>
          <CardDescription>Current status of AI models and services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center p-4 border rounded-lg">
              <div className="mr-4 bg-green-100 p-2 rounded-full">
                <Brain className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Diagnostic AI</div>
                <div className="flex items-center">
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                  <span className="text-xs text-muted-foreground ml-2">v2.1</span>
                </div>
              </div>
            </div>

            <div className="flex items-center p-4 border rounded-lg">
              <div className="mr-4 bg-green-100 p-2 rounded-full">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Chatbot AI</div>
                <div className="flex items-center">
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                  <span className="text-xs text-muted-foreground ml-2">v1.8</span>
                </div>
              </div>
            </div>

            <div className="flex items-center p-4 border rounded-lg">
              <div className="mr-4 bg-green-100 p-2 rounded-full">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Time Estimator</div>
                <div className="flex items-center">
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                  <span className="text-xs text-muted-foreground ml-2">v2.3</span>
                </div>
              </div>
            </div>

            <div className="flex items-center p-4 border rounded-lg">
              <div className="mr-4 bg-green-100 p-2 rounded-full">
                <Tag className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Dynamic Pricing</div>
                <div className="flex items-center">
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                  <span className="text-xs text-muted-foreground ml-2">v1.5</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.7%</div>
            <p className="text-xs text-muted-foreground">
              <RefreshCw className="inline mr-1 h-3 w-3" />
              Across all models
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Requests</CardTitle>
            <Cpu className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <RefreshCw className="inline mr-1 h-3 w-3" />
              Today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Data</CardTitle>
            <Database className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5K</div>
            <p className="text-xs text-muted-foreground">
              <RefreshCw className="inline mr-1 h-3 w-3" />
              Records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Models</CardTitle>
            <Layers className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              <RefreshCw className="inline mr-1 h-3 w-3" />
              Active models
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Features Tabs */}
      <Tabs defaultValue="repair-time" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5">
          <TabsTrigger value="repair-time">
            <Clock className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Repair Time</span>
            <span className="sm:hidden">Time</span>
          </TabsTrigger>
          <TabsTrigger value="diagnostics">
            <Brain className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Diagnostics</span>
            <span className="sm:hidden">Diag</span>
          </TabsTrigger>
          <TabsTrigger value="chatbot">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Chatbot</span>
            <span className="sm:hidden">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="pricing">
            <Tag className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Dynamic Pricing</span>
            <span className="sm:hidden">Price</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="repair-time">
          <AIErrorBoundary>
            <AIRepairTimeEstimator />
          </AIErrorBoundary>
        </TabsContent>

        <TabsContent value="diagnostics">
          <AIErrorBoundary>
            <AIPoweredDiagnostics />
          </AIErrorBoundary>
        </TabsContent>

        <TabsContent value="chatbot">
          <AIErrorBoundary>
            <AIChatbotSupport />
          </AIErrorBoundary>
        </TabsContent>

        <TabsContent value="analytics">
          <AIErrorBoundary>
            <AIAnalyticsEngine />
          </AIErrorBoundary>
        </TabsContent>

        <TabsContent value="pricing">
          <AIErrorBoundary>
            <DynamicPricingAI />
          </AIErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  )
}
