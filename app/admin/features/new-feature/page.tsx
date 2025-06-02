"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addFeature, getFeatureModules } from "@/lib/features-utils"
import { useToast } from "@/hooks/use-toast"
import type { FeatureModule } from "@/lib/features-utils"

export default function NewFeaturePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [modules, setModules] = useState<FeatureModule[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    moduleId: "",
    status: "planned" as "complete" | "in-progress" | "planned",
  })
  const router = useRouter()
  const { toast } = useToast()

  // Fetch modules on component mount
  useState(() => {
    const fetchModules = async () => {
      const moduleData = await getFeatureModules()
      setModules(moduleData)
    }
    fetchModules()
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await addFeature(formData.moduleId, formData.name, formData.description, formData.status)

      if (result) {
        toast({
          title: "Feature added",
          description: "The feature has been added successfully.",
        })
        router.push("/admin/features")
        router.refresh()
      } else {
        throw new Error("Failed to add feature")
      }
    } catch (error) {
      console.error("Error adding feature:", error)
      toast({
        title: "Error",
        description: "There was an error adding the feature. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Add New Feature</CardTitle>
          <CardDescription>Add a new feature to an existing module</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="moduleId">Module</Label>
              <Select onValueChange={(value) => handleSelectChange("moduleId", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Feature Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) => handleSelectChange("status", value as "complete" | "in-progress" | "planned")}
                defaultValue="planned"
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Feature"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
