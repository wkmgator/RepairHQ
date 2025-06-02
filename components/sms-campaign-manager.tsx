"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Loader2, MessageSquare, Plus, Eye, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  createSmsTemplate,
  getSmsTemplates,
  deleteSmsTemplate,
  getCustomerSegments,
  createCampaign,
  getCampaigns,
  generateSmsContent,
  scheduleCampaign,
  pauseCampaign,
  resumeCampaign,
  type SmsTemplate,
  type CustomerSegment,
  type MarketingCampaign,
} from "@/lib/marketing-service"

export function SmsCampaignManager() {
  const [templates, setTemplates] = useState<SmsTemplate[]>([])
  const [segments, setSegments] = useState<CustomerSegment[]>([])
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<SmsTemplate | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<MarketingCampaign | null>(null)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    content: "",
    category: "general",
    tags: [""],
  })
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    type: "sms" as const,
    templateId: "",
    segmentId: "",
  })
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [generatingContent, setGeneratingContent] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [templatesData, segmentsData, campaignsData] = await Promise.all([
          getSmsTemplates(),
          getCustomerSegments(),
          getCampaigns(),
        ])
        setTemplates(templatesData)
        setSegments(segmentsData)
        setCampaigns(campaignsData.filter((c) => c.type === "sms"))
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    setCharCount(newTemplate.content.length)
  }, [newTemplate.content])

  const handleCreateTemplate = async () => {
    try {
      setLoading(true)
      const template = await createSmsTemplate({
        name: newTemplate.name,
        description: newTemplate.description,
        content: newTemplate.content,
        category: newTemplate.category,
        tags: newTemplate.tags,
        created_by: "current-user-id", // Replace with actual user ID
        is_active: true,
      })
      setTemplates([...templates, template])
      setTemplateDialogOpen(false)
      setNewTemplate({
        name: "",
        description: "",
        content: "",
        category: "general",
        tags: [""],
      })
      toast({
        title: "Success",
        description: "SMS template created successfully.",
      })
    } catch (error) {
      console.error("Error creating template:", error)
      toast({
        title: "Error",
        description: "Failed to create template. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTemplate = async (id: string) => {
    try {
      setLoading(true)
      await deleteSmsTemplate(id)
      setTemplates(templates.filter((t) => t.id !== id))
      toast({
        title: "Success",
        description: "SMS template deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting template:", error)
      toast({
        title: "Error",
        description: "Failed to delete template. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCampaign = async () => {
    try {
      setLoading(true)
      const selectedTemplate = templates.find((t) => t.id === newCampaign.templateId)
      const selectedSegment = segments.find((s) => s.id === newCampaign.segmentId)

      if (!selectedTemplate || !selectedSegment) {
        throw new Error("Template or segment not found")
      }

      const campaign = await createCampaign({
        name: newCampaign.name,
        description: newCampaign.description,
        type: "sms",
        status: "draft",
        target_audience: {
          segment_id: selectedSegment.id,
          segment_name: selectedSegment.name,
          customer_count: selectedSegment.customer_count,
        },
        content: {
          template_id: selectedTemplate.id,
          template_name: selectedTemplate.name,
          body: selectedTemplate.content,
        },
        metrics: {
          total: 0,
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          converted: 0,
          failed: 0,
          unsubscribed: 0,
        },
        scheduled_at: null,
        completed_at: null,
        created_by: "current-user-id", // Replace with actual user ID
      })

      setCampaigns([...campaigns, campaign])
      setCreateDialogOpen(false)
      setNewCampaign({
        name: "",
        description: "",
        type: "sms",
        templateId: "",
        segmentId: "",
      })
      toast({
        title: "Success",
        description: "SMS campaign created successfully.",
      })
    } catch (error) {
      console.error("Error creating campaign:", error)
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleCampaign = async () => {
    if (!selectedCampaign || !scheduledDate) return

    try {
      setLoading(true)
      const updatedCampaign = await scheduleCampaign(selectedCampaign.id, scheduledDate.toISOString())
      setCampaigns(campaigns.map((c) => (c.id === updatedCampaign.id ? updatedCampaign : c)))
      setScheduleDialogOpen(false)
      setSelectedCampaign(null)
      setScheduledDate(undefined)
      toast({
        title: "Success",
        description: "Campaign scheduled successfully.",
      })
    } catch (error) {
      console.error("Error scheduling campaign:", error)
      toast({
        title: "Error",
        description: "Failed to schedule campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePauseCampaign = async (id: string) => {
    try {
      setLoading(true)
      const updatedCampaign = await pauseCampaign(id)
      setCampaigns(campaigns.map((c) => (c.id === updatedCampaign.id ? updatedCampaign : c)))
      toast({
        title: "Success",
        description: "Campaign paused successfully.",
      })
    } catch (error) {
      console.error("Error pausing campaign:", error)
      toast({
        title: "Error",
        description: "Failed to pause campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResumeCampaign = async (id: string) => {
    try {
      setLoading(true)
      const updatedCampaign = await resumeCampaign(id)
      setCampaigns(campaigns.map((c) => (c.id === updatedCampaign.id ? updatedCampaign : c)))
      toast({
        title: "Success",
        description: "Campaign resumed successfully.",
      })
    } catch (error) {
      console.error("Error resuming campaign:", error)
      toast({
        title: "Error",
        description: "Failed to resume campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateContent = async () => {
    if (!aiPrompt) return

    try {
      setGeneratingContent(true)
      const content = await generateSmsContent(aiPrompt)
      setNewTemplate({
        ...newTemplate,
        content,
      })
      toast({
        title: "Success",
        description: "SMS content generated successfully.",
      })
    } catch (error) {
      console.error("Error generating content:", error)
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGeneratingContent(false)
    }
  }

  const getCampaignStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "active":
        return <Badge variant="default">Active</Badge>
      case "paused":
        return <Badge variant="secondary">Paused</Badge>
      case "completed":
        return <Badge variant="success">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMessageSegments = (length: number) => {
    if (length <= 160) return 1
    return Math.ceil(length / 153)
  }

  if (loading && templates.length === 0 && segments.length === 0 && campaigns.length === 0) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">SMS Campaigns</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setTemplateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Template
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Campaign
          </Button>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground">
              No SMS campaigns yet. Create your first campaign to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{campaign.name}</span>
                  {getCampaignStatusBadge(campaign.status)}
                </CardTitle>
                <CardDescription>{campaign.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Audience:</span>
                    <span>{campaign.target_audience?.segment_name || "Unknown"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Recipients:</span>
                    <span>{campaign.target_audience?.customer_count || 0}</span>
                  </div>
                  {campaign.scheduled_at && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Scheduled:</span>
                      <span>{new Date(campaign.scheduled_at).toLocaleDateString()}</span>
                    </div>
                  )}
                  {campaign.metrics && (
                    <>
                      <Separator className="my-2" />
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Sent:</span>
                          <span className="ml-1">{campaign.metrics.sent || 0}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Delivered:</span>
                          <span className="ml-1">{campaign.metrics.delivered || 0}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Clicked:</span>
                          <span className="ml-1">{campaign.metrics.clicked || 0}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Converted:</span>
                          <span className="ml-1">{campaign.metrics.converted || 0}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedCampaign(campaign)
                      setPreviewDialogOpen(true)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {campaign.status === "draft" && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedCampaign(campaign)
                        setScheduleDialogOpen(true)
                      }}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex space-x-2">
                  {campaign.status === "active" && (
                    <Button variant="outline" size="sm" onClick={() => handlePauseCampaign(campaign.id)}>
                      Pause
                    </Button>
                  )}
                  {campaign.status === "paused" && (
                    <Button variant="outline" size="sm" onClick={() => handleResumeCampaign(campaign.id)}>
                      Resume
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create Campaign Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create SMS Campaign</DialogTitle>
            <DialogDescription>Create a new SMS campaign to send to your customers.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                placeholder="Flash Sale Alert"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="campaign-description">Description</Label>
              <Textarea
                id="campaign-description"
                value={newCampaign.description}
                onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                placeholder="Alert customers about our 24-hour flash sale"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="template-select">SMS Template</Label>
              <Select
                value={newCampaign.templateId}
                onValueChange={(value) => setNewCampaign({ ...newCampaign, templateId: value })}
              >
                <SelectTrigger id="template-select">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Templates</SelectLabel>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="segment-select">Customer Segment</Label>
              <Select
                value={newCampaign.segmentId}
                onValueChange={(value) => setNewCampaign({ ...newCampaign, segmentId: value })}
              >
                <SelectTrigger id="segment-select">
                  <SelectValue placeholder="Select a segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Segments</SelectLabel>
                    {segments.map((segment) => (
                      <SelectItem key={segment.id} value={segment.id}>
                        {segment.name} ({segment.customer_count} customers)
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateCampaign}
              disabled={!newCampaign.name || !newCampaign.templateId || !newCampaign.segmentId}
            >
              Create Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Template Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create SMS Template</DialogTitle>
            <DialogDescription>Create a new SMS template for your campaigns.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="Appointment Reminder"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="template-category">Category</Label>
                <Select
                  value={newTemplate.category}
                  onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
                >
                  <SelectTrigger id="template-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                    <SelectItem value="transactional">Transactional</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="template-description">Description</Label>
              <Textarea
                id="template-description"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                placeholder="SMS reminder for upcoming appointments"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ai-prompt">Generate Content with AI</Label>
              <div className="flex gap-2">
                <Textarea
                  id="ai-prompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe what you want in your SMS, e.g., 'A reminder for an upcoming repair appointment with a link to reschedule'"
                />
                <Button
                  variant="outline"
                  onClick={handleGenerateContent}
                  disabled={generatingContent || !aiPrompt}
                  className="shrink-0"
                >
                  {generatingContent ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="template-content">SMS Content</Label>
                <div className="text-xs text-muted-foreground">
                  {charCount} characters ({getMessageSegments(charCount)}{" "}
                  {getMessageSegments(charCount) === 1 ? "segment" : "segments"})
                </div>
              </div>
              <Textarea
                id="template-content"
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                placeholder="Your appointment is scheduled for tomorrow at 2 PM. Reply Y to confirm or call (555) 123-4567 to reschedule."
                className="min-h-[100px]"
              />
              {charCount > 160 && (
                <p className="text-xs text-amber-500">
                  This message exceeds 160 characters and will be sent as multiple segments.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate} disabled={!newTemplate.name || !newTemplate.content}>
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate
                ? `Preview: ${selectedTemplate.name}`
                : selectedCampaign
                  ? `Preview: ${selectedCampaign.name}`
                  : "Preview"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedTemplate && (
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="mb-2 text-xs text-muted-foreground">
                    {selectedTemplate.content.length} characters ({getMessageSegments(selectedTemplate.content.length)}{" "}
                    {getMessageSegments(selectedTemplate.content.length) === 1 ? "segment" : "segments"})
                  </div>
                  <div className="rounded-lg bg-primary/10 p-3 text-sm">{selectedTemplate.content}</div>
                </div>
              </div>
            )}
            {selectedCampaign && (
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="mb-2 text-xs text-muted-foreground">
                    {selectedCampaign.content?.body.length} characters (
                    {getMessageSegments(selectedCampaign.content?.body.length)}{" "}
                    {getMessageSegments(selectedCampaign.content?.body.length) === 1 ? "segment" : "segments"})
                  </div>
                  <div className="rounded-lg bg-primary/10 p-3 text-sm">{selectedCampaign.content?.body}</div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Schedule Campaign</DialogTitle>
            <DialogDescription>Choose when to send this campaign to your customers.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid gap-2">
              <Label>Select Date and Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent mode="single" selected={scheduledDate} onSelect={setScheduledDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleCampaign} disabled={!scheduledDate}>
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
