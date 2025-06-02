"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Palette,
  Coins,
  Shield,
  ExternalLink,
  Copy,
  Zap,
  Star,
  Trophy,
  Crown,
  Target,
  Eye,
  Heart,
  ShoppingCart,
} from "lucide-react"
import Image from "next/image"

const GATORVERSE_NFT_ADDRESS = "0xCf24B7ca03B14A546371388C09a9921155e1ccbB"
const GBT_TOKEN_ADDRESS = "0xBf632C62b6b842015B5912a2B2cE942bd13A30Ad"

interface GatorverseNFT {
  id: string
  tokenId: number
  name: string
  description: string
  image: string
  rarity: "common" | "rare" | "epic" | "legendary"
  price: number
  priceGBT: number
  seller: string
  attributes: Array<{ trait_type: string; value: string }>
  utilities: string[]
  isListed: boolean
  lastSale?: number
}

interface NFTCollection {
  name: string
  description: string
  totalSupply: number
  floorPrice: number
  volume24h: number
  owners: number
}

const mockNFTs: GatorverseNFT[] = [
  {
    id: "1",
    tokenId: 1001,
    name: "Cyber Gator #1001",
    description: "A futuristic gator with cybernetic enhancements",
    image: "/placeholder.svg?height=300&width=300&query=cyberpunk+alligator+neon",
    rarity: "rare",
    price: 0.5,
    priceGBT: 5900,
    seller: "0x742d35Cc...",
    attributes: [
      { trait_type: "Background", value: "Neon City" },
      { trait_type: "Body", value: "Cyber" },
      { trait_type: "Eyes", value: "Laser" },
      { trait_type: "Accessory", value: "Neural Link" },
    ],
    utilities: ["10% GBT Staking Bonus", "Priority Repair Service", "Exclusive Discord Access"],
    isListed: true,
    lastSale: 0.45,
  },
  {
    id: "2",
    tokenId: 1002,
    name: "Golden Gator #1002",
    description: "A majestic golden gator with royal attributes",
    image: "/placeholder.svg?height=300&width=300&query=golden+alligator+crown+royal",
    rarity: "legendary",
    price: 2.1,
    priceGBT: 24800,
    seller: "0x8f3e2a1b...",
    attributes: [
      { trait_type: "Background", value: "Royal Palace" },
      { trait_type: "Body", value: "Golden" },
      { trait_type: "Crown", value: "Diamond" },
      { trait_type: "Aura", value: "Divine" },
    ],
    utilities: ["25% GBT Staking Bonus", "VIP Repair Service", "Governance Voting Rights", "Exclusive Events"],
    isListed: true,
    lastSale: 1.8,
  },
  {
    id: "3",
    tokenId: 1003,
    name: "Tech Gator #1003",
    description: "A tech-savvy gator with repair tools",
    image: "/placeholder.svg?height=300&width=300&query=alligator+tools+technology+repair",
    rarity: "epic",
    price: 1.2,
    priceGBT: 14200,
    seller: "0x9a4f5c2d...",
    attributes: [
      { trait_type: "Background", value: "Workshop" },
      { trait_type: "Body", value: "Tech" },
      { trait_type: "Tools", value: "Advanced" },
      { trait_type: "Skill", value: "Master" },
    ],
    utilities: ["15% Repair Discounts", "Free Diagnostics", "Tool Access", "Tech Support Priority"],
    isListed: true,
  },
]

const collectionStats: NFTCollection = {
  name: "Gatorverse",
  description: "A collection of unique digital gators with real-world utilities",
  totalSupply: 10000,
  floorPrice: 0.3,
  volume24h: 45.7,
  owners: 3247,
}

export function GatorverseNFTMarketplace() {
  const [selectedNFT, setSelectedNFT] = useState<GatorverseNFT | null>(null)
  const [filterRarity, setFilterRarity] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("price")

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800"
      case "rare":
        return "bg-blue-100 text-blue-800"
      case "epic":
        return "bg-purple-100 text-purple-800"
      case "legendary":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const copyContractAddress = () => {
    navigator.clipboard.writeText(GATORVERSE_NFT_ADDRESS)
  }

  const buyNFT = (nft: GatorverseNFT) => {
    console.log(`Buying NFT ${nft.name} for ${nft.price} BNB`)
    // Implement NFT purchase logic
  }

  const buyWithGBT = (nft: GatorverseNFT) => {
    console.log(`Buying NFT ${nft.name} for ${nft.priceGBT} GBT`)
    // Implement GBT purchase logic
  }

  return (
    <div className="space-y-6">
      {/* Collection Header */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                🐊
              </div>
              <div>
                <CardTitle className="text-2xl">{collectionStats.name} NFT Collection</CardTitle>
                <CardDescription className="flex items-center space-x-2">
                  <span>{collectionStats.description}</span>
                  <Badge variant="outline">Verified</Badge>
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Floor Price</div>
              <div className="text-2xl font-bold">{collectionStats.floorPrice} BNB</div>
              <div className="text-sm text-muted-foreground">24h Volume: {collectionStats.volume24h} BNB</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{collectionStats.totalSupply.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Supply</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{collectionStats.owners.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Owners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {((collectionStats.owners / collectionStats.totalSupply) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Unique Owners</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <Button variant="outline" size="sm" onClick={copyContractAddress}>
                  <Copy className="mr-1 h-3 w-3" />
                  Contract
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://bscscan.com/address/${GATORVERSE_NFT_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-1 h-3 w-3" />
                    BscScan
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="marketplace" className="space-y-4">
        <TabsList>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="my-nfts">My NFTs</TabsTrigger>
          <TabsTrigger value="utilities">NFT Utilities</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace">
          <div className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Rarity:</label>
                    <select
                      value={filterRarity}
                      onChange={(e) => setFilterRarity(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="all">All</option>
                      <option value="common">Common</option>
                      <option value="rare">Rare</option>
                      <option value="epic">Epic</option>
                      <option value="legendary">Legendary</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="price">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rarity">Rarity</option>
                      <option value="recent">Recently Listed</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NFT Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {mockNFTs.map((nft) => (
                <Card key={nft.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={nft.image || "/placeholder.svg"}
                      alt={nft.name}
                      width={300}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={getRarityColor(nft.rarity)}>{nft.rarity}</Badge>
                    </div>
                    <div className="absolute top-2 left-2 flex space-x-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-medium truncate">{nft.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{nft.description}</p>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground">Price</div>
                          <div className="font-bold">{nft.price} BNB</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">or</div>
                          <div className="font-bold text-yellow-600">{nft.priceGBT} GBT</div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="flex-1" onClick={() => setSelectedNFT(nft)}>
                              <ShoppingCart className="mr-1 h-3 w-3" />
                              Buy
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{nft.name}</DialogTitle>
                              <DialogDescription>Purchase this Gatorverse NFT</DialogDescription>
                            </DialogHeader>
                            {selectedNFT && (
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <Image
                                    src={selectedNFT.image || "/placeholder.svg"}
                                    alt={selectedNFT.name}
                                    width={300}
                                    height={300}
                                    className="w-full rounded-lg"
                                  />
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="font-medium mb-2">Attributes</h3>
                                    <div className="grid gap-2">
                                      {selectedNFT.attributes.map((attr, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                          <span className="text-muted-foreground">{attr.trait_type}:</span>
                                          <span className="font-medium">{attr.value}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <h3 className="font-medium mb-2">Utilities</h3>
                                    <div className="space-y-1">
                                      {selectedNFT.utilities.map((utility, index) => (
                                        <div key={index} className="flex items-center text-sm">
                                          <Zap className="mr-1 h-3 w-3 text-yellow-500" />
                                          {utility}
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Button onClick={() => buyNFT(selectedNFT)} className="w-full">
                                      Buy for {selectedNFT.price} BNB
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => buyWithGBT(selectedNFT)}
                                      className="w-full"
                                    >
                                      <Coins className="mr-2 h-4 w-4" />
                                      Buy for {selectedNFT.priceGBT} GBT
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="utilities">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Coins className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-medium">GBT Staking Bonus</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">NFT holders receive enhanced staking rewards</p>
                <div className="space-y-1 text-sm">
                  <div>• Common: +5% APY</div>
                  <div>• Rare: +10% APY</div>
                  <div>• Epic: +15% APY</div>
                  <div>• Legendary: +25% APY</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">Priority Services</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Skip queues and get VIP treatment</p>
                <div className="space-y-1 text-sm">
                  <div>• Priority repair booking</div>
                  <div>• Dedicated support line</div>
                  <div>• Express diagnostics</div>
                  <div>• Premium warranties</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Crown className="h-5 w-5 text-purple-600" />
                  <h3 className="font-medium">Exclusive Access</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Members-only benefits and events</p>
                <div className="space-y-1 text-sm">
                  <div>• Private Discord channels</div>
                  <div>• Early feature access</div>
                  <div>• Exclusive NFT drops</div>
                  <div>• Community events</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Target className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium">Governance Rights</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Vote on platform decisions</p>
                <div className="space-y-1 text-sm">
                  <div>• DAO proposal voting</div>
                  <div>• Feature prioritization</div>
                  <div>• Treasury decisions</div>
                  <div>• Partnership approvals</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Star className="h-5 w-5 text-orange-600" />
                  <h3 className="font-medium">Repair Discounts</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Save money on all repair services</p>
                <div className="space-y-1 text-sm">
                  <div>• Common: 5% discount</div>
                  <div>• Rare: 10% discount</div>
                  <div>• Epic: 15% discount</div>
                  <div>• Legendary: 20% discount</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Trophy className="h-5 w-5 text-red-600" />
                  <h3 className="font-medium">Collectible Value</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Tradeable digital assets with utility</p>
                <div className="space-y-1 text-sm">
                  <div>• Marketplace trading</div>
                  <div>• Rarity appreciation</div>
                  <div>• Cross-platform utility</div>
                  <div>• Future integrations</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={copyContractAddress}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Contract
        </Button>
        <Button variant="outline" asChild>
          <a href={`https://bscscan.com/address/${GATORVERSE_NFT_ADDRESS}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            View on BscScan
          </a>
        </Button>
        <Button asChild>
          <a href="https://opensea.io" target="_blank" rel="noopener noreferrer">
            <Palette className="mr-2 h-4 w-4" />
            View on OpenSea
          </a>
        </Button>
      </div>
    </div>
  )
}
