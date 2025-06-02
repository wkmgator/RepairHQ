import { RepairIndustry } from "./industry-config"

export enum IndustryCategory {
  ELECTRONICS = "electronics",
  SPECIALTY = "specialty",
  AUTOMOTIVE = "automotive",
}

export interface IndustryCategoryConfig {
  id: IndustryCategory
  name: string
  description: string
  industries: RepairIndustry[]
  icon: string
  color: string
  isAddon?: boolean
}

export const industryCategories: Record<IndustryCategory, IndustryCategoryConfig> = {
  [IndustryCategory.ELECTRONICS]: {
    id: IndustryCategory.ELECTRONICS,
    name: "Electronics Repair",
    description: "Repair services for electronic devices and gadgets",
    industries: [
      RepairIndustry.CELL_PHONE,
      RepairIndustry.COMPUTER,
      RepairIndustry.WIRELESS,
      RepairIndustry.CAMERA,
      RepairIndustry.DRONE,
    ],
    icon: "smartphone",
    color: "blue",
    isAddon: false,
  },
  [IndustryCategory.SPECIALTY]: {
    id: IndustryCategory.SPECIALTY,
    name: "Specialty Repair",
    description: "Specialized repair services for various items",
    industries: [
      RepairIndustry.JEWELRY,
      RepairIndustry.WATCH,
      RepairIndustry.POWER_TOOLS,
      RepairIndustry.BICYCLE,
      RepairIndustry.MAIL_IN,
    ],
    icon: "tool",
    color: "purple",
    isAddon: false,
  },
  [IndustryCategory.AUTOMOTIVE]: {
    id: IndustryCategory.AUTOMOTIVE,
    name: "Automotive Services",
    description: "Repair and maintenance services for vehicles",
    industries: [
      RepairIndustry.AUTO_REPAIR,
      RepairIndustry.MOTORCYCLE_REPAIR,
      RepairIndustry.TIRE_SERVICE,
      RepairIndustry.OIL_CHANGE,
    ],
    icon: "car",
    color: "red",
    isAddon: true, // Mark as an add-on package
  },
}

export function getIndustryCategory(category: IndustryCategory): IndustryCategoryConfig {
  return industryCategories[category]
}

export function getAllCategories(): IndustryCategoryConfig[] {
  return Object.values(industryCategories)
}

export function getCategoryForIndustry(industry: RepairIndustry): IndustryCategory | undefined {
  for (const [categoryId, category] of Object.entries(industryCategories)) {
    if (category.industries.includes(industry)) {
      return categoryId as IndustryCategory
    }
  }
  return undefined
}
