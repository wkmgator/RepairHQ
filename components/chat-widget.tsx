"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, X, Minimize2, Bot } from "lucide-react"

interface ChatMessage {
  id: string
  type: "user" | "bot" | "system"
  content: string
  timestamp: Date
  quickReplies?: string[]
  metadata?: {
    intent?: string
    confidence?: number
    actions?: string[]
  }
}

interface ChatWidgetProps {
  position?: "bottom-right" | "bottom-left"
  theme?: "light" | "dark" | "auto"
  primaryColor?: string
  companyName?: string
  welcomeMessage?: string
  isMinimized?: boolean
}

export function ChatWidget({
  position = "bottom-right",
  theme = "light",
  primaryColor = "#2563eb",
  companyName = "RepairHQ",
  welcomeMessage = "Hi! I'm here to help with repair estimates and appointments. How can I assist you today?",
  isMinimized = true,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(!isMinimized)
  const [isMinimizedState, setIsMinimizedState] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "bot",
      content: welcomeMessage,
      timestamp: new Date(),
      quickReplies: ["Get Repair Quote", "Schedule Appointment", "Check Status", "Store Hours"],
      metadata: { intent: "welcome", confidence: 1.0 },
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!isOpen && !isMinimizedState) {
      setUnreadCount((prev) => prev + 1)
    }
  }, [messages, isOpen, isMinimizedState])

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputMessage
    if (!messageText.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)
    setUnreadCount(0)

    // Simulate AI processing
    setTimeout(
      () => {
        const botResponse = generateBotResponse(messageText)
        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const generateBotResponse = (userInput: string): ChatMessage => {
    const input = userInput.toLowerCase()

    if (input.includes("quote") || input.includes("price") || input.includes("cost") || input.includes("how much")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "I'd love to help you get a repair quote! 💰\n\nTo provide an accurate estimate, I need to know:\n• What device do you have? (iPhone, Samsung, iPad, etc.)\n• What's the issue? (cracked screen, battery, water damage, etc.)\n\nJust tell me and I'll give you an instant quote!",
        timestamp: new Date(),
        quickReplies: ["iPhone Screen", "Samsung Battery", "iPad Screen", "Other Device"],
        metadata: { intent: "repair_quote", confidence: 0.95 },
      }
    }

    if (input.includes("iphone") && input.includes("screen")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "📱 **iPhone Screen Repair Quote:**\n\n💵 **Cost:** $180 - $320 (depending on model)\n⏱️ **Time:** 45-60 minutes\n🔧 **Warranty:** 90 days\n\n**Popular Models:**\n• iPhone 14/15: $280-$320\n• iPhone 12/13: $220-$280\n• iPhone 11: $180-$220\n\nWould you like to schedule an appointment?",
        timestamp: new Date(),
        quickReplies: ["Schedule Now", "Different Device", "More Info"],
        metadata: { intent: "iphone_screen_quote", confidence: 0.98 },
      }
    }

    if (input.includes("schedule") || input.includes("appointment") || input.includes("book")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "📅 **Available Appointments:**\n\n**Today:**\n• 2:30 PM - 3:30 PM ✅\n• 4:00 PM - 5:00 PM ✅\n• 5:30 PM - 6:30 PM ✅\n\n**Tomorrow:**\n• 9:00 AM - 10:00 AM ✅\n• 11:30 AM - 12:30 PM ✅\n• 2:00 PM - 3:00 PM ✅\n\nWhich time works best for you?",
        timestamp: new Date(),
        quickReplies: ["2:30 PM Today", "4:00 PM Today", "9:00 AM Tomorrow", "Other Time"],
        metadata: { intent: "schedule_appointment", confidence: 0.94 },
      }
    }

    if (input.includes("status") || input.includes("track") || input.includes("check")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "🔍 **Check Repair Status:**\n\nI can look up your repair right away! Please provide:\n\n📋 **Ticket Number** (e.g., RHQ-123456)\n📞 **Phone Number** (used for the repair)\n\nI'll give you a real-time update on your device!",
        timestamp: new Date(),
        quickReplies: ["Enter Ticket #", "Call Instead", "Email Status"],
        metadata: { intent: "status_check", confidence: 0.91 },
      }
    }

    if (input.includes("hours") || input.includes("open") || input.includes("location") || input.includes("store")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "🏪 **Store Information:**\n\n📍 **Location:**\n123 Tech Street, San Francisco, CA 94105\n\n🕒 **Hours:**\n• Mon-Fri: 9:00 AM - 7:00 PM\n• Saturday: 10:00 AM - 6:00 PM\n• Sunday: 12:00 PM - 5:00 PM\n\n📞 **Contact:**\n• Phone: (555) 123-4567\n• Email: support@repairhq.com\n\nAnything else I can help with?",
        timestamp: new Date(),
        quickReplies: ["Get Directions", "Call Store", "Schedule Visit"],
        metadata: { intent: "store_info", confidence: 0.96 },
      }
    }

    if (input.includes("human") || input.includes("agent") || input.includes("person") || input.includes("help")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "👨‍💼 **Connect with Human Support:**\n\nI'd be happy to connect you with one of our repair specialists!\n\n**Available Options:**\n• 📞 Call: (555) 123-4567\n• 💬 Live Chat: I can transfer you now\n• 📧 Email: support@repairhq.com\n\n**Current Wait Time:** ~2 minutes\n\nWould you like me to connect you now?",
        timestamp: new Date(),
        quickReplies: ["Transfer Now", "Call Instead", "Continue with AI"],
        metadata: { intent: "human_agent", confidence: 0.89 },
      }
    }

    // Default response with helpful options
    return {
      id: Date.now().toString(),
      type: "bot",
      content:
        "I'm here to help! 🤖 I can assist you with:\n\n🔧 **Repair Quotes** - Instant pricing for any device\n📅 **Appointments** - Schedule your visit\n📱 **Repair Status** - Track your device\n🏪 **Store Info** - Hours, location, contact\n👨‍💼 **Human Support** - Connect with our team\n\nWhat would you like help with?",
      timestamp: new Date(),
      quickReplies: ["Get Quote", "Book Appointment", "Store Hours", "Human Agent"],
      metadata: { intent: "general_help", confidence: 0.75 },
    }
  }

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply)
  }

  const toggleChat = () => {
    if (isOpen) {
      setIsMinimizedState(true)
      setIsOpen(false)
    } else {
      setIsOpen(true)
      setIsMinimizedState(false)
      setUnreadCount(0)
    }
  }

  const closeChat = () => {
    setIsOpen(false)
    setIsMinimizedState(false)
  }

  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50 font-sans`}>
      {/* Chat Window */}
      {isOpen && (
        <Card className="w-80 h-96 mb-4 shadow-2xl border-0 overflow-hidden">
          {/* Header */}
          <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">{companyName} Support</CardTitle>
                  <div className="flex items-center text-xs opacity-90">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                    Online • Typically replies instantly
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={toggleChat} className="text-white hover:bg-white/20 p-1">
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={closeChat} className="text-white hover:bg-white/20 p-1">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="p-0 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((message) => (
                <div key={message.id}>
                  <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-lg p-3 ${
                        message.type === "user" ? "bg-blue-600 text-white" : "bg-white text-gray-900 shadow-sm border"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      <div className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>

                  {/* Quick Replies */}
                  {message.quickReplies && message.type === "bot" && (
                    <div className="flex flex-wrap gap-1 mt-2 ml-2">
                      {message.quickReplies.map((reply, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickReply(reply)}
                          className="text-xs h-7 px-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          {reply}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg p-3 shadow-sm border">
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

            {/* Input */}
            <div className="p-3 bg-white border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim()}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-gray-500 mt-1 text-center">
                Powered by {companyName} AI • We typically reply in seconds
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Button */}
      <Button
        onClick={toggleChat}
        className="w-14 h-14 rounded-full shadow-2xl bg-blue-600 hover:bg-blue-700 relative"
        style={{ backgroundColor: primaryColor }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {unreadCount > 0 && !isOpen && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
        )}
      </Button>
    </div>
  )
}
