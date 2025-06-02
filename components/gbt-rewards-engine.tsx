"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Share2,
  Copy,
  QrCode,
  Sparkles,
  Trophy,
  Users,
  CheckCircle2,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

interface RewardTransaction {
  id: string
  user_id: string
  transaction_type: string
  amount: number
  description: string
  created_at: string
  status: string
  reference_id?: string
}

interface RewardCampaign {
  id: string
  name: string
  description: string
  reward_amount: number
  start_date: string
  end_date: string
  is_active: boolean
  conditions: string
  total_rewards_given: number
  max_rewards_per_user: number
}

interface RewardTier {
  id: string
  name: string
  min_points: number
  benefits: string[]
  icon: string
  color: string
}

export default function GBTRewardsEngine() {
  const [loading, setLoading] = useState(true)
  const [userRewards, setUserRewards] = useState({
    balance: 2450,
    lifetime: 3200,
    tier: "Silver",
    nextTier: "Gold",
    nextTierThreshold: 5000,
    referralCode: "REPAIR4U",
    referralCount: 3,
    referralEarnings: 300,
  })
  const [transactions, setTransactions] = useState<RewardTransaction[]>([])
  const [campaigns, setCampaigns] = useState<RewardCampaign[]>([])
  const [tiers, setTiers] = useState<RewardTier[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [referralEmail, setReferralEmail] = useState("")

  useEffect(() => {
    fetchRewardsData()
  }, [])

  const fetchRewardsData = async () => {
    setLoading(true)
    try {
      // In a real app, these would be actual Supabase queries
      // Fetch transactions
      const { data: transactionsData } = await supabase
        .from("reward_transactions")
        .select("*")
        .eq("user_id", "current-user-id")
        .order("created_at", { ascending: false })
        .limit(10)

      // Fetch campaigns
      const { data: campaignsData } = await supabase
        .from("reward_campaigns")
        .select("*")
        .eq("is_active", true)
        .order("end_date", { ascending: true })

      // Fetch tiers
      const { data: tiersData } = await supabase
        .from("reward_tiers")
        .select("*")
        .order("min_points", { ascending: true })

      // Simulate data for demo
      setTransactions([
        {
          id: "tx-1",
          user_id: "current-user-id",
          transaction_type: "earn",
          amount: 250,
          description: "Repair service completed",
          created_at: "2023-11-15T14:23:45Z",
          status: "completed",
        },
        {
          id: "tx-2",
          user_id: "current-user-id",
          transaction_type: "earn",
          amount: 100,
          description: "Monthly loyalty bonus",
          created_at: "2023-11-10T09:12:33Z",
          status: "completed",
        },
        {
          id: "tx-3",
          user_id: "current-user-id",
          transaction_type: "earn",
          amount: 300,
          description: "Referral reward",
          created_at: "2023-11-05T11:34:21Z",
          status: "completed",
        },
        {
          id: "tx-4",
          user_id: "current-user-id",
          transaction_type: "redeem",
          amount: 500,
          description: "Discount on iPhone repair",
          created_at: "2023-10-28T15:22:18Z",
          status: "completed",
        },
        {
          id: "tx-5",
          user_id: "current-user-id",
          transaction_type: "earn",
          amount: 150,
          description: "Review bonus",
          created_at: "2023-10-20T13:45:56Z",
          status: "completed",
        },
      ])

      setCampaigns([
        {
          id: "camp-1",
          name: "Holiday Repair Special",
          description: "Earn double GBT tokens on all repairs during the holiday season",
          reward_amount: 2,
          start_date: "2023-12-01T00:00:00Z",
          end_date: "2023-12-31T23:59:59Z",
          is_active: true,
          conditions: "Valid on all repair services",
          total_rewards_given: 12500,
          max_rewards_per_user: 1000,
        },
        {
          id: "camp-2",
          name: "Referral Bonus",
          description: "Earn 100 GBT tokens for each friend you refer who completes a repair",
          reward_amount: 100,
          start_date: "2023-01-01T00:00:00Z",
          end_date: "2023-12-31T23:59:59Z",
          is_active: true,
          conditions: "New customers only",
          total_rewards_given: 45000,
          max_rewards_per_user: 0,
        },
        {
          id: "camp-3",
          name: "Review Rewards",
          description: "Earn 50 GBT tokens for leaving a review after your repair",
          reward_amount: 50,
          start_date: "2023-01-01T00:00:00Z",
          end_date: "2023-12-31T23:59:59Z",
          is_active: true,
          conditions: "Must include photo",
          total_rewards_given: 32500,
          max_rewards_per_user: 50,
        },
      ])

      setTiers([
        {
          id: "tier-1",
          name: "Bronze",
          min_points: 0,
          benefits: ["Basic repair discounts", "Standard service"],
          icon: "award",
          color: "bg-amber-700",
        },
        {
          id: "tier-2",
          name: "Silver",
          min_points: 1000,
          benefits: ["5% off all repairs", "Priority scheduling", "Free diagnostics"],
          icon: "award",
          color: "bg-gray-400",
        },
        {
          id: "tier-3",
          name: "Gold",
          min_points: 5000,
          benefits: ["10% off all repairs", "VIP scheduling", "Free diagnostics", "Extended warranty"],
          icon: "award",
          color: "bg-yellow-500",
        },
        {
          id: "tier-4",
          name: "Platinum",
          min_points: 10000,
          benefits: [
            "15% off all repairs",
            "VIP scheduling",
            "Free diagnostics",
            "Extended warranty",
            "Free loaner devices",
          ],
          icon: "award",
          color: "bg-blue-400",
        },
      ])
    } catch (error) {
      console.error("Error fetching rewards data:", error)
    } finally {
      setLoading(false)
    }
  }

  const sendReferral = () => {
    if (!referralEmail) return

    // In a real app, this would send an API request
    alert(`Referral invitation sent to ${referralEmail}`)
    setReferralEmail("")
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(userRewards.referralCode)
    alert("Referral code copied to clipboard!")
  }

  const redeemRewards = (amount: number) => {
    if (userRewards.balance < amount) {
      alert("Insufficient rewards balance")
      return
    }

    // In a real app, this would create a redemption transaction
    alert(`${amount} GBT tokens redeemed successfully!`)

    // Update local state for demo
    setUserRewards({
      ...userRewards,
      balance: userRewards.balance - amount,
    })

    setTransactions([
      {
        id: `tx-${Date.now()}`,
        user_id: "current-user-id",
        transaction_type: "redeem",
        amount: amount,
        description: "Manual redemption",
        created_at: new Date().toISOString(),
        status: "completed",
      },
      ...transactions,
    ])
  }

  const getCurrentTier = () => {
    const userTier = tiers.find(
      (tier) =>
        userRewards.lifetime >= tier.min_points &&
        (tiers.findIndex((t) => t.id === tier.id) === tiers.length - 1 ||
          userRewards.lifetime < tiers[tiers.findIndex((t) => t.id === tier.id) + 1].min_points),
    )
    return userTier
  }

  const getNextTier = () => {
    const currentTierIndex = tiers.findIndex((tier) => tier.name === userRewards.tier)
    if (currentTierIndex < tiers.length - 1) {
      return tiers[currentTierIndex + 1]
    }
    return null
  }

  const calculateProgress = () => {
    const currentTier = tiers.find((tier) => tier.name === userRewards.tier)
    const nextTier = getNextTier()

    if (!currentTier || !nextTier) return 100

    const range = nextTier.min_points - currentTier.min_points
    const userProgress = userRewards.lifetime - currentTier.min_points
    return Math.min(Math.round((userProgress / range) * 100), 100)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">GBT Rewards</h1>
          <p className="text-gray-600">Earn and redeem GatorBite Tokens for repairs and services</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userRewards.balance} GBT</div>
            <p className="text-xs text-muted-foreground">Available to redeem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lifetime Earnings</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userRewards.lifetime} GBT</div>
            <p className="text-xs text-muted-foreground">Total earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userRewards.tier}</div>
            <div className="mt-2">
              <Progress value={calculateProgress()} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {userRewards.nextTier
                ? `${userRewards.nextTierThreshold - userRewards.lifetime} points to ${userRewards.nextTier}`
                : "Max tier reached"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userRewards.referralCount}</div>
            <p className="text-xs text-muted-foreground">Earned {userRewards.referralEarnings} GBT from referrals</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="redeem">Redeem</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rewards Overview</CardTitle>
              <CardDescription>Your GBT rewards status and benefits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Current Tier: {userRewards.tier}</h3>
                <div className="flex items-center gap-2">
                  <Progress value={calculateProgress()} className="flex-1 h-2" />
                  <span className="text-sm text-gray-500">{calculateProgress()}%</span>
                </div>
                <p className="text-sm text-gray-600">
                  {userRewards.nextTier
                    ? `${userRewards.nextTierThreshold - userRewards.lifetime} more points to reach ${userRewards.nextTier} tier`
                    : "You've reached the highest tier!"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-medium mb-2">Your Benefits</h4>
                  <ul className="space-y-1">
                    {getCurrentTier()?.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {getNextTier() && (
                  <div>
                    <h4 className="font-medium mb-2">Next Tier Benefits</h4>
                    <ul className="space-y-1">
                      {getNextTier()?.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          {getCurrentTier()?.benefits.includes(benefit) ? (
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                          ) : (
                            <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                          )}
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest GBT activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${transaction.transaction_type === "earn" ? "bg-green-100" : "bg-blue-100"}`}
                        >
                          {transaction.transaction_type === "earn" ? (
                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`font-bold ${transaction.transaction_type === "earn" ? "text-green-600" : "text-blue-600"}`}
                      >
                        {transaction.transaction_type === "earn" ? "+" : "-"}
                        {transaction.amount} GBT
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => setActiveTab("transactions")}>
                  View All Transactions
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Campaigns</CardTitle>
                <CardDescription>Special ways to earn more GBT</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.slice(0, 2).map((campaign) => (
                    <div key={campaign.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="font-medium">{campaign.name}</div>
                        <Badge variant="outline">{campaign.reward_amount}x</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <div>Ends: {new Date(campaign.end_date).toLocaleDateString()}</div>
                        {campaign.max_rewards_per_user > 0 && <div>Max: {campaign.max_rewards_per_user} GBT</div>}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => setActiveTab("campaigns")}>
                  View All Campaigns
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All your GBT token activity</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.transaction_type === "earn" ? "default" : "secondary"}>
                          {transaction.transaction_type === "earn" ? "Earned" : "Redeemed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <span className={transaction.transaction_type === "earn" ? "text-green-600" : "text-blue-600"}>
                          {transaction.transaction_type === "earn" ? "+" : "-"}
                          {transaction.amount} GBT
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="redeem" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Redeem Rewards</CardTitle>
              <CardDescription>Use your GBT tokens for discounts and perks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">$10 Repair Discount</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-3xl font-bold">200 GBT</div>
                    <p className="text-sm text-gray-600 mt-2">Redeem for a $10 discount on your next repair service</p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => redeemRewards(200)} disabled={userRewards.balance < 200} className="w-full">
                      Redeem Now
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">$25 Repair Discount</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-3xl font-bold">450 GBT</div>
                    <p className="text-sm text-gray-600 mt-2">Redeem for a $25 discount on your next repair service</p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => redeemRewards(450)} disabled={userRewards.balance < 450} className="w-full">
                      Redeem Now
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Free Diagnostic</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-3xl font-bold">100 GBT</div>
                    <p className="text-sm text-gray-600 mt-2">Redeem for a free diagnostic service (normally $19.99)</p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => redeemRewards(100)} disabled={userRewards.balance < 100} className="w-full">
                      Redeem Now
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Priority Service</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-3xl font-bold">150 GBT</div>
                    <p className="text-sm text-gray-600 mt-2">
                      Skip the line with priority service on your next repair
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => redeemRewards(150)} disabled={userRewards.balance < 150} className="w-full">
                      Redeem Now
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Screen Protector</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-3xl font-bold">300 GBT</div>
                    <p className="text-sm text-gray-600 mt-2">
                      Redeem for a free premium screen protector installation
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => redeemRewards(300)} disabled={userRewards.balance < 300} className="w-full">
                      Redeem Now
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">$50 Repair Discount</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-3xl font-bold">800 GBT</div>
                    <p className="text-sm text-gray-600 mt-2">Redeem for a $50 discount on your next repair service</p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => redeemRewards(800)} disabled={userRewards.balance < 800} className="w-full">
                      Redeem Now
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
              <CardDescription>Special opportunities to earn more GBT tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">{campaign.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        {campaign.reward_amount}x Rewards
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <h4 className="text-sm font-medium">Campaign Period</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(campaign.start_date).toLocaleDateString()} -{" "}
                          {new Date(campaign.end_date).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium">Conditions</h4>
                        <p className="text-sm text-gray-600">{campaign.conditions}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium">Limits</h4>
                        <p className="text-sm text-gray-600">
                          {campaign.max_rewards_per_user > 0
                            ? `Max ${campaign.max_rewards_per_user} GBT per user`
                            : "No limit per user"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Total rewards given: {campaign.total_rewards_given} GBT
                        </div>
                        <Button variant="outline" size="sm">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Refer Friends & Earn</CardTitle>
              <CardDescription>Invite friends to RepairHQ and earn GBT tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium">Your Referral Stats</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <h4 className="text-sm font-medium">Referral Code</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">{userRewards.referralCode}</code>
                      <Button variant="ghost" size="sm" onClick={copyReferralCode}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium">Successful Referrals</h4>
                    <p className="text-2xl font-bold mt-1">{userRewards.referralCount}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium">Earnings from Referrals</h4>
                    <p className="text-2xl font-bold mt-1">{userRewards.referralEarnings} GBT</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Invite by Email</h3>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="friend@example.com"
                    value={referralEmail}
                    onChange={(e) => setReferralEmail(e.target.value)}
                  />
                  <Button onClick={sendReferral} disabled={!referralEmail}>
                    Send Invite
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Share Your Link</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share on Facebook
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share on Twitter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share on LinkedIn
                  </Button>
                  <Button variant="outline" size="sm">
                    <QrCode className="h-4 w-4 mr-2" />
                    Show QR Code
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800">How Referrals Work</h3>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-start gap-2 text-sm text-blue-700">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>Share your unique referral code or link with friends</div>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-blue-700">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>When they sign up and complete their first repair, you'll earn 100 GBT tokens</div>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-blue-700">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>Your friend also gets 50 GBT tokens as a welcome bonus</div>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-blue-700">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 flex-shrink-0 mt-0.5">
                      4
                    </div>
                    <div>There's no limit to how many friends you can refer!</div>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
