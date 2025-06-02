"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Wallet,
  Coins,
  TrendingUp,
  Shield,
  ExternalLink,
  Copy,
  RefreshCw,
  Zap,
  Star,
  Trophy,
  Crown,
  Target,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  Clock,
} from "lucide-react"
import Image from "next/image"

const GBT_TOKEN_ADDRESS = "0xBf632C62b6b842015B5912a2B2cE942bd13A30Ad"
const GATORVERSE_NFT_ADDRESS = "0xCf24B7ca03B14A546371388C09a9921155e1ccbB"
const BSC_CHAIN_ID = 56
const BSC_RPC_URL = "https://bsc-dataseed.binance.org/"

interface WalletConnection {
  address: string
  balance: number
  isConnected: boolean
  network: string
}

interface GBTTransaction {
  id: string
  type: "earned" | "redeemed" | "staked" | "transferred"
  amount: number
  description: string
  timestamp: Date
  txHash: string
  status: "pending" | "confirmed" | "failed"
}

interface GBTReward {
  id: string
  name: string
  description: string
  cost: number
  category: "discount" | "service" | "product" | "exclusive"
  available: boolean
  image?: string
}

const mockWallet: WalletConnection = {
  address: "0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4",
  balance: 1247.89,
  isConnected: false,
  network: "BSC Mainnet",
}

const mockTransactions: GBTTransaction[] = [
  {
    id: "1",
    type: "earned",
    amount: 50,
    description: "Repair completion bonus",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    txHash: "0xabc123...",
    status: "confirmed",
  },
  {
    id: "2",
    type: "redeemed",
    amount: -25,
    description: "10% discount coupon",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    txHash: "0xdef456...",
    status: "confirmed",
  },
  {
    id: "3",
    type: "earned",
    amount: 100,
    description: "Customer referral bonus",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    txHash: "0xghi789...",
    status: "confirmed",
  },
]

const gbtRewards: GBTReward[] = [
  {
    id: "1",
    name: "10% Repair Discount",
    description: "Get 10% off your next repair service",
    cost: 25,
    category: "discount",
    available: true,
  },
  {
    id: "2",
    name: "Free Screen Protector",
    description: "Premium tempered glass screen protector",
    cost: 50,
    category: "product",
    available: true,
  },
  {
    id: "3",
    name: "Priority Service",
    description: "Skip the queue with VIP priority service",
    cost: 75,
    category: "service",
    available: true,
  },
  {
    id: "4",
    name: "Exclusive Gatorverse NFT",
    description: "Limited edition RepairHQ x Gatorverse NFT collectible",
    cost: 200,
    category: "exclusive",
    available: true,
  },
  {
    id: "5",
    name: "Rare Gatorverse NFT",
    description: "Ultra-rare Gatorverse NFT with special utilities",
    cost: 500,
    category: "exclusive",
    available: true,
  },
]

export function Web3GBTRewards() {
  const [wallet, setWallet] = useState<WalletConnection>(mockWallet)
  const [transactions, setTransactions] = useState<GBTTransaction[]>(mockTransactions)
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedReward, setSelectedReward] = useState<GBTReward | null>(null)
  const [stakingAmount, setStakingAmount] = useState("")

  const connectWallet = async () => {
    setIsConnecting(true)
    // Simulate wallet connection
    setTimeout(() => {
      setWallet((prev) => ({ ...prev, isConnected: true }))
      setIsConnecting(false)
    }, 2000)
  }

  const disconnectWallet = () => {
    setWallet((prev) => ({ ...prev, isConnected: false }))
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address)
  }

  const redeemReward = (reward: GBTReward) => {
    if (wallet.balance >= reward.cost) {
      const newTransaction: GBTTransaction = {
        id: Date.now().toString(),
        type: "redeemed",
        amount: -reward.cost,
        description: `Redeemed: ${reward.name}`,
        timestamp: new Date(),
        txHash: `0x${Math.random().toString(16).substr(2, 8)}...`,
        status: "pending",
      }

      setTransactions((prev) => [newTransaction, ...prev])
      setWallet((prev) => ({ ...prev, balance: prev.balance - reward.cost }))
      setSelectedReward(null)
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "earned":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case "redeemed":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      case "staked":
        return <Shield className="h-4 w-4 text-blue-600" />
      case "transferred":
        return <RefreshCw className="h-4 w-4 text-purple-600" />
      default:
        return <Coins className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case "pending":
        return <Clock className="h-3 w-3 text-yellow-600" />
      case "failed":
        return <ExternalLink className="h-3 w-3 text-red-600" />
      default:
        return null
    }
  }

  const addTokenToWallet = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: GBT_TOKEN_ADDRESS,
            symbol: "GBT",
            decimals: 18,
            image: "/images/gatorbite-logo.png",
          },
        },
      })
    } catch (error) {
      console.error("Error adding token:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with GatorBite Branding */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-900 via-blue-800 to-teal-800 p-6 text-white">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative h-16 w-16">
              <Image src="/images/gatorbite-logo.png" alt="GatorBite Logo" fill className="object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">GBT Rewards System</h1>
              <p className="text-blue-100">Fueling the Future of Rewards with GatorBite Token</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">Current GBT Price</div>
            <div className="text-xl font-bold">$0.0847</div>
            <div className="flex items-center text-sm text-green-300">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12.5%
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-transparent" />
      </div>

      {/* Wallet Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="mr-2 h-5 w-5" />
            Web3 Wallet
          </CardTitle>
          <CardDescription>Connect your wallet to earn and redeem GBT tokens</CardDescription>
        </CardHeader>
        <CardContent>
          {!wallet.isConnected ? (
            <div className="text-center py-8">
              <Wallet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground mb-4">
                Connect your Web3 wallet to start earning GBT tokens for repairs and referrals
              </p>
              <Button onClick={connectWallet} disabled={isConnecting} size="lg">
                {isConnecting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full" />
                  <div>
                    <div className="font-medium">Wallet Connected</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                      <Button variant="ghost" size="sm" onClick={copyAddress} className="ml-2 h-6 w-6 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={disconnectWallet}>
                  Disconnect
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">Contract Address</div>
                        <div className="text-xs font-mono">
                          {GBT_TOKEN_ADDRESS.slice(0, 10)}...{GBT_TOKEN_ADDRESS.slice(-8)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(GBT_TOKEN_ADDRESS)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">GBT Balance</div>
                        <div className="text-2xl font-bold">{wallet.balance.toFixed(2)}</div>
                      </div>
                      <Coins className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">USD Value</div>
                        <div className="text-2xl font-bold">${(wallet.balance * 0.0847).toFixed(2)}</div>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {wallet.isConnected && (
        <Tabs defaultValue="rewards" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rewards">Rewards Store</TabsTrigger>
            <TabsTrigger value="earn">Earn GBT</TabsTrigger>
            <TabsTrigger value="stake">Staking</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="rewards">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {gbtRewards.map((reward) => (
                <Card key={reward.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="capitalize">
                        {reward.category}
                      </Badge>
                      <div className="flex items-center text-yellow-600">
                        <Coins className="mr-1 h-4 w-4" />
                        <span className="font-bold">{reward.cost}</span>
                      </div>
                    </div>
                    <h3 className="font-medium mb-1">{reward.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full"
                          disabled={!reward.available || wallet.balance < reward.cost}
                          onClick={() => setSelectedReward(reward)}
                        >
                          {wallet.balance < reward.cost ? "Insufficient GBT" : "Redeem"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Redeem Reward</DialogTitle>
                          <DialogDescription>Confirm your GBT token redemption</DialogDescription>
                        </DialogHeader>
                        {selectedReward && (
                          <div className="space-y-4">
                            <div className="p-4 border rounded-lg">
                              <h3 className="font-medium">{selectedReward.name}</h3>
                              <p className="text-sm text-muted-foreground">{selectedReward.description}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-sm">Cost:</span>
                                <div className="flex items-center text-yellow-600">
                                  <Coins className="mr-1 h-4 w-4" />
                                  <span className="font-bold">{selectedReward.cost} GBT</span>
                                </div>
                              </div>
                            </div>
                            <Alert>
                              <Shield className="h-4 w-4" />
                              <AlertTitle>Blockchain Transaction</AlertTitle>
                              <AlertDescription>
                                This action will create a blockchain transaction. Gas fees may apply.
                              </AlertDescription>
                            </Alert>
                            <div className="flex space-x-2">
                              <Button variant="outline" onClick={() => setSelectedReward(null)} className="flex-1">
                                Cancel
                              </Button>
                              <Button onClick={() => selectedReward && redeemReward(selectedReward)} className="flex-1">
                                Confirm Redemption
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="earn">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Earn GBT Tokens</CardTitle>
                  <CardDescription>Multiple ways to earn GatorBite tokens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Target className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Complete Repair</div>
                        <div className="text-sm text-muted-foreground">Earn tokens for each repair</div>
                      </div>
                    </div>
                    <Badge variant="outline">50 GBT</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Star className="h-5 w-5 text-yellow-600" />
                      <div>
                        <div className="font-medium">Customer Review</div>
                        <div className="text-sm text-muted-foreground">5-star reviews earn bonus</div>
                      </div>
                    </div>
                    <Badge variant="outline">25 GBT</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Trophy className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-medium">Refer Customer</div>
                        <div className="text-sm text-muted-foreground">Successful referrals</div>
                      </div>
                    </div>
                    <Badge variant="outline">100 GBT</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Crown className="h-5 w-5 text-gold" />
                      <div>
                        <div className="font-medium">Monthly Bonus</div>
                        <div className="text-sm text-muted-foreground">Top performer reward</div>
                      </div>
                    </div>
                    <Badge variant="outline">500 GBT</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Earning Progress</CardTitle>
                  <CardDescription>Track your monthly earning goals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Repairs Completed</span>
                      <span>12/20</span>
                    </div>
                    <Progress value={60} />
                    <div className="text-xs text-muted-foreground mt-1">8 more for bonus</div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Customer Reviews</span>
                      <span>8/15</span>
                    </div>
                    <Progress value={53} />
                    <div className="text-xs text-muted-foreground mt-1">7 more for bonus</div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Referrals</span>
                      <span>3/5</span>
                    </div>
                    <Progress value={60} />
                    <div className="text-xs text-muted-foreground mt-1">2 more for bonus</div>
                  </div>

                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertTitle>Streak Bonus Active!</AlertTitle>
                    <AlertDescription>You're on a 7-day streak. Keep it up for 2x rewards!</AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stake">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Stake GBT Tokens</CardTitle>
                  <CardDescription>Earn passive rewards by staking your GBT</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Current APY</span>
                      <span className="text-xl font-bold text-blue-600">12.5%</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Earn rewards for helping secure the network</div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount to Stake</label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={stakingAmount}
                        onChange={(e) => setStakingAmount(e.target.value)}
                      />
                      <Button variant="outline">Max</Button>
                    </div>
                    <div className="text-xs text-muted-foreground">Available: {wallet.balance.toFixed(2)} GBT</div>
                  </div>

                  <Button className="w-full" disabled={!stakingAmount}>
                    Stake GBT
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Staking Rewards</CardTitle>
                  <CardDescription>Your current staking positions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Staked Amount</span>
                        <span className="font-bold">500 GBT</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Rewards Earned</span>
                        <span className="text-sm font-medium text-green-600">+15.2 GBT</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Lock Period</span>
                        <span className="text-sm">23 days remaining</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      Claim Rewards
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Your GBT token transaction history</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>TX Hash</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getTransactionIcon(tx.type)}
                            <span className="capitalize">{tx.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={tx.amount > 0 ? "text-green-600" : "text-red-600"}>
                            {tx.amount > 0 ? "+" : ""}
                            {tx.amount} GBT
                          </span>
                        </TableCell>
                        <TableCell>{tx.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(tx.status)}
                            <span className="capitalize">{tx.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>{tx.timestamp.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-mono">{tx.txHash}</span>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Quick Actions */}
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={addTokenToWallet}>
          <Wallet className="mr-2 h-4 w-4" />
          Add GBT to Wallet
        </Button>
        <Button variant="outline" asChild>
          <a href={`https://bscscan.com/token/${GBT_TOKEN_ADDRESS}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            View on BscScan
          </a>
        </Button>
        <Button asChild>
          <a href="https://pancakeswap.finance/swap" target="_blank" rel="noopener noreferrer">
            <Coins className="mr-2 h-4 w-4" />
            Buy GBT on PancakeSwap
          </a>
        </Button>
      </div>
    </div>
  )
}
