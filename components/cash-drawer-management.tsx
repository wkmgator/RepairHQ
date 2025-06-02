"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getSupabaseClient, type CashDrawer } from "@/lib/supabase-pos"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, DollarSign, Clock, AlertCircle } from "lucide-react"

interface Register {
  id: string
  name: string
  status: string
}

interface CashDrawerManagementProps {
  register: Register
  currentDrawer: CashDrawer | null
  drawerHistory: CashDrawer[]
  user: any
}

export default function CashDrawerManagement({
  register,
  currentDrawer,
  drawerHistory,
  user,
}: CashDrawerManagementProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openingAmount, setOpeningAmount] = useState("100.00")
  const [closingAmount, setClosingAmount] = useState("")
  const [notes, setNotes] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  const handleOpenDrawer = async () => {
    if (!openingAmount || isNaN(Number.parseFloat(openingAmount))) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid opening amount",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const { data, error } = await supabase
        .from("pos_cash_drawers")
        .insert({
          register_id: register.id,
          employee_id: user.id,
          opening_amount: Number.parseFloat(openingAmount),
          status: "open",
          opened_at: new Date().toISOString(),
          expected_amount: Number.parseFloat(openingAmount),
          notes: notes || null,
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Cash Drawer Opened",
        description: `Cash drawer opened with $${Number.parseFloat(openingAmount).toFixed(2)}`,
      })

      router.refresh()
    } catch (error) {
      console.error("Error opening cash drawer:", error)
      toast({
        title: "Error",
        description: "Failed to open cash drawer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseDrawer = async () => {
    if (!currentDrawer) return

    if (!closingAmount || isNaN(Number.parseFloat(closingAmount))) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid closing amount",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const { data, error } = await supabase
        .from("pos_cash_drawers")
        .update({
          closing_amount: Number.parseFloat(closingAmount),
          difference: Number.parseFloat(closingAmount) - currentDrawer.expected_amount,
          status: "closed",
          closed_at: new Date().toISOString(),
          notes: notes || currentDrawer.notes,
        })
        .eq("id", currentDrawer.id)
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Cash Drawer Closed",
        description: `Cash drawer closed with $${Number.parseFloat(closingAmount).toFixed(2)}`,
      })

      router.refresh()
    } catch (error) {
      console.error("Error closing cash drawer:", error)
      toast({
        title: "Error",
        description: "Failed to close cash drawer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cash Drawer Management</h1>
        <Badge variant="outline" className="text-base">
          Register: {register.name}
        </Badge>
      </div>

      <Tabs defaultValue={currentDrawer ? "current" : "open"} className="w-full">
        <TabsList className="mb-4">
          {currentDrawer && <TabsTrigger value="current">Current Drawer</TabsTrigger>}
          {!currentDrawer && <TabsTrigger value="open">Open Drawer</TabsTrigger>}
          <TabsTrigger value="history">Drawer History</TabsTrigger>
        </TabsList>

        {currentDrawer && (
          <TabsContent value="current">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Current Cash Drawer
                </CardTitle>
                <CardDescription>Opened on {formatDate(currentDrawer.opened_at)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-muted-foreground">Opening Amount</div>
                    <div className="mt-1 text-2xl font-bold">{formatCurrency(currentDrawer.opening_amount)}</div>
                  </div>

                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-muted-foreground">Expected Amount</div>
                    <div className="mt-1 text-2xl font-bold">{formatCurrency(currentDrawer.expected_amount)}</div>
                  </div>

                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium text-muted-foreground">Status</div>
                    <div className="mt-1">
                      <Badge variant="default">Open</Badge>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">Close Cash Drawer</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="closing-amount">Closing Amount</Label>
                      <Input
                        id="closing-amount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={closingAmount}
                        onChange={(e) => setClosingAmount(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any notes about this cash drawer session"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>

                    <Button className="w-full" onClick={handleCloseDrawer} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Closing...
                        </>
                      ) : (
                        "Close Drawer"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {!currentDrawer && (
          <TabsContent value="open">
            <Card>
              <CardHeader>
                <CardTitle>Open Cash Drawer</CardTitle>
                <CardDescription>Start a new cash drawer session for this register</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="opening-amount">Opening Amount</Label>
                  <Input
                    id="opening-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="100.00"
                    value={openingAmount}
                    onChange={(e) => setOpeningAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the amount of cash in the drawer at the start of the session
                  </p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any notes about this cash drawer session"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleOpenDrawer} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Opening...
                    </>
                  ) : (
                    "Open Cash Drawer"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Cash Drawer History
              </CardTitle>
              <CardDescription>Recent cash drawer sessions for this register</CardDescription>
            </CardHeader>
            <CardContent>
              {drawerHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">No cash drawer history found</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">Opened</th>
                        <th className="p-2 text-left font-medium">Closed</th>
                        <th className="p-2 text-right font-medium">Opening</th>
                        <th className="p-2 text-right font-medium">Closing</th>
                        <th className="p-2 text-right font-medium">Difference</th>
                        <th className="p-2 text-center font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drawerHistory.map((drawer) => (
                        <tr key={drawer.id} className="border-b">
                          <td className="p-2 text-sm">{formatDate(drawer.opened_at)}</td>
                          <td className="p-2 text-sm">{drawer.closed_at ? formatDate(drawer.closed_at) : "—"}</td>
                          <td className="p-2 text-right">{formatCurrency(drawer.opening_amount)}</td>
                          <td className="p-2 text-right">
                            {drawer.closing_amount ? formatCurrency(drawer.closing_amount) : "—"}
                          </td>
                          <td className="p-2 text-right">
                            {drawer.difference !== undefined && drawer.difference !== null ? (
                              <span
                                className={
                                  drawer.difference < 0 ? "text-red-500" : drawer.difference > 0 ? "text-green-500" : ""
                                }
                              >
                                {formatCurrency(drawer.difference)}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="p-2 text-center">
                            <Badge variant={drawer.status === "open" ? "default" : "secondary"}>
                              {drawer.status === "open" ? "Open" : "Closed"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
