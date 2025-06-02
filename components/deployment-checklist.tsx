"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { EliteCard, EliteCardContent, EliteCardHeader, EliteCardTitle } from "@/components/ui/elite-card"
import { EliteButton } from "@/components/ui/elite-button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, Clock, Rocket, Shield, Zap, Globe, Database, Settings, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChecklistItem {
  id: string
  title: string
  description: string
  status: "pending" | "running" | "completed" | "failed"
  category: "build" | "test" | "security" | "performance" | "deployment"
  icon: React.ComponentType<{ className?: string }>
  critical: boolean
}

const checklistItems: ChecklistItem[] = [
  {
    id: "type-check",
    title: "TypeScript Type Check",
    description: "Verify all TypeScript types are correct",
    status: "pending",
    category: "build",
    icon: Shield,
    critical: true,
  },
  {
    id: "lint-check",
    title: "Code Linting",
    description: "Check code quality and formatting",
    status: "pending",
    category: "build",
    icon: Settings,
    critical: true,
  },
  {
    id: "build-check",
    title: "Production Build",
    description: "Build optimized production bundle",
    status: "pending",
    category: "build",
    icon: Zap,
    critical: true,
  },
  {
    id: "test-suite",
    title: "Test Suite",
    description: "Run all unit and integration tests",
    status: "pending",
    category: "test",
    icon: CheckCircle2,
    critical: false,
  },
  {
    id: "security-scan",
    title: "Security Scan",
    description: "Check for vulnerabilities in dependencies",
    status: "pending",
    category: "security",
    icon: Shield,
    critical: true,
  },
  {
    id: "performance-audit",
    title: "Performance Audit",
    description: "Lighthouse performance check",
    status: "pending",
    category: "performance",
    icon: Zap,
    critical: false,
  },
  {
    id: "env-validation",
    title: "Environment Variables",
    description: "Validate all required environment variables",
    status: "pending",
    category: "deployment",
    icon: Database,
    critical: true,
  },
  {
    id: "domain-check",
    title: "Domain Configuration",
    description: "Verify domain and SSL configuration",
    status: "pending",
    category: "deployment",
    icon: Globe,
    critical: true,
  },
  {
    id: "visual-regression",
    title: "Visual Regression Test",
    description: "Check for UI/UX regressions",
    status: "pending",
    category: "test",
    icon: Eye,
    critical: false,
  },
]

export function DeploymentChecklist() {
  const [items, setItems] = useState(checklistItems)
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const completedItems = items.filter((item) => item.status === "completed").length
  const failedItems = items.filter((item) => item.status === "failed").length
  const progress = (completedItems / items.length) * 100

  const runChecklist = async () => {
    setIsRunning(true)
    setCurrentStep(0)

    for (let i = 0; i < items.length; i++) {
      setCurrentStep(i)

      // Update item to running
      setItems((prev) => prev.map((item, index) => (index === i ? { ...item, status: "running" } : item)))

      // Simulate check duration
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000 + 1000))

      // Simulate success/failure (90% success rate)
      const success = Math.random() > 0.1

      setItems((prev) =>
        prev.map((item, index) => (index === i ? { ...item, status: success ? "completed" : "failed" } : item)),
      )
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: ChecklistItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "running":
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Clock className="w-5 h-5 text-blue-600" />
          </motion.div>
        )
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getCategoryColor = (category: ChecklistItem["category"]) => {
    switch (category) {
      case "build":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "test":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "security":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "performance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "deployment":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const canDeploy = items.filter((item) => item.critical).every((item) => item.status === "completed")

  return (
    <div className="space-y-6">
      {/* Header */}
      <EliteCard variant="gradient">
        <EliteCardHeader>
          <EliteCardTitle className="flex items-center gap-3 text-white">
            <Rocket className="w-6 h-6" />
            Production Deployment Checklist
          </EliteCardTitle>
        </EliteCardHeader>
        <EliteCardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-white">
              <span>Overall Progress</span>
              <span className="font-mono">
                {completedItems}/{items.length}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex gap-4 text-sm">
              <span>✅ Completed: {completedItems}</span>
              <span>❌ Failed: {failedItems}</span>
              <span>⏳ Remaining: {items.length - completedItems - failedItems}</span>
            </div>
          </div>
        </EliteCardContent>
      </EliteCard>

      {/* Checklist Items */}
      <EliteCard variant="glass">
        <EliteCardContent className="p-6">
          <div className="space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
                  item.status === "running" && "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
                  item.status === "completed" && "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
                  item.status === "failed" && "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
                  item.status === "pending" && "bg-muted/30 border-border",
                )}
              >
                <div className="flex-shrink-0">{getStatusIcon(item.status)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{item.title}</h4>
                    {item.critical && (
                      <Badge variant="destructive" className="text-xs">
                        Critical
                      </Badge>
                    )}
                    <Badge className={cn("text-xs", getCategoryColor(item.category))}>{item.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>

                <div className="flex-shrink-0">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </EliteCardContent>
      </EliteCard>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <EliteButton
          variant="gradient"
          size="lg"
          onClick={runChecklist}
          disabled={isRunning}
          loading={isRunning}
          icon={<Rocket className="w-5 h-5" />}
          className="flex-1"
        >
          {isRunning ? "Running Checks..." : "Run Pre-Deployment Checks"}
        </EliteButton>

        <EliteButton
          variant={canDeploy ? "default" : "outline"}
          size="lg"
          disabled={!canDeploy || isRunning}
          icon={<Globe className="w-5 h-5" />}
          className="flex-1"
        >
          Deploy to Production
        </EliteButton>
      </div>

      {/* Status Messages */}
      {failedItems > 0 && (
        <EliteCard variant="glass" className="border-red-200 dark:border-red-800">
          <EliteCardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              <span className="font-medium">
                {failedItems} check(s) failed. Please resolve issues before deploying.
              </span>
            </div>
          </EliteCardContent>
        </EliteCard>
      )}

      {canDeploy && completedItems === items.length && (
        <EliteCard variant="glass" className="border-green-200 dark:border-green-800">
          <EliteCardContent className="p-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">All checks passed! Ready for production deployment. 🚀</span>
            </div>
          </EliteCardContent>
        </EliteCard>
      )}
    </div>
  )
}
