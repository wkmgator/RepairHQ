"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  getServiceTemplatesByIndustryFromDB,
  getServiceCategoriesByIndustryFromDB,
} from "@/lib/service-template-registry"
import type { ServiceTemplate, ServiceTemplateCategory } from "@/lib/service-template-types"
import type { RepairIndustry } from "@/lib/industry-config"
import { FileText, Search, Loader2 } from "lucide-react"

interface ServiceTemplateSelectorProps {
  industry: RepairIndustry
  onSelect: (template: ServiceTemplate) => void
}

export function ServiceTemplateSelector({ industry, onSelect }: ServiceTemplateSelectorProps) {
  const [templates, setTemplates] = useState<ServiceTemplate[]>([])
  const [categories, setCategories] = useState<ServiceTemplateCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [fetchedTemplates, fetchedCategories] = await Promise.all([
          getServiceTemplatesByIndustryFromDB(industry),
          getServiceCategoriesByIndustryFromDB(industry),
        ])
        setTemplates(fetchedTemplates)
        setCategories(fetchedCategories)
      } catch (error) {
        console.error("Failed to load service templates or categories:", error)
        // Optionally, set an error state and display an error message
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [industry])

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory ? template.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" /> <span className="ml-2">Loading templates...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search templates..."
          className="pl-10"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Button variant={selectedCategory === null ? "default" : "outline"} onClick={() => setSelectedCategory(null)}>
          All Categories
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
      <ScrollArea className="h-[400px] w-full rounded-md border">
        <div className="p-4 space-y-4">
          {filteredTemplates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No templates found.</p>
          ) : (
            filteredTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="space-y-1" onClick={() => onSelect(template)}>
                  <CardTitle className="text-sm font-medium flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    {template.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">{template.description}</CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
