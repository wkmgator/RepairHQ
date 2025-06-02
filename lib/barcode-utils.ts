import { nanoid } from "nanoid"

// Barcode types
export enum BarcodeType {
  EAN13 = "EAN-13",
  CODE128 = "CODE-128",
  QR = "QR",
  UPC = "UPC-A",
}

// Generate a random barcode
export function generateBarcode(type: BarcodeType = BarcodeType.CODE128, prefix = ""): string {
  switch (type) {
    case BarcodeType.EAN13:
      return generateEAN13(prefix)
    case BarcodeType.UPC:
      return generateUPC(prefix)
    case BarcodeType.CODE128:
      return generateCode128(prefix)
    case BarcodeType.QR:
      return generateQRContent(prefix)
    default:
      return generateCode128(prefix)
  }
}

// Generate EAN-13 barcode
function generateEAN13(prefix = ""): string {
  // EAN-13 starts with a 2-3 digit country code
  const countryCode = prefix || "500" // Default to UK (500-509)

  // Generate random digits for the rest of the barcode
  let digits = countryCode
  while (digits.length < 12) {
    digits += Math.floor(Math.random() * 10).toString()
  }

  // Calculate check digit
  const checkDigit = calculateEAN13CheckDigit(digits)

  return digits + checkDigit
}

// Calculate EAN-13 check digit
function calculateEAN13CheckDigit(digits: string): string {
  let sum = 0

  for (let i = 0; i < 12; i++) {
    const digit = Number.parseInt(digits[i])
    sum += i % 2 === 0 ? digit : digit * 3
  }

  const checkDigit = (10 - (sum % 10)) % 10
  return checkDigit.toString()
}

// Generate UPC-A barcode
function generateUPC(prefix = ""): string {
  // UPC-A is 12 digits
  const manufacturerCode = prefix || "72527" // Default prefix

  // Generate random digits for the rest of the barcode
  let digits = manufacturerCode
  while (digits.length < 11) {
    digits += Math.floor(Math.random() * 10).toString()
  }

  // Calculate check digit
  const checkDigit = calculateUPCCheckDigit(digits)

  return digits + checkDigit
}

// Calculate UPC-A check digit
function calculateUPCCheckDigit(digits: string): string {
  let sum = 0

  for (let i = 0; i < 11; i++) {
    const digit = Number.parseInt(digits[i])
    sum += i % 2 === 0 ? digit * 3 : digit
  }

  const checkDigit = (10 - (sum % 10)) % 10
  return checkDigit.toString()
}

// Generate CODE-128 barcode
function generateCode128(prefix = ""): string {
  // CODE-128 can encode all ASCII characters
  const randomPart = nanoid(8).toUpperCase()
  return `${prefix}${randomPart}`
}

// Generate QR code content
function generateQRContent(prefix = ""): string {
  // QR codes can contain various data
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}${timestamp}${random}`.toUpperCase()
}

// Validate barcode format
export function validateBarcode(barcode: string, type: BarcodeType): boolean {
  switch (type) {
    case BarcodeType.EAN13:
      return validateEAN13(barcode)
    case BarcodeType.UPC:
      return validateUPC(barcode)
    case BarcodeType.CODE128:
      // CODE-128 can encode any ASCII character, so we just check length
      return barcode.length >= 6
    case BarcodeType.QR:
      // QR can contain any data, so we just check it's not empty
      return barcode.length > 0
    default:
      return false
  }
}

// Validate EAN-13 barcode
function validateEAN13(barcode: string): boolean {
  // EAN-13 is 13 digits
  if (!/^\d{13}$/.test(barcode)) {
    return false
  }

  // Check the check digit
  const digits = barcode.substring(0, 12)
  const checkDigit = barcode[12]

  return calculateEAN13CheckDigit(digits) === checkDigit
}

// Validate UPC-A barcode
function validateUPC(barcode: string): boolean {
  // UPC-A is 12 digits
  if (!/^\d{12}$/.test(barcode)) {
    return false
  }

  // Check the check digit
  const digits = barcode.substring(0, 11)
  const checkDigit = barcode[11]

  return calculateUPCCheckDigit(digits) === checkDigit
}

// Parse barcode to extract information
export function parseBarcode(barcode: string): { type: BarcodeType; data: any } | null {
  // Try to determine the barcode type and extract data
  if (/^\d{13}$/.test(barcode) && validateEAN13(barcode)) {
    return {
      type: BarcodeType.EAN13,
      data: {
        countryCode: barcode.substring(0, 3),
        manufacturerCode: barcode.substring(3, 7),
        productCode: barcode.substring(7, 12),
        checkDigit: barcode[12],
      },
    }
  } else if (/^\d{12}$/.test(barcode) && validateUPC(barcode)) {
    return {
      type: BarcodeType.UPC,
      data: {
        manufacturerCode: barcode.substring(0, 6),
        productCode: barcode.substring(6, 11),
        checkDigit: barcode[11],
      },
    }
  } else if (barcode.startsWith("http") || barcode.includes("://")) {
    return {
      type: BarcodeType.QR,
      data: {
        url: barcode,
      },
    }
  } else {
    // Default to CODE-128
    return {
      type: BarcodeType.CODE128,
      data: {
        value: barcode,
      },
    }
  }
}

// Generate a barcode for an inventory item
export function generateInventoryBarcode(category: string, sku: string): string {
  // Format: RHQ-{CATEGORY}-{SKU}-{RANDOM}
  const categoryCode = category.substring(0, 3).toUpperCase()
  const skuCode = sku
    .replace(/[^A-Z0-9]/gi, "")
    .substring(0, 6)
    .toUpperCase()
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")

  return `RHQ-${categoryCode}-${skuCode}-${random}`
}
