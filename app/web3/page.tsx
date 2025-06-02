"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Web3GBTRewards } from "@/components/web3-gbt-rewards"
import { BlockchainWarrantySystem } from "@/components/blockchain-warranty-system"
import { GBTTokenInfo } from "@/components/gbt-token-info"
import { GatorverseNFTMarketplace } from "@/components/gatorverse-nft-marketplace"

export default function Web3Page() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Web3 Integration</h2>
      </div>

      <Tabs defaultValue="rewards" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rewards">GBT Rewards System</TabsTrigger>
          <TabsTrigger value="nft">Gatorverse NFTs</TabsTrigger>
          <TabsTrigger value="token">Token Info</TabsTrigger>
          <TabsTrigger value="warranty">Blockchain Warranty</TabsTrigger>
        </TabsList>

        <TabsContent value="rewards">
          <Web3GBTRewards />
        </TabsContent>

        <TabsContent value="nft">
          <GatorverseNFTMarketplace />
        </TabsContent>

        <TabsContent value="token">
          <GBTTokenInfo />
        </TabsContent>

        <TabsContent value="warranty">
          <BlockchainWarrantySystem />
        </TabsContent>
      </Tabs>
    </div>
  )
}
