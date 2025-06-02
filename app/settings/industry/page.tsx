"use client"

import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IndustrySelector } from "@/components/industry-selector"
import { CategorySelector } from "@/components/category-selector"
import { RepairIndustry, getIndustryConfig } from "@/lib/industry-config"
import { type IndustryCategory, getCategoryForIndustry, getIndustryCategory } from "@/lib/industry-categories"
import { useToast } from "@/components/ui/use-toast"
import { Settings, Save, RefreshCw, PlusCircle } from "lucide-react"

export default function IndustrySettingsPage() {
  const { toast } = useToast()
  const [currentIndustry, setCurrentIndustry] = useState<RepairIndustry>(RepairIndustry.CELL_PHONE)
  const [selectedIndustry, setSelectedIndustry] = useState<RepairIndustry>(RepairIndustry.CELL_PHONE)
  const [selectedCategory, setSelectedCategory] = useState<IndustryCategory | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load the current industry from local storage
    const savedIndustry = localStorage.getItem("repairhq_industry") as RepairIndustry
    if (savedIndustry) {
      setCurrentIndustry(savedIndustry)
      setSelectedIndustry(savedIndustry)
      setSelectedCategory(getCategoryForIndustry(savedIndustry))
    }
  }, [])

  const handleCategorySelect = (category: IndustryCategory) => {
    setSelectedCategory(category)

    // Select the first industry in this category by default
    const categoryConfig = getIndustryCategory(category)
    if (categoryConfig.industries.length > 0) {
      setSelectedIndustry(categoryConfig.industries[0])
    }
  }

  const handleIndustrySelect = (industry: RepairIndustry) => {
    setSelectedIndustry(industry)
  }

  const handleSaveIndustry = async () => {
    setIsLoading(true)

    try {
      // Save the selected industry to local storage
      localStorage.setItem("repairhq_industry", selectedIndustry)

      // In a real app, you would also save this to the user's profile in the database
      // await updateUserIndustry(selectedIndustry)

      setCurrentIndustry(selectedIndustry)

      toast({
        title: "Industry Updated",
        description: "Your business type has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update industry settings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const industryConfig = getIndustryConfig(currentIndustry)
  const currentCategory = getCategoryForIndustry(currentIndustry)
  const categoryConfig = currentCategory ? getIndustryCategory(currentCategory) : undefined

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Industry Settings</h1>
      </div>

      <Tabs defaultValue="industry" className="space-y-4">
        <TabsList>
          <TabsTrigger value="industry">Business Type</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
        </TabsList>

        <TabsContent value="industry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Business Configuration</CardTitle>
              <CardDescription>Your system is currently configured for {industryConfig.name}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-md">
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-blue-500" />
                  <div>
                    <h3 className="font-medium">Current Business Type</h3>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-gray-600 mr-2">{industryConfig.name}</p>
                      {categoryConfig?.isAddon && (
                        <Badge variant="outline" className="bg-amber-50">
                          <PlusCircle className="h-3 w-3 mr-1" />
                          Add-on Package
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">1. Select Business Category</h3>
                  <CategorySelector selectedCategory={selectedCategory} onSelect={handleCategorySelect} />
                </div>

                {selectedCategory && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">2. Select Specific Business Type</h3>
                    <IndustrySelector
                      selectedIndustry={selectedIndustry}
                      onSelect={handleIndustrySelect}
                      showConfirmButton={false}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveIndustry} disabled={isLoading || currentIndustry === selectedIndustry}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Industry Features</CardTitle>
              <CardDescription>These features are enabled for your selected business type.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Device Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {industryConfig.deviceTypes.slice(0, 8).map((type) => (
                      <Badge key={type} variant="secondary">
                        {type}
                      </Badge>
                    ))}
                    {industryConfig.deviceTypes.length > 8 && (
                      <Badge variant="outline">+{industryConfig.deviceTypes.length - 8} more</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Common Issues</h3>
                  <div className="flex flex-wrap gap-2">
                    {industryConfig.commonIssues.slice(0, 8).map((issue) => (
                      <Badge key={issue} variant="secondary">
                        {issue}
                      </Badge>
                    ))}
                    {industryConfig.commonIssues.length > 8 && (
                      <Badge variant="outline">+{industryConfig.commonIssues.length - 8} more</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Required Fields</h3>
                  <div className="flex flex-wrap gap-2">
                    {industryConfig.requiresSerialNumber && <Badge>Serial Number</Badge>}
                    {industryConfig.requiresIMEI && <Badge>IMEI</Badge>}
                    {industryConfig.requiresPassword && <Badge>Password</Badge>}
                    {industryConfig.requiresAccessories && <Badge>Accessories</Badge>}
                    {industryConfig.hasWarranty && (
                      <Badge>Warranty ({industryConfig.defaultWarrantyPeriod} days)</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Custom Fields</h3>
                  <div className="flex flex-wrap gap-2">
                    {industryConfig.customFields.map((field) => (
                      <Badge key={field.name} variant="outline">
                        {field.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customize Your Workflow</CardTitle>
              <CardDescription>Tailor the system to match your specific business needs.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Customize which fields are required, what information to collect, and how your repair tickets are
                processed.
              </p>

              {/* This would be expanded with actual customization options in a real implementation */}
              <div className="p-4 bg-yellow-50 rounded-md text-center">
                <p className="text-sm text-yellow-800">
                  Advanced customization options are available in the Professional and Enterprise plans.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
