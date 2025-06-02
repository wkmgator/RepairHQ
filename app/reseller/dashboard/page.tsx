"use client"

import { CardContent } from "@/components/ui/card"

import { CardDescription } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { resellerService, type ResellerDashboardData } from "@/lib/reseller-service"
import { ReferralLinkCard } from "@/components/reseller/referral-link-card"
import { ResellerMetricsSummary } from "@/components/reseller/reseller-metrics-summary"
import { RecentReferralsList } from "@/components/reseller/recent-referrals-list"
import { CommissionSummary } from "@/components/reseller/commission-summary"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertTriangle } from "lucide-react"

export default function ResellerDashboardPage() {
  const { user, loading: authLoading, userProfile } = useAuth()
  const { toast } = useToast()
  const [dashboardData, setDashboardData] = useState<ResellerDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && user && userProfile) {
      fetchDashboardData()
    } else if (!authLoading && !user) {
      setError("You must be logged in to view the reseller dashboard.")
      setIsLoading(false)
    }
  }, [authLoading, user, userProfile])

  const fetchDashboardData = async () => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await resellerService.getResellerDashboardData(user)
      setDashboardData(data)
    } catch (err) {
      console.error("Failed to fetch reseller dashboard data:", err)
      setError("Failed to load dashboard data. Please try again later.")
      toast({
        title: "Error",
        description: "Could not load reseller dashboard data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBecomeReseller = async () => {
    if (!user) return
    try {
      await resellerService.createResellerProfile(user.id)
      toast({
        title: "Success!",
        description: "You are now a reseller. Your dashboard is loading.",
      })
      fetchDashboardData() // Refresh data
    } catch (err) {
      console.error("Failed to become a reseller:", err)
      toast({
        title: "Error",
        description: "Could not activate reseller profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Reseller Dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Access Denied or Error</h1>
        <p className="text-muted-foreground">{error}</p>
        {/* Optionally, add a button to retry or go home */}
      </div>
    )
  }

  if (!dashboardData?.profile && userProfile && !userProfile.is_reseller) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-semibold mb-4">Become a Reseller</h1>
        <p className="text-muted-foreground mb-6">
          Join our reseller program to earn commissions by referring new users!
        </p>
        <Button onClick={handleBecomeReseller} size="lg">
          Activate Reseller Account
        </Button>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto py-10 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Data Unavailable</h1>
        <p className="text-muted-foreground">Could not load reseller dashboard data.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reseller Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userProfile?.first_name || user?.email}! Manage your referrals and earnings.
          </p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" className="mt-4 md:mt-0">
          Refresh Data
        </Button>
      </div>

      <ReferralLinkCard referralLink={dashboardData.referralLink} />

      <ResellerMetricsSummary
        totalReferrals={dashboardData.totalReferrals}
        convertedReferrals={dashboardData.convertedReferrals}
        pendingCommissions={dashboardData.pendingCommissions}
        paidCommissions={dashboardData.paidCommissions}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentReferralsList referrals={dashboardData.recentReferrals} />
        <CommissionSummary payouts={dashboardData.recentPayouts} />
      </div>

      {/* Placeholder for Downline Management */}
      <Card>
        <CardHeader>
          <CardTitle>Your Downline</CardTitle>
          <CardDescription>View and manage resellers you have recruited.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Downline management feature coming soon.</p>
        </CardContent>
      </Card>

      {/* Placeholder for Marketing Materials */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing Materials</CardTitle>
          <CardDescription>Access resources to help you promote RepairHQ.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Marketing materials coming soon.</p>
        </CardContent>
      </Card>
    </div>
  )
}
