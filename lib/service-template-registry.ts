import type { RepairIndustry } from "./industry-config" // Ensure this path is correct
import type { ServiceTemplate, ServiceTemplateCategory } from "./service-template-types"
import { createClient } from "@/lib/supabase/client" // Assuming client-side Supabase

export async function getAllServiceTemplatesFromDB(): Promise<ServiceTemplate[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("service_templates").select("*")
  if (error) {
    console.error("Error fetching service templates:", error)
    return []
  }
  return data || []
}

export async function getServiceTemplateByIdFromDB(id: string): Promise<ServiceTemplate | undefined> {
  const supabase = createClient()
  const { data, error } = await supabase.from("service_templates").select("*").eq("id", id).single()
  if (error) {
    console.error(`Error fetching service template ${id}:`, error)
    return undefined
  }
  return data || undefined
}

export async function getServiceTemplatesByIndustryFromDB(industry: RepairIndustry): Promise<ServiceTemplate[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("service_templates").select("*").eq("industry_vertical", industry) // Ensure your DB column is named industry_vertical
  if (error) {
    console.error(`Error fetching service templates for industry ${industry}:`, error)
    return []
  }
  return data || []
}

export async function getAllServiceCategoriesFromDB(): Promise<ServiceTemplateCategory[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("service_template_categories").select("*")
  if (error) {
    console.error("Error fetching service template categories:", error)
    return []
  }
  return data || []
}

export async function getServiceCategoriesByIndustryFromDB(
  industry: RepairIndustry,
): Promise<ServiceTemplateCategory[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("service_template_categories")
    .select("*")
    .eq("industry_vertical", industry) // Ensure your DB column is named industry_vertical
  if (error) {
    console.error(`Error fetching service template categories for industry ${industry}:`, error)
    return []
  }
  return data || []
}
