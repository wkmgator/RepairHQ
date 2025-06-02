"use client"

import { EnterpriseMonitoringDashboard } from "@/components/scaling/enterprise-monitoring-dashboard"
import { motion } from "framer-motion"

export default function EnterpriseScalingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <EnterpriseMonitoringDashboard />
      </motion.div>
    </div>
  )
}
