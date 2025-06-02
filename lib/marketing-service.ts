import { createClient } from "@/lib/supabase"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export type MarketingCampaign = {
  id: string
  name: string
  description: string
  type: "email" | "sms" | "push"
  status: "draft" | "active" | "paused" | "completed"
  created_at: string
  updated_at: string
  scheduled_at: string | null
  completed_at: string | null
  target_audience: any
  content: any
  metrics: any
  created_by: string
}

export type EmailTemplate = {
  id: string
  name: string
  description: string
  subject: string
  content: string
  plain_text: string
  created_at: string
  updated_at: string
  category: string
  tags: string[]
  created_by: string
  is_active: boolean
}

export type SmsTemplate = {
  id: string
  name: string
  description: string
  content: string
  created_at: string
  updated_at: string
  category: string
  tags: string[]
  created_by: string
  is_active: boolean
}

export type CustomerSegment = {
  id: string
  name: string
  description: string
  criteria: any
  created_at: string
  updated_at: string
  created_by: string
  is_active: boolean
  customer_count: number
}

export type MarketingAutomation = {
  id: string
  name: string
  description: string
  trigger_type: string
  trigger_config: any
  actions: any
  status: "draft" | "active" | "paused"
  created_at: string
  updated_at: string
  created_by: string
  is_active: boolean
}

export type CampaignRecipient = {
  id: string
  campaign_id: string
  customer_id: string
  status: "pending" | "sent" | "delivered" | "opened" | "clicked" | "converted" | "failed" | "unsubscribed"
  sent_at: string | null
  delivered_at: string | null
  opened_at: string | null
  clicked_at: string | null
  converted_at: string | null
  failed_at: string | null
  failure_reason: string | null
  unsubscribed_at: string | null
  metadata: any
}

export type MarketingEvent = {
  id: string
  customer_id: string
  event_type: string
  event_data: any
  occurred_at: string
  ip_address: string | null
  user_agent: string | null
  url: string | null
  referrer: string | null
}

export type CommunicationPreferences = {
  id: string
  customer_id: string
  email_marketing: boolean
  sms_marketing: boolean
  push_notifications: boolean
  email_transactional: boolean
  sms_transactional: boolean
  updated_at: string
}

// Campaign functions
export async function getCampaigns() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("marketing_campaigns")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Error fetching campaigns: ${error.message}`)
  return data as MarketingCampaign[]
}

export async function getCampaign(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("marketing_campaigns").select("*").eq("id", id).single()

  if (error) throw new Error(`Error fetching campaign: ${error.message}`)
  return data as MarketingCampaign
}

export async function createCampaign(campaign: Omit<MarketingCampaign, "id" | "created_at" | "updated_at">) {
  const supabase = createClient()
  const { data, error } = await supabase.from("marketing_campaigns").insert(campaign).select().single()

  if (error) throw new Error(`Error creating campaign: ${error.message}`)
  return data as MarketingCampaign
}

export async function updateCampaign(id: string, updates: Partial<MarketingCampaign>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("marketing_campaigns")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(`Error updating campaign: ${error.message}`)
  return data as MarketingCampaign
}

export async function deleteCampaign(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("marketing_campaigns").delete().eq("id", id)

  if (error) throw new Error(`Error deleting campaign: ${error.message}`)
  return true
}

// Email template functions
export async function getEmailTemplates() {
  const supabase = createClient()
  const { data, error } = await supabase.from("email_templates").select("*").order("created_at", { ascending: false })

  if (error) throw new Error(`Error fetching email templates: ${error.message}`)
  return data as EmailTemplate[]
}

export async function getEmailTemplate(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("email_templates").select("*").eq("id", id).single()

  if (error) throw new Error(`Error fetching email template: ${error.message}`)
  return data as EmailTemplate
}

export async function createEmailTemplate(template: Omit<EmailTemplate, "id" | "created_at" | "updated_at">) {
  const supabase = createClient()
  const { data, error } = await supabase.from("email_templates").insert(template).select().single()

  if (error) throw new Error(`Error creating email template: ${error.message}`)
  return data as EmailTemplate
}

export async function updateEmailTemplate(id: string, updates: Partial<EmailTemplate>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("email_templates")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(`Error updating email template: ${error.message}`)
  return data as EmailTemplate
}

export async function deleteEmailTemplate(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("email_templates").delete().eq("id", id)

  if (error) throw new Error(`Error deleting email template: ${error.message}`)
  return true
}

// SMS template functions
export async function getSmsTemplates() {
  const supabase = createClient()
  const { data, error } = await supabase.from("sms_templates").select("*").order("created_at", { ascending: false })

  if (error) throw new Error(`Error fetching SMS templates: ${error.message}`)
  return data as SmsTemplate[]
}

export async function getSmsTemplate(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("sms_templates").select("*").eq("id", id).single()

  if (error) throw new Error(`Error fetching SMS template: ${error.message}`)
  return data as SmsTemplate
}

export async function createSmsTemplate(template: Omit<SmsTemplate, "id" | "created_at" | "updated_at">) {
  const supabase = createClient()
  const { data, error } = await supabase.from("sms_templates").insert(template).select().single()

  if (error) throw new Error(`Error creating SMS template: ${error.message}`)
  return data as SmsTemplate
}

export async function updateSmsTemplate(id: string, updates: Partial<SmsTemplate>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("sms_templates")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(`Error updating SMS template: ${error.message}`)
  return data as SmsTemplate
}

export async function deleteSmsTemplate(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("sms_templates").delete().eq("id", id)

  if (error) throw new Error(`Error deleting SMS template: ${error.message}`)
  return true
}

// Customer segment functions
export async function getCustomerSegments() {
  const supabase = createClient()
  const { data, error } = await supabase.from("customer_segments").select("*").order("created_at", { ascending: false })

  if (error) throw new Error(`Error fetching customer segments: ${error.message}`)
  return data as CustomerSegment[]
}

export async function getCustomerSegment(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("customer_segments").select("*").eq("id", id).single()

  if (error) throw new Error(`Error fetching customer segment: ${error.message}`)
  return data as CustomerSegment
}

export async function createCustomerSegment(
  segment: Omit<CustomerSegment, "id" | "created_at" | "updated_at" | "customer_count">,
) {
  const supabase = createClient()

  // Calculate customer count based on criteria
  const customerCount = await getCustomerCountForSegment(segment.criteria)

  const { data, error } = await supabase
    .from("customer_segments")
    .insert({ ...segment, customer_count: customerCount })
    .select()
    .single()

  if (error) throw new Error(`Error creating customer segment: ${error.message}`)
  return data as CustomerSegment
}

export async function updateCustomerSegment(id: string, updates: Partial<CustomerSegment>) {
  const supabase = createClient()

  // If criteria is updated, recalculate customer count
  let customerCount
  if (updates.criteria) {
    customerCount = await getCustomerCountForSegment(updates.criteria)
  }

  const { data, error } = await supabase
    .from("customer_segments")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
      ...(customerCount !== undefined ? { customer_count: customerCount } : {}),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(`Error updating customer segment: ${error.message}`)
  return data as CustomerSegment
}

export async function deleteCustomerSegment(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("customer_segments").delete().eq("id", id)

  if (error) throw new Error(`Error deleting customer segment: ${error.message}`)
  return true
}

// Helper function to get customer count for a segment
async function getCustomerCountForSegment(criteria: any) {
  const supabase = createClient()

  // Build query based on criteria
  let query = supabase.from("customers").select("id", { count: "exact" })

  // Apply filters based on criteria
  if (criteria.spent_min !== undefined) {
    query = query.gte("total_spent", criteria.spent_min)
  }

  if (criteria.spent_max !== undefined) {
    query = query.lte("total_spent", criteria.spent_max)
  }

  if (criteria.visits_min !== undefined) {
    query = query.gte("visit_count", criteria.visits_min)
  }

  if (criteria.visits_max !== undefined) {
    query = query.lte("visit_count", criteria.visits_max)
  }

  if (criteria.last_visit_min !== undefined) {
    const date = new Date()
    date.setDate(date.getDate() - criteria.last_visit_min)
    query = query.gte("last_visit", date.toISOString())
  }

  if (criteria.last_visit_max !== undefined) {
    const date = new Date()
    date.setDate(date.getDate() - criteria.last_visit_max)
    query = query.lte("last_visit", date.toISOString())
  }

  if (criteria.tags && criteria.tags.length > 0) {
    query = query.contains("tags", criteria.tags)
  }

  const { count, error } = await query

  if (error) throw new Error(`Error counting customers for segment: ${error.message}`)
  return count || 0
}

// Marketing automation functions
export async function getMarketingAutomations() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("marketing_automations")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Error fetching marketing automations: ${error.message}`)
  return data as MarketingAutomation[]
}

export async function getMarketingAutomation(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("marketing_automations").select("*").eq("id", id).single()

  if (error) throw new Error(`Error fetching marketing automation: ${error.message}`)
  return data as MarketingAutomation
}

export async function createMarketingAutomation(
  automation: Omit<MarketingAutomation, "id" | "created_at" | "updated_at">,
) {
  const supabase = createClient()
  const { data, error } = await supabase.from("marketing_automations").insert(automation).select().single()

  if (error) throw new Error(`Error creating marketing automation: ${error.message}`)
  return data as MarketingAutomation
}

export async function updateMarketingAutomation(id: string, updates: Partial<MarketingAutomation>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("marketing_automations")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(`Error updating marketing automation: ${error.message}`)
  return data as MarketingAutomation
}

export async function deleteMarketingAutomation(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("marketing_automations").delete().eq("id", id)

  if (error) throw new Error(`Error deleting marketing automation: ${error.message}`)
  return true
}

// Campaign recipient functions
export async function getCampaignRecipients(campaignId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("campaign_recipients")
    .select(`
      *,
      customers:customer_id (id, name, email, phone)
    `)
    .eq("campaign_id", campaignId)
    .order("sent_at", { ascending: false })

  if (error) throw new Error(`Error fetching campaign recipients: ${error.message}`)
  return data as (CampaignRecipient & { customers: { id: string; name: string; email: string; phone: string } })[]
}

export async function getCampaignRecipient(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("campaign_recipients")
    .select(`
      *,
      customers:customer_id (id, name, email, phone)
    `)
    .eq("id", id)
    .single()

  if (error) throw new Error(`Error fetching campaign recipient: ${error.message}`)
  return data as CampaignRecipient & { customers: { id: string; name: string; email: string; phone: string } }
}

export async function updateCampaignRecipient(id: string, updates: Partial<CampaignRecipient>) {
  const supabase = createClient()
  const { data, error } = await supabase.from("campaign_recipients").update(updates).eq("id", id).select().single()

  if (error) throw new Error(`Error updating campaign recipient: ${error.message}`)
  return data as CampaignRecipient
}

// Marketing events functions
export async function createMarketingEvent(event: Omit<MarketingEvent, "id" | "occurred_at">) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("marketing_events")
    .insert({ ...event, occurred_at: new Date().toISOString() })
    .select()
    .single()

  if (error) throw new Error(`Error creating marketing event: ${error.message}`)
  return data as MarketingEvent
}

export async function getCustomerMarketingEvents(customerId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("marketing_events")
    .select("*")
    .eq("customer_id", customerId)
    .order("occurred_at", { ascending: false })

  if (error) throw new Error(`Error fetching customer marketing events: ${error.message}`)
  return data as MarketingEvent[]
}

// Communication preferences functions
export async function getCustomerCommunicationPreferences(customerId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("customer_communication_preferences")
    .select("*")
    .eq("customer_id", customerId)
    .single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "no rows returned" error
    throw new Error(`Error fetching communication preferences: ${error.message}`)
  }

  // If no preferences exist, create default preferences
  if (!data) {
    return createCustomerCommunicationPreferences({
      customer_id: customerId,
      email_marketing: true,
      sms_marketing: true,
      push_notifications: true,
      email_transactional: true,
      sms_transactional: true,
    })
  }

  return data as CommunicationPreferences
}

export async function createCustomerCommunicationPreferences(
  preferences: Omit<CommunicationPreferences, "id" | "updated_at">,
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("customer_communication_preferences")
    .insert(preferences)
    .select()
    .single()

  if (error) throw new Error(`Error creating communication preferences: ${error.message}`)
  return data as CommunicationPreferences
}

export async function updateCustomerCommunicationPreferences(
  customerId: string,
  updates: Partial<CommunicationPreferences>,
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("customer_communication_preferences")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("customer_id", customerId)
    .select()
    .single()

  if (error) throw new Error(`Error updating communication preferences: ${error.message}`)
  return data as CommunicationPreferences
}

// AI-powered content generation
export async function generateEmailContent(prompt: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Create a marketing email for a repair shop with the following details: ${prompt}. 
      Return the result as a JSON object with 'subject' and 'content' fields. 
      The content should be valid HTML that can be used in an email template.`,
      maxTokens: 1000,
    })

    try {
      const result = JSON.parse(text)
      return {
        subject: result.subject,
        content: result.content,
      }
    } catch (e) {
      throw new Error("Failed to parse AI-generated content")
    }
  } catch (error: any) {
    throw new Error(`Error generating email content: ${error.message}`)
  }
}

export async function generateSmsContent(prompt: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Create a marketing SMS for a repair shop with the following details: ${prompt}. 
      The message should be concise (under 160 characters) and include a clear call to action.
      Return only the SMS text content.`,
      maxTokens: 200,
    })

    return text.trim()
  } catch (error: any) {
    throw new Error(`Error generating SMS content: ${error.message}`)
  }
}

export async function analyzeMarketingPerformance(campaignData: any) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Analyze this marketing campaign data and provide insights and recommendations:
      ${JSON.stringify(campaignData)}
      
      Focus on:
      1. Overall performance metrics
      2. Key strengths and weaknesses
      3. Specific recommendations for improvement
      4. Comparison to industry benchmarks if possible
      
      Return the analysis as a JSON object with these sections.`,
      maxTokens: 1000,
    })

    try {
      return JSON.parse(text)
    } catch (e) {
      throw new Error("Failed to parse AI-generated analysis")
    }
  } catch (error: any) {
    throw new Error(`Error analyzing marketing performance: ${error.message}`)
  }
}

// Campaign execution functions
export async function scheduleCampaign(campaignId: string, scheduledAt: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("marketing_campaigns")
    .update({
      status: "active",
      scheduled_at: scheduledAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", campaignId)
    .select()
    .single()

  if (error) throw new Error(`Error scheduling campaign: ${error.message}`)
  return data as MarketingCampaign
}

export async function pauseCampaign(campaignId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("marketing_campaigns")
    .update({
      status: "paused",
      updated_at: new Date().toISOString(),
    })
    .eq("id", campaignId)
    .select()
    .single()

  if (error) throw new Error(`Error pausing campaign: ${error.message}`)
  return data as MarketingCampaign
}

export async function resumeCampaign(campaignId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("marketing_campaigns")
    .update({
      status: "active",
      updated_at: new Date().toISOString(),
    })
    .eq("id", campaignId)
    .select()
    .single()

  if (error) throw new Error(`Error resuming campaign: ${error.message}`)
  return data as MarketingCampaign
}

export async function completeCampaign(campaignId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("marketing_campaigns")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", campaignId)
    .select()
    .single()

  if (error) throw new Error(`Error completing campaign: ${error.message}`)
  return data as MarketingCampaign
}

// Get customers for a segment
export async function getCustomersForSegment(segmentId: string) {
  const supabase = createClient()

  // First get the segment to get the criteria
  const { data: segment, error: segmentError } = await supabase
    .from("customer_segments")
    .select("*")
    .eq("id", segmentId)
    .single()

  if (segmentError) throw new Error(`Error fetching segment: ${segmentError.message}`)

  // Build query based on criteria
  let query = supabase.from("customers").select("*")
  const criteria = segment.criteria

  // Apply filters based on criteria
  if (criteria.spent_min !== undefined) {
    query = query.gte("total_spent", criteria.spent_min)
  }

  if (criteria.spent_max !== undefined) {
    query = query.lte("total_spent", criteria.spent_max)
  }

  if (criteria.visits_min !== undefined) {
    query = query.gte("visit_count", criteria.visits_min)
  }

  if (criteria.visits_max !== undefined) {
    query = query.lte("visit_count", criteria.visits_max)
  }

  if (criteria.last_visit_min !== undefined) {
    const date = new Date()
    date.setDate(date.getDate() - criteria.last_visit_min)
    query = query.gte("last_visit", date.toISOString())
  }

  if (criteria.last_visit_max !== undefined) {
    const date = new Date()
    date.setDate(date.getDate() - criteria.last_visit_max)
    query = query.lte("last_visit", date.toISOString())
  }

  if (criteria.tags && criteria.tags.length > 0) {
    query = query.contains("tags", criteria.tags)
  }

  const { data: customers, error: customersError } = await query

  if (customersError) throw new Error(`Error fetching customers for segment: ${customersError.message}`)
  return customers
}

// Add recipients to a campaign
export async function addRecipientsToCampaign(campaignId: string, customerIds: string[]) {
  const supabase = createClient()

  // Create recipients in batch
  const recipients = customerIds.map((customerId) => ({
    campaign_id: campaignId,
    customer_id: customerId,
    status: "pending",
  }))

  const { data, error } = await supabase.from("campaign_recipients").insert(recipients).select()

  if (error) throw new Error(`Error adding recipients to campaign: ${error.message}`)
  return data as CampaignRecipient[]
}

// Get campaign metrics
export async function getCampaignMetrics(campaignId: string) {
  const supabase = createClient()

  // Get all recipients for the campaign
  const { data: recipients, error } = await supabase
    .from("campaign_recipients")
    .select("status")
    .eq("campaign_id", campaignId)

  if (error) throw new Error(`Error fetching campaign metrics: ${error.message}`)

  // Calculate metrics
  const total = recipients.length
  const sent = recipients.filter((r) => r.status !== "pending").length
  const delivered = recipients.filter((r) => ["delivered", "opened", "clicked", "converted"].includes(r.status)).length
  const opened = recipients.filter((r) => ["opened", "clicked", "converted"].includes(r.status)).length
  const clicked = recipients.filter((r) => ["clicked", "converted"].includes(r.status)).length
  const converted = recipients.filter((r) => r.status === "converted").length
  const failed = recipients.filter((r) => r.status === "failed").length
  const unsubscribed = recipients.filter((r) => r.status === "unsubscribed").length

  // Calculate rates
  const deliveryRate = total > 0 ? (delivered / total) * 100 : 0
  const openRate = delivered > 0 ? (opened / delivered) * 100 : 0
  const clickRate = opened > 0 ? (clicked / opened) * 100 : 0
  const conversionRate = clicked > 0 ? (converted / clicked) * 100 : 0
  const bounceRate = total > 0 ? (failed / total) * 100 : 0
  const unsubscribeRate = delivered > 0 ? (unsubscribed / delivered) * 100 : 0

  return {
    total,
    sent,
    delivered,
    opened,
    clicked,
    converted,
    failed,
    unsubscribed,
    deliveryRate,
    openRate,
    clickRate,
    conversionRate,
    bounceRate,
    unsubscribeRate,
  }
}

// Update campaign metrics
export async function updateCampaignMetrics(campaignId: string) {
  const metrics = await getCampaignMetrics(campaignId)

  const supabase = createClient()
  const { data, error } = await supabase
    .from("marketing_campaigns")
    .update({
      metrics,
      updated_at: new Date().toISOString(),
    })
    .eq("id", campaignId)
    .select()
    .single()

  if (error) throw new Error(`Error updating campaign metrics: ${error.message}`)
  return data as MarketingCampaign
}
