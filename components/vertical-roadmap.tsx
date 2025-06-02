"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Rocket, Target, Calendar } from "lucide-react"

const roadmapItems = [
  {
    phase: "Phase 1: Core Verticals",
    deadline: "June 3, 2024",
    status: "in-progress",
    progress: 85,
    items: [
      { name: "Electronics Repair (Phones, TVs, Consoles, Watches)", status: "completed" },
      { name: "Micro Soldering Lab", status: "completed" },
      { name: "Appliance Repair Services", status: "completed" },
      { name: "Auto Repair Center", status: "completed" },
      { name: "Aerospace Services (Airplanes, Helicopters)", status: "in-progress" },
    ],
  },
  {
    phase: "Phase 2: Advanced Features",
    deadline: "June 7, 2024",
    status: "upcoming",
    progress: 25,
    items: [
      { name: "Vertical-Specific Templates", status: "in-progress" },
      { name: "Industry Compliance Tools", status: "planned" },
      { name: "Custom Waiver Systems", status: "planned" },
      { name: "Specialized Inventory Management", status: "planned" },
      { name: "Multi-Payment Integration", status: "planned" },
    ],
  },
  {
    phase: "Phase 3: Public Launch",
    deadline: "June 7, 2024",
    status: "upcoming",
    progress: 0,
    items: [
      { name: "Internal Testing Complete", status: "planned" },
      { name: "Documentation & Training", status: "planned" },
      { name: "Public Access to All Verticals", status: "planned" },
      { name: "Marketing & Onboarding", status: "planned" },
      { name: "Customer Support Ready", status: "planned" },
    ],
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "in-progress":
      return <Clock className="h-4 w-4 text-blue-500" />
    case "planned":
      return <Target className="h-4 w-4 text-gray-400" />
    default:
      return <Clock className="h-4 w-4 text-gray-400" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <Badge variant="default" className="bg-green-500">
          Completed
        </Badge>
      )
    case "in-progress":
      return (
        <Badge variant="default" className="bg-blue-500">
          In Progress
        </Badge>
      )
    case "upcoming":
      return <Badge variant="secondary">Upcoming</Badge>
    case "planned":
      return <Badge variant="outline">Planned</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export function VerticalRoadmap() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Rocket className="h-6 w-6 text-orange-500" />
          Vertical Onboarding Roadmap
        </h2>
        <p className="text-muted-foreground">Complete vertical structure implementation timeline</p>
      </div>

      <div className="space-y-6">
        {roadmapItems.map((phase, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {phase.phase}
                  </CardTitle>
                  <CardDescription>Target: {phase.deadline}</CardDescription>
                </div>
                {getStatusBadge(phase.status)}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{phase.progress}%</span>
                </div>
                <Progress value={phase.progress} className="w-full" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {phase.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <span
                      className={`flex-1 ${item.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                    >
                      {item.name}
                    </span>
                    {getStatusBadge(item.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-green-800">🎯 Launch Target</h3>
            <p className="text-green-700">
              <strong>June 7, 2024</strong> - Public access to all core verticals
            </p>
            <p className="text-sm text-green-600">
              Internal testing complete by June 3 • Full feature set ready for customers
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
