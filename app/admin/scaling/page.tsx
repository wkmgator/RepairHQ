"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { RealTimeMonitoring } from "@/components/scaling/real-time-monitoring"
import { EliteCard, EliteCardContent, EliteCardHeader, EliteCardTitle } from "@/components/ui/elite-card"
import { EliteButton } from "@/components/ui/elite-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Rocket, Globe, Zap, Database, Activity, TrendingUp, Settings } from "lucide-react"

export default function ScalingDashboard() {
  const [autoScalingEnabled, setAutoScalingEnabled] = useState(true)
  const [scalingEvents, setScalingEvents] = useState([])

  const triggerAutoScale = async () => {
    try {
      const response = await fetch("/api/monitoring/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "auto-scale" }),
      })

      if (response.ok) {
        // Show success notification
        console.log("Auto-scaling triggered successfully")
      }
    } catch (error) {
      console.error("Failed to trigger auto-scaling:", error)
    }
  }

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
            Infrastructure Scaling
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage your global infrastructure for millions of users
          </p>
        </div>
        <div className="flex gap-3">
          <EliteButton
            variant="outline"
            icon={<Settings className="w-4 h-4" />}
            onClick={() => setAutoScalingEnabled(!autoScalingEnabled)}
          >
            Auto-Scale: {autoScalingEnabled ? "ON" : "OFF"}
          </EliteButton>
          <EliteButton variant="gradient" icon={<Rocket className="w-4 h-4" />} onClick={triggerAutoScale}>
            Trigger Scale
          </EliteButton>
        </div>
      </motion.div>

      {/* Scaling Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <EliteCard variant="glass">
          <EliteCardHeader>
            <EliteCardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Global Infrastructure Status
            </EliteCardTitle>
          </EliteCardHeader>
          <EliteCardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Database className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold">Database Clusters</h3>
                <p className="text-sm text-muted-foreground">5 Active Regions</p>
                <Badge variant="default" className="mt-2">
                  Healthy
                </Badge>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold">API Instances</h3>
                <p className="text-sm text-muted-foreground">12 Running</p>
                <Badge variant="default" className="mt-2">
                  Scaling
                </Badge>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Activity className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold">Background Jobs</h3>
                <p className="text-sm text-muted-foreground">8 Workers</p>
                <Badge variant="secondary" className="mt-2">
                  Processing
                </Badge>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="font-semibold">CDN Nodes</h3>
                <p className="text-sm text-muted-foreground">150+ Global</p>
                <Badge variant="default" className="mt-2">
                  Optimized
                </Badge>
              </div>
            </div>
          </EliteCardContent>
        </EliteCard>
      </motion.div>

      {/* Monitoring Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="monitoring" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="monitoring">Real-Time Monitoring</TabsTrigger>
            <TabsTrigger value="scaling">Auto-Scaling Rules</TabsTrigger>
            <TabsTrigger value="regions">Global Regions</TabsTrigger>
            <TabsTrigger value="costs">Cost Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring">
            <RealTimeMonitoring />
          </TabsContent>

          <TabsContent value="scaling">
            <EliteCard variant="glass">
              <EliteCardHeader>
                <EliteCardTitle>Auto-Scaling Configuration</EliteCardTitle>
              </EliteCardHeader>
              <EliteCardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                      <h3 className="font-semibold mb-2">CPU Scaling</h3>
                      <p className="text-sm text-muted-foreground mb-2">Scale when CPU &gt; 70%</p>
                      <Badge variant="default">Active</Badge>
                    </div>

                    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                      <h3 className="font-semibold mb-2">Memory Scaling</h3>
                      <p className="text-sm text-muted-foreground mb-2">Scale when Memory &gt; 80%</p>
                      <Badge variant="default">Active</Badge>
                    </div>

                    <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
                      <h3 className="font-semibold mb-2">Request Scaling</h3>
                      <p className="text-sm text-muted-foreground mb-2">Scale when RPS &gt; 5000</p>
                      <Badge variant="default">Active</Badge>
                    </div>

                    <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                      <h3 className="font-semibold mb-2">Response Time</h3>
                      <p className="text-sm text-muted-foreground mb-2">Scale when latency &gt; 2s</p>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                </div>
              </EliteCardContent>
            </EliteCard>
          </TabsContent>

          <TabsContent value="regions">
            <EliteCard variant="glass">
              <EliteCardHeader>
                <EliteCardTitle>Global Region Status</EliteCardTitle>
              </EliteCardHeader>
              <EliteCardContent>
                <div className="space-y-4">
                  {[
                    { region: "US East (Virginia)", status: "Healthy", load: 65, latency: "45ms" },
                    { region: "US West (Oregon)", status: "Healthy", load: 72, latency: "52ms" },
                    { region: "Europe (Ireland)", status: "Healthy", load: 58, latency: "38ms" },
                    { region: "Asia Pacific (Singapore)", status: "Warning", load: 89, latency: "67ms" },
                    { region: "Asia Pacific (Tokyo)", status: "Healthy", load: 43, latency: "41ms" },
                  ].map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            region.status === "Healthy"
                              ? "bg-green-500"
                              : region.status === "Warning"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />
                        <div>
                          <div className="font-medium">{region.region}</div>
                          <div className="text-sm text-muted-foreground">Load: {region.load}%</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            region.status === "Healthy"
                              ? "default"
                              : region.status === "Warning"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {region.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">{region.latency}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </EliteCardContent>
            </EliteCard>
          </TabsContent>

          <TabsContent value="costs">
            <EliteCard variant="glass">
              <EliteCardHeader>
                <EliteCardTitle>Cost Optimization</EliteCardTitle>
              </EliteCardHeader>
              <EliteCardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">$2,847</div>
                    <div className="text-sm text-muted-foreground">Monthly Infrastructure Cost</div>
                    <Badge variant="default" className="mt-2">
                      15% below budget
                    </Badge>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">$0.12</div>
                    <div className="text-sm text-muted-foreground">Cost per 1000 requests</div>
                    <Badge variant="secondary" className="mt-2">
                      Optimized
                    </Badge>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">23%</div>
                    <div className="text-sm text-muted-foreground">Cost savings from auto-scaling</div>
                    <Badge variant="default" className="mt-2">
                      Excellent
                    </Badge>
                  </div>
                </div>
              </EliteCardContent>
            </EliteCard>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
