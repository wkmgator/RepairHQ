"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, Package, RotateCcw, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PurchaseOrder {
  id: string
  supplier: string
  items: string
  eta: string
  status: string
  created_at: string
}

interface InboundPart {
  id: string
  tracking: string
  carrier: string
  eta: string
  status: string
  created_at: string
}

interface RMALog {
  id: string
  item: string
  reason: string
  rma_number: string
  status: string
  created_at: string
}

export default function SupplierManagement() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [inboundParts, setInboundParts] = useState<InboundPart[]>([])
  const [rmaLogs, setRmaLogs] = useState<RMALog[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [formPO, setFormPO] = useState({
    supplier: "",
    items: "",
    eta: "",
    status: "ordered",
  })

  const [formInbound, setFormInbound] = useState({
    tracking: "",
    carrier: "",
    eta: "",
    status: "in transit",
  })

  const [formRMA, setFormRMA] = useState({
    item: "",
    reason: "",
    rma_number: "",
    status: "pending",
  })

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [poRes, inboundRes, rmaRes] = await Promise.all([
        supabase.from("purchase_orders").select("*").order("created_at", { ascending: false }),
        supabase.from("inbound_parts").select("*").order("created_at", { ascending: false }),
        supabase.from("rma_logs").select("*").order("created_at", { ascending: false }),
      ])

      setPurchaseOrders(poRes.data || [])
      setInboundParts(inboundRes.data || [])
      setRmaLogs(rmaRes.data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addPO = async () => {
    if (!formPO.supplier || !formPO.items) {
      toast({
        title: "Error",
        description: "Supplier and items are required",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.from("purchase_orders").insert([formPO])
      if (error) throw error

      toast({
        title: "Success",
        description: "Purchase order added successfully",
      })
      setFormPO({ supplier: "", items: "", eta: "", status: "ordered" })
      loadAll()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add purchase order",
        variant: "destructive",
      })
    }
  }

  const addInbound = async () => {
    if (!formInbound.tracking || !formInbound.carrier) {
      toast({
        title: "Error",
        description: "Tracking number and carrier are required",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.from("inbound_parts").insert([formInbound])
      if (error) throw error

      toast({
        title: "Success",
        description: "Inbound shipment added successfully",
      })
      setFormInbound({ tracking: "", carrier: "", eta: "", status: "in transit" })
      loadAll()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add inbound shipment",
        variant: "destructive",
      })
    }
  }

  const addRMA = async () => {
    if (!formRMA.item || !formRMA.rma_number) {
      toast({
        title: "Error",
        description: "Item and RMA number are required",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.from("rma_logs").insert([formRMA])
      if (error) throw error

      toast({
        title: "Success",
        description: "RMA log added successfully",
      })
      setFormRMA({ item: "", reason: "", rma_number: "", status: "pending" })
      loadAll()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add RMA log",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ordered":
      case "pending":
        return "default"
      case "shipped":
      case "in transit":
        return "secondary"
      case "received":
      case "delivered":
      case "approved":
        return "default"
      case "cancelled":
      case "rejected":
        return "destructive"
      default:
        return "outline"
    }
  }

  const overdueInbound = inboundParts.filter(
    (item) => item.eta && new Date(item.eta) < new Date() && item.status !== "delivered",
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">📦 Supplier Management</h1>
          <p className="text-muted-foreground">Manage purchase orders, inbound shipments, and RMAs</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active POs</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchaseOrders.filter((po) => po.status !== "received").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inboundParts.filter((part) => part.status === "in transit").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueInbound.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open RMAs</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rmaLogs.filter((rma) => rma.status === "pending").length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="purchase-orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="inbound-parts">Inbound Shipments</TabsTrigger>
          <TabsTrigger value="rma-logs">RMA / Returns</TabsTrigger>
        </TabsList>

        <TabsContent value="purchase-orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Purchase Order</CardTitle>
              <CardDescription>Create a new purchase order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Supplier Name"
                  value={formPO.supplier}
                  onChange={(e) => setFormPO({ ...formPO, supplier: e.target.value })}
                />
                <Input
                  placeholder="Items Description"
                  value={formPO.items}
                  onChange={(e) => setFormPO({ ...formPO, items: e.target.value })}
                />
                <Input
                  type="date"
                  placeholder="Expected Delivery"
                  value={formPO.eta}
                  onChange={(e) => setFormPO({ ...formPO, eta: e.target.value })}
                />
                <Select value={formPO.status} onValueChange={(value) => setFormPO({ ...formPO, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ordered">Ordered</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addPO}>Add Purchase Order</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="space-y-2">
                  {purchaseOrders.map((po) => (
                    <div key={po.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <div className="font-medium">{po.supplier}</div>
                        <div className="text-sm text-muted-foreground">{po.items}</div>
                        {po.eta && <div className="text-sm text-muted-foreground">ETA: {po.eta}</div>}
                      </div>
                      <Badge variant={getStatusColor(po.status)}>{po.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbound-parts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Inbound Shipment</CardTitle>
              <CardDescription>Track incoming shipments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Tracking Number"
                  value={formInbound.tracking}
                  onChange={(e) => setFormInbound({ ...formInbound, tracking: e.target.value })}
                />
                <Input
                  placeholder="Carrier (UPS, FedEx, etc.)"
                  value={formInbound.carrier}
                  onChange={(e) => setFormInbound({ ...formInbound, carrier: e.target.value })}
                />
                <Input
                  type="date"
                  placeholder="Expected Delivery"
                  value={formInbound.eta}
                  onChange={(e) => setFormInbound({ ...formInbound, eta: e.target.value })}
                />
                <Select
                  value={formInbound.status}
                  onValueChange={(value) => setFormInbound({ ...formInbound, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in transit">In Transit</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addInbound}>Add Inbound Shipment</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inbound Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="space-y-2">
                  {inboundParts.map((part) => {
                    const isOverdue = part.eta && new Date(part.eta) < new Date() && part.status !== "delivered"
                    return (
                      <div
                        key={part.id}
                        className={`flex justify-between items-center p-3 border rounded ${isOverdue ? "border-red-200 bg-red-50" : ""}`}
                      >
                        <div>
                          <div className="font-medium">{part.tracking}</div>
                          <div className="text-sm text-muted-foreground">via {part.carrier}</div>
                          {part.eta && (
                            <div className={`text-sm ${isOverdue ? "text-red-600" : "text-muted-foreground"}`}>
                              ETA: {part.eta} {isOverdue && "(Overdue)"}
                            </div>
                          )}
                        </div>
                        <Badge variant={getStatusColor(part.status)}>{part.status}</Badge>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rma-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add RMA / Return</CardTitle>
              <CardDescription>Log return merchandise authorizations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Item Name"
                  value={formRMA.item}
                  onChange={(e) => setFormRMA({ ...formRMA, item: e.target.value })}
                />
                <Input
                  placeholder="Return Reason"
                  value={formRMA.reason}
                  onChange={(e) => setFormRMA({ ...formRMA, reason: e.target.value })}
                />
                <Input
                  placeholder="RMA Number"
                  value={formRMA.rma_number}
                  onChange={(e) => setFormRMA({ ...formRMA, rma_number: e.target.value })}
                />
                <Select value={formRMA.status} onValueChange={(value) => setFormRMA({ ...formRMA, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addRMA}>Add RMA Log</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>RMA / Returns</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="space-y-2">
                  {rmaLogs.map((rma) => (
                    <div key={rma.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <div className="font-medium">{rma.item}</div>
                        <div className="text-sm text-muted-foreground">RMA: {rma.rma_number}</div>
                        <div className="text-sm text-muted-foreground">{rma.reason}</div>
                      </div>
                      <Badge variant={getStatusColor(rma.status)}>{rma.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
