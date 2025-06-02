"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { locationManagementService, type TerritoryMap, type Location } from "@/lib/location-management-service"
import { MapPin, Users, DollarSign, TrendingUp, Plus, Edit } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function TerritoryManagement() {
  const { toast } = useToast()
  const [territories, setTerritories] = useState<TerritoryMap[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showTerritoryDialog, setShowTerritoryDialog] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [territoriesData, locationsData] = await Promise.all([
        locationManagementService.getTerritories(),
        locationManagementService.getLocations("user-id"),
      ])
      setTerritories(territoriesData)
      setLocations(locationsData)
    } catch (error) {
      console.error("Error fetching territory data:", error)
      toast({
        title: "Error",
        description: "Failed to load territory data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTerritory = async (territoryData: Omit<TerritoryMap, "id">) => {
    try {
      await locationManagementService.createTerritory(territoryData)
      await fetchData()
      setShowTerritoryDialog(false)
      toast({
        title: "Success",
        description: "Territory created successfully",
      })
    } catch (error) {
      console.error("Error creating territory:", error)
      toast({
        title: "Error",
        description: "Failed to create territory",
        variant: "destructive",
      })
    }
  }

  const handleAssignTerritory = async (territoryId: string, locationId: string) => {
    try {
      await locationManagementService.assignTerritoryToLocation(territoryId, locationId)
      await fetchData()
      toast({
        title: "Success",
        description: "Territory assigned successfully",
      })
    } catch (error) {
      console.error("Error assigning territory:", error)
      toast({
        title: "Error",
        description: "Failed to assign territory",
        variant: "destructive",
      })
    }
  }

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading territory data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Territory Management</h2>
          <p className="text-muted-foreground">Manage franchise territories and market assignments</p>
        </div>
        <Dialog open={showTerritoryDialog} onOpenChange={setShowTerritoryDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Territory
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Territory</DialogTitle>
              <DialogDescription>Define a new market territory</DialogDescription>
            </DialogHeader>
            <TerritoryForm onSubmit={handleCreateTerritory} onCancel={() => setShowTerritoryDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Territory Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Territories</CardTitle>
            <MapPin className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{territories.length}</div>
            <p className="text-xs text-muted-foreground">
              {territories.filter((t) => t.assigned_location_id).length} assigned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Potential</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${territories.reduce((sum, t) => sum + t.market_potential, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total market value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Population</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {territories.reduce((sum, t) => sum + t.population, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total population</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{territories.filter((t) => !t.assigned_location_id).length}</div>
            <p className="text-xs text-muted-foreground">Available territories</p>
          </CardContent>
        </Card>
      </div>

      {/* Territory List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {territories.map((territory) => (
          <Card key={territory.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {territory.name}
                <Badge className={getCompetitionColor(territory.competition_level)}>
                  {territory.competition_level} competition
                </Badge>
              </CardTitle>
              <CardDescription>Population: {territory.population.toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Market Potential:</span>
                  <div className="font-medium">${territory.market_potential.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Median Income:</span>
                  <div className="font-medium">${territory.demographics.median_income.toLocaleString()}</div>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Assignment:</span>
                {territory.assigned_location_id ? (
                  <div className="mt-1">
                    <Badge variant="default">
                      {locations.find((l) => l.id === territory.assigned_location_id)?.name || "Unknown Location"}
                    </Badge>
                  </div>
                ) : (
                  <div className="mt-2">
                    <Select onValueChange={(value) => handleAssignTerritory(territory.id, value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Assign to location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations
                          .filter((l) => l.type === "franchise" || l.type === "store")
                          .map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <MapPin className="mr-2 h-4 w-4" />
                  View Map
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Territory Form Component
function TerritoryForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: Omit<TerritoryMap, "id">) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: "",
    population: 0,
    market_potential: 0,
    competition_level: "medium" as "low" | "medium" | "high",
    demographics: {
      median_income: 0,
      age_groups: {},
      device_ownership: {},
      market_size: 0,
    },
    boundaries: {
      type: "Polygon" as const,
      coordinates: [[[]]],
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Territory Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="population">Population</Label>
          <Input
            id="population"
            type="number"
            value={formData.population}
            onChange={(e) => setFormData({ ...formData, population: Number.parseInt(e.target.value) || 0 })}
            required
          />
        </div>
        <div>
          <Label htmlFor="market_potential">Market Potential ($)</Label>
          <Input
            id="market_potential"
            type="number"
            value={formData.market_potential}
            onChange={(e) => setFormData({ ...formData, market_potential: Number.parseInt(e.target.value) || 0 })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="competition_level">Competition Level</Label>
          <Select
            value={formData.competition_level}
            onValueChange={(value) => setFormData({ ...formData, competition_level: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="median_income">Median Income ($)</Label>
          <Input
            id="median_income"
            type="number"
            value={formData.demographics.median_income}
            onChange={(e) =>
              setFormData({
                ...formData,
                demographics: {
                  ...formData.demographics,
                  median_income: Number.parseInt(e.target.value) || 0,
                },
              })
            }
            required
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Territory</Button>
      </DialogFooter>
    </form>
  )
}
