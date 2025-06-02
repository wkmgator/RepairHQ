import type { RepairIndustry } from "./industry-config"

export interface ServiceTemplate {
  id: string
  name: string
  description: string
  industry: RepairIndustry
  estimatedTime: number // in minutes
  estimatedCost: number
  laborCost: number
  partsCost: number
  steps: ServiceStep[]
  requiredParts: TemplatePart[]
  recommendedServices: string[]
  checklistItems: ChecklistItem[]
}

export interface ServiceStep {
  id: string
  title: string
  description: string
  estimatedTime: number // in minutes
  technicalNotes?: string
  warningNotes?: string
  requiredTools?: string[]
  images?: string[]
}

export interface TemplatePart {
  id: string
  name: string
  partNumber?: string
  quantity: number
  estimatedCost: number
  isRequired: boolean
  alternatives?: string[]
}

export interface ChecklistItem {
  id: string
  title: string
  description?: string
  isRequired: boolean
  type: "inspection" | "verification" | "measurement" | "customer_approval"
  options?: string[]
}

export interface ServiceTemplateCategory {
  id: string
  name: string
  description: string
  industry: RepairIndustry
  templates: ServiceTemplate[]
}
