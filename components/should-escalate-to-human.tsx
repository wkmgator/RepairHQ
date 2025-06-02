"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, MessageCircle, TrendingUp, Clock } from "lucide-react"

interface ChatIntent {
  intent: string
  confidence: number
}

interface Sentiment {
  sentiment: string
  confidence: number
}

interface EscalationTestProps {
  intent: ChatIntent
  sentiment: Sentiment
  conversationLength: number
}

export function ShouldEscalateToHuman({ intent, sentiment, conversationLength }: EscalationTestProps) {
  const [testResult, setTestResult] = useState<boolean | null>(null)

  const shouldEscalate = (testIntent: ChatIntent, testSentiment: Sentiment, testLength: number): boolean => {
    // Escalate if:
    // 1. Low confidence in intent recognition
    if (testIntent.confidence < 0.7) return true

    // 2. Negative sentiment with high confidence
    if (testSentiment.sentiment === "negative" && testSentiment.confidence > 0.8) return true

    // 3. Long conversation without resolution
    if (testLength > 10) return true

    // 4. Specific intents that require human intervention
    const humanRequiredIntents = ["complaint", "refund_request", "complex_technical"]
    if (humanRequiredIntents.includes(testIntent.intent)) return true

    return false
  }

  const runTest = () => {
    const result = shouldEscalate(intent, sentiment, conversationLength)
    setTestResult(result)
  }

  const getEscalationReasons = () => {
    const reasons = []

    if (intent.confidence < 0.7) {
      reasons.push("Low intent confidence")
    }

    if (sentiment.sentiment === "negative" && sentiment.confidence > 0.8) {
      reasons.push("High confidence negative sentiment")
    }

    if (conversationLength > 10) {
      reasons.push("Long conversation without resolution")
    }

    const humanRequiredIntents = ["complaint", "refund_request", "complex_technical"]
    if (humanRequiredIntents.includes(intent.intent)) {
      reasons.push("Requires human intervention")
    }

    return reasons
  }

  const reasons = getEscalationReasons()

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Escalation Decision Engine
        </CardTitle>
        <CardDescription>Test whether a conversation should be escalated to human support</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Intent</span>
            </div>
            <div className="text-sm text-muted-foreground">{intent.intent}</div>
            <Badge variant={intent.confidence >= 0.7 ? "default" : "destructive"}>
              {Math.round(intent.confidence * 100)}% confidence
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Sentiment</span>
            </div>
            <div className="text-sm text-muted-foreground">{sentiment.sentiment}</div>
            <Badge variant={sentiment.sentiment === "negative" ? "destructive" : "default"}>
              {Math.round(sentiment.confidence * 100)}% confidence
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Length</span>
            </div>
            <div className="text-sm text-muted-foreground">{conversationLength} messages</div>
            <Badge variant={conversationLength > 10 ? "destructive" : "default"}>
              {conversationLength > 10 ? "Too long" : "Normal"}
            </Badge>
          </div>
        </div>

        {reasons.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Escalation Triggers:</h4>
            <div className="flex flex-wrap gap-2">
              {reasons.map((reason, index) => (
                <Badge key={index} variant="outline" className="text-orange-600">
                  {reason}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <Button onClick={runTest}>Test Escalation Logic</Button>

          {testResult !== null && (
            <div className="flex items-center gap-2">
              <Badge variant={testResult ? "destructive" : "default"} className="text-sm">
                {testResult ? "🚨 Escalate to Human" : "✅ Continue with AI"}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ShouldEscalateToHuman
