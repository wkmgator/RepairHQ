"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Shield, QrCode, ExternalLink, CheckCircle, Clock, AlertTriangle, Smartphone, Wrench } from "lucide-react"

interface BlockchainWarranty {
  id: string
  deviceType: string
  deviceModel: string
  serialNumber: string
  repairType: string
  warrantyPeriod: number
  issueDate: Date
  expiryDate: Date
  status: "active" | "expired" | "claimed"
  txHash: string
  nftTokenId: string
  repairShop: string
  customer: string
}

const mockWarranties: BlockchainWarranty[] = [
  {
    id: "1",
    deviceType: "iPhone",
    deviceModel: "iPhone 14 Pro",
    serialNumber: "F2LW8J9K2L",
    repairType: "Screen Replacement",
    warrantyPeriod: 90,
    issueDate: new Date("2024-01-15"),
    expiryDate: new Date("2024-04-15"),
    status: "active",
    txHash: "0xabc123def456...",
    nftTokenId: "RPH001",
    repairShop: "RepairHQ Downtown",
    customer: "John Smith",
  },
  {
    id: "2",
    deviceType: "Samsung",
    deviceModel: "Galaxy S23",
    serialNumber: "R58N2M9P1K",
    repairType: "Battery Replacement",
    warrantyPeriod: 60,
    issueDate: new Date("2024-01-10"),
    expiryDate: new Date("2024-03-10"),
    status: "active",
    txHash: "0xdef456ghi789...",
    nftTokenId: "RPH002",
    repairShop: "RepairHQ Mall",
    customer: "Sarah Davis",
  },
]

export function BlockchainWarrantySystem() {
  const [warranties, setWarranties] = useState<BlockchainWarranty[]>(mockWarranties)
  const [searchSerial, setSearchSerial] = useState("")
  const [isCreatingWarranty, setIsCreatingWarranty] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "expired":
        return "bg-red-100 text-red-800"
      case "claimed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "expired":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "claimed":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const createWarrantyNFT = () => {
    setIsCreatingWarranty(true)
    // Simulate blockchain transaction
    setTimeout(() => {
      setIsCreatingWarranty(false)
    }, 3000)
  }

  const searchWarranty = () => {
    // Simulate warranty search
    console.log("Searching for warranty:", searchSerial)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Blockchain Warranty System</h2>
          <p className="text-muted-foreground">Immutable warranty records powered by blockchain technology</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Shield className="mr-2 h-4 w-4" />
              Create Warranty NFT
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Warranty NFT</DialogTitle>
              <DialogDescription>Generate a blockchain-based warranty certificate as an NFT</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Device Type</label>
                  <Input placeholder="iPhone" />
                </div>
                <div>
                  <label className="text-sm font-medium">Model</label>
                  <Input placeholder="iPhone 14 Pro" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Serial Number</label>
                <Input placeholder="F2LW8J9K2L" />
              </div>
              <div>
                <label className="text-sm font-medium">Repair Type</label>
                <Input placeholder="Screen Replacement" />
              </div>
              <div>
                <label className="text-sm font-medium">Warranty Period (days)</label>
                <Input type="number" placeholder="90" />
              </div>
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Blockchain Transaction</AlertTitle>
                <AlertDescription>
                  This will create an immutable warranty record on the blockchain. Gas fees will apply.
                </AlertDescription>
              </Alert>
              <Button onClick={createWarrantyNFT} disabled={isCreatingWarranty} className="w-full">
                {isCreatingWarranty ? "Creating NFT..." : "Create Warranty NFT"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Warranty Lookup</CardTitle>
          <CardDescription>Search for warranty information using device serial number</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter device serial number..."
              value={searchSerial}
              onChange={(e) => setSearchSerial(e.target.value)}
              className="flex-1"
            />
            <Button onClick={searchWarranty}>
              <QrCode className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Warranties</TabsTrigger>
          <TabsTrigger value="nft">NFT Collection</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Warranty Records</CardTitle>
              <CardDescription>Blockchain-verified warranty certificates</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Repair Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>NFT ID</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warranties.map((warranty) => (
                    <TableRow key={warranty.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Smartphone className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{warranty.deviceModel}</div>
                            <div className="text-sm text-muted-foreground">{warranty.deviceType}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{warranty.serialNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Wrench className="h-4 w-4" />
                          <span>{warranty.repairType}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(warranty.status)}
                          <Badge className={getStatusColor(warranty.status)}>{warranty.status}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{warranty.expiryDate.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {warranty.nftTokenId}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <QrCode className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
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

        <TabsContent value="nft">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {warranties.map((warranty) => (
              <Card key={warranty.id} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 transform rotate-45 translate-x-8 -translate-y-8" />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono">
                      #{warranty.nftTokenId}
                    </Badge>
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Warranty Certificate</CardTitle>
                  <CardDescription>{warranty.deviceModel}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Serial:</span>
                    <span className="font-mono">{warranty.serialNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Repair:</span>
                    <span>{warranty.repairType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valid Until:</span>
                    <span>{warranty.expiryDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shop:</span>
                    <span>{warranty.repairShop}</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    View on OpenSea
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Warranty Verification</CardTitle>
              <CardDescription>Verify warranty authenticity using blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Blockchain Verification</AlertTitle>
                <AlertDescription>
                  All warranty records are stored on the blockchain and can be independently verified.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-medium">Verification Methods</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <QrCode className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">QR Code Scan</div>
                        <div className="text-sm text-muted-foreground">Instant verification via QR code</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <ExternalLink className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Blockchain Explorer</div>
                        <div className="text-sm text-muted-foreground">View transaction on BSCScan</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-medium">Smart Contract</div>
                        <div className="text-sm text-muted-foreground">Direct contract interaction</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Verification Benefits</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Tamper-proof records</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Global accessibility</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Instant verification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Fraud prevention</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Transferable ownership</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
