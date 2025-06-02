"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Plus, Trash2, Save, Play, BarChart3, PieChart, LineChart, Table, Download, Edit } from "lucide-react"

interface ReportField {
  id: string
  name: string
  type: "text" | "number" | "date" | "currency" | "percentage"
  source: "revenue" | "customers" | "tickets" | "inventory" | "technicians" | "locations"
  aggregation?: "sum" | "avg" | "count" | "min" | "max"
}

interface ReportFilter {
  id: string
  field: string
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains" | "between"
  value: string | number | Date
  value2?: string | number | Date // for 'between' operator
}

interface ReportVisualization {
  id: string
  type: "table" | "bar_chart" | "line_chart" | "pie_chart" | "area_chart"
  title: string
  fields: string[]
  groupBy?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

interface CustomReport {
  id: string
  name: string
  description: string
  fields: ReportField[]
  filters: ReportFilter[]
  visualizations: ReportVisualization[]
  schedule?: {
    frequency: "daily" | "weekly" | "monthly"
    time: string
    recipients: string[]
  }
  createdAt: Date
  updatedAt: Date
}

const availableFields: ReportField[] = [
  // Revenue fields
  { id: "total_revenue", name: "Total Revenue", type: "currency", source: "revenue", aggregation: "sum" },
  { id: "avg_order_value", name: "Average Order Value", type: "currency", source: "revenue", aggregation: "avg" },
  { id: "profit_margin", name: "Profit Margin", type: "percentage", source: "revenue" },
  { id: "monthly_revenue", name: "Monthly Revenue", type: "currency", source: "revenue", aggregation: "sum" },

  // Customer fields
  { id: "total_customers", name: "Total Customers", type: "number", source: "customers", aggregation: "count" },
  { id: "new_customers", name: "New Customers", type: "number", source: "customers", aggregation: "count" },
  {
    id: "customer_lifetime_value",
    name: "Customer Lifetime Value",
    type: "currency",
    source: "customers",
    aggregation: "avg",
  },
  { id: "retention_rate", name: "Retention Rate", type: "percentage", source: "customers" },

  // Ticket fields
  { id: "total_tickets", name: "Total Tickets", type: "number", source: "tickets", aggregation: "count" },
  { id: "completion_rate", name: "Completion Rate", type: "percentage", source: "tickets" },
  { id: "avg_resolution_time", name: "Average Resolution Time", type: "number", source: "tickets", aggregation: "avg" },
  { id: "first_time_fix_rate", name: "First Time Fix Rate", type: "percentage", source: "tickets" },

  // Technician fields
  { id: "total_technicians", name: "Total Technicians", type: "number", source: "technicians", aggregation: "count" },
  {
    id: "avg_tickets_per_tech",
    name: "Average Tickets per Technician",
    type: "number",
    source: "technicians",
    aggregation: "avg",
  },
  {
    id: "technician_efficiency",
    name: "Technician Efficiency",
    type: "percentage",
    source: "technicians",
    aggregation: "avg",
  },

  // Inventory fields
  { id: "inventory_value", name: "Inventory Value", type: "currency", source: "inventory", aggregation: "sum" },
  { id: "turnover_rate", name: "Turnover Rate", type: "number", source: "inventory" },
  { id: "low_stock_items", name: "Low Stock Items", type: "number", source: "inventory", aggregation: "count" },

  // Location fields
  { id: "total_locations", name: "Total Locations", type: "number", source: "locations", aggregation: "count" },
  { id: "location_revenue", name: "Revenue by Location", type: "currency", source: "locations", aggregation: "sum" },
  {
    id: "location_efficiency",
    name: "Location Efficiency",
    type: "percentage",
    source: "locations",
    aggregation: "avg",
  },
]

export function CustomReportBuilder() {
  const [reports, setReports] = useState<CustomReport[]>([])
  const [currentReport, setCurrentReport] = useState<CustomReport | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedFields, setSelectedFields] = useState<ReportField[]>([])
  const [filters, setFilters] = useState<ReportFilter[]>([])
  const [visualizations, setVisualizations] = useState<ReportVisualization[]>([])
  const [reportName, setReportName] = useState("")
  const [reportDescription, setReportDescription] = useState("")

  const handleCreateNewReport = () => {
    setCurrentReport(null)
    setIsEditing(true)
    setSelectedFields([])
    setFilters([])
    setVisualizations([])
    setReportName("")
    setReportDescription("")
  }

  const handleSaveReport = () => {
    if (!reportName.trim()) return

    const report: CustomReport = {
      id: currentReport?.id || Date.now().toString(),
      name: reportName,
      description: reportDescription,
      fields: selectedFields,
      filters,
      visualizations,
      createdAt: currentReport?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    if (currentReport) {
      setReports(reports.map((r) => (r.id === currentReport.id ? report : r)))
    } else {
      setReports([...reports, report])
    }

    setCurrentReport(report)
    setIsEditing(false)
  }

  const handleAddField = (field: ReportField) => {
    if (!selectedFields.find((f) => f.id === field.id)) {
      setSelectedFields([...selectedFields, field])
    }
  }

  const handleRemoveField = (fieldId: string) => {
    setSelectedFields(selectedFields.filter((f) => f.id !== fieldId))
  }

  const handleAddFilter = () => {
    const newFilter: ReportFilter = {
      id: Date.now().toString(),
      field: selectedFields[0]?.id || "",
      operator: "equals",
      value: "",
    }
    setFilters([...filters, newFilter])
  }

  const handleUpdateFilter = (filterId: string, updates: Partial<ReportFilter>) => {
    setFilters(filters.map((f) => (f.id === filterId ? { ...f, ...updates } : f)))
  }

  const handleRemoveFilter = (filterId: string) => {
    setFilters(filters.filter((f) => f.id !== filterId))
  }

  const handleAddVisualization = () => {
    const newVisualization: ReportVisualization = {
      id: Date.now().toString(),
      type: "table",
      title: "New Visualization",
      fields: selectedFields.slice(0, 3).map((f) => f.id),
    }
    setVisualizations([...visualizations, newVisualization])
  }

  const handleUpdateVisualization = (vizId: string, updates: Partial<ReportVisualization>) => {
    setVisualizations(visualizations.map((v) => (v.id === vizId ? { ...v, ...updates } : v)))
  }

  const handleRemoveVisualization = (vizId: string) => {
    setVisualizations(visualizations.filter((v) => v.id !== vizId))
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(selectedFields)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSelectedFields(items)
  }

  const getVisualizationIcon = (type: string) => {
    switch (type) {
      case "bar_chart":
        return <BarChart3 className="h-4 w-4" />
      case "line_chart":
        return <LineChart className="h-4 w-4" />
      case "pie_chart":
        return <PieChart className="h-4 w-4" />
      case "table":
        return <Table className="h-4 w-4" />
      default:
        return <BarChart3 className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Custom Report Builder</h1>
          <p className="text-muted-foreground">Create and manage custom analytics reports</p>
        </div>
        <Button onClick={handleCreateNewReport}>
          <Plus className="mr-2 h-4 w-4" />
          New Report
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Report List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Saved Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    currentReport?.id === report.id ? "border-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => {
                    setCurrentReport(report)
                    setSelectedFields(report.fields)
                    setFilters(report.filters)
                    setVisualizations(report.visualizations)
                    setReportName(report.name)
                    setReportDescription(report.description)
                    setIsEditing(false)
                  }}
                >
                  <div className="font-medium text-sm">{report.name}</div>
                  <div className="text-xs text-muted-foreground">{report.description}</div>
                  <div className="flex justify-between items-center mt-2">
                    <Badge variant="outline" className="text-xs">
                      {report.fields.length} fields
                    </Badge>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsEditing(true)
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          setReports(reports.filter((r) => r.id !== report.id))
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Builder */}
        <div className="lg:col-span-3">
          {isEditing ? (
            <Tabs defaultValue="fields" className="space-y-4">
              <TabsList>
                <TabsTrigger value="fields">Fields</TabsTrigger>
                <TabsTrigger value="filters">Filters</TabsTrigger>
                <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Report Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Report Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="report-name">Report Name</Label>
                    <Input
                      id="report-name"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      placeholder="Enter report name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="report-description">Description</Label>
                    <Textarea
                      id="report-description"
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      placeholder="Enter report description"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSaveReport}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Report
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <TabsContent value="fields">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Available Fields */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Available Fields</CardTitle>
                      <CardDescription>Select fields to include in your report</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {availableFields.map((field) => (
                          <div
                            key={field.id}
                            className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
                          >
                            <div>
                              <div className="text-sm font-medium">{field.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {field.source} • {field.type}
                                {field.aggregation && ` • ${field.aggregation}`}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAddField(field)}
                              disabled={selectedFields.some((f) => f.id === field.id)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Selected Fields */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Selected Fields</CardTitle>
                      <CardDescription>Drag to reorder fields</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="selected-fields">
                          {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                              {selectedFields.map((field, index) => (
                                <Draggable key={field.id} draggableId={field.id} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="flex items-center justify-between p-2 border rounded bg-white"
                                    >
                                      <div>
                                        <div className="text-sm font-medium">{field.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {field.source} • {field.type}
                                        </div>
                                      </div>
                                      <Button size="sm" variant="ghost" onClick={() => handleRemoveField(field.id)}>
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="filters">
                <Card>
                  <CardHeader>
                    <CardTitle>Report Filters</CardTitle>
                    <CardDescription>Add filters to refine your data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button onClick={handleAddFilter}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Filter
                      </Button>

                      {filters.map((filter) => (
                        <div key={filter.id} className="flex items-center space-x-2 p-3 border rounded">
                          <Select
                            value={filter.field}
                            onValueChange={(value) => handleUpdateFilter(filter.id, { field: value })}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedFields.map((field) => (
                                <SelectItem key={field.id} value={field.id}>
                                  {field.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={filter.operator}
                            onValueChange={(value: any) => handleUpdateFilter(filter.id, { operator: value })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equals">Equals</SelectItem>
                              <SelectItem value="not_equals">Not Equals</SelectItem>
                              <SelectItem value="greater_than">Greater Than</SelectItem>
                              <SelectItem value="less_than">Less Than</SelectItem>
                              <SelectItem value="contains">Contains</SelectItem>
                              <SelectItem value="between">Between</SelectItem>
                            </SelectContent>
                          </Select>

                          <Input
                            value={filter.value.toString()}
                            onChange={(e) => handleUpdateFilter(filter.id, { value: e.target.value })}
                            placeholder="Value"
                            className="w-32"
                          />

                          {filter.operator === "between" && (
                            <Input
                              value={filter.value2?.toString() || ""}
                              onChange={(e) => handleUpdateFilter(filter.id, { value2: e.target.value })}
                              placeholder="To"
                              className="w-32"
                            />
                          )}

                          <Button size="sm" variant="ghost" onClick={() => handleRemoveFilter(filter.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="visualizations">
                <Card>
                  <CardHeader>
                    <CardTitle>Visualizations</CardTitle>
                    <CardDescription>Configure how your data is displayed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button onClick={handleAddVisualization}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Visualization
                      </Button>

                      {visualizations.map((viz) => (
                        <div key={viz.id} className="p-4 border rounded space-y-3">
                          <div className="flex items-center justify-between">
                            <Input
                              value={viz.title}
                              onChange={(e) => handleUpdateVisualization(viz.id, { title: e.target.value })}
                              className="font-medium"
                            />
                            <Button size="sm" variant="ghost" onClick={() => handleRemoveVisualization(viz.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid gap-3 md:grid-cols-2">
                            <div>
                              <Label>Visualization Type</Label>
                              <Select
                                value={viz.type}
                                onValueChange={(value: any) => handleUpdateVisualization(viz.id, { type: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="table">
                                    <div className="flex items-center">
                                      <Table className="mr-2 h-4 w-4" />
                                      Table
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="bar_chart">
                                    <div className="flex items-center">
                                      <BarChart3 className="mr-2 h-4 w-4" />
                                      Bar Chart
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="line_chart">
                                    <div className="flex items-center">
                                      <LineChart className="mr-2 h-4 w-4" />
                                      Line Chart
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="pie_chart">
                                    <div className="flex items-center">
                                      <PieChart className="mr-2 h-4 w-4" />
                                      Pie Chart
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Fields to Display</Label>
                              <Select
                                value={viz.fields[0] || ""}
                                onValueChange={(value) => handleUpdateVisualization(viz.id, { fields: [value] })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select fields" />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedFields.map((field) => (
                                    <SelectItem key={field.id} value={field.id}>
                                      {field.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Report Settings</CardTitle>
                    <CardDescription>Configure scheduling and sharing options</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Schedule Frequency</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Schedule</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Email Recipients</Label>
                        <Textarea placeholder="Enter email addresses, separated by commas" />
                      </div>

                      <div>
                        <Label>Export Format</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : currentReport ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{currentReport.name}</CardTitle>
                    <CardDescription>{currentReport.description}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button>
                      <Play className="mr-2 h-4 w-4" />
                      Run Report
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Fields ({currentReport.fields.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentReport.fields.map((field) => (
                        <Badge key={field.id} variant="outline">
                          {field.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {currentReport.filters.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Filters ({currentReport.filters.length})</h4>
                      <div className="space-y-2">
                        {currentReport.filters.map((filter) => (
                          <div key={filter.id} className="text-sm text-muted-foreground">
                            {availableFields.find((f) => f.id === filter.field)?.name} {filter.operator} {filter.value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentReport.visualizations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Visualizations ({currentReport.visualizations.length})</h4>
                      <div className="grid gap-3 md:grid-cols-2">
                        {currentReport.visualizations.map((viz) => (
                          <div key={viz.id} className="flex items-center space-x-2 p-2 border rounded">
                            {getVisualizationIcon(viz.type)}
                            <span className="text-sm">{viz.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No report selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a report from the list or create a new one to get started.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
