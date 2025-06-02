export const verticalGroups = {
  Electronics: [
    "Cell Phone Repair",
    "Tablet Repair",
    "Laptop Repair",
    "TV Repair",
    "Gaming Console Repair",
    "Smart Watch Repair",
    "Headphone Repair",
  ],
  Automotive: [
    "Auto Body",
    "EV Repair",
    "Small Engine Repair",
    "Motorcycle Repair",
    "Tractor Repair",
    "RV Repair",
    "Marine Repair",
  ],
  "Home & Appliances": [
    "Appliance Repair",
    "Dishwasher Repair",
    "Washer/Dryer Repair",
    "Refrigerator Repair",
    "HVAC Repair",
    "Vacuum Repair",
  ],
  Lifestyle: [
    "Jewelry Repair",
    "Watch Repair",
    "Camera Repair",
    "Drone Repair",
    "Musical Instrument Repair",
    "Sporting Goods Repair",
  ],
  Commercial: [
    "POS Repair",
    "ATM Repair",
    "Medical Equipment",
    "Solar Systems",
    "Security Systems",
    "Industrial Equipment",
  ],
} as const

export type VerticalGroup = keyof typeof verticalGroups
export type Vertical = (typeof verticalGroups)[VerticalGroup][number]

export const getAllVerticals = (): Vertical[] => {
  return Object.values(verticalGroups).flat()
}

export const getVerticalsByGroup = (group: VerticalGroup): Vertical[] => {
  return verticalGroups[group]
}
