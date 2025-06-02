import { nanoid } from "nanoid"
import { RepairIndustry } from "../industry-config"
import type { ServiceTemplate, ServiceTemplateCategory } from "../service-template-types"

// Motorcycle Repair Service Templates
export const motorcycleTuneUpTemplate: ServiceTemplate = {
  id: "moto-tune-up",
  name: "Motorcycle Tune-Up",
  description: "Comprehensive tune-up service for motorcycles",
  industry: RepairIndustry.MOTORCYCLE_REPAIR,
  estimatedTime: 120,
  estimatedCost: 299.99,
  laborCost: 180.0,
  partsCost: 119.99,
  steps: [
    {
      id: nanoid(),
      title: "Initial Inspection",
      description: "Perform visual inspection and document current condition",
      estimatedTime: 10,
      requiredTools: ["Inspection light", "Diagnostic scanner"],
    },
    {
      id: nanoid(),
      title: "Change Oil & Filter",
      description: "Drain old oil, replace filter, and add new oil",
      estimatedTime: 20,
      technicalNotes: "Use manufacturer recommended oil type and weight",
      requiredTools: ["Oil drain pan", "Filter wrench", "Torque wrench"],
    },
    {
      id: nanoid(),
      title: "Air Filter Service",
      description: "Remove, inspect, and replace or clean air filter",
      estimatedTime: 15,
      technicalNotes: "If using K&N filter, clean and re-oil according to specifications",
      requiredTools: ["Filter cleaner kit", "Compressed air"],
    },
    {
      id: nanoid(),
      title: "Spark Plug Replacement",
      description: "Remove and replace spark plugs",
      estimatedTime: 20,
      technicalNotes: "Gap plugs according to manufacturer specifications",
      requiredTools: ["Spark plug socket", "Gapping tool", "Torque wrench"],
    },
    {
      id: nanoid(),
      title: "Check/Adjust Valve Clearance",
      description: "Inspect and adjust valve clearance if necessary",
      estimatedTime: 30,
      technicalNotes: "Refer to service manual for specific clearance specifications",
      requiredTools: ["Feeler gauges", "Valve adjustment tools"],
    },
    {
      id: nanoid(),
      title: "Synchronize Carburetors/Throttle Bodies",
      description: "Balance carburetors or throttle bodies for smooth operation",
      estimatedTime: 20,
      technicalNotes: "Use vacuum gauge set for proper synchronization",
      requiredTools: ["Vacuum gauge set", "Adjustment tools"],
    },
    {
      id: nanoid(),
      title: "Test Ride",
      description: "Perform test ride to verify proper operation",
      estimatedTime: 15,
      warningNotes: "Ensure all components are properly secured before test ride",
    },
  ],
  requiredParts: [
    {
      id: nanoid(),
      name: "Engine Oil",
      quantity: 3, // quarts
      estimatedCost: 30.0,
      isRequired: true,
    },
    {
      id: nanoid(),
      name: "Oil Filter",
      quantity: 1,
      estimatedCost: 12.99,
      isRequired: true,
    },
    {
      id: nanoid(),
      name: "Air Filter",
      quantity: 1,
      estimatedCost: 29.99,
      isRequired: true,
    },
    {
      id: nanoid(),
      name: "Spark Plugs",
      quantity: 4,
      estimatedCost: 32.0,
      isRequired: true,
    },
    {
      id: nanoid(),
      name: "Fuel Filter",
      quantity: 1,
      estimatedCost: 15.0,
      isRequired: false,
    },
  ],
  recommendedServices: ["Chain Maintenance", "Brake Fluid Flush", "Coolant Flush", "Battery Service"],
  checklistItems: [
    {
      id: nanoid(),
      title: "Check Tire Pressure",
      isRequired: true,
      type: "measurement",
    },
    {
      id: nanoid(),
      title: "Check Tire Condition",
      isRequired: true,
      type: "inspection",
    },
    {
      id: nanoid(),
      title: "Check Chain Tension",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Check Brake Pad Wear",
      isRequired: true,
      type: "inspection",
    },
    {
      id: nanoid(),
      title: "Check Fluid Levels",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Check Lights and Signals",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Check Battery Voltage",
      isRequired: true,
      type: "measurement",
    },
    {
      id: nanoid(),
      title: "Check Clutch Operation",
      isRequired: true,
      type: "verification",
    },
  ],
}

export const motorcycleChainServiceTemplate: ServiceTemplate = {
  id: "moto-chain-service",
  name: "Chain Maintenance Service",
  description: "Clean, adjust, and lubricate drive chain",
  industry: RepairIndustry.MOTORCYCLE_REPAIR,
  estimatedTime: 45,
  estimatedCost: 79.99,
  laborCost: 60.0,
  partsCost: 19.99,
  steps: [
    {
      id: nanoid(),
      title: "Initial Inspection",
      description: "Inspect chain condition, tension, and sprocket wear",
      estimatedTime: 10,
      technicalNotes: "Check for tight spots in chain and excessive wear on sprockets",
      requiredTools: ["Flashlight", "Inspection mirror"],
    },
    {
      id: nanoid(),
      title: "Clean Chain",
      description: "Clean chain thoroughly using chain cleaner",
      estimatedTime: 15,
      technicalNotes: "Use approved chain cleaner and brush to remove all debris",
      requiredTools: ["Chain cleaner", "Chain brush", "Rags"],
    },
    {
      id: nanoid(),
      title: "Adjust Chain Tension",
      description: "Adjust chain to proper tension according to specifications",
      estimatedTime: 10,
      technicalNotes: "Refer to service manual for specific tension specifications",
      requiredTools: ["Socket set", "Tension gauge", "Tape measure"],
    },
    {
      id: nanoid(),
      title: "Lubricate Chain",
      description: "Apply appropriate chain lubricant",
      estimatedTime: 5,
      technicalNotes: "Use type of lubricant specified for chain type (O-ring, X-ring, etc.)",
      requiredTools: ["Chain lubricant"],
    },
    {
      id: nanoid(),
      title: "Final Inspection",
      description: "Verify proper tension and lubrication",
      estimatedTime: 5,
      requiredTools: ["Flashlight"],
    },
  ],
  requiredParts: [
    {
      id: nanoid(),
      name: "Chain Cleaner",
      quantity: 1,
      estimatedCost: 9.99,
      isRequired: true,
    },
    {
      id: nanoid(),
      name: "Chain Lubricant",
      quantity: 1,
      estimatedCost: 10.0,
      isRequired: true,
    },
    {
      id: nanoid(),
      name: "Drive Chain",
      quantity: 1,
      estimatedCost: 89.99,
      isRequired: false,
    },
    {
      id: nanoid(),
      name: "Master Link",
      quantity: 1,
      estimatedCost: 12.99,
      isRequired: false,
    },
  ],
  recommendedServices: ["Sprocket Replacement", "Tune-Up Service", "Brake Service"],
  checklistItems: [
    {
      id: nanoid(),
      title: "Check Chain Tension",
      isRequired: true,
      type: "measurement",
    },
    {
      id: nanoid(),
      title: "Inspect Sprocket Wear",
      isRequired: true,
      type: "inspection",
    },
    {
      id: nanoid(),
      title: "Check for Chain Kinks",
      isRequired: true,
      type: "inspection",
    },
    {
      id: nanoid(),
      title: "Verify Chain Alignment",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Check Master Link Security",
      isRequired: true,
      type: "verification",
    },
  ],
}

// More motorcycle repair templates...
export const motorcycleRepairTemplates: ServiceTemplate[] = [
  motorcycleTuneUpTemplate,
  motorcycleChainServiceTemplate,
  // Add more templates here
]

export const motorcycleRepairCategories: ServiceTemplateCategory[] = [
  {
    id: "moto-maintenance",
    name: "Routine Maintenance",
    description: "Regular maintenance services to keep motorcycles running smoothly",
    industry: RepairIndustry.MOTORCYCLE_REPAIR,
    templates: [motorcycleTuneUpTemplate],
  },
  {
    id: "moto-drive",
    name: "Drive System",
    description: "Chain, belt, and drive system maintenance",
    industry: RepairIndustry.MOTORCYCLE_REPAIR,
    templates: [motorcycleChainServiceTemplate],
  },
  // Add more categories here
]
