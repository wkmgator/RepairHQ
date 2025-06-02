import { nanoid } from "nanoid"
import { RepairIndustry } from "../industry-config"
import type { ServiceTemplate, ServiceTemplateCategory } from "../service-template-types"

// Tire Service Templates
export const tireMountBalanceTemplate: ServiceTemplate = {
  id: "tire-mount-balance",
  name: "Tire Mount & Balance",
  description: "Mount new tires and balance wheels",
  industry: RepairIndustry.TIRE_SERVICE,
  estimatedTime: 60,
  estimatedCost: 80.0,
  laborCost: 80.0,
  partsCost: 0.0, // Assumes customer provides tires
  steps: [
    {
      id: nanoid(),
      title: "Vehicle Check-In",
      description: "Verify customer information and vehicle details",
      estimatedTime: 5,
    },
    {
      id: nanoid(),
      title: "Remove Wheels",
      description: "Safely raise vehicle and remove wheels",
      estimatedTime: 10,
      requiredTools: ["Impact wrench", "Jack", "Jack stands", "Torque wrench"],
    },
    {
      id: nanoid(),
      title: "Dismount Old Tires",
      description: "Remove old tires from wheels",
      estimatedTime: 10,
      requiredTools: ["Tire machine", "Tire irons", "Bead breaker"],
    },
    {
      id: nanoid(),
      title: "Inspect Wheels",
      description: "Inspect wheels for damage or defects",
      estimatedTime: 5,
      technicalNotes: "Check for bends, cracks, or corrosion that could affect safety",
      requiredTools: ["Inspection light", "Wheel straightness gauge"],
    },
    {
      id: nanoid(),
      title: "Mount New Tires",
      description: "Mount new tires on wheels",
      estimatedTime: 10,
      technicalNotes: "Ensure proper tire direction and bead seating",
      requiredTools: ["Tire machine", "Bead sealer", "Tire lubricant"],
    },
    {
      id: nanoid(),
      title: "Balance Wheels",
      description: "Balance wheels with new tires",
      estimatedTime: 10,
      technicalNotes: "Use dynamic balancing for optimal results",
      requiredTools: ["Wheel balancer", "Balance weights"],
    },
    {
      id: nanoid(),
      title: "Reinstall Wheels",
      description: "Install wheels on vehicle and torque to specification",
      estimatedTime: 10,
      technicalNotes: "Torque in star pattern to manufacturer specifications",
      requiredTools: ["Torque wrench", "Impact wrench"],
    },
  ],
  requiredParts: [
    {
      id: nanoid(),
      name: "Valve Stems",
      quantity: 4,
      estimatedCost: 0.0, // Usually included in service
      isRequired: true,
    },
    {
      id: nanoid(),
      name: "Balance Weights",
      quantity: 1, // Set
      estimatedCost: 0.0, // Usually included in service
      isRequired: true,
    },
    {
      id: nanoid(),
      name: "TPMS Service Kit",
      quantity: 4,
      estimatedCost: 20.0,
      isRequired: false,
    },
  ],
  recommendedServices: [
    "Wheel Alignment",
    "TPMS Programming",
    "Tire Rotation (for remaining tires)",
    "Road Hazard Warranty",
  ],
  checklistItems: [
    {
      id: nanoid(),
      title: "Verify Tire Size",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Check Wheel Condition",
      isRequired: true,
      type: "inspection",
    },
    {
      id: nanoid(),
      title: "Verify Proper Bead Seating",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Check Balance Quality",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Verify Lug Nut Torque",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Set Tire Pressure",
      isRequired: true,
      type: "measurement",
    },
    {
      id: nanoid(),
      title: "Check TPMS Operation",
      isRequired: true,
      type: "verification",
    },
  ],
}

export const tpmsServiceTemplate: ServiceTemplate = {
  id: "tpms-service",
  name: "TPMS Service",
  description: "Tire Pressure Monitoring System service and programming",
  industry: RepairIndustry.TIRE_SERVICE,
  estimatedTime: 30,
  estimatedCost: 59.99,
  laborCost: 39.99,
  partsCost: 20.0,
  steps: [
    {
      id: nanoid(),
      title: "Initial Diagnosis",
      description: "Diagnose TPMS issues using scanner",
      estimatedTime: 5,
      technicalNotes: "Check for sensor communication and battery status",
      requiredTools: ["TPMS scanner", "Diagnostic tool"],
    },
    {
      id: nanoid(),
      title: "Remove Tire",
      description: "Remove tire from wheel if sensor replacement is needed",
      estimatedTime: 10,
      requiredTools: ["Tire machine", "Tire irons", "Bead breaker"],
    },
    {
      id: nanoid(),
      title: "Replace TPMS Sensor",
      description: "Replace faulty sensor with new one",
      estimatedTime: 5,
      technicalNotes: "Ensure proper torque on sensor nut",
      requiredTools: ["Torque wrench", "TPMS tools"],
    },
    {
      id: nanoid(),
      title: "Remount Tire",
      description: "Remount tire on wheel",
      estimatedTime: 5,
      technicalNotes: "Take care not to damage new sensor during mounting",
      requiredTools: ["Tire machine", "Tire lubricant"],
    },
    {
      id: nanoid(),
      title: "Program Sensor",
      description: "Program new sensor to vehicle",
      estimatedTime: 5,
      technicalNotes: "Follow vehicle-specific programming procedure",
      requiredTools: ["TPMS programming tool"],
    },
  ],
  requiredParts: [
    {
      id: nanoid(),
      name: "TPMS Sensor",
      quantity: 1,
      estimatedCost: 20.0,
      isRequired: false, // Only if replacement needed
    },
    {
      id: nanoid(),
      name: "TPMS Service Kit",
      quantity: 1,
      estimatedCost: 5.0,
      isRequired: true,
    },
    {
      id: nanoid(),
      name: "Valve Core",
      quantity: 1,
      estimatedCost: 1.0,
      isRequired: false,
    },
  ],
  recommendedServices: ["Tire Rotation", "Wheel Alignment", "Tire Replacement"],
  checklistItems: [
    {
      id: nanoid(),
      title: "Verify Sensor Communication",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Check Sensor Battery Status",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Verify Proper Programming",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Check for TPMS Warning Light",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Set Correct Tire Pressure",
      isRequired: true,
      type: "measurement",
    },
  ],
}

// More tire service templates...
export const tireServiceTemplates: ServiceTemplate[] = [
  tireMountBalanceTemplate,
  tpmsServiceTemplate,
  // Add more templates here
]

export const tireServiceCategories: ServiceTemplateCategory[] = [
  {
    id: "tire-installation",
    name: "Tire Installation",
    description: "Tire mounting, balancing, and installation services",
    industry: RepairIndustry.TIRE_SERVICE,
    templates: [tireMountBalanceTemplate],
  },
  {
    id: "tire-tpms",
    name: "TPMS Services",
    description: "Tire Pressure Monitoring System services",
    industry: RepairIndustry.TIRE_SERVICE,
    templates: [tpmsServiceTemplate],
  },
  // Add more categories here
]
