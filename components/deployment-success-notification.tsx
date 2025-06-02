"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { EliteButton } from "@/components/ui/elite-button"
import { CheckCircle2, ExternalLink, X, Rocket, Globe, Zap } from "lucide-react"
import confetti from "canvas-confetti"

interface DeploymentSuccessNotificationProps {
  isVisible: boolean
  onClose: () => void
  deploymentUrl: string
  deploymentId: string
}

export function DeploymentSuccessNotification({
  isVisible,
  onClose,
  deploymentUrl,
  deploymentId,
}: DeploymentSuccessNotificationProps) {
  useEffect(() => {
    if (isVisible) {
      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B"],
      })

      // Auto-close after 10 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          className="fixed bottom-6 right-6 z-50 max-w-md"
        >
          <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-2xl shadow-2xl text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Deployment Successful! 🎉</h3>
                  <p className="text-white/80 text-sm">Your elite RepairHQ is now live</p>
                </div>
              </div>
              <EliteButton variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/10">
                <X className="w-4 h-4" />
              </EliteButton>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4" />
                <span>Live at: {deploymentUrl}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Rocket className="w-4 h-4" />
                <span>Deployment ID: {deploymentId}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4" />
                <span>Performance Score: 98/100</span>
              </div>
            </div>

            <div className="flex gap-2">
              <EliteButton
                variant="outline"
                size="sm"
                onClick={() => window.open(deploymentUrl, "_blank")}
                icon={<ExternalLink className="w-4 h-4" />}
                className="flex-1 text-white border-white/20 hover:bg-white/10"
              >
                View Live Site
              </EliteButton>
              <EliteButton
                variant="outline"
                size="sm"
                onClick={() => window.open("https://vercel.com/dashboard", "_blank")}
                className="text-white border-white/20 hover:bg-white/10"
              >
                Dashboard
              </EliteButton>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
