// lib/ai-chatbot-service.ts

import { ChatOpenAI } from "@langchain/openai"
import { StringOutputParser } from "langchain/schema/output_parser"
import { AIMessage, HumanMessage, type BaseChatMessage } from "langchain/schema"
import { ChatPromptTemplate, MessagesPlaceholder } from "langchain/prompts"
import { BufferMemory, ChatMessageHistory } from "langchain/memory"
import { type ChatIntent, analyzeIntent } from "./intent-analyzer"
import { analyzeSentiment } from "./sentiment-analyzer"

// Define a type for the chat history
export type ChatHistory = {
  type: "human" | "ai"
  text: string
  timestamp: Date
}[]

// Define a type for the chatbot response
export type ChatbotResponse = {
  response: string
  intent: ChatIntent
  sentiment: { sentiment: string; confidence: number }
  shouldEscalate: boolean
}

// Function to initialize the chat model
const initializeChatModel = (openAIApiKey: string, modelName = "gpt-3.5-turbo") => {
  return new ChatOpenAI({
    openAIApiKey,
    modelName,
    temperature: 0.7,
  })
}

// Function to create the prompt
const createPrompt = () => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a friendly and helpful AI Chatbot named Athena, designed to assist users with various tasks and questions.
      You should always be polite and respectful. You should answer the user's questions briefly and concisely.
      If you do not know the answer to a question, you should admit that you do not know.
      If the user expresses negative sentiment or frustration, offer to escalate the conversation to a human agent.
      If the user asks to speak to a human, offer to escalate the conversation to a human agent.
      If the user uses offensive language, warn them to stop. If they continue, offer to escalate the conversation to a human agent.
      `,
    ],
    new MessagesPlaceholder("history"),
    ["human", "{input}"],
  ])
  return prompt
}

// Function to create the runnable chain
const createRunnableChain = (chatModel: ChatOpenAI, prompt: ChatPromptTemplate) => {
  return prompt.pipe(chatModel).pipe(new StringOutputParser())
}

// Function to initialize memory
const initializeMemory = (chatHistory: ChatHistory) => {
  const pastMessages: BaseChatMessage[] = chatHistory.map((message) => {
    if (message.type === "human") {
      return new HumanMessage(message.text)
    } else {
      return new AIMessage(message.text)
    }
  })

  const memory = new BufferMemory({
    chatHistory: new ChatMessageHistory(pastMessages),
    returnMessages: true,
    memoryKey: "history",
  })

  return memory
}

// Main function to run the chatbot
export async function runChatbot(
  userMessage: string,
  chatHistory: ChatHistory,
  openAIApiKey: string,
): Promise<ChatbotResponse> {
  try {
    // Initialize the chat model
    const chatModel = initializeChatModel(openAIApiKey)

    // Create the prompt
    const prompt = createPrompt()

    // Initialize memory
    const memory = initializeMemory(chatHistory)

    // Create the runnable chain
    const runnableChain = createRunnableChain(chatModel, prompt)

    // Invoke the chain with the user message and memory
    const response = await runnableChain.invoke({
      input: userMessage,
      memory: await memory.loadMemoryVariables({}),
    })

    // Save the user message and chatbot response to memory
    memory.saveContext({ input: userMessage }, { output: response })

    // Analyze the intent of the user message
    const intent = await analyzeIntent(userMessage, openAIApiKey)

    // Analyze the sentiment of the user message
    const sentiment = await analyzeSentiment(userMessage, openAIApiKey)

    // Determine whether to escalate to a human agent
    const shouldEscalate = shouldEscalateToHuman(intent, sentiment, chatHistory.length)

    return {
      response: response.trim(),
      intent,
      sentiment,
      shouldEscalate,
    }
  } catch (error: any) {
    console.error("Error in runChatbot:", error)
    return {
      response: "I'm sorry, I encountered an error. Please try again later.",
      intent: { intent: "error", confidence: 1 },
      sentiment: { sentiment: "negative", confidence: 1 },
      shouldEscalate: true,
    }
  }
}

// Remove 'use server' and make it a regular exported function
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
