"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getAllVerticals, type VerticalConfig, type RepairVertical } from "@/lib/industry-verticals"
import { useUserPreferences } from "@/hooks/use-user-preferences"

interface IndustrySelectorProps {
  onIndustryChange: (industry: RepairVertical | null) => void // Changed to onIndustryChange for clarity, passes RepairVertical
  currentIndustry?: RepairVertical | null // This is RepairVertical
  label?: string
  className?: string
}

export function IndustrySelector({
  onIndustryChange,
  currentIndustry,
  label = "Select Your Repair Vertical", // Changed label to reflect vertical selection
  className,
}: IndustrySelectorProps) {
  const [verticals, setVerticals] = useState<VerticalConfig[]>([])
  const { preferences, updateUserPreference } = useUserPreferences()

  // Internal state for the Select component, derived from props or preferences
  const [selectedVerticalValue, setSelectedVerticalValue] = useState<string>(
    currentIndustry || preferences.defaultIndustry || "",
  )

  useEffect(() => {
    const fetchedVerticals = getAllVerticals()
    setVerticals(fetchedVerticals)

    // Update selectedVerticalValue if currentIndustry prop changes
    if (currentIndustry && currentIndustry !== selectedVerticalValue) {
      setSelectedVerticalValue(currentIndustry)
    } else if (
      !currentIndustry &&
      preferences.defaultIndustry &&
      preferences.defaultIndustry !== selectedVerticalValue
    ) {
      // If currentIndustry is not set, but preference is, use preference
      setSelectedVerticalValue(preferences.defaultIndustry)
    }
  }, [preferences.defaultIndustry, currentIndustry, selectedVerticalValue])

  const handleSelectionChange = (value: string) => {
    const newVertical = value as RepairVertical // Assuming value is always a valid RepairVertical string
    setSelectedVerticalValue(newVertical) // Update internal state for the Select component
    onIndustryChange(newVertical) // Call the callback with the new RepairVertical
    updateUserPreference("defaultIndustry", newVertical) // Persist preference
  }

  return (
    <div className={className}>
      <Label htmlFor="industry-selector" className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Select value={selectedVerticalValue} onValueChange={handleSelectionChange}>
        <SelectTrigger id="industry-selector" className="w-full">
          <SelectValue placeholder="Choose a repair vertical..." />
        </SelectTrigger>
        <SelectContent>
          {verticals.map((vertical) => (
            <SelectItem key={vertical.id} value={vertical.id}>
              {vertical.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
