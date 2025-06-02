"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, Edit, Trash2, Check, X, AlertCircle, Users, Store, Package } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase"
import type { Plan } from "@/lib/supabase-types"

export function PlanSettings() {
  const [loading, setLoading] = useState(true)
  const [plans, setPlans] = useState<Plan[]>([])
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [newPlan, setNewPlan] = useState<Partial<Plan>>({
    name: "",
    display_name: "",
    description: "",
    price_monthly: 0,
    price_yearly: 0,
    stripe_price_id_monthly: "",
    stripe_price_id_yearly: "",
    max_stores: 1,
    max_users: 2,
    max_customers: 500,
    max_inventory_items: 1000,
    features: [],
    is_active: true,
  })
  const [featureInput, setFeatureInput] = useState("")

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase.from("plans").select("*").order("price_monthly", { ascending: true })

      if (error) {
        throw error
      }

      setPlans(data as Plan[])
    } catch (error) {
      console.error("Error fetching plans:", error)
      toast({
        title: "Error",
        description: "Failed to load plans. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlan = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      // Validate required fields
      if (!newPlan.name || !newPlan.display_name || !newPlan.price_monthly || !newPlan.stripe_price_id_monthly) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      const { data, error } = await supabase.from("plans").insert({
        name: newPlan.name,
        display_name: newPlan.display_name,
        description: newPlan.description,
        price_monthly: newPlan.price_monthly,
        price_yearly: newPlan.price_yearly,
        stripe_price_id_monthly: newPlan.stripe_price_id_monthly,
        stripe_price_id_yearly: newPlan.stripe_price_id_yearly,
        max_stores: newPlan.max_stores,
        max_users: newPlan.max_users,
        max_customers: newPlan.max_customers,
        max_inventory_items: newPlan.max_inventory_items,
        features: newPlan.features,
        is_active: newPlan.is_active,
      }).select()

      if (error) {
        throw error
      }

      setPlans([...plans, data[0] as Plan])
      setCreateDialogOpen(false)
      setNewPlan({
        name: "",
        display_name: "",
        description: "",
        price_monthly: 0,
        price_yearly: 0,
        stripe_price_id_monthly: "",
        stripe_price_id_yearly: "",
        max_stores: 1,
        max_users: 2,
        max_customers: 500,
        max_inventory_items: 1000,
        features: [],
        is_active: true,
      })
      
      toast({
        title: "Success",
        description: "Plan created successfully.",
      })
    } catch (error) {
      console.error("Error creating plan:", error)
      toast({
        title: "Error",
        description: "Failed to create plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePlan = async () => {
    if (!selectedPlan) return

    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from("plans")
        .update({
          name: selectedPlan.name,
          display_name: selectedPlan.display_name,
          description: selectedPlan.description,
          price_monthly: selectedPlan.price_monthly,
          price_yearly: selectedPlan.price_yearly,
          stripe_price_id_monthly: selectedPlan.stripe_price_id_monthly,
          stripe_price_id_yearly: selectedPlan.stripe_price_id_yearly,
          max_stores: selectedPlan.max_stores,
          max_users: selectedPlan.max_users,
          max_customers: selectedPlan.max_customers,
          max_inventory_items: selectedPlan.max_inventory_items,
          features: selectedPlan.features,
          is_active: selectedPlan.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedPlan.id)
        .select()

      if (error) {
        throw error
      }

      setPlans(plans.map(plan => plan.id === selectedPlan.id ? data[0] as Plan : plan))
      setEditDialogOpen(false)
      setSelectedPlan(null)
      
      toast({
        title: "Success",
        description: "Plan updated successfully.",
      })
    } catch (error) {
      console.error("Error updating plan:", error)
      toast({
        title: "Error",
        description: "Failed to update plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePlan = async () => {
    if (!selectedPlan) return

    try {
      setLoading(true)
      const supabase = createClient()
      
      const { error } = await supabase
        .from("plans")
        .delete()
        .eq("id", selectedPlan.id)

      if (error) {
        throw error
      }

      setPlans(plans.filter(plan => plan.id !== selectedPlan.id))
      setDeleteDialogOpen(false)
      setSelectedPlan(null)
      
      toast({
        title: "Success",
        description: "Plan deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting plan:", error)
      toast({
        title: "Error",
        description: "Failed to delete plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePlanStatus = async (plan: Plan) => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from("plans")
        .update({
          is_active: !plan.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", plan.id)
        .select()

      if (error) {
        throw error
      }

      setPlans(plans.map(p => p.id === plan.id ? data[0] as Plan : p))
      
      toast({
        title: "Success",
        description: `Plan ${plan.is_active ? "deactivated" : "activated"} successfully.`,
      })
    } catch (error) {
      console.error("Error toggling plan status:", error)
      toast({
        title: "Error",
        description: "Failed to update plan status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addFeature = (planState: "new" | "edit") => {
    if (!featureInput.trim()) return

    if (planState === "new") {
      setNewPlan({
        ...newPlan,
        features: [...(newPlan.features || []), featureInput.trim()],
      })
    } else if (selectedPlan) {
      setSelectedPlan({
        ...selectedPlan,
        features: [...(selectedPlan.features || []), featureInput.trim()],
      })
    }

    setFeatureInput("")
  }

  const removeFeature = (index: number, planState: "new" | "edit") => {
    if (planState === "new") {
      const features = [...(newPlan.features || [])]
      features.splice(index, 1)
      setNewPlan({
        ...newPlan,
        features,
      })
    } else if (selectedPlan) {
      const features = [...(selectedPlan.features || [])]
      features.splice(index, 1)
      setSelectedPlan({
        ...selectedPlan,
        features,
      })
    }
  }

  if (loading && plans.length === 0) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Plan Settings</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Plan
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Plans</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {plans.filter(plan => plan.is_active).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-center text-muted-foreground">No active plans found. Create a new plan or activate an existing one.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {plans.filter(plan => plan.is_active).map((plan) => (
                <Card key={plan.id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>{plan.display_name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-end">
                        <span className="text-3xl font-bold">${plan.price_monthly}</span>
                        <span className="text-sm text-muted-foreground">/month</span>
                      </div>
                      
                      {plan.price_yearly && (
                        <div className="flex items-end">
                          <span className="text-xl font-medium">${plan.price_yearly}</span>
                          <span className="text-sm text-muted-foreground">/year</span>
                          {plan.price_monthly * 12 > plan.price_yearly && (
                            <Badge variant="secondary" className="ml-2">
                              Save ${plan.price_monthly * 12 - plan.price_yearly}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Store className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{plan.max_stores === null ? "Unlimited" : plan.max_stores} {plan.max_stores === 1 ? "Store" : "Stores"}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{plan.max_users === null ? "Unlimited" : plan.max_users} {plan.max_users === 1 ? "User" : "Users"}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{plan.max_customers === null ? "Unlimited" : plan.max_customers.toLocaleString()} Customers</span>
                        </div>
                        <div className="flex items-center">
                          <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{plan.max_inventory_items === null ? "Unlimited" : plan.max_inventory_items.toLocaleString()} Inventory Items</span>
                        </div>
                      </div>
                      
                      {plan.features && plan.features.length > 0 && (
                        <>
                          <Separator />
                          <div className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <div key={index} className="flex items-start">
                                <Check className="mr-2 h-4 w-4 text-green-500" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between bg-muted/50 p-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPlan(plan)
                          setEditDialogOpen(true)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePlanStatus(plan)}
                      >
                        <X className="mr-2 h-4 w-4" /> Deactivate
                      </Button>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedPlan(plan)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="inactive">
          {plans.filter(plan => !plan.is_active).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-center text-muted-foreground">No inactive plans found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {plans.filter(plan => !plan.is_active).map((plan) => (
                <Card key={plan.id} className="overflow-hidden border-dashed opacity-70">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{plan.display_name}</CardTitle>
                      <Badge variant="outline">Inactive</Badge>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-end">
                        <span className="text-3xl font-bold">${plan.price_monthly}</span>
                        <span className="text-sm text-muted-foreground">/month</span>
                      </div>
                      
                      {plan.price_yearly && (
                        <div className="flex items-end">
                          <span className="text-xl font-medium">${plan.price_yearly}</span>
                          <span className="text-sm text-muted-foreground">/year</span>
                        </div>
                      )}
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Store className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{plan.max_stores === null ? "Unlimited" : plan.max_stores} {plan.max_stores === 1 ? "Store" : "Stores"}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{plan.max_users === null ? "Unlimited" : plan.max_users} {plan.max_users === 1 ? "User" : "Users"}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between bg-muted/50 p-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPlan(plan)
                        setEditDialogOpen(true)
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <div className="flex space-x-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleTogglePlanStatus(plan)}
                      >
                        <Check className="mr-2 h-4 w-4" /> Activate
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedPlan(plan)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Plan Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Plan</DialogTitle>
            <DialogDescription>
              Create a new subscription plan for your customers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="plan-name">Plan ID</Label>
                <Input
                  id="plan-name"
                  value={newPlan.name || ""}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  placeholder="starter"
                />
                <p className="text-xs text-muted-foreground">
                  Internal ID used in the system (no spaces)
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  value={newPlan.display_name || ""}
                  onChange={(e) => setNewPlan({ ...newPlan, display_name: e.target.value })}
                  placeholder="Starter Plan"
                />
                <p className="text-xs text-muted-foreground">
                  Name shown to customers
                </p>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newPlan.description || ""}
                onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                placeholder="Perfect for small repair shops just getting started"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price-monthly">Monthly Price ($)</Label>
                <Input
                  id="price-monthly"
                  type="number"
                  value={newPlan.price_monthly || ""}
                  onChange={(e) => setNewPlan({ ...newPlan, price_monthly: Number.parseFloat(e.target.value) })}
                  placeholder="29.99"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price-yearly">Yearly Price ($)</Label>
                <Input
                  id="price-yearly"
                  type="number"
                  value={newPlan.price_yearly || ""}
                  onChange={(e) => setNewPlan({ ...newPlan, price_yearly: Number.parseFloat(e.target.value) })}
                  placeholder="299.99"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty for no yearly option
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="stripe-monthly">Stripe Monthly Price ID</Label>
                <Input
                  id="stripe-monthly"
                  value={newPlan.stripe_price_id_monthly || ""}
                  onChange={(e) => setNewPlan({ ...newPlan, stripe_price_id_monthly: e.target.value })}
                  placeholder="price_1234567890"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stripe-yearly">Stripe Yearly Price ID</Label>
                <Input
                  id="stripe-yearly"
                  value={newPlan.stripe_price_id_yearly || ""}
                  onChange={(e) => setNewPlan({ ...newPlan, stripe_price_id_yearly: e.target.value })}
                  placeholder="price_0987654321"
                />
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="max-stores">Max Stores</Label>
                <Input
                  id="max-stores"
                  type="number"
                  value={newPlan.max_stores === null ? "" : newPlan.max_stores || ""}
                  onChange={(e) => setNewPlan({ ...newPlan, max_stores: e.target.value ? Number.parseInt(e.target.value) : null })}
                  placeholder="1"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty for unlimited
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max-users">Max Users</Label>
                <Input
                  id="max-users"
                  type="number"
                  value={newPlan.max_users === null ? "" : newPlan.max_users || ""}
                  onChange={(e) => setNewPlan({ ...newPlan, max_users: e.target.value ? Number.parseInt(e.target.value) : null })}
                  placeholder="2"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty for unlimited
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="max-customers">Max Customers</Label>
                <Input
                  id="max-customers"
                  type="number"
                  value={newPlan.max_customers === null ? "" : newPlan.max_customers || ""}
                  onChange={(e) => setNewPlan({ ...newPlan, max_customers: e.target.value ? Number.parseInt(e.target.value) : null })}
                  placeholder="500"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty for unlimited
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max-inventory">Max Inventory Items</Label>
                <Input
                  id="max-inventory"
                  type="number"
                  value={newPlan.max_inventory_items === null ? "" : newPlan.max_inventory_items || ""}
                  onChange={(e) => setNewPlan({ ...newPlan, max_inventory_items: e.target.value ? Number.parseInt(e.target.value) : null })}
                  placeholder="1000"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty for unlimited
                </p>
              </div>
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label>Features</Label>
              <div className="flex gap-2">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Add a feature"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addFeature("new")
                    }
                  }}
                />
                <Button type="button" onClick={() => addFeature("new")} variant="outline">
                  Add
                </Button>
              </div>
              <div className="mt-2 space-y-2">
                {newPlan.features && newPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between rounded-md border p-2">
                    <div className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index, "new")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is-active"
                checked={newPlan.is_active}
                onCheckedChange={(checked) => setNewPlan({ ...newPlan, is_active: checked })}
              />
              <Label htmlFor="is-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePlan}>
              Create Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
            <DialogDescription>
              Update the details of this subscription plan.
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-plan-name">Plan ID</Label>
                  <Input
                    id="edit-plan-name"
                    value={selectedPlan.name}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-display-name">Display Name</Label>
                  <Input
                    id="edit-display-name"
                    value={selectedPlan.display_name}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, display_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedPlan.description || ""}
                  onChange={(e) => setSelectedPlan({ ...selectedPlan, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price-monthly">Monthly Price ($)</Label>
                  <Input
                    id="edit-price-monthly"
                    type="number"
                    value={selectedPlan.price_monthly}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, price_monthly: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-price-yearly">Yearly Price ($)</Label>
                  <Input
                    id="edit-price-yearly"
                    type="number"
                    value={selectedPlan.price_yearly || ""}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, price_yearly: e.target.value ? Number.parseFloat(e.target.value) : null })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-stripe-monthly">Stripe Monthly Price ID</Label>
                  <Input
                    id="edit-stripe-monthly"
                    value={selectedPlan.stripe_price_id_monthly}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, stripe_price_id_monthly: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-stripe-yearly">Stripe Yearly Price ID</Label>
                  <Input
                    id="edit-stripe-yearly"
                    value={selectedPlan.stripe_price_id_yearly || ""}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, stripe_price_id_yearly: e.target.value || null })}
                  />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-max-stores">Max Stores</Label>
                  <Input
                    id="edit-max-stores"
                    type="number"
                    value={selectedPlan.max_stores === null ? "" : selectedPlan.max_stores}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, max_stores: e.target.value ? Number.parseInt(e.target.value) : null })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-max-users">Max Users</Label>
                  <Input
                    id="edit-max-users"
                    type="number"
                    value={selectedPlan.max_users === null ? "" : selectedPlan.max_users}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, max_users: e.target.value ? Number.parseInt(e.target.value) : null })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-max-customers">Max Customers</Label>
                  <Input
                    id="edit-max-customers"
                    type="number"
                    value={selectedPlan.max_customers === null ? "" : selectedPlan.max_customers}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, max_customers: e.target.value ? Number.parseInt(e.target.value) : null })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-max-inventory">Max Inventory Items</Label>
                  <Input
                    id="edit-max-inventory"
                    type="number"
                    value={selectedPlan.max_inventory_items === null ? "" : selectedPlan.max_inventory_items}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, max_inventory_items: e.target.value ? Number.parseInt(e.target.value) : null })}
                  />
                </div>
              </div>
              <Separator />\
