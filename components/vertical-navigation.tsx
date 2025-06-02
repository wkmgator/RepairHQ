"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Smartphone, Cpu, Home, Car, Plane, Search, ArrowRight, Star } from "lucide-react"
import Link from "next/link"

const verticals = [
  {
    label: "Electronics Repair",
    description: "Consumer electronics and mobile devices",
    icon: Smartphone,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    items: [
      { name: "Phones", href: "/repairs/electronics/phones", popular: true },
      { name: "TVs", href: "/repairs/electronics/tvs", popular: true },
      { name: "Consoles", href: "/repairs/electronics/consoles", popular: false },
      { name: "Watches", href: "/repairs/electronics/watches", popular: false },
    ],
  },
  {
    label: "Micro Soldering",
    description: "Board-level and component repair",
    icon: Cpu,
    color: "bg-purple-50 text-purple-600 border-purple-200",
    items: [
      { name: "Board Repair", href: "/repairs/microsoldering?type=board", popular: true },
      { name: "Connector Repair", href: "/repairs/microsoldering?type=connector", popular: false },
    ],
  },
  {
    label: "Appliance Repair",
    description: "In-home appliance services",
    icon: Home,
    color: "bg-green-50 text-green-600 border-green-200",
    items: [
      { name: "Washers", href: "/repairs/appliances?type=washer", popular: true },
      { name: "Dryers", href: "/repairs/appliances?type=dryer", popular: true },
      { name: "Fridges", href: "/repairs/appliances?type=refrigerator", popular: false },
    ],
  },
  {
    label: "Auto Repair",
    description: "Automotive service and maintenance",
    icon: Car,
    color: "bg-red-50 text-red-600 border-red-200",
    items: [
      { name: "EVs", href: "/repairs/auto-repair?type=electric", popular: true },
      { name: "Audio", href: "/repairs/auto-repair?type=audio", popular: false },
      { name: "Diagnostics", href: "/repairs/auto-repair?type=diagnostic", popular: true },
    ],
  },
  {
    label: "Aerospace",
    description: "Aircraft and helicopter maintenance",
    icon: Plane,
    color: "bg-orange-50 text-orange-600 border-orange-200",
    items: [
      { name: "Airplanes", href: "/repairs/aerospace/airplanes", popular: true },
      { name: "Helicopters", href: "/repairs/aerospace/helicopters", popular: false },
    ],
  },
]

interface VerticalNavigationProps {
  onVerticalSelect?: (vertical: string) => void
  showSearch?: boolean
  compact?: boolean
}

export function VerticalNavigation({ onVerticalSelect, showSearch = true, compact = false }: VerticalNavigationProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVertical, setSelectedVertical] = useState<string | null>(null)

  const filteredVerticals = verticals.filter(
    (vertical) =>
      vertical.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vertical.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleVerticalClick = (verticalLabel: string) => {
    setSelectedVertical(verticalLabel)
    onVerticalSelect?.(verticalLabel)
  }

  if (compact) {
    return (
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filteredVerticals.map((vertical, index) => (
          <Card key={index} className={`cursor-pointer hover:shadow-md transition-shadow ${vertical.color}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <vertical.icon className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">{vertical.label}</h3>
                  <p className="text-xs opacity-80">{vertical.items.length} services</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search repair services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      <div className="space-y-4">
        {filteredVerticals.map((vertical, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader
              className={`cursor-pointer transition-colors ${vertical.color}`}
              onClick={() => handleVerticalClick(vertical.label)}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <vertical.icon className="h-6 w-6" />
                  <div>
                    <h3 className="text-lg">{vertical.label}</h3>
                    <p className="text-sm opacity-80 font-normal">{vertical.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid gap-2 md:grid-cols-2">
                {vertical.items.map((item, itemIndex) => (
                  <Link key={itemIndex} href={item.href}>
                    <Button variant="ghost" className="w-full justify-between hover:bg-muted/50">
                      <span className="flex items-center gap-2">
                        {item.name}
                        {item.popular && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
