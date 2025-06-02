"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Printer,
  Play,
  Pause,
  Square,
  Trash2,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { LaserJetPrinterService, LASERJET_CONFIGS } from "@/lib/laserjet-printer-service"
import { StarTSP100Service, STAR_TSP100_CONFIGS } from "@/lib/star-tsp100-service"

interface PrintJob {
  id: string
  type: "invoice" | "label" | "report" | "receipt" | "sticker"
  title: string
  data: any
  status: "pending" | "printing" | "completed" | "failed" | "cancelled" | "paused"
  timestamp: Date
  retryCount: number
  priority: "low" | "normal" | "high" | "urgent"
  printerType: "laserjet" | "thermal" | "star"
  pages: number
  estimatedTime: number
  progress: number
  error?: string
}

export function AdvancedPrintQueue() {
  const { toast } = useToast()
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([])
  const [selectedPrinter, setSelectedPrinter] = useState<string>("laserjet")
  const [printerServices, setPrinterServices] = useState<Map<string, any>>(new Map())
  const [isProcessing, setIsProcessing] = useState(false)
  const [filter, setFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("timestamp")

  // Initialize printer services
  useEffect(() => {
    const services = new Map()

    // Initialize LaserJet service
    const laserjetService = new LaserJetPrinterService(LASERJET_CONFIGS.HP_LASERJET_STANDARD)
    services.set("laserjet", laserjetService)

    // Initialize Star TSP100 service
    const starService = new StarTSP100Service(STAR_TSP100_CONFIGS.TSP143III_USB)
    services.set("star", starService)

    setPrinterServices(services)

    // Load sample jobs for demonstration
    loadSampleJobs()
  }, [])

  const loadSampleJobs = () => {
    const sampleJobs: PrintJob[] = [
      {
        id: "job-001",
        type: "invoice",
        title: "Invoice #INV-2024-001",
        data: { invoiceNumber: "INV-2024-001", customer: "John Doe" },
        status: "pending",
        timestamp: new Date(),
        retryCount: 0,
        priority: "normal",
        printerType: "laserjet",
        pages: 2,
        estimatedTime: 45,
        progress: 0,
      },
      {
        id: "job-002",
        type: "sticker",
        title: "Oil Change Windshield Sticker",
        data: { vehicleInfo: "2023 Honda Civic", serviceDate: "2024-01-15" },
        status: "printing",
        timestamp: new Date(Date.now() - 60000),
        retryCount: 0,
        priority: "high",
        printerType: "laserjet",
        pages: 1,
        estimatedTime: 15,
        progress: 65,
      },
      {
        id: "job-003",
        type: "receipt",
        title: "POS Receipt #R-001",
        data: { receiptNumber: "R-001", total: 125.5 },
        status: "completed",
        timestamp: new Date(Date.now() - 300000),
        retryCount: 0,
        priority: "normal",
        printerType: "star",
        pages: 1,
        estimatedTime: 10,
        progress: 100,
      },
      {
        id: "job-004",
        type: "label",
        title: "Warranty Label #WL-004",
        data: { repairType: "Screen Repair", warrantyPeriod: "90 days" },
        status: "failed",
        timestamp: new Date(Date.now() - 180000),
        retryCount: 2,
        priority: "normal",
        printerType: "laserjet",
        pages: 1,
        estimatedTime: 20,
        progress: 0,
        error: "Printer offline",
      },
    ]
    setPrintJobs(sampleJobs)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "printing":
        return <Printer className="h-4 w-4 text-blue-500 animate-pulse" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "cancelled":
        return <Square className="h-4 w-4 text-gray-500" />
      case "paused":
        return <Pause className="h-4 w-4 text-orange-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      printing: "default",
      completed: "outline",
      failed: "destructive",
      cancelled: "secondary",
      paused: "secondary",
    }
    return <Badge variant={variants[status] || "outline"}>{status.toUpperCase()}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-gray-100 text-gray-800",
      normal: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    }
    return <Badge className={colors[priority] || colors.normal}>{priority.toUpperCase()}</Badge>
  }

  const startQueue = async () => {
    setIsProcessing(true)
    const service = printerServices.get(selectedPrinter)
    if (service) {
      try {
        await service.processQueue()
        toast({
          title: "Print Queue Started",
          description: "Processing print jobs...",
        })
      } catch (error) {
        toast({
          title: "Queue Start Failed",
          description: "Failed to start print queue",
          variant: "destructive",
        })
      }
    }
    setIsProcessing(false)
  }

  const pauseQueue = () => {
    setIsProcessing(false)
    toast({
      title: "Print Queue Paused",
      description: "All pending jobs have been paused",
    })
  }

  const cancelJob = (jobId: string) => {
    setPrintJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, status: "cancelled" as const } : job)))
    toast({
      title: "Job Cancelled",
      description: "Print job has been cancelled",
    })
  }

  const retryJob = (jobId: string) => {
    setPrintJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? { ...job, status: "pending" as const, retryCount: job.retryCount + 1, error: undefined }
          : job,
      ),
    )
    toast({
      title: "Job Retried",
      description: "Print job has been added back to queue",
    })
  }

  const changePriority = (jobId: string, newPriority: string) => {
    setPrintJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, priority: newPriority as any } : job)))
  }

  const moveJobUp = (jobId: string) => {
    setPrintJobs((prev) => {
      const index = prev.findIndex((job) => job.id === jobId)
      if (index > 0) {
        const newJobs = [...prev]
        ;[newJobs[index - 1], newJobs[index]] = [newJobs[index], newJobs[index - 1]]
        return newJobs
      }
      return prev
    })
  }

  const moveJobDown = (jobId: string) => {
    setPrintJobs((prev) => {
      const index = prev.findIndex((job) => job.id === jobId)
      if (index < prev.length - 1) {
        const newJobs = [...prev]
        ;[newJobs[index], newJobs[index + 1]] = [newJobs[index + 1], newJobs[index]]
        return newJobs
      }
      return prev
    })
  }

  const clearCompleted = () => {
    setPrintJobs((prev) => prev.filter((job) => job.status !== "completed"))
    toast({
      title: "Completed Jobs Cleared",
      description: "All completed jobs have been removed from the queue",
    })
  }

  const filteredJobs = printJobs.filter((job) => {
    if (filter === "all") return true
    return job.status === filter
  })

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "priority":
        const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case "timestamp":
        return b.timestamp.getTime() - a.timestamp.getTime()
      case "type":
        return a.type.localeCompare(b.type)
      default:
        return 0
    }
  })

  const queueStats = {
    total: printJobs.length,
    pending: printJobs.filter((job) => job.status === "pending").length,
    printing: printJobs.filter((job) => job.status === "printing").length,
    completed: printJobs.filter((job) => job.status === "completed").length,
    failed: printJobs.filter((job) => job.status === "failed").length,
  }

  return (
    <div className="space-y-6">
      {/* Queue Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Printer className="h-5 w-5 mr-2" />
              Print Queue Management
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={startQueue} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Queue
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={pauseQueue} disabled={!isProcessing}>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button variant="outline" size="sm" onClick={clearCompleted}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Completed
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="printer">Active Printer</Label>
              <Select value={selectedPrinter} onValueChange={setSelectedPrinter}>
                <SelectTrigger id="printer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="laserjet">HP LaserJet Pro</SelectItem>
                  <SelectItem value="star">Star TSP100</SelectItem>
                  <SelectItem value="thermal">Thermal Printer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter">Filter by Status</Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger id="filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="printing">Printing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort">Sort by</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timestamp">Time Added</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="type">Job Type</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Queue Statistics</Label>
              <div className="text-sm space-y-1">
                <div>Total: {queueStats.total}</div>
                <div>Pending: {queueStats.pending}</div>
                <div>Processing: {queueStats.printing}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Print Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedJobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {job.type.charAt(0).toUpperCase() + job.type.slice(1)} •{job.pages} page
                        {job.pages !== 1 ? "s" : ""} •{job.printerType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(job.status)}
                    {getPriorityBadge(job.priority)}
                  </div>
                </div>

                {job.status === "printing" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} className="w-full" />
                  </div>
                )}

                {job.error && (
                  <div className="bg-red-50 border border-red-200 rounded p-2">
                    <p className="text-sm text-red-600">{job.error}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Added: {job.timestamp.toLocaleTimeString()} • Est. Time: {job.estimatedTime}s
                    {job.retryCount > 0 && ` • Retries: ${job.retryCount}`}
                  </div>
                  <div className="flex items-center space-x-2">
                    {job.status === "pending" && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => moveJobUp(job.id)}>
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => moveJobDown(job.id)}>
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                        <Select value={job.priority} onValueChange={(value) => changePriority(job.id, value)}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </>
                    )}
                    {job.status === "failed" && (
                      <Button variant="outline" size="sm" onClick={() => retryJob(job.id)}>
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Retry
                      </Button>
                    )}
                    {(job.status === "pending" || job.status === "failed") && (
                      <Button variant="outline" size="sm" onClick={() => cancelJob(job.id)}>
                        <XCircle className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {sortedJobs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Printer className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No print jobs in queue</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdvancedPrintQueue
