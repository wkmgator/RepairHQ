"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Add new interfaces at the top of the file

export interface AutoBodyDamageInput {
  vehicleMake: string
  vehicleModel: string
  vehicleYear: number
  damageDescription: string // Detailed description of the damage
  damagedParts: string[] // e.g., ["Front Bumper", "Driver Side Fender", "Custom Flux Capacitor Housing"]
  damageSeverity: "minor" | "moderate" | "severe" // e.g., light scratches, deep dent, part crushed
  paintRequired: boolean
  imageUrls?: string[] // Optional: for future image analysis
}

export interface AutoBodyRepairQuote {
  estimatedParts: Array<{
    name: string
    quantity: number
    costPerUnit?: number | null // Allow null if AI cannot determine cost
    totalCost?: number | null // Allow null
    oemGenuine?: boolean
    notes?: string // Optional notes for specific parts, e.g., "Manual verification needed for this custom part"
  }>
  estimatedLaborHours: {
    bodyRepair?: number
    paintPrep?: number
    painting?: number
    assembly?: number
    total: number
  }
  paintMaterialCost?: number
  sundriesCost?: number // e.g., clips, fillers, sandpaper
  totalEstimatedCost: {
    min: number
    max: number
  }
  estimatedRepairTimeDays: {
    min: number
    max: number
  }
  confidence: number
  assumptions?: string[]
  notes?: string // General notes for the overall quote
}

export interface ChatIntent {
  intent: string
  confidence: number
  entities: Record<string, any>
  response: string
  actions?: string[]
}

export interface RepairEstimate {
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
  warranty?: string
}

export interface DeviceInfo {
  brand: string
  model: string
  type: "phone" | "tablet" | "laptop" | "desktop" | "watch" | "other"
  releaseYear?: number
}

export interface IssueInfo {
  category: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
  symptoms: string[]
}

// AI-powered intent recognition
export async function recognizeIntent(userMessage: string): Promise<ChatIntent> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Analyze this customer message and determine the intent, entities, and appropriate response.
        
        Customer message: "${userMessage}"
        
        Possible intents:
        - repair_estimate: Customer wants pricing for a repair
        - schedule_appointment: Customer wants to book a service
        - status_check: Customer wants to check repair progress
        - general_question: Customer has a general inquiry
        - store_info: Customer wants store hours/location
        - complaint: Customer has an issue or complaint
        - compliment: Customer is giving positive feedback
        
        Extract entities like:
        - device_brand (Apple, Samsung, Google, etc.)
        - device_model (iPhone 14, Galaxy S23, etc.)
        - issue_type (screen, battery, water damage, etc.)
        - urgency (low, medium, high)
        
        Respond in JSON format:
        {
          "intent": "intent_name",
          "confidence": 0.95,
          "entities": {
            "device_brand": "Apple",
            "device_model": "iPhone 14",
            "issue_type": "screen"
          },
          "response": "Helpful response to the customer",
          "actions": ["action1", "action2"]
        }
      `,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Intent recognition error:", error)
    return {
      intent: "general_question",
      confidence: 0.5,
      entities: {},
      response: "I'm here to help! Could you please provide more details about what you need assistance with?",
    }
  }
}

// Generate repair estimates using AI
export async function generateRepairEstimate(device: DeviceInfo, issue: IssueInfo): Promise<RepairEstimate> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Generate a repair estimate for the following device and issue:
        
        Device: ${device.brand} ${device.model} (${device.type})
        Issue: ${issue.category} - ${issue.description}
        Severity: ${issue.severity}
        
        Consider current market prices, parts availability, and labor costs.
        
        Respond in JSON format:
        {
          "device": "Device name",
          "issue": "Issue description",
          "estimatedCost": {
            "min": 150,
            "max": 250
          },
          "estimatedTime": "45-60 minutes",
          "confidence": 0.92,
          "parts": ["Part 1", "Part 2"],
          "labor": 45,
          "warranty": "90 days"
        }
      `,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Estimate generation error:", error)
    return {
      device: `${device.brand} ${device.model}`,
      issue: issue.description,
      estimatedCost: { min: 50, max: 200 },
      estimatedTime: "30-120 minutes",
      confidence: 0.75,
      warranty: "90 days",
    }
  }
}

// Smart response generation
export async function generateSmartResponse(
  userMessage: string,
  context: Record<string, any>,
  conversationHistory: string[],
): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        You are an AI customer support agent for RepairHQ, a device repair service.
        
        Customer message: "${userMessage}"
        
        Context: ${JSON.stringify(context)}
        
        Recent conversation: ${conversationHistory.slice(-5).join("\n")}
        
        Guidelines:
        - Be helpful, friendly, and professional
        - Provide specific repair estimates when possible
        - Offer to schedule appointments
        - Ask clarifying questions when needed
        - Escalate to human agents for complex issues
        - Use emojis sparingly but appropriately
        
        Store information:
        - Hours: Mon-Fri 9AM-7PM, Sat 10AM-6PM, Sun 12PM-5PM
        - Phone: (555) 123-4567
        - Email: support@repairhq.com
        - Same-day repairs available for most issues
        - 90-day warranty on all repairs
        
        Generate a helpful response:
      `,
    })

    return text
  } catch (error) {
    console.error("Response generation error:", error)
    return "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team at (555) 123-4567."
  }
}

// Knowledge base search
export async function searchKnowledgeBase(
  query: string,
): Promise<Array<{ question: string; answer: string; relevance: number }>> {
  const knowledgeBase = [
    {
      question: "How long does screen repair take?",
      answer: "Most screen repairs take 45-90 minutes depending on the device model and availability of parts.",
      keywords: ["screen", "repair", "time", "duration", "how long"],
    },
    {
      question: "Do you use original parts?",
      answer: "We use high-quality OEM and aftermarket parts. All parts come with a 90-day warranty.",
      keywords: ["parts", "original", "oem", "quality", "warranty"],
    },
    {
      question: "How much does battery replacement cost?",
      answer: "Battery replacement typically costs $80-$150 depending on your device model.",
      keywords: ["battery", "replacement", "cost", "price"],
    },
    {
      question: "Do you offer same-day service?",
      answer: "Yes! Most repairs can be completed the same day, often within 1-2 hours.",
      keywords: ["same day", "fast", "quick", "urgent"],
    },
    {
      question: "What's your warranty policy?",
      answer: "All repairs come with a 90-day warranty covering parts and labor.",
      keywords: ["warranty", "guarantee", "policy", "coverage"],
    },
  ]

  const queryLower = query.toLowerCase()
  const results = knowledgeBase
    .map((item) => {
      const relevance = item.keywords.reduce((score, keyword) => {
        return queryLower.includes(keyword) ? score + 1 : score
      }, 0)
      return { ...item, relevance }
    })
    .filter((item) => item.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 3)

  return results.map(({ question, answer, relevance }) => ({ question, answer, relevance }))
}

// Appointment availability checker
export async function checkAppointmentAvailability(
  date?: string,
): Promise<Array<{ time: string; available: boolean }>> {
  // Mock availability data - in real implementation, this would check your calendar system
  const timeSlots = ["9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM", "3:00 PM", "4:30 PM", "6:00 PM"]

  return timeSlots.map((time) => ({
    time,
    available: Math.random() > 0.3, // 70% chance of availability
  }))
}

// Sentiment analysis
export async function analyzeSentiment(message: string): Promise<{
  sentiment: "positive" | "negative" | "neutral"
  confidence: number
  emotions: string[]
}> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Analyze the sentiment and emotions in this customer message:
        
        "${message}"
        
        Respond in JSON format:
        {
          "sentiment": "positive|negative|neutral",
          "confidence": 0.85,
          "emotions": ["frustrated", "urgent", "polite"]
        }
      `,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Sentiment analysis error:", error)
    return {
      sentiment: "neutral",
      confidence: 0.5,
      emotions: [],
    }
  }
}

// Escalation decision engine
export function shouldEscalateToHuman(
  intent: ChatIntent,
  sentiment: { sentiment: string; confidence: number },
  conversationLength: number,
): boolean {
  // Escalate if:
  // 1. Low confidence in intent recognition
  if (intent.confidence < 0.7) return true

  // 2. Negative sentiment with high confidence
  if (sentiment.sentiment === "negative" && sentiment.confidence > 0.8) return true

  // 3. Long conversation without resolution
  if (conversationLength > 10) return true

  // 4. Specific intents that require human intervention
  const humanRequiredIntents = ["complaint", "refund_request", "complex_technical"]
  if (humanRequiredIntents.includes(intent.intent)) return true

  return false
}

// Add the new server action function

export async function generateAutoBodyRepairQuote(damageInput: AutoBodyDamageInput): Promise<AutoBodyRepairQuote> {
  try {
    const prompt = `
      You are an expert auto body repair estimator.
      Generate a detailed repair quote for the following vehicle damage.
      Provide estimates for parts, labor hours (broken down by type if possible: body repair, paint prep, painting, assembly), paint material costs, and total cost.
      Also estimate the total repair time in days.
      Assume standard shop labor rates unless specified. Be realistic.

      Vehicle Make: ${damageInput.vehicleMake}
      Vehicle Model: ${damageInput.vehicleModel}
      Vehicle Year: ${damageInput.vehicleYear}
      Damaged Parts: ${damageInput.damagedParts.join(", ")}
      (Note: The 'Damaged Parts' list may include standard automotive parts as well as user-specified, custom, or less common items. Use the damage description and vehicle details to understand their context and relevance to the repair.)
      Damage Severity: ${damageInput.damageSeverity}
      Paint Required: ${damageInput.paintRequired ? "Yes" : "No"}
      Damage Description: "${damageInput.damageDescription}"
      ${damageInput.imageUrls ? `Image URLs (for context, no direct analysis): ${damageInput.imageUrls.join(", ")}` : ""}

      Consider common repair procedures for the described damage.
      List potential parts that might need replacement or repair. Specify if OEM/Genuine parts are typically used or if aftermarket is an option.
      
      For each part provided in the "Damaged Parts" list above:
      - Include it in your "estimatedParts" response array.
      - If a part is recognized and standard, estimate its cost ("costPerUnit", "totalCost").
      - If a part name seems uncommon, custom, misspelled, or is not immediately recognized:
        - Set its "costPerUnit" and "totalCost" to null.
        - Add a brief note to the part's "notes" field (e.g., "Uncommon part, cost requires manual verification.", "Possible custom item, pricing needed.", "Verify part name and availability.").
      - Attempt to estimate labor associated with all listed parts, noting any uncertainties in the main "assumptions" or "notes" of the quote if a part significantly impacts labor estimation due to its unknown nature.

      Respond in JSON format for an AutoBodyRepairQuote. Ensure all fields from the interface are considered.
      Example for an estimated part:
      { "name": "Part Name", "quantity": 1, "costPerUnit": 100, "totalCost": 100, "oemGenuine": true, "notes": "Standard part." }
      Example for an unrecognized part:
      { "name": "Custom Widget", "quantity": 1, "costPerUnit": null, "totalCost": null, "oemGenuine": false, "notes": "Custom part. Cost and availability require manual verification." }
      
      JSON Response Structure:
      {
        "estimatedParts": [
          { "name": "Part Name", "quantity": 1, "costPerUnit": 100, "totalCost": 100, "oemGenuine": true, "notes": "Optional note for this part." }
        ],
        "estimatedLaborHours": {
          "bodyRepair": 5.0,
          "paintPrep": 3.0,
          "painting": 2.5,
          "assembly": 2.0,
          "total": 12.5
        },
        "paintMaterialCost": 150,
        "sundriesCost": 50,
        "totalEstimatedCost": { "min": 1200, "max": 1800 },
        "estimatedRepairTimeDays": { "min": 3, "max": 5 },
        "confidence": 0.85, // Your confidence in this estimate (0.0 to 1.0)
        "assumptions": ["Assumed no hidden frame damage.", "Standard finish paint job."],
        "notes": "Final cost may vary after teardown and detailed inspection. Some part costs may need manual verification as noted."
      }
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
    })

    const parsedResponse = JSON.parse(text) as AutoBodyRepairQuote
    // Basic validation
    if (!parsedResponse.totalEstimatedCost || !parsedResponse.estimatedParts) {
      throw new Error("AI response missing critical fields for quote.")
    }
    // Ensure all input damaged parts are somehow represented in estimatedParts, even if with null costs/notes
    // This can be complex to enforce strictly if AI restructures names, but good for AI to aim for.
    // For now, we trust the AI follows the prompt to include all listed parts.

    return parsedResponse
  } catch (error) {
    console.error("Auto body quote generation error:", error)
    // Return a fallback or error structure consistent with the interface
    return {
      estimatedParts: damageInput.damagedParts.map((partName) => ({
        // Try to list the input parts with error notes
        name: partName,
        quantity: 1,
        costPerUnit: null,
        totalCost: null,
        notes: "Error generating estimate for this part.",
      })),
      estimatedLaborHours: { total: 0 },
      totalEstimatedCost: { min: 0, max: 0 },
      estimatedRepairTimeDays: { min: 0, max: 0 },
      confidence: 0.1,
      notes:
        "Error generating estimate. Please try again or consult a manual estimator. AI failed to process the request.",
      assumptions: ["Failed to generate AI estimate due to an internal error."],
    }
  }
}
