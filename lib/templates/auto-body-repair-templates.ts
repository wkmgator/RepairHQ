import { nanoid } from "nanoid"
import { RepairIndustry } from "../industry-config" // Ensure AUTO_BODY_REPAIR is added here
import type { ServiceTemplate, ServiceTemplateCategory } from "../service-template-types"

export const bumperReplacementTemplate: ServiceTemplate = {
  id: "auto-body-bumper-replace",
  name: "Bumper Replacement (Front/Rear)",
  description: "Remove damaged bumper, install new bumper, paint to match.",
  industry: RepairIndustry.AUTO_BODY_REPAIR,
  estimatedTime: 240, // 4 hours
  estimatedCost: 850.0, // Varies greatly
  laborCost: 320.0, // 4 hrs @ $80/hr
  partsCost: 450.0, // Bumper cover, brackets, paint
  steps: [
    {
      id: nanoid(),
      title: "Vehicle Check-In & Damage Assessment",
      description: "Inspect vehicle, document damage, confirm parts.",
      estimatedTime: 30,
    },
    {
      id: nanoid(),
      title: "Remove Damaged Bumper",
      description: "Disconnect sensors, lights. Unbolt and remove bumper cover and absorbers.",
      estimatedTime: 60,
    },
    {
      id: nanoid(),
      title: "Prepare New Bumper for Paint",
      description: "Clean, sand, prime new bumper cover.",
      estimatedTime: 45,
    },
    {
      id: nanoid(),
      title: "Paint New Bumper",
      description: "Apply base coat and clear coat. Cure paint.",
      estimatedTime: 60,
      technicalNotes: "Ensure exact color match using paint code and blending if necessary.",
    },
    {
      id: nanoid(),
      title: "Install New Bumper",
      description: "Transfer sensors/lights. Mount new bumper, align panels.",
      estimatedTime: 45,
    },
    {
      id: nanoid(),
      title: "Final Inspection & Clean-up",
      description: "Check fitment, sensor operation. Clean vehicle.",
      estimatedTime: 30,
    },
  ],
  requiredParts: [
    { id: nanoid(), name: "Bumper Cover (Front or Rear)", quantity: 1, estimatedCost: 300.0, isRequired: true },
    { id: nanoid(), name: "Bumper Brackets/Clips", quantity: 1, estimatedCost: 50.0, isRequired: true },
    { id: nanoid(), name: "Paint & Clear Coat", quantity: 1, estimatedCost: 100.0, isRequired: true },
  ],
  recommendedServices: ["Headlight/Taillight Check", "Parking Sensor Calibration"],
  checklistItems: [
    { id: nanoid(), title: "Verify Paint Color Match", isRequired: true, type: "verification" },
    { id: nanoid(), title: "Check Panel Gaps & Alignment", isRequired: true, type: "inspection" },
    { id: nanoid(), title: "Test All Lights & Sensors in Bumper", isRequired: true, type: "verification" },
  ],
}

export const pdrDentRepairTemplate: ServiceTemplate = {
  id: "auto-body-pdr-dent",
  name: "Paintless Dent Repair (PDR) - Single Panel",
  description: "Repair minor to moderate dent without affecting factory paint.",
  industry: RepairIndustry.AUTO_BODY_REPAIR,
  estimatedTime: 90,
  estimatedCost: 250.0,
  laborCost: 225.0,
  partsCost: 0.0, // Typically no parts
  steps: [
    {
      id: nanoid(),
      title: "Assess Dent & Access",
      description: "Evaluate dent size, depth, location. Determine access points.",
      estimatedTime: 15,
    },
    {
      id: nanoid(),
      title: "Set Up PDR Tools & Lighting",
      description: "Prepare specialized PDR tools and lighting board.",
      estimatedTime: 10,
    },
    {
      id: nanoid(),
      title: "Gently Massage Dent Out",
      description: "Apply pressure to the backside of the panel to work out the dent.",
      estimatedTime: 50,
      technicalNotes: "Requires skill and patience to avoid cracking paint.",
    },
    {
      id: nanoid(),
      title: "Inspect Repair & Polish",
      description: "Verify dent removal, polish area if needed.",
      estimatedTime: 15,
    },
  ],
  requiredParts: [],
  recommendedServices: ["Full Vehicle Detail"],
  checklistItems: [
    { id: nanoid(), title: "Confirm Paint Integrity (No Cracks)", isRequired: true, type: "inspection" },
    { id: nanoid(), title: "Verify Dent is Fully Removed", isRequired: true, type: "inspection" },
    { id: nanoid(), title: "Check for High Spots or Tool Marks", isRequired: true, type: "inspection" },
  ],
}

export const autoBodyRepairTemplates: ServiceTemplate[] = [bumperReplacementTemplate, pdrDentRepairTemplate]

export const autoBodyRepairCategories: ServiceTemplateCategory[] = [
  {
    id: "auto-body-structural",
    name: "Structural & Panel Repair",
    description: "Bumper, fender, door, and panel repairs or replacements.",
    industry: RepairIndustry.AUTO_BODY_REPAIR,
    templates: [bumperReplacementTemplate],
  },
  {
    id: "auto-body-cosmetic",
    name: "Cosmetic & Paintless Repair",
    description: "Dent removal, scratch repair, and paintless dent repair (PDR).",
    industry: RepairIndustry.AUTO_BODY_REPAIR,
    templates: [pdrDentRepairTemplate],
  },
  {
    id: "auto-body-paint",
    name: "Paint & Refinishing",
    description: "Spot painting, full panel painting, and complete refinishing services.",
    industry: RepairIndustry.AUTO_BODY_REPAIR,
    templates: [], // Add paint-specific templates here
  },
]
