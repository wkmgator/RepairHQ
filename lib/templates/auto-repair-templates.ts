import { nanoid } from "nanoid"
import { RepairIndustry } from "../industry-config"
import type { ServiceTemplate, ServiceTemplateCategory } from "../service-template-types"

// Auto Repair Service Templates
export const oilChangeTemplate: ServiceTemplate = {
  id: "auto-oil-change",
  name: "Standard Oil Change",
  description: "Complete oil and filter change service with multi-point inspection",
  industry: RepairIndustry.AUTO_REPAIR,
  estimatedTime: 30,
  estimatedCost: 49.99,
  laborCost: 24.99,
  partsCost: 25.0,
  steps: [
    {
      id: nanoid(),
      title: "Vehicle Check-In",
      description: "Verify customer information and vehicle details",
      estimatedTime: 5,
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
      estimatedTime: 5,
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
      description: "Add the correct amount and type of oil for the vehicle",
      estimatedTime: 5,
      technicalNotes: "Verify oil capacity in service manual before filling",
    },
    {
      id: nanoid(),
      title: "Multi-Point Inspection",
      description: "Check fluid levels, tire pressure, lights, and other basic systems",
      estimatedTime: 5,
      requiredTools: ["Tire pressure gauge", "Fluid level tools"],
    },
    {
      id: nanoid(),
      title: "Final Check",
      description: "Start engine, check for leaks, and verify oil pressure",
      estimatedTime: 3,
    },
  ],
  requiredParts: [
    {
      id: nanoid(),
      name: "Oil Filter",
      quantity: 1,
      estimatedCost: 8.0,
      isRequired: true,
    },
    {
      id: nanoid(),
      name: "Engine Oil",
      quantity: 5, // quarts
      estimatedCost: 17.0,
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
    "Tire Rotation",
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
      title: "Check Transmission Fluid",
      isRequired: true,
      type: "inspection",
    },
    {
      id: nanoid(),
      title: "Check Coolant Level",
      isRequired: true,
      type: "inspection",
    },
    {
      id: nanoid(),
      title: "Check Brake Fluid",
      isRequired: true,
      type: "inspection",
    },
    {
      id: nanoid(),
      title: "Check Power Steering Fluid",
      isRequired: true,
      type: "inspection",
    },
    {
      id: nanoid(),
      title: "Check Tire Pressure",
      isRequired: true,
      type: "measurement",
    },
    {
      id: nanoid(),
      title: "Check Wiper Blades",
      isRequired: true,
      type: "inspection",
    },
    {
      id: nanoid(),
      title: "Check Air Filter",
      isRequired: true,
      type: "inspection",
    },
    {
      id: nanoid(),
      title: "Check Lights",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Check Battery",
      isRequired: true,
      type: "inspection",
    },
  ],
}

export const brakeServiceTemplate: ServiceTemplate = {
  id: "auto-brake-service",
  name: "Front Brake Service",
  description: "Front brake pad replacement and rotor inspection",
  industry: RepairIndustry.AUTO_REPAIR,
  estimatedTime: 90,
  estimatedCost: 249.99,
  laborCost: 150.0,
  partsCost: 99.99,
  steps: [
    {
      id: nanoid(),
      title: "Vehicle Check-In",
      description: "Verify customer information and vehicle details",
      estimatedTime: 5,
    },
    {
      id: nanoid(),
      title: "Raise Vehicle",
      description: "Safely raise vehicle and secure on jack stands",
      estimatedTime: 10,
      warningNotes: "Ensure vehicle is properly supported before beginning work",
      requiredTools: ["Floor jack", "Jack stands", "Wheel chocks"],
    },
    {
      id: nanoid(),
      title: "Remove Wheels",
      description: "Remove front wheels to access brake components",
      estimatedTime: 10,
      requiredTools: ["Lug wrench", "Impact wrench"],
    },
    {
      id: nanoid(),
      title: "Inspect Brake System",
      description: "Inspect calipers, rotors, pads, and brake lines for wear and damage",
      estimatedTime: 10,
      technicalNotes: "Check for uneven wear patterns that might indicate alignment issues",
      requiredTools: ["Flashlight", "Brake gauge"],
    },
    {
      id: nanoid(),
      title: "Remove Caliper",
      description: "Remove caliper and bracket to access brake pads",
      estimatedTime: 15,
      technicalNotes: "Support caliper with wire - do not let it hang by brake line",
      requiredTools: ["Socket set", "Breaker bar", "Wire hook"],
    },
    {
      id: nanoid(),
      title: "Replace Brake Pads",
      description: "Remove old pads and install new ones with proper lubrication",
      estimatedTime: 15,
      technicalNotes: "Apply brake lubricant to contact points, but keep away from friction surface",
      requiredTools: ["Brake lubricant", "C-clamp", "Brake tool kit"],
    },
    {
      id: nanoid(),
      title: "Reinstall Caliper",
      description: "Reinstall caliper and bracket with proper torque",
      estimatedTime: 10,
      technicalNotes: "Torque to manufacturer specifications",
      requiredTools: ["Torque wrench", "Socket set"],
    },
    {
      id: nanoid(),
      title: "Reinstall Wheels",
      description: "Reinstall wheels and lower vehicle",
      estimatedTime: 10,
      technicalNotes: "Torque lug nuts in star pattern to manufacturer specifications",
      requiredTools: ["Torque wrench", "Socket set"],
    },
    {
      id: nanoid(),
      title: "Pump Brakes",
      description: "Pump brake pedal to establish proper pad contact before test drive",
      estimatedTime: 2,
      warningNotes: "Ensure firm pedal before moving vehicle",
    },
    {
      id: nanoid(),
      title: "Test Drive",
      description: "Perform test drive to verify proper brake operation",
      estimatedTime: 10,
      warningNotes: "Listen for unusual noises and feel for pulling or vibration",
    },
    {
      id: nanoid(),
      title: "Final Inspection",
      description: "Perform final inspection and clean up work area",
      estimatedTime: 3,
    },
  ],
  requiredParts: [
    {
      id: nanoid(),
      name: "Front Brake Pads",
      quantity: 1, // set
      estimatedCost: 69.99,
      isRequired: true,
    },
    {
      id: nanoid(),
      name: "Brake Lubricant",
      quantity: 1,
      estimatedCost: 5.0,
      isRequired: true,
    },
    {
      id: nanoid(),
      name: "Brake Cleaner",
      quantity: 1,
      estimatedCost: 5.0,
      isRequired: true,
    },
    {
      id: nanoid(),
      name: "Front Rotors",
      quantity: 2,
      estimatedCost: 120.0,
      isRequired: false,
      alternatives: ["Rotor Resurfacing"],
    },
    {
      id: nanoid(),
      name: "Caliper Hardware Kit",
      quantity: 1,
      estimatedCost: 20.0,
      isRequired: false,
    },
  ],
  recommendedServices: ["Brake Fluid Flush", "Rear Brake Service", "Wheel Alignment", "Tire Rotation"],
  checklistItems: [
    {
      id: nanoid(),
      title: "Measure Rotor Thickness",
      description: "Ensure rotors meet minimum thickness specification",
      isRequired: true,
      type: "measurement",
    },
    {
      id: nanoid(),
      title: "Check Brake Fluid Level",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Inspect Brake Lines",
      isRequired: true,
      type: "inspection",
    },
    {
      id: nanoid(),
      title: "Check Caliper Movement",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Verify Pad Installation",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Check for Proper Pedal Feel",
      isRequired: true,
      type: "verification",
    },
    {
      id: nanoid(),
      title: "Verify No Brake Warning Lights",
      isRequired: true,
      type: "verification",
    },
  ],
}

// More auto repair templates...
export const autoRepairTemplates: ServiceTemplate[] = [
  oilChangeTemplate,
  brakeServiceTemplate,
  // Add more templates here
]

export const autoRepairCategories: ServiceTemplateCategory[] = [
  {
    id: "auto-maintenance",
    name: "Routine Maintenance",
    description: "Regular maintenance services to keep vehicles running smoothly",
    industry: RepairIndustry.AUTO_REPAIR,
    templates: [oilChangeTemplate],
  },
  {
    id: "auto-brakes",
    name: "Brake Services",
    description: "Brake repair and maintenance services",
    industry: RepairIndustry.AUTO_REPAIR,
    templates: [brakeServiceTemplate],
  },
  // Add more categories here
]
