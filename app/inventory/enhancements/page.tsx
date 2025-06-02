"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, MapPin, TrendingUp, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Warranty {
  id: string
  item: string
  customer: string
  expiry: string
  created_at: string
}

interface BinLocation {
  id: string
  item_sku: string
  bin: string
  shelf: string
  created_at: string
}

interface RepairMargin {
  id: string
  item: string
  cost: number
  price: number
  created_at: string
}

export default function InventoryEnhancements() {
  const [warranties, setWarranties] = useState<Warranty[]>([])
  const [bins, setBins] = useState<BinLocation[]>([])
  const [repairs, setRepairs] = useState<RepairMargin[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [formWarranty, setFormWarranty] = useState({
    item: "",
    customer: "",
    expiry: "",
  })

  const [formBin, setFormBin] = useState({
    item_sku: "",
    bin: "",
    shelf: "",
  })

  const [formRepair, setFormRepair] = useState({
    item: "",
    cost: 0,
    price: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [warrantyData, binData, repairData] = await Promise.all([
        supabase.from("warranties").select("*").order("created_at", { ascending: false }),
        supabase.from("bin_locations").select("*").order("created_at", { ascending: false }),
        supabase.from("repair_margins").select("*").order("created_at", { ascending: false }),
      ])

      setWarranties(warrantyData.data || [])
      setBins(binData.data || [])
      setRepairs(repairData.data || [])
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

  const addWarranty = async () => {
    if (!formWarranty.item || !formWarranty.customer || !formWarranty.expiry) {
      toast({
        title: "Error",
        description: "All warranty fields are required",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.from("warranties").insert([formWarranty])
      if (error) throw error

      toast({
        title: "Success",
        description: "Warranty added successfully",
      })
      setFormWarranty({ item: "", customer: "", expiry: "" })
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add warranty",
        variant: "destructive",
      })
    }
  }

  const addBin = async () => {
    if (!formBin.item_sku || !formBin.bin) {
      toast({
        title: "Error",
        description: "Item SKU and bin are required",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.from("bin_locations").insert([formBin])
      if (error) throw error

      toast({
        title: "Success",
        description: "Bin location assigned successfully",
      })
      setFormBin({ item_sku: "", bin: "", shelf: "" })
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign bin location",
        variant: "destructive",
      })
    }
  }

  const addRepair = async () => {
    if (!formRepair.item || formRepair.cost <= 0 || formRepair.price <= 0) {
      toast({
        title: "Error",
        description: "Item name, cost, and price are required",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.from("repair_margins").insert([formRepair])
      if (error) throw error

      toast({
        title: "Success",
        description: "Repair margin logged successfully",
      })
      setFormRepair({ item: "", cost: 0, price: 0 })
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log repair margin",
        variant: "destructive",
      })
    }
  }

  const expiringWarranties = warranties.filter((w) => {
    const expiryDate = new Date(w.expiry)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date()
  })

  const averageMargin =
    repairs.length > 0 ? repairs.reduce((sum, r) => sum + ((r.price - r.cost) / r.price) * 100, 0) / repairs.length : 0

  const totalProfit = repairs.reduce((sum, r) => sum + (r.price - r.cost), 0)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🔧 Inventory Enhancements</h1>
          <p className="text-muted-foreground">Warranty tracking, bin locations, and profit analysis</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Warranties</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warranties.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{expiringWarranties.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMargin.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalProfit.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="warranties" className="space-y-4">
        <TabsList>
          <TabsTrigger value="warranties">Warranty Tracker</TabsTrigger>
          <TabsTrigger value="bin-locations">Bin Locations</TabsTrigger>
          <TabsTrigger value="profit-analysis">Profit Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="warranties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Warranty</CardTitle>
              <CardDescription>Track warranty information for items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Item Name"
                  value={formWarranty.item}
                  onChange={(e) => setFormWarranty({ ...formWarranty, item: e.target.value })}
                />
                <Input
                  placeholder="Customer Name"
                  value={formWarranty.customer}
                  onChange={(e) => setFormWarranty({ ...formWarranty, customer: e.target.value })}
                />
                <Input
                  type="date"
                  placeholder="Expiry Date"
                  value={formWarranty.expiry}
                  onChange={(e) => setFormWarranty({ ...formWarranty, expiry: e.target.value })}
                />
              </div>
              <Button onClick={addWarranty}>Add Warranty</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Warranties</CardTitle>
              <CardDescription>Active warranty records</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="space-y-2">
                  {warranties.map((warranty) => {
                    const isExpiringSoon = expiringWarranties.some((w) => w.id === warranty.id)
                    const isExpired = new Date(warranty.expiry) < new Date()

                    return (
                      <div
                        key={warranty.id}
                        className={`flex justify-between items-center p-3 border rounded ${isExpiringSoon ? "border-yellow-200 bg-yellow-50" : isExpired ? "border-red-200 bg-red-50" : ""}`}
                      >
                        <div>
                          <div className="font-medium">{warranty.item}</div>
                          <div className="text-sm text-muted-foreground">Customer: {warranty.customer}</div>
                          <div
                            className={`text-sm ${isExpired ? "text-red-600" : isExpiringSoon ? "text-yellow-600" : "text-muted-foreground"}`}
                          >
                            Expires: {warranty.expiry}
                            {isExpired && " (Expired)"}
                            {isExpiringSoon && !isExpired && " (Expiring Soon)"}
                          </div>
                        </div>
                        <Badge variant={isExpired ? "destructive" : isExpiringSoon ? "secondary" : "default"}>
                          {isExpired ? "Expired" : isExpiringSoon ? "Expiring" : "Active"}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bin-locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assign Bin Location</CardTitle>
              <CardDescription>Organize inventory with bin and shelf locations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Item SKU"
                  value={formBin.item_sku}
                  onChange={(e) => setFormBin({ ...formBin, item_sku: e.target.value })}
                />
                <Input
                  placeholder="Bin Number"
                  value={formBin.bin}
                  onChange={(e) => setFormBin({ ...formBin, bin: e.target.value })}
                />
                <Input
                  placeholder="Shelf Number (Optional)"
                  value={formBin.shelf}
                  onChange={(e) => setFormBin({ ...formBin, shelf: e.target.value })}
                />
              </div>
              <Button onClick={addBin}>Assign Bin Location</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bin Locations</CardTitle>
              <CardDescription>Current inventory locations</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="space-y-2">
                  {bins.map((bin) => (
                    <div key={bin.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <div className="font-medium">SKU: {bin.item_sku}</div>
                        <div className="text-sm text-muted-foreground">
                          Bin: {bin.bin}
                          {bin.shelf && ` | Shelf: ${bin.shelf}`}
                        </div>
                      </div>
                      <Badge variant="outline">
                        <MapPin className="w-3 h-3 mr-1" />
                        Located
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit-analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Log Repair Margin</CardTitle>
              <CardDescription>Track profit margins on repairs and services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Item/Service Name"
                  value={formRepair.item}
                  onChange={(e) => setFormRepair({ ...formRepair, item: e.target.value })}
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Cost to Store"
                  value={formRepair.cost}
                  onChange={(e) => setFormRepair({ ...formRepair, cost: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Sale Price"
                  value={formRepair.price}
                  onChange={(e) => setFormRepair({ ...formRepair, price: Number(e.target.value) })}
                />
              </div>
              <Button onClick={addRepair}>Log Repair Margin</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Repair Margins</CardTitle>
              <CardDescription>Profit analysis for repairs and services</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="space-y-2">
                  {repairs.map((repair) => {
                    const profit = repair.price - repair.cost
                    const marginPercent = (profit / repair.price) * 100

                    return (
                      <div key={repair.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <div className="font-medium">{repair.item}</div>
                          <div className="text-sm text-muted-foreground">
                            Cost: ${repair.cost.toFixed(2)} | Price: ${repair.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">+${profit.toFixed(2)}</div>
                          <Badge
                            variant={
                              marginPercent >= 30 ? "default" : marginPercent >= 20 ? "secondary" : "destructive"
                            }
                          >
                            {marginPercent.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
