"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Bot,
  MessageCircle,
  Send,
  Phone,
  Mail,
  TrendingUp,
  Zap,
  CheckCircle,
  Star,
  Calendar,
  DollarSign,
  Smartphone,
  Laptop,
  Tablet,
  Settings,
  MessageSquare,
  Headphones,
  ThumbsUp,
  RefreshCw,
} from "lucide-react"

interface ChatMessage {
  id: string
  type: "user" | "bot" | "system"
  content: string
  timestamp: Date
  metadata?: {
    intent?: string
    confidence?: number
    entities?: Record<string, any>
    actions?: string[]
  }
}

interface RepairEstimate {
  device: string
  issue: string
  estimatedCost: {
    min: number
    max: number
  }
  estimatedTime: string
  confidence: number
  parts?: string[]
  labor?: number
}

interface SupportMetrics {
  totalChats: number
  resolvedChats: number
  avgResponseTime: number
  satisfactionScore: number
  escalationRate: number
  topIssues: { issue: string; count: number }[]
}

const mockChatHistory: ChatMessage[] = [
  {
    id: "1",
    type: "user",
    content: "My iPhone 14 screen is cracked, how much to fix?",
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: "2",
    type: "bot",
    content:
      "I can help you with that! For an iPhone 14 screen repair, the estimated cost is $280-$320 and typically takes 45-60 minutes. Would you like me to check our current availability for an appointment?",
    timestamp: new Date(Date.now() - 295000),
    metadata: {
      intent: "repair_estimate",
      confidence: 0.95,
      entities: { device: "iPhone 14", issue: "screen_crack" },
    },
  },
  {
    id: "3",
    type: "user",
    content: "Yes, what times are available today?",
    timestamp: new Date(Date.now() - 290000),
  },
  {
    id: "4",
    type: "bot",
    content:
      "Great! I have these slots available today:\n• 2:30 PM - 3:30 PM\n• 4:00 PM - 5:00 PM\n• 5:30 PM - 6:30 PM\n\nWhich time works best for you?",
    timestamp: new Date(Date.now() - 285000),
    metadata: {
      intent: "schedule_appointment",
      confidence: 0.92,
      actions: ["show_calendar", "book_appointment"],
    },
  },
]

const supportMetrics: SupportMetrics = {
  totalChats: 1247,
  resolvedChats: 1156,
  avgResponseTime: 0.8,
  satisfactionScore: 4.7,
  escalationRate: 7.3,
  topIssues: [
    { issue: "Screen Repair", count: 342 },
    { issue: "Battery Issues", count: 287 },
    { issue: "Water Damage", count: 156 },
    { issue: "Charging Problems", count: 134 },
    { issue: "Software Issues", count: 98 },
  ],
}

const knowledgeBase = [
  {
    category: "Screen Repair",
    questions: [
      {
        q: "How long does screen repair take?",
        a: "Most screen repairs take 45-90 minutes depending on the device model.",
      },
      {
        q: "Do you use original parts?",
        a: "We use high-quality OEM and aftermarket parts with warranty coverage.",
      },
    ],
  },
  {
    category: "Battery",
    questions: [
      {
        q: "How do I know if I need a battery replacement?",
        a: "Signs include rapid battery drain, unexpected shutdowns, or battery health below 80%.",
      },
      {
        q: "How long do new batteries last?",
        a: "Our replacement batteries typically last 2-3 years with normal usage.",
      },
    ],
  },
]

export function AIChatbotSupport() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatHistory)
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedTab, setSelectedTab] = useState("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI processing
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage)
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateBotResponse = (userInput: string): ChatMessage => {
    const input = userInput.toLowerCase()

    // Simple intent detection
    if (input.includes("price") || input.includes("cost") || input.includes("how much")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "I'd be happy to provide a repair estimate! Could you tell me:\n1. What device do you have?\n2. What's the issue you're experiencing?\n\nThis will help me give you an accurate quote.",
        timestamp: new Date(),
        metadata: {
          intent: "price_inquiry",
          confidence: 0.89,
          actions: ["collect_device_info"],
        },
      }
    }

    if (input.includes("appointment") || input.includes("schedule") || input.includes("book")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "I can help you schedule an appointment! We have availability:\n\n📅 Today: 2:30 PM, 4:00 PM, 5:30 PM\n📅 Tomorrow: 9:00 AM, 11:30 AM, 2:00 PM, 4:30 PM\n\nWhich time works best for you?",
        timestamp: new Date(),
        metadata: {
          intent: "schedule_appointment",
          confidence: 0.94,
          actions: ["show_calendar", "book_slot"],
        },
      }
    }

    if (input.includes("status") || input.includes("track") || input.includes("progress")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "I can help you check your repair status! Please provide your:\n• Ticket number (e.g., RHQ-123456)\n• Phone number associated with the repair\n\nI'll look up your repair immediately.",
        timestamp: new Date(),
        metadata: {
          intent: "status_check",
          confidence: 0.91,
          actions: ["lookup_ticket"],
        },
      }
    }

    if (input.includes("hours") || input.includes("open") || input.includes("location")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "📍 **Store Information:**\n\n🕒 **Hours:**\nMon-Fri: 9:00 AM - 7:00 PM\nSat: 10:00 AM - 6:00 PM\nSun: 12:00 PM - 5:00 PM\n\n📞 **Phone:** (555) 123-4567\n📧 **Email:** support@repairhq.com\n\nIs there anything specific you'd like to know?",
        timestamp: new Date(),
        metadata: {
          intent: "store_info",
          confidence: 0.96,
        },
      }
    }

    // Default response
    return {
      id: Date.now().toString(),
      type: "bot",
      content:
        "I'm here to help! I can assist you with:\n\n🔧 **Repair estimates** - Get instant quotes\n📅 **Appointments** - Schedule your visit\n📱 **Repair status** - Track your device\n❓ **Questions** - General support\n\nWhat would you like help with today?",
      timestamp: new Date(),
      metadata: {
        intent: "general_help",
        confidence: 0.75,
        actions: ["show_menu"],
      },
    }
  }

  const getEstimate = (device: string, issue: string): RepairEstimate => {
    const estimates: Record<string, Record<string, RepairEstimate>> = {
      iphone: {
        screen: {
          device: "iPhone",
          issue: "Screen Repair",
          estimatedCost: { min: 180, max: 320 },
          estimatedTime: "45-60 minutes",
          confidence: 0.95,
          parts: ["LCD Display", "Touch Digitizer"],
          labor: 45,
        },
        battery: {
          device: "iPhone",
          issue: "Battery Replacement",
          estimatedCost: { min: 80, max: 120 },
          estimatedTime: "30-45 minutes",
          confidence: 0.98,
          parts: ["Battery"],
          labor: 30,
        },
      },
      samsung: {
        screen: {
          device: "Samsung",
          issue: "Screen Repair",
          estimatedCost: { min: 150, max: 280 },
          estimatedTime: "60-90 minutes",
          confidence: 0.92,
          parts: ["AMOLED Display"],
          labor: 60,
        },
      },
    }

    return (
      estimates[device.toLowerCase()]?.[issue.toLowerCase()] || {
        device: "Device",
        issue: "Repair",
        estimatedCost: { min: 50, max: 200 },
        estimatedTime: "30-120 minutes",
        confidence: 0.75,
      }
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Customer Support</h2>
          <p className="text-muted-foreground">24/7 automated support with instant repair estimates</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Online
          </Badge>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportMetrics.totalChats.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline mr-1 h-3 w-3 text-green-600" />
              +12.5% this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((supportMetrics.resolvedChats / supportMetrics.totalChats) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {supportMetrics.resolvedChats} of {supportMetrics.totalChats} resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportMetrics.avgResponseTime}s</div>
            <p className="text-xs text-muted-foreground">Instant AI responses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
            <Star className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportMetrics.satisfactionScore}/5</div>
            <p className="text-xs text-muted-foreground">
              <ThumbsUp className="inline mr-1 h-3 w-3 text-green-600" />
              94.2% positive feedback
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Chat Interface */}
            <div className="md:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bot className="mr-2 h-5 w-5 text-blue-600" />
                    AI Support Chat
                  </CardTitle>
                  <CardDescription>Instant repair estimates and support</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          <div className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</div>
                          {message.metadata?.confidence && (
                            <div className="text-xs opacity-70 mt-1">
                              Confidence: {(message.metadata.confidence * 100).toFixed(0)}%
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask about repairs, pricing, or schedule an appointment..."
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Info */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Get Repair Quote
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Appointment
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Check Repair Status
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Headphones className="mr-2 h-4 w-4" />
                    Contact Human Agent
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Devices</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Smartphone className="mr-2 h-4 w-4" />
                      <span className="text-sm">iPhone 14/15</span>
                    </div>
                    <span className="text-sm text-muted-foreground">$180-$320</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Smartphone className="mr-2 h-4 w-4" />
                      <span className="text-sm">Samsung Galaxy</span>
                    </div>
                    <span className="text-sm text-muted-foreground">$150-$280</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Tablet className="mr-2 h-4 w-4" />
                      <span className="text-sm">iPad</span>
                    </div>
                    <span className="text-sm text-muted-foreground">$200-$450</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Laptop className="mr-2 h-4 w-4" />
                      <span className="text-sm">MacBook</span>
                    </div>
                    <span className="text-sm text-muted-foreground">$300-$800</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Support Issues</CardTitle>
                <CardDescription>Most common customer inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supportMetrics.topIssues.map((issue, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm font-medium">{issue.issue}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(issue.count / supportMetrics.topIssues[0].count) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-8">{issue.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Performance</CardTitle>
                <CardDescription>AI chatbot efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Resolution Rate</span>
                    <span>92.7%</span>
                  </div>
                  <Progress value={92.7} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Customer Satisfaction</span>
                    <span>94.2%</span>
                  </div>
                  <Progress value={94.2} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Escalation Rate</span>
                    <span>7.3%</span>
                  </div>
                  <Progress value={7.3} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Intent Recognition</span>
                    <span>89.5%</span>
                  </div>
                  <Progress value={89.5} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Conversations</CardTitle>
                <CardDescription>Latest customer interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Intent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Satisfaction</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>2:34 PM</TableCell>
                      <TableCell>John D.</TableCell>
                      <TableCell>Repair Estimate</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>5.0</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2:28 PM</TableCell>
                      <TableCell>Sarah M.</TableCell>
                      <TableCell>Schedule Appointment</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>4.8</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2:15 PM</TableCell>
                      <TableCell>Mike R.</TableCell>
                      <TableCell>Status Check</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                      </TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="knowledge">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base</CardTitle>
                <CardDescription>Common questions and answers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {knowledgeBase.map((category, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">{category.category}</h4>
                      <div className="space-y-2">
                        {category.questions.map((qa, qaIndex) => (
                          <div key={qaIndex} className="text-sm">
                            <div className="font-medium text-blue-600">{qa.q}</div>
                            <div className="text-muted-foreground">{qa.a}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Data</CardTitle>
                <CardDescription>AI model performance and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Intent Recognition Model</div>
                    <div className="text-sm text-muted-foreground">Last updated: 2 days ago</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">89.5% Accuracy</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Repair Estimation Model</div>
                    <div className="text-sm text-muted-foreground">Last updated: 1 week ago</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">94.2% Accuracy</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Sentiment Analysis</div>
                    <div className="text-sm text-muted-foreground">Last updated: 3 days ago</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">91.7% Accuracy</Badge>
                </div>
                <Button className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retrain Models
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Chatbot Configuration</CardTitle>
                <CardDescription>Customize AI behavior and responses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Response Tone</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Professional & Friendly</option>
                    <option>Casual & Conversational</option>
                    <option>Formal & Technical</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confidence Threshold</label>
                  <div className="flex items-center space-x-2">
                    <input type="range" min="0" max="100" value="75" className="flex-1" />
                    <span className="text-sm">75%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Escalation Triggers</label>
                  <div className="space-y-1">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Low confidence responses</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Customer requests human agent</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Complex technical issues</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
                <CardDescription>Connect with external services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">Website Chat Widget</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">SMS Support</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">Email Integration</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                </div>
                <Button className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Integrations
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
