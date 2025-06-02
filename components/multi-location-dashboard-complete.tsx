"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { locationManagementService, type Location, type InventoryTransfer } from "@/lib/location-management-service"
import {
  MapPin,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  ArrowRightLeft,
  Building,
  Package,
  Eye,
  Settings,
  Globe,
  BarChart3,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function MultiLocationDashboardComplete() {
  const { toast } = useToast()
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [inventoryTransfers, setInventoryTransfers] = useState<InventoryTransfer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [showLocationDialog, setShowLocationDialog] = useState(false)
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [locationsData, transfersData] = await Promise.all([
        locationManagementService.getLocations("user-id"), // Replace with actual user ID
        locationManagementService.getInventoryTransfers(),
      ])
      setLocations(locationsData)
      setInventoryTransfers(transfersData)
      if (locationsData.length > 0 && !selectedLocation) {
        setSelectedLocation(locationsData[0])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load location data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateLocation = async (locationData: Partial<Location>) => {
    try {
      await locationManagementService.createLocation(locationData)
      await fetchData()
      setShowLocationDialog(false)
      toast({
        title: "Success",
        description: "Location created successfully",
      })
    } catch (error) {
      console.error("Error creating location:", error)
      toast({
        title: "Error",
        description: "Failed to create location",
        variant: "destructive",
      })
    }
  }

  const handleUpdateLocation = async (locationId: string, updates: Partial<Location>) => {
    try {
      await locationManagementService.updateLocation(locationId, updates)
      await fetchData()
      setEditingLocation(null)
      toast({
        title: "Success",
        description: "Location updated successfully",
      })
    } catch (error) {
      console.error("Error updating location:", error)
      toast({
        title: "Error",
        description: "Failed to update location",
        variant: "destructive",
      })
    }
  }

  const handleDeleteLocation = async (locationId: string) => {
    try {
      await locationManagementService.deleteLocation(locationId)
      await fetchData()
      toast({
        title: "Success",
        description: "Location deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting location:", error)
      toast({
        title: "Error",
        description: "Failed to delete location",
        variant: "destructive",
      })
    }
  }

  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case "store":
        return "bg-blue-100 text-blue-800"
      case "warehouse":
        return "bg-green-100 text-green-800"
      case "franchise":
        return "bg-purple-100 text-purple-800"
      case "kiosk":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTransferStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "in_transit":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateLocationMetrics = () => {
    const totalLocations = locations.length
    const activeLocations = locations.filter((loc) => loc.is_active).length
    const franchiseLocations = locations.filter((loc) => loc.type === "franchise").length
    const storeLocations = locations.filter((loc) => loc.type === "store").length

    return {
      totalLocations,
      activeLocations,
      franchiseLocations,
      storeLocations,
    }
  }

  const metrics = calculateLocationMetrics()

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading multi-location data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Multi-Location Management</h2>
          <p className="text-muted-foreground">Manage all your business locations from one central dashboard</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={selectedLocation?.id || ""}
            onValueChange={(value) => {
              const location = locations.find((loc) => loc.id === value)
              setSelectedLocation(location || null)
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Location
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Location</DialogTitle>
                <DialogDescription>Create a new business location</DialogDescription>
              </DialogHeader>
              <LocationForm onSubmit={handleCreateLocation} onCancel={() => setShowLocationDialog(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalLocations}</div>
            <p className="text-xs text-muted-foreground">{metrics.activeLocations} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Store Locations</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.storeLocations}</div>
            <p className="text-xs text-muted-foreground">Company owned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Franchise Locations</CardTitle>
            <Globe className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.franchiseLocations}</div>
            <p className="text-xs text-muted-foreground">Franchise partners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transfers</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryTransfers.filter((t) => t.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="franchise">Franchise</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Location Performance</CardTitle>
                <CardDescription>Performance overview across all locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locations.slice(0, 5).map((location) => (
                    <div key={location.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                          <MapPin className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{location.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {location.city}, {location.state}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getLocationTypeColor(location.type)}>{location.type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transfers</CardTitle>
                <CardDescription>Latest inventory transfers between locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryTransfers.slice(0, 5).map((transfer) => (
                    <div key={transfer.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                          <Package className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">{transfer.items.length} items</p>
                          <p className="text-sm text-muted-foreground">
                            {locations.find((l) => l.id === transfer.from_location_id)?.name} →{" "}
                            {locations.find((l) => l.id === transfer.to_location_id)?.name}
                          </p>
                        </div>
                      </div>
                      <Badge className={getTransferStatusColor(transfer.status)}>{transfer.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>All Locations</CardTitle>
              <CardDescription>Manage your business locations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-muted-foreground">{location.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getLocationTypeColor(location.type)}>{location.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{location.address}</div>
                          <div className="text-sm text-muted-foreground">
                            {location.city}, {location.state} {location.zip_code}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{location.manager_id ? "Assigned" : "Unassigned"}</TableCell>
                      <TableCell>
                        <Badge variant={location.is_active ? "default" : "secondary"}>
                          {location.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setEditingLocation(location)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedLocation(location)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteLocation(location.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Inventory Transfers</h3>
              <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Transfer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Inventory Transfer</DialogTitle>
                    <DialogDescription>Transfer inventory between locations</DialogDescription>
                  </DialogHeader>
                  <InventoryTransferForm
                    locations={locations}
                    onSubmit={async (transferData) => {
                      try {
                        await locationManagementService.createInventoryTransfer(transferData)
                        await fetchData()
                        setShowTransferDialog(false)
                        toast({
                          title: "Success",
                          description: "Transfer request created successfully",
                        })
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to create transfer request",
                          variant: "destructive",
                        })
                      }
                    }}
                    onCancel={() => setShowTransferDialog(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transfer ID</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryTransfers.map((transfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell className="font-mono text-sm">{transfer.id.slice(0, 8)}...</TableCell>
                        <TableCell>{locations.find((l) => l.id === transfer.from_location_id)?.name}</TableCell>
                        <TableCell>{locations.find((l) => l.id === transfer.to_location_id)?.name}</TableCell>
                        <TableCell>{transfer.items.length} items</TableCell>
                        <TableCell>
                          <Badge className={getTransferStatusColor(transfer.status)}>{transfer.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(transfer.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Location Permissions</CardTitle>
              <CardDescription>Manage user access to different locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Permission Management</h4>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Grant Permission
                  </Button>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  Permission management interface would be implemented here
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Location Performance Comparison</CardTitle>
                <CardDescription>Compare performance across all locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locations.map((location) => (
                    <div key={location.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{location.name}</span>
                        <span className="text-sm text-muted-foreground">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Location</CardTitle>
                <CardDescription>Monthly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locations.map((location, index) => (
                    <div key={location.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                          <DollarSign className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{location.name}</span>
                      </div>
                      <span className="font-bold">${(25000 - index * 3000).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="franchise">
          <FranchiseManagementTab locations={locations.filter((l) => l.type === "franchise")} />
        </TabsContent>
      </Tabs>

      {/* Edit Location Dialog */}
      {editingLocation && (
        <Dialog open={!!editingLocation} onOpenChange={() => setEditingLocation(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Location</DialogTitle>
              <DialogDescription>Update location information</DialogDescription>
            </DialogHeader>
            <LocationForm
              initialData={editingLocation}
              onSubmit={(data) => handleUpdateLocation(editingLocation.id, data)}
              onCancel={() => setEditingLocation(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Location Form Component
function LocationForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Location
  onSubmit: (data: Partial<Location>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    type: initialData?.type || "store",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zip_code: initialData?.zip_code || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    timezone: initialData?.timezone || "America/New_York",
    is_active: initialData?.is_active ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Location Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="store">Store</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
              <SelectItem value="franchise">Franchise</SelectItem>
              <SelectItem value="kiosk">Kiosk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="zip_code">ZIP Code</Label>
          <Input
            id="zip_code"
            value={formData.zip_code}
            onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Active Location</Label>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Update" : "Create"} Location</Button>
      </DialogFooter>
    </form>
  )
}

// Inventory Transfer Form Component
function InventoryTransferForm({
  locations,
  onSubmit,
  onCancel,
}: {
  locations: Location[]
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    from_location_id: "",
    to_location_id: "",
    notes: "",
    items: [{ inventory_id: "", name: "", quantity_requested: 1 }],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      requested_by: "current-user-id", // Replace with actual user ID
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="from_location">From Location</Label>
          <Select
            value={formData.from_location_id}
            onValueChange={(value) => setFormData({ ...formData, from_location_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="to_location">To Location</Label>
          <Select
            value={formData.to_location_id}
            onValueChange={(value) => setFormData({ ...formData, to_location_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select destination location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <Label>Items to Transfer</Label>
        <div className="space-y-2 mt-2">
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Item name"
                value={item.name}
                onChange={(e) => {
                  const newItems = [...formData.items]
                  newItems[index].name = e.target.value
                  setFormData({ ...formData, items: newItems })
                }}
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={item.quantity_requested}
                onChange={(e) => {
                  const newItems = [...formData.items]
                  newItems[index].quantity_requested = Number.parseInt(e.target.value) || 1
                  setFormData({ ...formData, items: newItems })
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newItems = formData.items.filter((_, i) => i !== index)
                  setFormData({ ...formData, items: newItems })
                }}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setFormData({
                ...formData,
                items: [...formData.items, { inventory_id: "", name: "", quantity_requested: 1 }],
              })
            }}
          >
            Add Item
          </Button>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Transfer</Button>
      </DialogFooter>
    </form>
  )
}

// Franchise Management Tab Component
function FranchiseManagementTab({ locations }: { locations: Location[] }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Franchises</CardTitle>
            <Globe className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations.length}</div>
            <p className="text-xs text-muted-foreground">Active franchise locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Royalties</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-green-600">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Target achievement</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Franchise Performance</CardTitle>
          <CardDescription>Monitor franchise partner performance and compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Franchise</TableHead>
                <TableHead>Franchisee</TableHead>
                <TableHead>Monthly Revenue</TableHead>
                <TableHead>Target Achievement</TableHead>
                <TableHead>Compliance Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{location.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {location.city}, {location.state}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{location.franchise_info?.franchisee_name || "N/A"}</TableCell>
                  <TableCell>$25,000</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={85} className="w-16 h-2" />
                      <span className="text-sm">85%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={92} className="w-16 h-2" />
                      <span className="text-sm">92%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
