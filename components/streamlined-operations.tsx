"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Zap, TrendingUp, CheckCircle, AlertTriangle, Brain, Settings, Target } from "lucide-react"

const automatedWorkflows = [
  {
    id: 1,
    name: "Smart Appointment Scheduling",
    description: "AI-powered scheduling based on technician skills, availability, and repair complexity",
    status: "active",
    efficiency: 94,
    timeSaved: "3.2 hours/day",
    automationLevel: 85,
    triggers: ["New appointment request", "Technician availability change", "Skill matching"],
    actions: ["Auto-assign technician", "Block calendar", "Send confirmations", "Optimize route"],
  },
  {
    id: 2,
    name: "Predictive Parts Ordering",
    description: "Automatically order parts based on repair trends and inventory levels",
    status: "active",
    efficiency: 89,
    timeSaved: "2.8 hours/day",
    automationLevel: 92,
    triggers: ["Low inventory alert", "Seasonal trends", "Repair forecasting"],
    actions: ["Generate purchase order", "Contact suppliers", "Update inventory", "Notify manager"],
  },
  {
    id: 3,
    name: "Customer Communication Flow",
    description: "Automated status updates and proactive customer communication",
    status: "active",
    efficiency: 96,
    timeSaved: "4.1 hours/day",
    automationLevel: 88,
    triggers: ["Status change", "Delay detected", "Completion milestone"],
    actions: ["Send SMS/Email", "Update portal", "Schedule follow-up", "Request feedback"],
  },
  {
    id: 4,
    name: "Resource Optimization",
    description: "Dynamic allocation of technicians and tools based on workload",
    status: "learning",
    efficiency: 78,
    timeSaved: "1.9 hours/day",
    automationLevel: 65,
    triggers: ["Workload imbalance", "Skill requirements", "Priority changes"],
    actions: ["Reassign tasks", "Balance workload", "Optimize schedules", "Alert supervisors"],
  },
]

const smartScheduling = {
  todayMetrics: {
    scheduledAppointments: 24,
    optimizationScore: 92,
    utilizationRate: 87,
    averageWaitTime: 12,
    customerSatisfaction: 4.8,
  },
  aiRecommendations: [
    {
      type: "schedule_optimization",
      title: "Reschedule 2 PM appointment",
      description: "Move iPhone repair to 3:30 PM to optimize technician Mike's route",
      impact: "Save 25 minutes travel time",
      confidence: 94,
    },
    {
      type: "resource_allocation",
      title: "Assign water damage specialist",
      description: "iPad water damage case needs Emma's expertise",
      impact: "Increase success rate by 35%",
      confidence: 89,
    },
    {
      type: "inventory_alert",
      title: "Order iPhone 14 screens",
      description: "Predicted shortage in 3 days based on booking trends",
      impact: "Prevent 5 potential delays",
      confidence: 91,
    },
  ],
}

const operationalMetrics = {
  efficiency: {
    current: 87,
    target: 95,
    improvement: "+12% this month",
  },
  automation: {
    tasksAutomated: 156,
    manualTasks: 23,
    automationRate: 87,
  },
  productivity: {
    ticketsPerDay: 18.5,
    avgCompletionTime: 2.3,
    firstTimeFixRate: 94,
  },
}

export function StreamlinedOperations() {
  const [selectedWorkflow, setSelectedWorkflow] = useState(automatedWorkflows[0])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Streamlined Operations</h2>
          <p className="text-muted-foreground">AI-powered automation and smart scheduling</p>
        </div>
        <Button>
          <Settings className="mr-2 h-4 w-4" />
          Configure Automation
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operational Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operationalMetrics.efficiency.current}%</div>
            <div className="flex items-center mt-2">
              <Progress value={operationalMetrics.efficiency.current} className="flex-1 mr-2" />
              <span className="text-xs text-green-600">{operationalMetrics.efficiency.improvement}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Automated</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operationalMetrics.automation.tasksAutomated}</div>
            <p className="text-xs text-muted-foreground">
              {operationalMetrics.automation.automationRate}% automation rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Productivity</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operationalMetrics.productivity.ticketsPerDay}</div>
            <p className="text-xs text-muted-foreground">tickets per technician</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">First-Time Fix Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operationalMetrics.productivity.firstTimeFixRate}%</div>
            <p className="text-xs text-muted-foreground">
              Avg completion: {operationalMetrics.productivity.avgCompletionTime} days
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workflows">Automated Workflows</TabsTrigger>
          <TabsTrigger value="scheduling">Smart Scheduling</TabsTrigger>
          <TabsTrigger value="optimization">Resource Optimization</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Active Workflows</CardTitle>
                <CardDescription>AI-powered automation systems</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automatedWorkflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedWorkflow.id === workflow.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedWorkflow(workflow)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{workflow.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant={workflow.status === "active" ? "default" : "secondary"}>
                            {workflow.status}
                          </Badge>
                          <Switch checked={workflow.status === "active"} />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600">Saves {workflow.timeSaved}</span>
                        <span className="text-blue-600">{workflow.efficiency}% efficient</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workflow Details</CardTitle>
                <CardDescription>{selectedWorkflow.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Automation Level</h4>
                  <div className="flex items-center space-x-2">
                    <Progress value={selectedWorkflow.automationLevel} className="flex-1" />
                    <span className="text-sm font-medium">{selectedWorkflow.automationLevel}%</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Triggers</h4>
                  <div className="space-y-1">
                    {selectedWorkflow.triggers.map((trigger, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <AlertTriangle className="h-3 w-3 mr-2 text-orange-500" />
                        {trigger}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Automated Actions</h4>
                  <div className="space-y-1">
                    {selectedWorkflow.actions.map((action, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                        {action}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{selectedWorkflow.efficiency}%</div>
                      <div className="text-xs text-gray-600">Efficiency</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{selectedWorkflow.timeSaved}</div>
                      <div className="text-xs text-gray-600">Time Saved</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scheduling">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule Optimization</CardTitle>
                <CardDescription>AI-powered scheduling insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{smartScheduling.todayMetrics.scheduledAppointments}</div>
                    <div className="text-xs text-gray-600">Appointments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {smartScheduling.todayMetrics.optimizationScore}%
                    </div>
                    <div className="text-xs text-gray-600">Optimization</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {smartScheduling.todayMetrics.utilizationRate}%
                    </div>
                    <div className="text-xs text-gray-600">Utilization</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{smartScheduling.todayMetrics.averageWaitTime}min</div>
                    <div className="text-xs text-gray-600">Avg Wait</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Schedule Health</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Technician Utilization</span>
                      <span>{smartScheduling.todayMetrics.utilizationRate}%</span>
                    </div>
                    <Progress value={smartScheduling.todayMetrics.utilizationRate} />

                    <div className="flex justify-between text-sm">
                      <span>Customer Satisfaction</span>
                      <span>{smartScheduling.todayMetrics.customerSatisfaction}/5.0</span>
                    </div>
                    <Progress value={smartScheduling.todayMetrics.customerSatisfaction * 20} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>Smart suggestions to optimize operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {smartScheduling.aiRecommendations.map((rec, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Brain className="h-4 w-4 mr-2 text-purple-600" />
                          <span className="font-medium text-sm">{rec.title}</span>
                        </div>
                        <Badge variant="outline">{rec.confidence}% confident</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-600">{rec.impact}</span>
                        <div className="space-x-2">
                          <Button size="sm" variant="outline">
                            Dismiss
                          </Button>
                          <Button size="sm">Apply</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Resource Allocation</CardTitle>
                <CardDescription>Real-time resource optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Technician Workload</span>
                    <Badge variant="outline">Balanced</Badge>
                  </div>
                  <Progress value={85} />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tool Utilization</span>
                    <Badge variant="outline">Optimal</Badge>
                  </div>
                  <Progress value={92} />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Parts Availability</span>
                    <Badge variant="outline">Good</Badge>
                  </div>
                  <Progress value={78} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workflow Efficiency</CardTitle>
                <CardDescription>Process optimization metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">94%</div>
                    <div className="text-sm text-gray-600">Overall Efficiency</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Intake Process</span>
                      <span>96%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Diagnosis</span>
                      <span>91%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Repair Execution</span>
                      <span>95%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Quality Check</span>
                      <span>98%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predictive Insights</CardTitle>
                <CardDescription>AI-powered forecasting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center mb-1">
                      <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">Demand Forecast</span>
                    </div>
                    <p className="text-xs text-gray-600">25% increase expected next week</p>
                  </div>

                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center mb-1">
                      <AlertTriangle className="h-4 w-4 mr-2 text-orange-600" />
                      <span className="text-sm font-medium">Capacity Alert</span>
                    </div>
                    <p className="text-xs text-gray-600">Consider hiring temp technician</p>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center mb-1">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm font-medium">Efficiency Gain</span>
                    </div>
                    <p className="text-xs text-gray-600">New workflow saves 2.5 hrs/day</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>30-day operational metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">+12%</div>
                      <div className="text-xs text-gray-600">Efficiency Gain</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">-18%</div>
                      <div className="text-xs text-gray-600">Wait Times</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Key Improvements</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Automated scheduling adoption</span>
                        <span className="text-green-600">+45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Customer satisfaction</span>
                        <span className="text-green-600">+8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>First-time fix rate</span>
                        <span className="text-green-600">+6%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI Analysis</CardTitle>
                <CardDescription>Automation investment returns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">340%</div>
                    <div className="text-sm text-gray-600">ROI on Automation</div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Time Savings</span>
                        <span>$2,400/month</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Error Reduction</span>
                        <span>$800/month</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Customer Retention</span>
                        <span>$1,200/month</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-medium">
                          <span>Total Monthly Savings</span>
                          <span className="text-green-600">$4,400</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
