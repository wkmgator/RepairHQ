export interface LabelTemplate {
  id: string
  name: string
  industry: string
  type: "sticker" | "label" | "tag" | "receipt"
  size: {
    width: number
    height: number
    unit: "mm" | "inch"
  }
  fields: LabelField[]
  layout: LabelLayout
  printSettings: PrintSettings
}

export interface LabelField {
  id: string
  name: string
  type: "text" | "number" | "date" | "qr" | "barcode" | "image"
  required: boolean
  defaultValue?: string
  validation?: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  style: FieldStyle
}

export interface LabelLayout {
  background?: string
  border?: BorderStyle
  margins: { top: number; right: number; bottom: number; left: number }
  orientation: "portrait" | "landscape"
}

export interface FieldStyle {
  fontFamily: string
  fontSize: number
  fontWeight: "normal" | "bold"
  color: string
  alignment: "left" | "center" | "right"
  backgroundColor?: string
}

export interface BorderStyle {
  width: number
  style: "solid" | "dashed" | "dotted"
  color: string
  radius?: number
}

export interface PrintSettings {
  printerType: "thermal" | "laserjet" | "inkjet"
  paperType: "label" | "sticker" | "standard"
  quality: "draft" | "normal" | "high"
  copies: number
}

// Oil Change Windshield Sticker Template
export const OIL_CHANGE_WINDSHIELD_STICKER: LabelTemplate = {
  id: "oil_change_windshield",
  name: "Oil Change Windshield Sticker",
  industry: "automotive",
  type: "sticker",
  size: { width: 76, height: 51, unit: "mm" }, // 3" x 2"
  fields: [
    {
      id: "business_name",
      name: "Business Name",
      type: "text",
      required: true,
      position: { x: 5, y: 5 },
      size: { width: 66, height: 8 },
      style: {
        fontFamily: "Arial",
        fontSize: 12,
        fontWeight: "bold",
        color: "#000000",
        alignment: "center",
      },
    },
    {
      id: "business_phone",
      name: "Phone Number",
      type: "text",
      required: true,
      position: { x: 5, y: 15 },
      size: { width: 66, height: 6 },
      style: {
        fontFamily: "Arial",
        fontSize: 8,
        fontWeight: "normal",
        color: "#000000",
        alignment: "center",
      },
    },
    {
      id: "service_title",
      name: "Service Title",
      type: "text",
      required: true,
      defaultValue: "OIL CHANGE",
      position: { x: 5, y: 25 },
      size: { width: 40, height: 6 },
      style: {
        fontFamily: "Arial",
        fontSize: 10,
        fontWeight: "bold",
        color: "#000000",
        alignment: "left",
      },
    },
    {
      id: "service_date",
      name: "Service Date",
      type: "date",
      required: true,
      position: { x: 5, y: 32 },
      size: { width: 40, height: 4 },
      style: {
        fontFamily: "Arial",
        fontSize: 7,
        fontWeight: "normal",
        color: "#000000",
        alignment: "left",
      },
    },
    {
      id: "current_mileage",
      name: "Current Mileage",
      type: "number",
      required: true,
      position: { x: 5, y: 37 },
      size: { width: 40, height: 4 },
      style: {
        fontFamily: "Arial",
        fontSize: 7,
        fontWeight: "normal",
        color: "#000000",
        alignment: "left",
      },
    },
    {
      id: "next_service",
      name: "Next Service",
      type: "text",
      required: true,
      position: { x: 5, y: 42 },
      size: { width: 40, height: 4 },
      style: {
        fontFamily: "Arial",
        fontSize: 7,
        fontWeight: "bold",
        color: "#FF0000",
        alignment: "left",
      },
    },
    {
      id: "qr_code",
      name: "QR Code",
      type: "qr",
      required: false,
      position: { x: 50, y: 25 },
      size: { width: 20, height: 20 },
      style: {
        fontFamily: "Arial",
        fontSize: 8,
        fontWeight: "normal",
        color: "#000000",
        alignment: "center",
      },
    },
  ],
  layout: {
    border: {
      width: 1,
      style: "solid",
      color: "#000000",
      radius: 2,
    },
    margins: { top: 2, right: 2, bottom: 2, left: 2 },
    orientation: "landscape",
  },
  printSettings: {
    printerType: "laserjet",
    paperType: "sticker",
    quality: "high",
    copies: 1,
  },
}

// Automotive Service Label Template
export const AUTOMOTIVE_SERVICE_LABEL: LabelTemplate = {
  id: "automotive_service",
  name: "Automotive Service Label",
  industry: "automotive",
  type: "label",
  size: { width: 102, height: 76, unit: "mm" }, // 4" x 3"
  fields: [
    {
      id: "vehicle_info",
      name: "Vehicle Information",
      type: "text",
      required: true,
      position: { x: 5, y: 5 },
      size: { width: 92, height: 12 },
      style: {
        fontFamily: "Arial",
        fontSize: 10,
        fontWeight: "bold",
        color: "#000000",
        alignment: "left",
      },
    },
    {
      id: "vin_number",
      name: "VIN Number",
      type: "text",
      required: true,
      position: { x: 5, y: 20 },
      size: { width: 92, height: 8 },
      style: {
        fontFamily: "Courier",
        fontSize: 8,
        fontWeight: "normal",
        color: "#000000",
        alignment: "left",
      },
    },
    {
      id: "service_description",
      name: "Service Description",
      type: "text",
      required: true,
      position: { x: 5, y: 30 },
      size: { width: 60, height: 20 },
      style: {
        fontFamily: "Arial",
        fontSize: 8,
        fontWeight: "normal",
        color: "#000000",
        alignment: "left",
      },
    },
    {
      id: "technician",
      name: "Technician",
      type: "text",
      required: true,
      position: { x: 5, y: 55 },
      size: { width: 60, height: 6 },
      style: {
        fontFamily: "Arial",
        fontSize: 8,
        fontWeight: "normal",
        color: "#000000",
        alignment: "left",
      },
    },
    {
      id: "completion_date",
      name: "Completion Date",
      type: "date",
      required: true,
      position: { x: 5, y: 65 },
      size: { width: 60, height: 6 },
      style: {
        fontFamily: "Arial",
        fontSize: 8,
        fontWeight: "normal",
        color: "#000000",
        alignment: "left",
      },
    },
    {
      id: "service_qr",
      name: "Service QR Code",
      type: "qr",
      required: false,
      position: { x: 70, y: 30 },
      size: { width: 25, height: 25 },
      style: {
        fontFamily: "Arial",
        fontSize: 8,
        fontWeight: "normal",
        color: "#000000",
        alignment: "center",
      },
    },
  ],
  layout: {
    border: {
      width: 2,
      style: "solid",
      color: "#000000",
    },
    margins: { top: 3, right: 3, bottom: 3, left: 3 },
    orientation: "landscape",
  },
  printSettings: {
    printerType: "laserjet",
    paperType: "label",
    quality: "high",
    copies: 1,
  },
}

// Tire Service Sticker Template
export const TIRE_SERVICE_STICKER: LabelTemplate = {
  id: "tire_service_sticker",
  name: "Tire Service Sticker",
  industry: "automotive",
  type: "sticker",
  size: { width: 64, height: 38, unit: "mm" }, // 2.5" x 1.5"
  fields: [
    {
      id: "tire_brand",
      name: "Tire Brand",
      type: "text",
      required: true,
      position: { x: 3, y: 3 },
      size: { width: 58, height: 6 },
      style: {
        fontFamily: "Arial",
        fontSize: 9,
        fontWeight: "bold",
        color: "#000000",
        alignment: "center",
      },
    },
    {
      id: "tire_size",
      name: "Tire Size",
      type: "text",
      required: true,
      position: { x: 3, y: 12 },
      size: { width: 58, height: 6 },
      style: {
        fontFamily: "Arial",
        fontSize: 8,
        fontWeight: "normal",
        color: "#000000",
        alignment: "center",
      },
    },
    {
      id: "installation_date",
      name: "Installation Date",
      type: "date",
      required: true,
      position: { x: 3, y: 20 },
      size: { width: 30, height: 5 },
      style: {
        fontFamily: "Arial",
        fontSize: 7,
        fontWeight: "normal",
        color: "#000000",
        alignment: "left",
      },
    },
    {
      id: "mileage_installed",
      name: "Mileage at Installation",
      type: "number",
      required: true,
      position: { x: 3, y: 27 },
      size: { width: 30, height: 5 },
      style: {
        fontFamily: "Arial",
        fontSize: 7,
        fontWeight: "normal",
        color: "#000000",
        alignment: "left",
      },
    },
    {
      id: "tire_barcode",
      name: "Tire Barcode",
      type: "barcode",
      required: false,
      position: { x: 35, y: 20 },
      size: { width: 25, height: 12 },
      style: {
        fontFamily: "Arial",
        fontSize: 6,
        fontWeight: "normal",
        color: "#000000",
        alignment: "center",
      },
    },
  ],
  layout: {
    border: {
      width: 1,
      style: "solid",
      color: "#000000",
    },
    margins: { top: 1, right: 1, bottom: 1, left: 1 },
    orientation: "landscape",
  },
  printSettings: {
    printerType: "laserjet",
    paperType: "sticker",
    quality: "normal",
    copies: 4, // One for each tire
  },
}

// Phone Repair Warranty Sticker
export const PHONE_REPAIR_WARRANTY: LabelTemplate = {
  id: "phone_repair_warranty",
  name: "Phone Repair Warranty Sticker",
  industry: "electronics",
  type: "sticker",
  size: { width: 51, height: 25, unit: "mm" }, // 2" x 1"
  fields: [
    {
      id: "repair_type",
      name: "Repair Type",
      type: "text",
      required: true,
      position: { x: 2, y: 2 },
      size: { width: 47, height: 5 },
      style: {
        fontFamily: "Arial",
        fontSize: 8,
        fontWeight: "bold",
        color: "#000000",
        alignment: "center",
      },
    },
    {
      id: "warranty_period",
      name: "Warranty Period",
      type: "text",
      required: true,
      position: { x: 2, y: 9 },
      size: { width: 30, height: 4 },
      style: {
        fontFamily: "Arial",
        fontSize: 6,
        fontWeight: "normal",
        color: "#000000",
        alignment: "left",
      },
    },
    {
      id: "expiry_date",
      name: "Expiry Date",
      type: "date",
      required: true,
      position: { x: 2, y: 15 },
      size: { width: 30, height: 4 },
      style: {
        fontFamily: "Arial",
        fontSize: 6,
        fontWeight: "normal",
        color: "#FF0000",
        alignment: "left",
      },
    },
    {
      id: "warranty_qr",
      name: "Warranty QR",
      type: "qr",
      required: false,
      position: { x: 35, y: 8 },
      size: { width: 12, height: 12 },
      style: {
        fontFamily: "Arial",
        fontSize: 5,
        fontWeight: "normal",
        color: "#000000",
        alignment: "center",
      },
    },
  ],
  layout: {
    border: {
      width: 1,
      style: "solid",
      color: "#000000",
    },
    margins: { top: 1, right: 1, bottom: 1, left: 1 },
    orientation: "landscape",
  },
  printSettings: {
    printerType: "laserjet",
    paperType: "sticker",
    quality: "high",
    copies: 1,
  },
}

// Appliance Service Tag
export const APPLIANCE_SERVICE_TAG: LabelTemplate = {
  id: "appliance_service_tag",
  name: "Appliance Service Tag",
  industry: "appliance",
  type: "tag",
  size: { width: 89, height: 51, unit: "mm" }, // 3.5" x 2"
  fields: [
    {
      id: "appliance_type",
      name: "Appliance Type",
      type: "text",
      required: true,
      position: { x: 5, y: 5 },
      size: { width: 79, height: 8 },
      style: {
        fontFamily: "Arial",
        fontSize: 12,
        fontWeight: "bold",
        color: "#000000",
        alignment: "center",
      },
    },
    {
      id: "model_number",
      name: "Model Number",
      type: "text",
      required: true,
      position: { x: 5, y: 16 },
      size: { width: 50, height: 6 },
      style: {
        fontFamily: "Arial",
        fontSize: 8,
        fontWeight: "normal",
        color: "#000000",
        alignment: "left",
      },
    },
    {
      id: "serial_number",
      name: "Serial Number",
      type: "text",
      required: true,
      position: { x: 5, y: 24 },
      size: { width: 50, height: 6 },
      style: {
        fontFamily: "Courier",
        fontSize: 8,
        fontWeight: "normal",
        color: "#000000",
        alignment: "left",
      },
    },
    {
      id: "service_date",
      name: "Service Date",
      type: "date",
      required: true,
      position: { x: 5, y: 32 },
      size: { width: 50, height: 6 },
      style: {
        fontFamily: "Arial",
        fontSize: 8,
        fontWeight: "normal",
        color: "#000000",
        alignment: "left",
      },
    },
    {
      id: "next_maintenance",
      name: "Next Maintenance",
      type: "date",
      required: false,
      position: { x: 5, y: 40 },
      size: { width: 50, height: 6 },
      style: {
        fontFamily: "Arial",
        fontSize: 8,
        fontWeight: "bold",
        color: "#0066CC",
        alignment: "left",
      },
    },
    {
      id: "service_barcode",
      name: "Service Barcode",
      type: "barcode",
      required: false,
      position: { x: 60, y: 16 },
      size: { width: 25, height: 25 },
      style: {
        fontFamily: "Arial",
        fontSize: 6,
        fontWeight: "normal",
        color: "#000000",
        alignment: "center",
      },
    },
  ],
  layout: {
    border: {
      width: 2,
      style: "solid",
      color: "#0066CC",
    },
    margins: { top: 2, right: 2, bottom: 2, left: 2 },
    orientation: "landscape",
  },
  printSettings: {
    printerType: "laserjet",
    paperType: "label",
    quality: "high",
    copies: 1,
  },
}

// Export all templates
export const INDUSTRY_LABEL_TEMPLATES: Record<string, LabelTemplate[]> = {
  automotive: [OIL_CHANGE_WINDSHIELD_STICKER, AUTOMOTIVE_SERVICE_LABEL, TIRE_SERVICE_STICKER],
  electronics: [PHONE_REPAIR_WARRANTY],
  appliance: [APPLIANCE_SERVICE_TAG],
}

// Template registry for easy access
export class LabelTemplateRegistry {
  private static templates: Map<string, LabelTemplate> = new Map()

  static {
    // Register all templates
    Object.values(INDUSTRY_LABEL_TEMPLATES)
      .flat()
      .forEach((template) => {
        this.templates.set(template.id, template)
      })
  }

  static getTemplate(id: string): LabelTemplate | undefined {
    return this.templates.get(id)
  }

  static getTemplatesByIndustry(industry: string): LabelTemplate[] {
    return INDUSTRY_LABEL_TEMPLATES[industry] || []
  }

  static getAllTemplates(): LabelTemplate[] {
    return Array.from(this.templates.values())
  }

  static registerTemplate(template: LabelTemplate): void {
    this.templates.set(template.id, template)
  }
}
