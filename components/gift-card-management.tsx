"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Gift, CreditCard, Search, Plus, Eye, DollarSign, Calendar } from "lucide-react"
import { format } from "date-fns"
import { advancedPOSService } from "@/lib/advanced-pos-service"

interface GiftCard {
  id: string
  card_number: string
  initial_balance: number
  current_balance: number
  customer_id?: string
  customer_name?: string
  status: string
  created_at: string
  expiry_date?: string
  transactions: GiftCardTransaction[]
}

interface GiftCardTransaction {
  id: string
  amount: number
  transaction_type: "purchase" | "redemption" | "refund"
  date: string
  reference?: string
}

export default function GiftCardManagement() {
  const { toast } = useToast()
  const [giftCards, setGiftCards] = useState<GiftCard[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showRedeemDialog, setShowRedeemDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Create gift card form
  const [newCardAmount, setNewCardAmount] = useState(0)
  const [newCardCustomer, setNewCardCustomer] = useState("")
  const [newCardExpiry, setNewCardExpiry] = useState("")

  // Redeem gift card form
  const [redeemCardNumber, setRedeemCardNumber] = useState("")
  const [redeemAmount, setRedeemAmount] = useState(0)

  useEffect(() => {
    loadGiftCards()
  }, [])

  const loadGiftCards = async () => {
    try {
      setIsLoading(true)
      // Mock data - replace with actual API call
      const mockGiftCards: GiftCard[] = [
        {
          id: "1",
          card_number: "GC123456789012",
          initial_balance: 100.0,
          current_balance: 75.5,
          customer_name: "John Doe",
          status: "active",
          created_at: "2024-01-15",
          expiry_date: "2025-01-15",
          transactions: [
            {
              id: "1",
              amount: 100.0,
              transaction_type: "purchase",
              date: "2024-01-15",
            },
            {
              id: "2",
              amount: -24.5,
              transaction_type: "redemption",
              date: "2024-01-20",
              reference: "TX-ABC123",
            },
          ],
        },
      ]
      setGiftCards(mockGiftCards)
    } catch (error) {
      console.error("Error loading gift cards:", error)
      toast({
        title: "Error",
        description: "Failed to load gift cards",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createGiftCard = async () => {
    if (newCardAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Gift card amount must be greater than 0",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await advancedPOSService.createGiftCard({
        amount: newCardAmount,
        customer_id: newCardCustomer || undefined,
        expiry_date: newCardExpiry || undefined,
      })

      if (result.success) {
        toast({
          title: "Gift Card Created",
          description: `Gift card ${result.giftCard.card_number} created successfully`,
        })

        setShowCreateDialog(false)
        setNewCardAmount(0)
        setNewCardCustomer("")
        setNewCardExpiry("")
        loadGiftCards()
      }
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create gift card",
        variant: "destructive",
      })
    }
  }

  const redeemGiftCard = async () => {
    if (!redeemCardNumber || redeemAmount <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid card number and amount",
        variant: "destructive",
      })
      return
    }

    try {
      // Find gift card
      const card = giftCards.find((gc) => gc.card_number === redeemCardNumber)

      if (!card) {
        toast({
          title: "Card Not Found",
          description: "Gift card number not found",
          variant: "destructive",
        })
        return
      }

      if (card.current_balance < redeemAmount) {
        toast({
          title: "Insufficient Balance",
          description: `Card balance: $${card.current_balance.toFixed(2)}`,
          variant: "destructive",
        })
        return
      }

      // Process redemption
      toast({
        title: "Gift Card Redeemed",
        description: `$${redeemAmount.toFixed(2)} redeemed from gift card`,
      })

      setShowRedeemDialog(false)
      setRedeemCardNumber("")
      setRedeemAmount(0)
      loadGiftCards()
    } catch (error) {
      toast({
        title: "Redemption Failed",
        description: "Failed to redeem gift card",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "expired":
        return "destructive"
      case "used":
        return "secondary"
      case "cancelled":
        return "outline"
      default:
        return "secondary"
    }
  }

  const filteredCards = giftCards.filter(
    (card) =>
      card.card_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (card.customer_name && card.customer_name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  if (isLoading) {
    return <div className="p-4">Loading gift cards...</div>
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gift Card Management</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Gift Card
          </Button>
          <Button variant="outline" onClick={() => setShowRedeemDialog(true)}>
            <CreditCard className="h-4 w-4 mr-2" />
            Redeem Gift Card
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by card number or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="used">Used</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {filteredCards
              .filter((card) => card.status === "active" && card.current_balance > 0)
              .map((card) => (
                <Card key={card.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-mono">{card.card_number}</CardTitle>
                      <Badge variant={getStatusColor(card.status)}>{card.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Current Balance</p>
                        <p className="text-xl font-bold text-green-600">${card.current_balance.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Initial Balance</p>
                        <p className="font-bold">${card.initial_balance.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-medium">{card.customer_name || "Anonymous"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="font-medium">{format(new Date(card.created_at), "MMM dd, yyyy")}</p>
                      </div>
                    </div>

                    {card.expiry_date && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">
                          Expires: {format(new Date(card.expiry_date), "MMM dd, yyyy")}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setSelectedCard(card)} className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        onClick={() => {
                          setRedeemCardNumber(card.card_number)
                          setShowRedeemDialog(true)
                        }}
                        className="flex-1"
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Redeem
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {filteredCards.filter((card) => card.status === "active" && card.current_balance > 0).length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Gift className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No active gift cards found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="used">
          <div className="grid gap-4">
            {filteredCards
              .filter((card) => card.current_balance === 0)
              .map((card) => (
                <Card key={card.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-mono">{card.card_number}</CardTitle>
                      <Badge variant="secondary">Used</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Initial Value</p>
                        <p className="font-bold">${card.initial_balance.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-medium">{card.customer_name || "Anonymous"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="font-medium">{format(new Date(card.created_at), "MMM dd, yyyy")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="expired">
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No expired gift cards</p>
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="grid gap-4">
            {filteredCards.map((card) => (
              <Card key={card.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-mono">{card.card_number}</CardTitle>
                    <Badge variant={getStatusColor(card.status)}>{card.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Balance</p>
                      <p className="font-bold">${card.current_balance.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Initial</p>
                      <p className="font-bold">${card.initial_balance.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-medium">{card.customer_name || "Anonymous"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-medium">{format(new Date(card.created_at), "MMM dd")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Gift Card Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Gift Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Gift Card Amount</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={newCardAmount}
                onChange={(e) => setNewCardAmount(Number(e.target.value))}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Customer (Optional)</Label>
              <Input
                value={newCardCustomer}
                onChange={(e) => setNewCardCustomer(e.target.value)}
                placeholder="Search customer..."
              />
            </div>

            <div className="space-y-2">
              <Label>Expiry Date (Optional)</Label>
              <Input type="date" value={newCardExpiry} onChange={(e) => setNewCardExpiry(e.target.value)} />
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={createGiftCard} disabled={newCardAmount <= 0} className="flex-1">
                Create Gift Card
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Redeem Gift Card Dialog */}
      <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redeem Gift Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Gift Card Number</Label>
              <Input
                value={redeemCardNumber}
                onChange={(e) => setRedeemCardNumber(e.target.value)}
                placeholder="Enter gift card number"
              />
            </div>

            <div className="space-y-2">
              <Label>Redemption Amount</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={redeemAmount}
                onChange={(e) => setRedeemAmount(Number(e.target.value))}
                placeholder="0.00"
              />
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowRedeemDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={redeemGiftCard} disabled={!redeemCardNumber || redeemAmount <= 0} className="flex-1">
                Redeem Gift Card
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gift Card Details Dialog */}
      {selectedCard && (
        <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Gift Card Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Card Number</Label>
                  <p className="font-mono text-lg">{selectedCard.card_number}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge variant={getStatusColor(selectedCard.status)}>{selectedCard.status}</Badge>
                </div>
                <div>
                  <Label>Current Balance</Label>
                  <p className="text-2xl font-bold text-green-600">${selectedCard.current_balance.toFixed(2)}</p>
                </div>
                <div>
                  <Label>Initial Balance</Label>
                  <p className="text-xl font-bold">${selectedCard.initial_balance.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <Label>Transaction History</Label>
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                  {selectedCard.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium capitalize">{transaction.transaction_type}</p>
                        <p className="text-sm text-gray-500">{format(new Date(transaction.date), "MMM dd, yyyy")}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                          {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        {transaction.reference && <p className="text-xs text-gray-500">{transaction.reference}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
