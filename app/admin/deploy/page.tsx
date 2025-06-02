"use client"

import { motion } from "framer-motion"
import { DeploymentExecutor } from "@/components/deployment-executor"
import { EliteCard, EliteCardContent, EliteCardHeader, EliteCardTitle } from "@/components/ui/elite-card"
import { Badge } from "@/components/ui/badge"
import { Globe, Zap, GitBranch, Clock, Users } from "lucide-react"

export default function DeployPage() {
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
            Deploy to Production
          </h1>
          <p className="text-muted-foreground mt-2">
            Execute automated deployment of your elite RepairHQ design system.
          </p>
        </div>
        <div className="flex gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <GitBranch className="w-3 h-3" />
            main
          </Badge>
          <Badge variant="default" className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            Production Ready
          </Badge>
        </div>
      </motion.div>

      {/* Pre-Deployment Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <EliteCard variant="glass">
          <EliteCardHeader>
            <EliteCardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Deployment Information
            </EliteCardTitle>
          </EliteCardHeader>
          <EliteCardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold">Target Environment</h3>
                <p className="text-sm text-muted-foreground">Production (repairhq.io)</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold">Estimated Duration</h3>
                <p className="text-sm text-muted-foreground">3-5 minutes</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold">Downtime</h3>
                <p className="text-sm text-muted-foreground">Zero downtime</p>
              </div>
            </div>
          </EliteCardContent>
        </EliteCard>
      </motion.div>

      {/* Deployment Executor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <DeploymentExecutor />
      </motion.div>
    </div>
  )
}
