"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Brain,
  Camera,
  Mic,
  Send,
  Lightbulb,
  Clock,
  DollarSign,
  Wrench,
  CheckCircle,
  TrendingUp,
  Zap,
  Target,
  BarChart3,
} from "lucide-react"
import { recognizeIntent, generateSmartResponse } from "@/lib/ai-chatbot-service"

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  metadata?: any
}

interface RepairSuggestion {
  id: string
  title: string
  confidence: number
  estimatedTime: string
  estimatedCost: string
  difficulty: "easy" | "medium" | "hard"
  tools: string[]
  steps: string[]
}

export function AIRepairAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hi! I'm your AI repair assistant. I can help you diagnose issues, estimate repair costs, and provide step-by-step guidance. What device are you working on today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null)
  const [repairSuggestions, setRepairSuggestions] = useState<RepairSuggestion[]>([])
  const [isListening, setIsListening] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

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
    setIsProcessing(true)

    try {
      // Recognize intent
      const intent = await recognizeIntent(inputMessage)

      // Generate smart response
      const response = await generateSmartResponse(
        inputMessage,
        { intent },
        messages.map((m) => m.content),
      )

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
        metadata: { intent },
      }

      setMessages((prev) => [...prev, assistantMessage])

      // If it's a repair estimate request, generate suggestions
      if (intent.intent === "repair_estimate") {
        await generateRepairSuggestions(intent.entities)
      }
    } catch (error) {
      console.error("Error processing message:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const generateRepairSuggestions = async (entities: any) => {
    try {
      const suggestions: RepairSuggestion[] = [
        {
          id: "1",
          title: "Screen Replacement - Standard",
          confidence: 92,
          estimatedTime: "45-60 minutes",
          estimatedCost: "$150-$200",
          difficulty: "medium",
          tools: ["Pentalobe screwdriver", "Suction cup", "Spudger", "Heat gun"],
          steps: [
            "Power off device completely",
            "Remove pentalobe screws",
            "Apply heat to soften adhesive",
            "Carefully lift screen with suction cup",
            "Disconnect display cables",
            "Install new screen",
            "Reconnect cables and test",
            "Reassemble device",
          ],
        },
        {
          id: "2",
          title: "Screen Replacement - Premium",
          confidence: 88,
          estimatedTime: "30-45 minutes",
          estimatedCost: "$200-$250",
          difficulty: "medium",
          tools: ["Pentalobe screwdriver", "Suction cup", "Spudger", "Heat gun"],
          steps: [
            "Power off device completely",
            "Remove pentalobe screws",
            "Apply heat to soften adhesive",
            "Carefully lift screen with suction cup",
            "Disconnect display cables",
            "Install premium OEM screen",
            "Reconnect cables and test",
            "Reassemble device",
          ],
        },
      ]

      setRepairSuggestions(suggestions)
    } catch (error) {
      console.error("Error generating repair suggestions:", error)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setUploadedImages((prev) => [...prev, ...newImages])

      // Add message about image upload
      const imageMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "user",
        content: `Uploaded ${files.length} image(s) for analysis`,
        timestamp: new Date(),
        metadata: { images: newImages },
      }
      setMessages((prev) => [...prev, imageMessage])

      // Trigger AI analysis
      analyzeImages(newImages)
    }
  }

  const analyzeImages = async (images: string[]) => {
    setIsProcessing(true)

    // Simulate AI image analysis
    setTimeout(() => {
      const analysisMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "assistant",
        content:
          "I can see damage to the screen. Based on the images, this appears to be a cracked LCD with intact touch functionality. I recommend a screen replacement. Would you like me to provide detailed repair instructions?",
        timestamp: new Date(),
        metadata: {
          analysis: {
            confidence: 94,
            detectedIssues: ["Cracked LCD", "Intact digitizer"],
            recommendedAction: "Screen replacement",
          },
        },
      }
      setMessages((prev) => [...prev, analysisMessage])
      setIsProcessing(false)
    }, 2000)
  }

  const startVoiceInput = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Repair Assistant</h2>
          <p className="text-muted-foreground">Get intelligent repair guidance and cost estimates</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Brain className="mr-1 h-3 w-3" />
            AI Powered
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
          <TabsTrigger value="suggestions">Repair Suggestions</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-5 w-5" />
                    AI Chat Assistant
                  </CardTitle>
                  <CardDescription>
                    Ask questions about repairs, get cost estimates, and receive step-by-step guidance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 w-full pr-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                            {message.metadata?.images && (
                              <div className="mt-2 grid grid-cols-2 gap-2">
                                {message.metadata.images.map((img: string, idx: number) => (
                                  <img
                                    key={idx}
                                    src={img || "/placeholder.svg"}
                                    alt={`Uploaded ${idx + 1}`}
                                    className="w-full h-20 object-cover rounded"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {isProcessing && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <Brain className="h-4 w-4 animate-pulse" />
                              <span className="text-sm">AI is thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  <div className="mt-4 space-y-3">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Ask about a repair, upload images, or describe an issue..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        disabled={isProcessing}
                      />
                      <Button onClick={handleSendMessage} disabled={isProcessing || !inputMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex space-x-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        <Camera className="mr-2 h-4 w-4" />
                        Upload Images
                      </Button>
                      <Button variant="outline" size="sm" onClick={startVoiceInput} disabled={isListening}>
                        <Mic className={`mr-2 h-4 w-4 ${isListening ? "animate-pulse" : ""}`} />
                        {isListening ? "Listening..." : "Voice Input"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Get Repair Estimate
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Wrench className="mr-2 h-4 w-4" />
                    Troubleshoot Issue
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="mr-2 h-4 w-4" />
                    Time Estimation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Cost Analysis
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Accuracy Rate</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                    <Progress value={94.2} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Queries Today</span>
                      <span className="font-medium">47</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Time Saved</span>
                      <span className="font-medium">3.2h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="suggestions">
          <div className="space-y-4">
            {repairSuggestions.length > 0 ? (
              repairSuggestions.map((suggestion) => (
                <Card key={suggestion.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={getDifficultyColor(suggestion.difficulty)}>{suggestion.difficulty}</Badge>
                        <Badge variant="outline">{suggestion.confidence}% confidence</Badge>
                      </div>
                    </div>
                    <CardDescription>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {suggestion.estimatedTime}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="mr-1 h-4 w-4" />
                          {suggestion.estimatedCost}
                        </span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="steps" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="steps">Repair Steps</TabsTrigger>
                        <TabsTrigger value="tools">Required Tools</TabsTrigger>
                      </TabsList>
                      <TabsContent value="steps" className="mt-4">
                        <ol className="space-y-2">
                          {suggestion.steps.map((step, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </span>
                              <span className="text-sm">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </TabsContent>
                      <TabsContent value="tools" className="mt-4">
                        <div className="grid grid-cols-2 gap-2">
                          {suggestion.tools.map((tool, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                              <Wrench className="h-4 w-4 text-gray-600" />
                              <span className="text-sm">{tool}</span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                    <div className="mt-4 flex space-x-2">
                      <Button>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Start Repair
                      </Button>
                      <Button variant="outline">
                        <Target className="mr-2 h-4 w-4" />
                        Get Quote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Suggestions Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start a conversation with the AI assistant to get personalized repair suggestions.
                  </p>
                  <Button onClick={() => setInputMessage("I need help with a screen repair")}>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Queries Today</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline mr-1 h-3 w-3" />
                  +12% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline mr-1 h-3 w-3" />
                  +2.1% this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2h</div>
                <p className="text-xs text-muted-foreground">Per technician today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Estimates</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">Generated today</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
