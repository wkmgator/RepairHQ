import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export interface TicketAnalysis {
  suggestedDiagnosis: string
  estimatedRepairTime: number
  recommendedParts: string[]
  estimatedCost: number
  urgencyLevel: "low" | "medium" | "high" | "critical"
  similarCases: string[]
}

export interface CustomerInsight {
  loyaltyScore: number
  preferredServices: string[]
  averageSpend: number
  lastVisit: string
  recommendations: string[]
}

export class AIAssistant {
  static async analyzeTicket(
    deviceType: string,
    issue: string,
    symptoms: string[],
    customerHistory?: any[],
  ): Promise<TicketAnalysis> {
    const prompt = `
    Analyze this repair ticket:
    Device: ${deviceType}
    Issue: ${issue}
    Symptoms: ${symptoms.join(", ")}
    Customer History: ${customerHistory ? JSON.stringify(customerHistory) : "None"}
    
    Provide a detailed analysis including:
    1. Most likely diagnosis
    2. Estimated repair time in minutes
    3. Recommended parts needed
    4. Estimated cost range
    5. Urgency level (low/medium/high/critical)
    6. Similar cases from knowledge base
    
    Format as JSON.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    try {
      return JSON.parse(text)
    } catch {
      return {
        suggestedDiagnosis: "Unable to analyze - manual diagnosis required",
        estimatedRepairTime: 60,
        recommendedParts: [],
        estimatedCost: 0,
        urgencyLevel: "medium",
        similarCases: [],
      }
    }
  }

  static async generateCustomerInsights(
    customerId: string,
    transactionHistory: any[],
    ticketHistory: any[],
  ): Promise<CustomerInsight> {
    const prompt = `
    Analyze this customer's data:
    Customer ID: ${customerId}
    Transactions: ${JSON.stringify(transactionHistory)}
    Repair History: ${JSON.stringify(ticketHistory)}
    
    Provide insights including:
    1. Loyalty score (0-100)
    2. Preferred services
    3. Average spend per visit
    4. Last visit date
    5. Personalized recommendations
    
    Format as JSON.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    try {
      return JSON.parse(text)
    } catch {
      return {
        loyaltyScore: 50,
        preferredServices: [],
        averageSpend: 0,
        lastVisit: "Unknown",
        recommendations: [],
      }
    }
  }

  static async optimizeInventory(currentInventory: any[], salesHistory: any[], seasonalTrends: any[]): Promise<any> {
    const prompt = `
    Optimize inventory based on:
    Current Stock: ${JSON.stringify(currentInventory)}
    Sales History: ${JSON.stringify(salesHistory)}
    Seasonal Trends: ${JSON.stringify(seasonalTrends)}
    
    Provide recommendations for:
    1. Items to reorder
    2. Optimal stock levels
    3. Items to discontinue
    4. New items to consider
    5. Seasonal adjustments
    
    Format as JSON.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    try {
      return JSON.parse(text)
    } catch {
      return {
        reorderItems: [],
        optimalLevels: {},
        discontinueItems: [],
        newItems: [],
        seasonalAdjustments: {},
      }
    }
  }
}
