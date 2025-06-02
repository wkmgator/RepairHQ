import { nanoid } from "nanoid"
import { RepairIndustry } from "../industry-config"
import type { ServiceTemplate, ServiceTemplateCategory } from "../service-template-types"

// Oil Change & Lube Service Templates
export const conventionalOilChangeTemplate: ServiceTemplate = {
  id: "conventional-oil-change",
  name: "Conventional Oil Change",
  description: "Standard oil change with conventional oil",
  industry: RepairIndustry.OIL_CHANGE,
  estimatedTime: 20,
  estimatedCost: 39.99,
  laborCost: 19.99,
  partsCost: 20.0,
  steps: [
    {
      id: nanoid(),
      title: "Vehicle Check-In",
      description: "Verify customer information and vehicle details",
      estimatedTime: 2,
    },
    {
      id: nanoid(),
      title: "Drain Oil",
      description: "Raise vehicle, locate drain plug, place drain pan, and remove plug to drain oil",
      estimatedTime: 5,
      warningNotes: "Ensure oil is not too hot to avoid burns",
      requiredTools: ["Oil drain pan", "Socket set", "Gloves"],
    },
    {
      id: nanoid(),
      title: "Replace Oil Filter",
      description: "Remove old filter and install new one with proper lubrication on gasket",
      estimatedTime: 3,
      technicalNotes: "Hand-tighten filter only - do not use tools to tighten",
      requiredTools: ["Oil filter wrench", "Rags"],
    },
    {
      id: nanoid(),
      title: "Replace Drain Plug",
      description: "Install drain plug with new washer if required",
      estimatedTime: 2,
      technicalNotes: "Torque to manufacturer specifications",
      requiredTools: ["Torque wrench", "Socket set"],
    },
    {
      id: nanoid(),
      title: "Add New Oil",
      description: "Add the correct amount and type of conventional oil for the vehicle",
      estimatedTime: 3,
      technicalNotes: "Verify oil capacity in service manual before filling",
    },
    {
      id: nanoid(),
      title: "Check Fluid Levels",
      description: "Check and top off windshield washer fluid, coolant, and other accessible fluids",
      estimatedTime: 3,
      requiredTools: ["Fluid level tools"],
    },
    {
      id: nanoid(),
      title: "Final Check",
      description: "Start engine, check for leaks, and verify oil pressure",
      estimatedTime: 2,
    },
  ],
  requiredParts: [
    {
      id: nanoid(),
      name: "Conventional Oil",
      quantity: 5, // quarts
      estimatedCost: 15.0,
      isRequired: true,
    },
    {
      id: nanoid(),
      name: "Oil Filter",
      quantity: 1,
      estimatedCost: 5.0,
      isRequired: true,
    },
    {
      id: nanoid(),
      name: "Drain Plug Washer",
      quantity: 1,
      estimatedCost: 0.0, // included
      isRequired: false,
    },
  ],
  recommendedServices: [
    "Air Filter Replacement",
    "Cabin Air Filter Replacement",
    "Wiper Blade Replacement",
    "Synthetic Oil Upgrade",
  ],
  checklistItems: [
    {
      id: nanoid(),
      title: "Check Engine Oil Level",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Check Windshield Washer Fluid",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Check Coolant Level",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Check Tire Pressure",
      isRequired: true,
      type: "measurement",
    },
    {
      id: nanoid(),
      title: "Check Air Filter",
      isRequired: true,
      type: "inspection",
    },
    {
      id: nanoid(),
      title: "Check Wiper Blades",
      isRequired: true,
      type: "inspection",
    },
    {
      id: nanoid(),
      title: "Apply Oil Change Sticker",
      isRequired: true,
      type: "verification",
    },
  ],
}

export const syntheticOilChangeTemplate: ServiceTemplate = {
  id: "synthetic-oil-change",
  name: "Full Synthetic Oil Change",
  description: "Premium oil change with full synthetic oil",
  industry: RepairIndustry.OIL_CHANGE,
  estimatedTime: 20,
  estimatedCost: 69.99,
  laborCost: 19.99,
  partsCost: 50.0,
  steps: [
    {
      id: nanoid(),
      title: "Vehicle Check-In",
      description: "Verify customer information and vehicle details",
      estimatedTime: 2,
    },
    {
      id: nanoid(),
      title: "Drain Oil",
      description: "Raise vehicle, locate drain plug, place drain pan, and remove plug to drain oil",
      estimatedTime: 5,
      warningNotes: "Ensure oil is not too hot to avoid burns",
      requiredTools: ["Oil drain pan", "Socket set", "Gloves"],
    },
    {
      id: nanoid(),
      title: "Replace Oil Filter",
      description: "Remove old filter and install new premium filter with proper lubrication on gasket",
      estimatedTime: 3,
      technicalNotes: "Hand-tighten filter only - do not use tools to tighten",
      requiredTools: ["Oil filter wrench", "Rags"],
    },
    {
      id: nanoid(),
      title: "Replace Drain Plug",
      description: "Install drain plug with new washer if required",
      estimatedTime: 2,
      technicalNotes: "Torque to manufacturer specifications",
      requiredTools: ["Torque wrench", "Socket set"],
    },
    {
      id: nanoid(),
      title: "Add New Synthetic Oil",
      description: "Add the correct amount and type of full synthetic oil for the vehicle",
      estimatedTime: 3,
      technicalNotes: "Verify oil capacity in service manual before filling",
    },
    {
      id: nanoid(),
      title: "Check Fluid Levels",
      description: "Check and top off windshield washer fluid, coolant, and other accessible fluids",
      estimatedTime: 3,
      requiredTools: ["Fluid level tools"],
    },
    {
      id: nanoid(),
      title: "Final Check",
      description: "Start engine, check for leaks, and verify oil pressure",
      estimatedTime: 2,
    },
  ],
  requiredParts: [
    {
      id: nanoid(),
      name: "Full Synthetic Oil",
      quantity: 5, // quarts
      estimatedCost: 40.0,
      isRequired: true,
    },
    {
      id: nanoid(),
      name: "Premium Oil Filter",
      quantity: 1,
      estimatedCost: 10.0,
      isRequired: true,
    },
    {
      id: nanoid(),
      name: "Drain Plug Washer",
      quantity: 1,
      estimatedCost: 0.0, // included
      isRequired: false,
    },
  ],
  recommendedServices: [
    "Air Filter Replacement",
    "Cabin Air Filter Replacement",
    "Wiper Blade Replacement",
    "Fuel System Cleaning",
  ],
  checklistItems: [
    {
      id: nanoid(),
      title: "Check Engine Oil Level",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Check Windshield Washer Fluid",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Check Coolant Level",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Check Tire Pressure",
      isRequired: true,
      type: "measurement",
    },
    {
      id: nanoid(),
      title: "Check Air Filter",
      isRequired: true,
      type: "inspection",
    },
    {
      id: nanoid(),
      title: "Check Wiper Blades",
      isRequired: true,
      type: "inspection",
    },
    {
      id: nanoid(),
      title: "Apply Oil Change Sticker",
      isRequired: true,
      type: "verification",
    },
  ],
}

// More oil change templates...
export const oilChangeTemplates: ServiceTemplate[] = [
  conventionalOilChangeTemplate,
  syntheticOilChangeTemplate,
  // Add more templates here
]

export const oilChangeCategories: ServiceTemplateCategory[] = [
  {
    id: "oil-changes",
    name: "Oil Change Services",
    description: "Various oil change options for different vehicle needs",
    industry: RepairIndustry.OIL_CHANGE,
    templates: [conventionalOilChangeTemplate, syntheticOilChangeTemplate],
  },
  // Add more categories here
]
