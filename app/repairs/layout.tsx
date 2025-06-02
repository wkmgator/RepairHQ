"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function RepairsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter(Boolean)

  // Extract vertical info from path
  const vertical = pathSegments[1] // electronics, aerospace, etc.
  const subVertical = pathSegments[2] // phones, airplanes, etc.

  const getVerticalDisplayName = (vertical: string) => {
    const names: Record<string, string> = {
      electronics: "Electronics Repair",
      microsoldering: "Micro Soldering",
      appliances: "Appliance Repair",
      "auto-repair": "Auto Repair",
      aerospace: "Aerospace Repair",
    }
    return names[vertical] || vertical
  }

  const getSubVerticalDisplayName = (subVertical: string) => {
    const names: Record<string, string> = {
      phones: "Phone Repair",
      tvs: "TV Repair",
      consoles: "Gaming Console Repair",
      watches: "Watch Repair",
      airplanes: "Airplane Maintenance",
      helicopters: "Helicopter Maintenance",
    }
    return names[subVertical] || subVertical
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">Repairs</span>
          {vertical && (
            <>
              <span className="text-muted-foreground">/</span>
              <Badge variant="secondary">{getVerticalDisplayName(vertical)}</Badge>
            </>
          )}
          {subVertical && (
            <>
              <span className="text-muted-foreground">/</span>
              <Badge variant="default">{getSubVerticalDisplayName(subVertical)}</Badge>
            </>
          )}
        </div>
        <Link href="/settings/industry">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure Verticals
          </Button>
        </Link>
      </div>

      {children}
    </div>
  )
}
