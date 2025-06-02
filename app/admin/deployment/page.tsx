"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DeploymentChecklist } from "@/components/deployment-checklist"
import { EliteCard, EliteCardContent, EliteCardHeader, EliteCardTitle } from "@/components/ui/elite-card"
import { EliteButton } from "@/components/ui/elite-button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Rocket, Globe, Zap, Database, CheckCircle2, AlertTriangle, ExternalLink, GitBranch, Clock } from "lucide-react"

export default function DeploymentPage() {
  const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "deploying" | "success" | "failed">("idle")
  const [lastDeployment, setLastDeployment] = useState({
    timestamp: new Date().toISOString(),
    version: "v2.1.0-elite",
    commit: "abc123f",
    duration: "2m 34s",
    status: "success",
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Production Deployment
          </h1>
          <p className="text-muted-foreground mt-2">Deploy your elite RepairHQ design system to production.</p>
        </div>
        <div className="flex gap-3">
          <EliteButton variant="outline" icon={<GitBranch className="w-4 h-4" />}>
            main branch
          </EliteButton>
          <EliteButton variant="gradient" icon={<ExternalLink className="w-4 h-4" />}>
            View Live Site
          </EliteButton>
        </div>
      </motion.div>

      {/* Deployment Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <EliteCard variant="glass">
          <EliteCardHeader>
            <EliteCardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Current Deployment Status
            </EliteCardTitle>
          </EliteCardHeader>
          <EliteCardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold">Production</h3>
                <p className="text-sm text-muted-foreground">repairhq.io</p>
                <Badge variant="default" className="mt-2">
                  Live
                </Badge>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold">Version</h3>
                <p className="text-sm text-muted-foreground">{lastDeployment.version}</p>
                <Badge variant="secondary" className="mt-2">
                  Latest
                </Badge>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold">Last Deploy</h3>
                <p className="text-sm text-muted-foreground">{lastDeployment.duration}</p>
                <Badge variant="outline" className="mt-2">
                  {new Date(lastDeployment.timestamp).toLocaleDateString()}
                </Badge>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="font-semibold">Performance</h3>
                <p className="text-sm text-muted-foreground">98/100</p>
                <Badge variant="default" className="mt-2">
                  Excellent
                </Badge>
              </div>
            </div>
          </EliteCardContent>
        </EliteCard>
      </motion.div>

      {/* Deployment Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="checklist" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="checklist">Pre-Deploy Checks</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="history">Deploy History</TabsTrigger>
          </TabsList>

          <TabsContent value="checklist">
            <DeploymentChecklist />
          </TabsContent>

          <TabsContent value="environment">
            <EliteCard variant="glass">
              <EliteCardHeader>
                <EliteCardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-green-600" />
                  Environment Configuration
                </EliteCardTitle>
              </EliteCardHeader>
              <EliteCardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Database</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Supabase connection verified</p>
                    </div>

                    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Payments</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Stripe configured and active</p>
                    </div>

                    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Email</span>
                      </div>
                      <p className="text-sm text-muted-foreground">SendGrid API connected</p>
                    </div>

                    <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span className="font-medium">SMS</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Twilio setup recommended</p>
                    </div>
                  </div>
                </div>
              </EliteCardContent>
            </EliteCard>
          </TabsContent>

          <TabsContent value="performance">
            <EliteCard variant="glass">
              <EliteCardHeader>
                <EliteCardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Performance Metrics
                </EliteCardTitle>
              </EliteCardHeader>
              <EliteCardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">98</div>
                    <div className="text-sm text-muted-foreground">Performance Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">1.2s</div>
                    <div className="text-sm text-muted-foreground">First Contentful Paint</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">2.1s</div>
                    <div className="text-sm text-muted-foreground">Largest Contentful Paint</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">0.05</div>
                    <div className="text-sm text-muted-foreground">Cumulative Layout Shift</div>
                  </div>
                </div>
              </EliteCardContent>
            </EliteCard>
          </TabsContent>

          <TabsContent value="history">
            <EliteCard variant="glass">
              <EliteCardHeader>
                <EliteCardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  Deployment History
                </EliteCardTitle>
              </EliteCardHeader>
              <EliteCardContent>
                <div className="space-y-4">
                  {[
                    { version: "v2.1.0-elite", time: "2 hours ago", status: "success", commit: "abc123f" },
                    { version: "v2.0.5", time: "1 day ago", status: "success", commit: "def456a" },
                    { version: "v2.0.4", time: "3 days ago", status: "success", commit: "ghi789b" },
                    { version: "v2.0.3", time: "1 week ago", status: "failed", commit: "jkl012c" },
                  ].map((deploy, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-3">
                        {deploy.status === "success" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        )}
                        <div>
                          <div className="font-medium">{deploy.version}</div>
                          <div className="text-sm text-muted-foreground">Commit: {deploy.commit}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={deploy.status === "success" ? "default" : "destructive"}>{deploy.status}</Badge>
                        <div className="text-sm text-muted-foreground mt-1">{deploy.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </EliteCardContent>
            </EliteCard>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
