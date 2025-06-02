import { type NextRequest, NextResponse } from "next/server"
import {
  recognizeIntent,
  generateSmartResponse,
  searchKnowledgeBase,
  analyzeSentiment,
  shouldEscalateToHuman,
  generateRepairEstimate,
} from "@/lib/ai-chatbot-service"

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, context } = await request.json()

    // Recognize intent and extract entities
    const intent = await recognizeIntent(message)

    // Analyze sentiment
    const sentiment = await analyzeSentiment(message)

    // Check if escalation is needed
    const shouldEscalate = shouldEscalateToHuman(intent, sentiment, conversationHistory.length)

    if (shouldEscalate) {
      return NextResponse.json({
        response:
          "I'd like to connect you with one of our human support specialists who can better assist you. Please hold while I transfer you, or you can call us directly at (555) 123-4567.",
        intent: intent.intent,
        confidence: intent.confidence,
        escalate: true,
        sentiment: sentiment.sentiment,
      })
    }

    // Generate contextual response
    let response = await generateSmartResponse(message, context, conversationHistory)

    // If asking for repair estimate, generate one
    if (intent.intent === "repair_estimate" && intent.entities.device_brand && intent.entities.issue_type) {
      const deviceInfo = {
        brand: intent.entities.device_brand,
        model: intent.entities.device_model || "Unknown",
        type: intent.entities.device_type || "phone",
      }

      const issueInfo = {
        category: intent.entities.issue_type,
        severity: intent.entities.urgency || "medium",
        description: intent.entities.issue_type,
        symptoms: [],
      }

      const estimate = await generateRepairEstimate(deviceInfo, issueInfo)

      response += `\n\n💰 **Repair Estimate:**\n• Cost: $${estimate.estimatedCost.min}-$${estimate.estimatedCost.max}\n• Time: ${estimate.estimatedTime}\n• Warranty: ${estimate.warranty}\n\nWould you like to schedule an appointment?`
    }

    // Search knowledge base for additional helpful info
    const kbResults = await searchKnowledgeBase(message)
    if (kbResults.length > 0 && intent.confidence < 0.9) {
      response += `\n\n📚 **You might also find this helpful:**\n${kbResults[0].answer}`
    }

    return NextResponse.json({
      response,
      intent: intent.intent,
      confidence: intent.confidence,
      entities: intent.entities,
      sentiment: sentiment.sentiment,
      escalate: false,
      suggestions: intent.actions || [],
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "I'm having trouble processing your request. Please try again." },
      { status: 500 },
    )
  }
}
