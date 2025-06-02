/**
 * VIN Decoder Service
 *
 * This service provides functions for validating and decoding Vehicle Identification Numbers (VINs).
 * It includes both local decoding for basic information and API integration for detailed vehicle data.
 */

import { createClient } from "@supabase/supabase-js"

// VIN structure constants
const VIN_LENGTH = 17
const ALLOWED_CHARS = /^[A-HJ-NPR-Z0-9]+$/ // VINs don't use I, O, or Q to avoid confusion
const WEIGHT_FACTORS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2]
const TRANSLITERATION: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  J: 1,
  K: 2,
  L: 3,
  M: 4,
  N: 5,
  P: 7,
  R: 9,
  S: 2,
  T: 3,
  U: 4,
  V: 5,
  W: 6,
  X: 7,
  Y: 8,
  Z: 9,
  "0": 0,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
}

// World Manufacturer Identifiers (WMI) - first 3 characters of VIN
const MANUFACTURER_CODES: Record<string, string> = {
  // North America
  "1G": "General Motors",
  "1J": "Jeep",
  "1C": "Chrysler",
  "1F": "Ford",
  "1H": "Honda",
  "1N": "Nissan",
  "1T": "Toyota",
  "1V": "Volkswagen",
  "1Y": "General Motors",
  "2G": "General Motors",
  "2T": "Toyota",
  "3G": "General Motors",
  "3H": "Honda",
  "3N": "Nissan",
  "3V": "Volkswagen",
  "4F": "Mazda",
  "4M": "Mercury",
  "4S": "Subaru",
  "4T": "Toyota",
  "5F": "Honda",
  "5L": "Lincoln",
  "5N": "Hyundai",
  "5T": "Toyota",
  "5Y": "Mazda",

  // Europe
  WA: "Audi",
  WB: "BMW",
  WD: "Mercedes-Benz",
  WF: "Ferrari",
  WM: "Mini",
  WP: "Porsche",
  WV: "Volkswagen",
  YV: "Volvo",
  ZA: "Alfa Romeo",
  ZF: "Ferrari",

  // Asia
  JA: "Isuzu",
  JF: "Fuji (Subaru)",
  JH: "Honda",
  JM: "Mazda",
  JN: "Nissan",
  JS: "Suzuki",
  JT: "Toyota",
  KL: "Daewoo/GM Korea",
  KM: "Hyundai",
  KN: "Kia",
  KP: "SsangYong",
  MA: "Mahindra",
  MR: "Mitsubishi",
  PE: "Ford",
  SH: "Honda",
  TM: "Hyundai",
}

// Model year codes - 10th character of VIN
const MODEL_YEAR_CODES: Record<string, string> = {
  A: "1980",
  B: "1981",
  C: "1982",
  D: "1983",
  E: "1984",
  F: "1985",
  G: "1986",
  H: "1987",
  J: "1988",
  K: "1989",
  L: "1990",
  M: "1991",
  N: "1992",
  P: "1993",
  R: "1994",
  S: "1995",
  T: "1996",
  V: "1997",
  W: "1998",
  X: "1999",
  Y: "2000",
  "1": "2001",
  "2": "2002",
  "3": "2003",
  "4": "2004",
  "5": "2005",
  "6": "2006",
  "7": "2007",
  "8": "2008",
  "9": "2009",
  A: "2010",
  B: "2011",
  C: "2012",
  D: "2013",
  E: "2014",
  F: "2015",
  G: "2016",
  H: "2017",
  J: "2018",
  K: "2019",
  L: "2020",
  M: "2021",
  N: "2022",
  P: "2023",
  R: "2024",
  S: "2025",
  T: "2026",
  V: "2027",
  W: "2028",
  X: "2029",
  Y: "2030",
}

// Plant codes - 11th character of VIN (simplified, varies by manufacturer)
const PLANT_CODES: Record<string, Record<string, string>> = {
  "General Motors": {
    A: "Atlanta, GA",
    B: "Baltimore, MD",
    C: "Southgate, CA",
    D: "Doraville, GA",
    E: "Linden, NJ",
    F: "Flint, MI",
    G: "Framingham, MA",
    H: "Lordstown, OH",
    J: "Janesville, WI",
    K: "Kansas City, KS",
    L: "Lansing, MI",
    M: "Pontiac, MI",
    N: "Norwood, OH",
    P: "Pontiac, MI",
    R: "Arlington, TX",
    S: "South Gate, CA",
    T: "Tarrytown, NY",
    U: "Wilmington, DE",
    V: "Bowling Green, KY",
    W: "Wentzville, MO",
    X: "Moraine, OH",
    Y: "Wilmington, DE",
    Z: "Fort Wayne, IN",
  },
  Ford: {
    A: "Atlanta, GA",
    B: "Oakville, Ontario",
    C: "Ontario, Canada",
    D: "Ohio",
    E: "Kentucky",
    F: "Dearborn, MI",
    G: "Chicago, IL",
    H: "Lorain, OH",
    J: "New Jersey",
    K: "Kansas City, MO",
    L: "Michigan",
    M: "Cuautitlan, Mexico",
    N: "Norfolk, VA",
    P: "Twin Cities, MN",
    R: "San Jose, CA",
    S: "St. Louis, MO",
    T: "Edison, NJ",
    U: "Louisville, KY",
    V: "Kansas City, MO",
    W: "Wayne, MI",
    X: "St. Thomas, Ontario",
    Y: "Wixom, MI",
    Z: "St. Louis, MO",
  },
  Toyota: {
    A: "Aichi, Japan",
    C: "Ontario, Canada",
    E: "Hino, Japan",
    J: "Japan",
    K: "Kariya, Japan",
    M: "Miyawaka, Japan",
    R: "Tahara, Japan",
    S: "Shimoyama, Japan",
    T: "Tsutsumi, Japan",
    U: "United Kingdom",
    W: "Motomachi, Japan",
    X: "Takaoka, Japan",
    Z: "Fremont, CA",
  },
}

// Types for VIN data
export interface VehicleInfo {
  vin: string
  manufacturer: string
  country: string
  year: string
  make: string
  model: string
  trim: string
  engine: string
  transmission: string
  bodyType: string
  driveTrain: string
  fuelType: string
  plantCode: string
  plantLocation: string
  serialNumber: string
  isValid: boolean
  validationMessage?: string
}

export interface VinLookupResult {
  success: boolean
  data?: VehicleInfo
  error?: string
}

// Initialize Supabase client for storing VIN history
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Validates a VIN using the check digit (9th character)
 * @param vin The VIN to validate
 * @returns Boolean indicating if the VIN is valid
 */
export function validateVin(vin: string): { isValid: boolean; message?: string } {
  // Check length
  if (vin.length !== VIN_LENGTH) {
    return { isValid: false, message: `VIN must be ${VIN_LENGTH} characters` }
  }

  // Check for valid characters
  if (!ALLOWED_CHARS.test(vin)) {
    return { isValid: false, message: "VIN contains invalid characters" }
  }

  // Check digit validation (North American standard)
  const checkDigit = vin.charAt(8)
  let sum = 0

  for (let i = 0; i < VIN_LENGTH; i++) {
    const char = vin.charAt(i)
    const value = TRANSLITERATION[char] || 0
    sum += value * WEIGHT_FACTORS[i]
  }

  const calculatedCheckDigit = sum % 11
  const expectedCheckDigit = calculatedCheckDigit === 10 ? "X" : calculatedCheckDigit.toString()

  if (checkDigit !== expectedCheckDigit) {
    return { isValid: false, message: "VIN check digit is invalid" }
  }

  return { isValid: true }
}

/**
 * Decodes basic information from a VIN locally
 * @param vin The VIN to decode
 * @returns Basic vehicle information
 */
export function decodeVinBasic(vin: string): Partial<VehicleInfo> {
  const validation = validateVin(vin)

  if (!validation.isValid) {
    return {
      vin,
      isValid: false,
      validationMessage: validation.message,
    }
  }

  // Extract World Manufacturer Identifier (first 3 characters)
  const wmi = vin.substring(0, 3)
  const wmiPrefix = vin.substring(0, 2)

  // Determine country of origin
  let country = "Unknown"
  if (wmi.charAt(0) === "1" || wmi.charAt(0) === "4" || wmi.charAt(0) === "5") {
    country = "United States"
  } else if (wmi.charAt(0) === "2") {
    country = "Canada"
  } else if (wmi.charAt(0) === "3") {
    country = "Mexico"
  } else if (wmi.charAt(0) === "J") {
    country = "Japan"
  } else if (wmi.charAt(0) === "K") {
    country = "Korea"
  } else if (wmi.charAt(0) === "L") {
    country = "China"
  } else if (wmi.charAt(0) === "S") {
    country = "United Kingdom"
  } else if (wmi.charAt(0) === "W") {
    country = "Germany"
  } else if (wmi.charAt(0) === "Y") {
    country = "Sweden"
  } else if (wmi.charAt(0) === "Z") {
    country = "Italy"
  }

  // Get manufacturer
  const manufacturer = MANUFACTURER_CODES[wmiPrefix] || "Unknown"

  // Get model year (10th character)
  const yearCode = vin.charAt(9)
  const year = MODEL_YEAR_CODES[yearCode] || "Unknown"

  // Get plant code (11th character)
  const plantCode = vin.charAt(10)
  const plantLocation = manufacturer in PLANT_CODES ? PLANT_CODES[manufacturer][plantCode] || "Unknown" : "Unknown"

  // Get serial number (last 6 characters)
  const serialNumber = vin.substring(11)

  return {
    vin,
    manufacturer,
    country,
    year,
    plantCode,
    plantLocation,
    serialNumber,
    isValid: true,
  }
}

/**
 * Fetches detailed vehicle information from an external API
 * @param vin The VIN to look up
 * @returns Promise with detailed vehicle information
 */
export async function fetchVehicleDetails(vin: string): Promise<VinLookupResult> {
  try {
    // First validate the VIN
    const validation = validateVin(vin)
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.message,
      }
    }

    // Get basic info from local decoding
    const basicInfo = decodeVinBasic(vin)

    // In a real implementation, you would call an external API here
    // For this example, we'll simulate an API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate API response based on manufacturer
    const manufacturer = basicInfo.manufacturer || "Unknown"
    let make = manufacturer
    let model = "Unknown"
    let trim = "Unknown"
    let engine = "Unknown"
    let transmission = "Unknown"
    let bodyType = "Unknown"
    let driveTrain = "Unknown"
    let fuelType = "Unknown"

    // Generate mock data based on VIN patterns
    if (manufacturer === "Toyota") {
      make = "Toyota"
      const modelCode = vin.substring(3, 5)
      if (modelCode === "A3") {
        model = "Camry"
        trim = vin.charAt(5) === "E" ? "XLE" : "LE"
        engine = "2.5L I4"
        transmission = vin.charAt(6) === "A" ? "Automatic" : "Manual"
        bodyType = "Sedan"
        driveTrain = "FWD"
        fuelType = "Gasoline"
      } else if (modelCode === "B4") {
        model = "RAV4"
        trim = vin.charAt(5) === "L" ? "Limited" : "XLE"
        engine = "2.5L I4"
        transmission = "Automatic"
        bodyType = "SUV"
        driveTrain = vin.charAt(6) === "A" ? "AWD" : "FWD"
        fuelType = vin.charAt(7) === "H" ? "Hybrid" : "Gasoline"
      }
    } else if (manufacturer === "Honda") {
      make = "Honda"
      const modelCode = vin.substring(3, 5)
      if (modelCode === "C5") {
        model = "Accord"
        trim = vin.charAt(5) === "E" ? "EX" : "LX"
        engine = vin.charAt(6) === "V" ? "3.5L V6" : "2.4L I4"
        transmission = vin.charAt(7) === "A" ? "Automatic" : "Manual"
        bodyType = "Sedan"
        driveTrain = "FWD"
        fuelType = "Gasoline"
      } else if (modelCode === "D2") {
        model = "CR-V"
        trim = vin.charAt(5) === "E" ? "EX-L" : "LX"
        engine = "2.4L I4"
        transmission = "Automatic"
        bodyType = "SUV"
        driveTrain = vin.charAt(6) === "A" ? "AWD" : "FWD"
        fuelType = "Gasoline"
      }
    } else if (manufacturer === "Ford") {
      make = "Ford"
      const modelCode = vin.substring(3, 5)
      if (modelCode === "P3") {
        model = "F-150"
        trim = vin.charAt(5) === "L" ? "Lariat" : "XLT"
        engine = vin.charAt(6) === "V" ? "5.0L V8" : "3.5L V6"
        transmission = "Automatic"
        bodyType = "Pickup"
        driveTrain = vin.charAt(7) === "4" ? "4WD" : "2WD"
        fuelType = "Gasoline"
      } else if (modelCode === "M5") {
        model = "Mustang"
        trim = vin.charAt(5) === "G" ? "GT" : "EcoBoost"
        engine = vin.charAt(6) === "V" ? "5.0L V8" : "2.3L I4"
        transmission = vin.charAt(7) === "A" ? "Automatic" : "Manual"
        bodyType = vin.charAt(8) === "C" ? "Convertible" : "Coupe"
        driveTrain = "RWD"
        fuelType = "Gasoline"
      }
    }

    // Combine basic and detailed info
    const vehicleInfo: VehicleInfo = {
      ...(basicInfo as VehicleInfo),
      make,
      model,
      trim,
      engine,
      transmission,
      bodyType,
      driveTrain,
      fuelType,
    }

    // Save to VIN history in Supabase
    await saveVinToHistory(vehicleInfo)

    return {
      success: true,
      data: vehicleInfo,
    }
  } catch (error) {
    console.error("Error fetching vehicle details:", error)
    return {
      success: false,
      error: "Failed to fetch vehicle details",
    }
  }
}

/**
 * Saves a VIN lookup to history
 * @param vehicleInfo The vehicle information to save
 */
async function saveVinToHistory(vehicleInfo: VehicleInfo) {
  try {
    const { error } = await supabase.from("vin_history").upsert(
      {
        vin: vehicleInfo.vin,
        manufacturer: vehicleInfo.manufacturer,
        year: vehicleInfo.year,
        make: vehicleInfo.make,
        model: vehicleInfo.model,
        last_lookup: new Date().toISOString(),
        lookup_count: 1,
        vehicle_data: vehicleInfo,
      },
      {
        onConflict: "vin",
        ignoreDuplicates: false,
      },
    )

    if (error) {
      console.error("Error saving VIN to history:", error)
    }
  } catch (error) {
    console.error("Error saving VIN to history:", error)
  }
}

/**
 * Gets VIN lookup history
 * @param limit Number of records to return
 * @returns Promise with VIN history
 */
export async function getVinHistory(limit = 10) {
  try {
    const { data, error } = await supabase
      .from("vin_history")
      .select("*")
      .order("last_lookup", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching VIN history:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching VIN history:", error)
    return { success: false, error: "Failed to fetch VIN history" }
  }
}

/**
 * Gets a specific VIN from history
 * @param vin The VIN to look up
 * @returns Promise with VIN data
 */
export async function getVinFromHistory(vin: string) {
  try {
    const { data, error } = await supabase.from("vin_history").select("*").eq("vin", vin).single()

    if (error) {
      console.error("Error fetching VIN from history:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching VIN from history:", error)
    return { success: false, error: "Failed to fetch VIN from history" }
  }
}
