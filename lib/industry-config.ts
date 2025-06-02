import {
  Car,
  Gamepad2,
  Wrench,
  Sun,
  Anchor,
  Zap,
  Truck,
  Tractor,
  Settings,
  Home,
  CarFront,
  Gem,
  Bot,
  Wind,
  Camera,
  Drill,
} from "lucide-react"
import type { ReactComponentType } from "react"

export enum RepairIndustry {
  GENERAL_REPAIR = "general-repair",
  HVAC_REPAIR = "hvac-repair", // Example, not fully implemented in this step
  PLUMBING_REPAIR = "plumbing-repair", // Example
  ELECTRICAL_REPAIR = "electrical-repair", // Example
  APPLIANCE_REPAIR = "appliance-repair",
  AUTO_BODY_REPAIR = "auto-body-repair",
  DIGITAL_DEVICES_GAMING = "digital-devices-gaming", // New consolidated industry
  AUTO_REPAIR = "auto-repair",
  ELECTRIC_VEHICLE_REPAIR = "electric-vehicle-repair",
  SMALL_ENGINE_REPAIR = "small-engine-repair",
  TRACTOR_REPAIR = "tractor-repair",
  SOLAR_REPAIR = "solar-repair",
  RV_CAMPER_REPAIR = "rv-camper-repair",
  BOAT_YACHT_REPAIR = "boat-yacht-repair",
  JEWELRY_WATCH_REPAIR = "jewelry-watch-repair",
  VACUUM_ROBOT_REPAIR = "vacuum-robot-repair",
  DRONE_REPAIR = "drone-repair",
  CAMERA_REPAIR = "camera-repair",
  POWER_TOOL_REPAIR = "power-tool-repair",
  // Removed: PHONE_REPAIR, COMPUTER_REPAIR, GAMING, ELECTRONICS (if they were separate and now covered by DIGITAL_DEVICES_GAMING)
  INDUSTRIAL_REPAIR = "industrial-repair",
}

export interface IndustryConfig {
  id: RepairIndustry
  name: string
  description: string
  icon: ReactComponentType<{ className?: string }>
  defaultTicketForm?: string
  serviceCategories?: string[]
  deviceAttributesSchema?: Array<{
    name: string
    label: string
    type: "text" | "number" | "boolean" | "select"
    options?: string[]
    required?: boolean
  }>
  ticketCustomFieldsSchema?: Array<{
    name: string
    label: string
    type: "text" | "number" | "boolean" | "select"
    options?: string[]
    required?: boolean
  }>
}

export const industryConfigurations: Record<RepairIndustry, IndustryConfig> = {
  [RepairIndustry.GENERAL_REPAIR]: {
    id: RepairIndustry.GENERAL_REPAIR,
    name: "General Repair",
    description: "General repairs for various devices and equipment.",
    icon: Wrench,
    defaultTicketForm: "/tickets/new/general",
    deviceAttributesSchema: [
      { name: "serial_number", label: "Serial Number", type: "text", required: false },
      { name: "purchase_date", label: "Purchase Date", type: "text", required: false }, // Consider date picker type
    ],
    ticketCustomFieldsSchema: [{ name: "reported_issue_details", label: "Detailed Issue Report", type: "text" }],
  },
  [RepairIndustry.HVAC_REPAIR]: {
    id: RepairIndustry.HVAC_REPAIR,
    name: "HVAC Repair",
    description: "Heating, ventilation, and air conditioning repairs.",
    icon: Wind, // Placeholder icon
    defaultTicketForm: "/tickets/new/hvac",
    deviceAttributesSchema: [
      { name: "unit_model", label: "Unit Model", type: "text", required: true },
      { name: "unit_serial", label: "Unit Serial", type: "text", required: false },
      { name: "installation_date", label: "Installation Date", type: "text" },
    ],
    ticketCustomFieldsSchema: [
      { name: "filter_last_changed", label: "Filter Last Changed", type: "text" },
      { name: "system_age_years", label: "System Age (Years)", type: "number" },
    ],
  },
  [RepairIndustry.PLUMBING_REPAIR]: {
    id: RepairIndustry.PLUMBING_REPAIR,
    name: "Plumbing Repair",
    description: "Repairs for plumbing systems.",
    icon: Wrench, // Placeholder icon
    defaultTicketForm: "/tickets/new/plumbing",
    deviceAttributesSchema: [
      // Less device-centric, more about fixture/location
      {
        name: "fixture_type",
        label: "Fixture Type",
        type: "text",
        required: true,
        options: ["Sink", "Toilet", "Shower", "Pipe", "Water Heater"],
      },
      { name: "location_in_property", label: "Location in Property", type: "text", required: true },
    ],
    ticketCustomFieldsSchema: [{ name: "water_shut_off_location", label: "Water Shut Off Location", type: "text" }],
  },
  [RepairIndustry.ELECTRICAL_REPAIR]: {
    id: RepairIndustry.ELECTRICAL_REPAIR,
    name: "Electrical Repair",
    description: "Electrical repairs for various devices.",
    icon: Zap, // Placeholder icon
    defaultTicketForm: "/tickets/new/electrical",
    deviceAttributesSchema: [
      { name: "appliance_type", label: "Appliance/Fixture Type", type: "text" },
      { name: "voltage_rating", label: "Voltage Rating", type: "text" },
    ],
    ticketCustomFieldsSchema: [
      { name: "breaker_panel_location", label: "Breaker Panel Location", type: "text" },
      { name: "circuit_number", label: "Circuit Number (if known)", type: "text" },
    ],
  },
  [RepairIndustry.APPLIANCE_REPAIR]: {
    id: RepairIndustry.APPLIANCE_REPAIR,
    name: "Appliance Repair",
    description: "Repairs for home and commercial appliances.",
    icon: Home,
    defaultTicketForm: "/tickets/new/appliance",
    deviceAttributesSchema: [
      { name: "appliance_model_number", label: "Model Number", type: "text", required: true },
      { name: "appliance_serial_number", label: "Serial Number", type: "text", required: false },
      { name: "appliance_purchase_date", label: "Purchase Date", type: "text" },
    ],
    ticketCustomFieldsSchema: [
      { name: "error_code_displayed", label: "Error Code Displayed", type: "text" },
      { name: "last_serviced_date", label: "Last Serviced Date", type: "text" },
    ],
  },
  [RepairIndustry.AUTO_BODY_REPAIR]: {
    id: RepairIndustry.AUTO_BODY_REPAIR,
    name: "Auto Body Repair",
    description: "Collision repair, painting, and body work for vehicles.",
    icon: CarFront, // Changed from CarCrash
    defaultTicketForm: "/tickets/new/auto-body",
    deviceAttributesSchema: [
      { name: "vin", label: "VIN", type: "text", required: true },
      { name: "license_plate", label: "License Plate", type: "text" },
      { name: "mileage", label: "Mileage", type: "number" },
    ],
    ticketCustomFieldsSchema: [
      { name: "insurance_claim_number", label: "Insurance Claim #", type: "text" },
      { name: "date_of_loss", label: "Date of Loss", type: "text" }, // Consider date picker
    ],
  },
  [RepairIndustry.DIGITAL_DEVICES_GAMING]: {
    id: RepairIndustry.DIGITAL_DEVICES_GAMING,
    name: "Digital Devices & Gaming Repair",
    description: "Repairs for phones, computers, tablets, and gaming consoles.",
    icon: Gamepad2, // Or combine Smartphone, Computer, Gamepad2 if possible, or choose one.
    defaultTicketForm: "/tickets/new/digital-devices",
    deviceAttributesSchema: [
      { name: "imei_sn", label: "IMEI/Serial Number", type: "text", required: true },
      { name: "storage_capacity_gb", label: "Storage (GB)", type: "number" },
      { name: "has_liquid_damage_indicator", label: "Liquid Damage Indicator Triggered?", type: "boolean" },
    ],
    ticketCustomFieldsSchema: [
      { name: "data_backup_requested", label: "Data Backup Requested", type: "boolean" },
      { name: "password_provided", label: "Device Password Provided", type: "text" },
    ],
  },
  [RepairIndustry.AUTO_REPAIR]: {
    id: RepairIndustry.AUTO_REPAIR,
    name: "Automotive Repair",
    description: "Mechanical and electrical repairs for vehicles.",
    icon: Car,
    defaultTicketForm: "/tickets/new/automotive",
    deviceAttributesSchema: [
      { name: "vin", label: "VIN", type: "text", required: true },
      { name: "mileage", label: "Mileage", type: "number", required: false },
      {
        name: "engine_type",
        label: "Engine Type",
        type: "select",
        options: ["Gasoline", "Diesel", "Hybrid", "Electric"],
        required: false,
      },
    ],
    ticketCustomFieldsSchema: [
      { name: "customer_reported_issue_code", label: "Issue Code (Customer)", type: "text" },
      { name: "pre_repair_inspection_done", label: "Pre-Repair Inspection Done?", type: "boolean" },
    ],
  },
  [RepairIndustry.ELECTRIC_VEHICLE_REPAIR]: {
    id: RepairIndustry.ELECTRIC_VEHICLE_REPAIR,
    name: "Electric Vehicle Repair",
    description: "Repairs for electric vehicles.",
    icon: Zap,
    defaultTicketForm: "/tickets/new/electric-vehicle",
    deviceAttributesSchema: [
      { name: "vin", label: "VIN", type: "text", required: true },
      { name: "battery_capacity_kwh", label: "Battery Capacity (kWh)", type: "number" },
      { name: "charger_type", label: "Charger Type", type: "text" },
    ],
    ticketCustomFieldsSchema: [
      { name: "software_version", label: "Software Version", type: "text" },
      { name: "charging_issue_details", label: "Charging Issue Details", type: "text" },
    ],
  },
  [RepairIndustry.SMALL_ENGINE_REPAIR]: {
    id: RepairIndustry.SMALL_ENGINE_REPAIR,
    name: "Small Engine Repair",
    description: "Repairs for small engines like mowers, generators.",
    icon: Settings,
    defaultTicketForm: "/tickets/new/small-engine",
    deviceAttributesSchema: [
      { name: "engine_model", label: "Engine Model", type: "text", required: true },
      { name: "engine_serial", label: "Engine Serial", type: "text" },
    ],
    ticketCustomFieldsSchema: [{ name: "fuel_type_used", label: "Fuel Type Used", type: "text" }],
  },
  [RepairIndustry.TRACTOR_REPAIR]: {
    id: RepairIndustry.TRACTOR_REPAIR,
    name: "Tractor Repair",
    description: "Repairs for agricultural tractors and equipment.",
    icon: Tractor,
    defaultTicketForm: "/tickets/new/tractor",
    deviceAttributesSchema: [
      { name: "tractor_model", label: "Tractor Model", type: "text", required: true },
      { name: "tractor_serial", label: "Tractor Serial", type: "text" },
      { name: "engine_hours", label: "Engine Hours", type: "number" },
    ],
    ticketCustomFieldsSchema: [{ name: "attachment_details", label: "Attachment Details", type: "text" }],
  },
  [RepairIndustry.SOLAR_REPAIR]: {
    id: RepairIndustry.SOLAR_REPAIR,
    name: "Solar Panel Repair",
    description: "Repairs and maintenance for solar panel systems.",
    icon: Sun,
    defaultTicketForm: "/tickets/new/solar",
    deviceAttributesSchema: [
      { name: "panel_model", label: "Panel Model", type: "text" },
      { name: "inverter_model", label: "Inverter Model", type: "text" },
    ],
    ticketCustomFieldsSchema: [{ name: "system_output_reading", label: "System Output Reading", type: "text" }],
  },
  [RepairIndustry.RV_CAMPER_REPAIR]: {
    id: RepairIndustry.RV_CAMPER_REPAIR,
    name: "RV & Camper Repair",
    description: "Repairs for recreational vehicles and campers.",
    icon: Truck,
    defaultTicketForm: "/tickets/new/rv-camper",
    deviceAttributesSchema: [
      { name: "rv_vin", label: "RV VIN", type: "text", required: true },
      { name: "rv_length_ft", label: "RV Length (ft)", type: "number" },
    ],
    ticketCustomFieldsSchema: [{ name: "appliance_issue_details", label: "Appliance Issue Details", type: "text" }],
  },
  [RepairIndustry.BOAT_YACHT_REPAIR]: {
    id: RepairIndustry.BOAT_YACHT_REPAIR,
    name: "Boat & Yacht Repair",
    description: "Repairs for boats, yachts, and marine equipment.",
    icon: Anchor,
    defaultTicketForm: "/tickets/new/boat-yacht",
    deviceAttributesSchema: [
      { name: "hin_number", label: "HIN Number", type: "text", required: true },
      { name: "boat_length_ft", label: "Boat Length (ft)", type: "number" },
      { name: "engine_model_marine", label: "Engine Model", type: "text" },
    ],
    ticketCustomFieldsSchema: [{ name: "last_haul_out_date", label: "Last Haul Out Date", type: "text" }],
  },
  [RepairIndustry.JEWELRY_WATCH_REPAIR]: {
    id: RepairIndustry.JEWELRY_WATCH_REPAIR,
    name: "Jewelry & Watch Repair",
    description: "Repairs for jewelry and timepieces.",
    icon: Gem,
    defaultTicketForm: "/tickets/new/jewelry-watch",
    deviceAttributesSchema: [
      {
        name: "item_material",
        label: "Material",
        type: "text",
        options: ["Gold", "Silver", "Platinum", "Stainless Steel", "Other"],
      },
      { name: "stone_type", label: "Stone Type (if any)", type: "text" },
    ],
    ticketCustomFieldsSchema: [{ name: "engraving_details", label: "Engraving Details", type: "text" }],
  },
  [RepairIndustry.VACUUM_ROBOT_REPAIR]: {
    id: RepairIndustry.VACUUM_ROBOT_REPAIR,
    name: "Vacuum & Robot Repair",
    description: "Repairs for robotic vacuums and other domestic robots.",
    icon: Bot,
    defaultTicketForm: "/tickets/new/vacuum-robot",
    deviceAttributesSchema: [
      { name: "robot_model", label: "Robot Model", type: "text", required: true },
      { name: "robot_serial", label: "Robot Serial", type: "text" },
    ],
    ticketCustomFieldsSchema: [{ name: "error_code_robot", label: "Error Code Displayed", type: "text" }],
  },
  [RepairIndustry.DRONE_REPAIR]: {
    id: RepairIndustry.DRONE_REPAIR,
    name: "Drone Repair",
    description: "Repairs for consumer and commercial drones.",
    icon: Wind, // Using Wind as a proxy for drone flight
    defaultTicketForm: "/tickets/new/drone",
    deviceAttributesSchema: [
      { name: "drone_model", label: "Drone Model", type: "text", required: true },
      { name: "drone_serial", label: "Drone Serial", type: "text" },
    ],
    ticketCustomFieldsSchema: [
      { name: "flight_controller_logs_available", label: "Flight Logs Available?", type: "boolean" },
    ],
  },
  [RepairIndustry.CAMERA_REPAIR]: {
    id: RepairIndustry.CAMERA_REPAIR,
    name: "Camera Repair",
    description: "Repairs for digital and film cameras, lenses.",
    icon: Camera,
    defaultTicketForm: "/tickets/new/camera",
    deviceAttributesSchema: [
      { name: "camera_model", label: "Camera/Lens Model", type: "text", required: true },
      { name: "camera_serial", label: "Serial Number", type: "text" },
    ],
    ticketCustomFieldsSchema: [{ name: "shutter_count", label: "Shutter Count (if applicable)", type: "number" }],
  },
  [RepairIndustry.POWER_TOOL_REPAIR]: {
    id: RepairIndustry.POWER_TOOL_REPAIR,
    name: "Power Tool Repair",
    description: "Repairs for electric and pneumatic power tools.",
    icon: Drill,
    defaultTicketForm: "/tickets/new/power-tool",
    deviceAttributesSchema: [
      { name: "tool_model", label: "Tool Model", type: "text", required: true },
      { name: "tool_serial", label: "Tool Serial", type: "text" },
    ],
    ticketCustomFieldsSchema: [{ name: "battery_included", label: "Battery Included?", type: "boolean" }],
  },
  [RepairIndustry.INDUSTRIAL_REPAIR]: {
    id: RepairIndustry.INDUSTRIAL_REPAIR,
    name: "Industrial Maintenance & Repair",
    description: "Comprehensive maintenance and repair for industrial equipment and facilities.",
    icon: Wrench, // Or a more specific industrial icon like Factory or HardHat from Lucide if available
    defaultTicketForm: "/tickets/new/industrial",
    deviceTypes: [
      // Examples of "equipment" types
      "Manufacturing Equipment",
      "HVAC Systems (Industrial)",
      "Pumps & Compressors",
      "Electrical Systems",
      "Robotics & Automation",
      "Heavy Machinery",
      "Production Lines",
      "Facility Infrastructure",
    ],
    deviceAttributesSchema: [
      { name: "equipment_type", label: "Equipment Type", type: "text", required: true },
      { name: "asset_tag", label: "Asset Tag / ID", type: "text", required: true },
      { name: "manufacturer", label: "Manufacturer", type: "text" },
      { name: "model_number", label: "Model Number", type: "text" },
      { name: "serial_number", label: "Serial Number", type: "text" },
      { name: "installation_date", label: "Installation Date", type: "text" }, // Consider date picker
      { name: "location_in_plant", label: "Location/Zone in Plant", type: "text", required: true },
      {
        name: "criticality_level",
        label: "Criticality Level",
        type: "select",
        options: ["Low", "Medium", "High", "Critical"],
        required: false,
      },
    ],
    ticketCustomFieldsSchema: [
      {
        name: "maintenance_type",
        label: "Maintenance Type",
        type: "select",
        options: ["Preventive", "Corrective", "Predictive", "Emergency"],
        required: true,
      },
      {
        name: "service_frequency",
        label: "Service Frequency",
        type: "select",
        options: ["As Needed", "Daily", "Weekly", "Monthly", "Quarterly", "Semi-Annually", "Annually"],
        required: false,
      },
      { name: "reported_by", label: "Reported By (Operator/Dept)", type: "text" },
      { name: "downtime_hours_expected", label: "Expected Downtime (Hours)", type: "number" },
      { name: "safety_permit_required", label: "Safety Permit Required?", type: "boolean" },
      { name: "work_order_number_client", label: "Client Work Order #", type: "text" },
      { name: "last_serviced_date", label: "Last Serviced Date", type: "text" }, // Consider date picker
    ],
    requiresSerialNumber: true, // Or false, depending on common industrial assets
    requiresIMEI: false,
    requiresVIN: false,
  },
}

export function getIndustryConfig(industry: RepairIndustry): IndustryConfig | undefined {
  return industryConfigurations[industry]
}

export function getAllIndustries(): IndustryConfig[] {
  return Object.values(industryConfigurations)
}
