"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Smartphone, PenToolIcon as Tool, Car, PlusCircle } from "lucide-react"
import { IndustryCategory, getAllCategories } from "@/lib/industry-categories"
import { Badge } from "@/components/ui/badge"

interface CategorySelectorProps {
  selectedCategory?: IndustryCategory
  onSelect?: (category: IndustryCategory) => void
  showDescription?: boolean
}

export function CategorySelector({ selectedCategory, onSelect, showDescription = true }: CategorySelectorProps) {
  const [selected, setSelected] = useState<IndustryCategory | undefined>(selectedCategory)
  const categories = getAllCategories()

  const handleSelect = (category: IndustryCategory) => {
    setSelected(category)
    if (onSelect) {
      onSelect(category)
    }
  }

  const getCategoryIcon = (category: IndustryCategory) => {
    switch (category) {
      case IndustryCategory.ELECTRONICS:
        return <Smartphone className="h-5 w-5" />
      case IndustryCategory.SPECIALTY:
        return <Tool className="h-5 w-5" />
      case IndustryCategory.AUTOMOTIVE:
        return <Car className="h-5 w-5" />
      default:
        return <Smartphone className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all ${
              selected === category.id ? `border-2 border-${category.color}-500 shadow-md` : "hover:shadow-md"
            }`}
            onClick={() => handleSelect(category.id)}
          >
            <CardContent className="p-4 flex items-center space-x-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-${category.color}-100 text-${category.color}-500`}
              >
                {getCategoryIcon(category.id)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-base">{category.name}</h3>
                  {selected === category.id && <Check className="h-4 w-4 text-green-500" />}
                </div>
                {showDescription && <p className="text-xs text-gray-500 mt-1">{category.description}</p>}
                {category.isAddon && (
                  <Badge variant="outline" className="mt-2 bg-amber-50">
                    <PlusCircle className="h-3 w-3 mr-1" />
                    Add-on Package
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
