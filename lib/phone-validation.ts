import { parsePhoneNumber, getCountryCallingCode, type CountryCode } from "libphonenumber-js"

export interface PhoneValidationResult {
  isValid: boolean
  formattedNumber?: string
  nationalNumber?: string
  internationalNumber?: string
  countryCode?: CountryCode
  errorMessage?: string
}

export interface PhoneConfig {
  country: CountryCode
  format: "national" | "international" | "e164" | "rfc3966"
  validateMobile?: boolean
}

export class PhoneValidationService {
  static validate(phoneNumber: string, country?: CountryCode): PhoneValidationResult {
    try {
      if (!phoneNumber?.trim()) {
        return {
          isValid: false,
          errorMessage: "Phone number is required",
        }
      }

      // Try to parse with country code first
      let parsedNumber
      if (country) {
        parsedNumber = parsePhoneNumber(phoneNumber, country)
      } else {
        // Try to parse without country (international format)
        parsedNumber = parsePhoneNumber(phoneNumber)
      }

      if (!parsedNumber) {
        return {
          isValid: false,
          errorMessage: "Invalid phone number format",
        }
      }

      const isValid = parsedNumber.isValid()

      if (!isValid) {
        return {
          isValid: false,
          errorMessage: "Phone number is not valid",
        }
      }

      return {
        isValid: true,
        formattedNumber: parsedNumber.formatNational(),
        nationalNumber: parsedNumber.formatNational(),
        internationalNumber: parsedNumber.formatInternational(),
        countryCode: parsedNumber.country,
      }
    } catch (error) {
      return {
        isValid: false,
        errorMessage: "Unable to validate phone number",
      }
    }
  }

  static formatPhone(phoneNumber: string, config: PhoneConfig): string {
    try {
      const parsedNumber = parsePhoneNumber(phoneNumber, config.country)

      if (!parsedNumber?.isValid()) {
        return phoneNumber // Return original if invalid
      }

      switch (config.format) {
        case "national":
          return parsedNumber.formatNational()
        case "international":
          return parsedNumber.formatInternational()
        case "e164":
          return parsedNumber.format("E.164")
        case "rfc3966":
          return parsedNumber.format("RFC3966")
        default:
          return parsedNumber.formatInternational()
      }
    } catch (error) {
      return phoneNumber
    }
  }

  static getCountryFromPhone(phoneNumber: string): CountryCode | undefined {
    try {
      const parsedNumber = parsePhoneNumber(phoneNumber)
      return parsedNumber?.country
    } catch (error) {
      return undefined
    }
  }

  static isMobileNumber(phoneNumber: string, country?: CountryCode): boolean {
    try {
      const parsedNumber = country ? parsePhoneNumber(phoneNumber, country) : parsePhoneNumber(phoneNumber)

      return parsedNumber?.getType() === "MOBILE" || parsedNumber?.getType() === "FIXED_LINE_OR_MOBILE"
    } catch (error) {
      return false
    }
  }

  static getCallingCode(country: CountryCode): string {
    try {
      return `+${getCountryCallingCode(country)}`
    } catch (error) {
      return ""
    }
  }

  // SMS verification methods
  static async sendSMSVerification(
    phoneNumber: string,
    country?: CountryCode,
  ): Promise<{
    success: boolean
    verificationId?: string
    error?: string
  }> {
    try {
      const validation = this.validate(phoneNumber, country)

      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errorMessage,
        }
      }

      // Send verification code via Twilio or similar service
      const response = await fetch("/api/sms/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: validation.internationalNumber,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Failed to send verification code",
        }
      }

      return {
        success: true,
        verificationId: result.verificationId,
      }
    } catch (error) {
      return {
        success: false,
        error: "Network error occurred",
      }
    }
  }

  static async verifySMSCode(
    verificationId: string,
    code: string,
  ): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      const response = await fetch("/api/sms/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          verificationId,
          code,
        }),
      })

      const result = await response.json()

      return {
        success: response.ok,
        error: response.ok ? undefined : result.error,
      }
    } catch (error) {
      return {
        success: false,
        error: "Network error occurred",
      }
    }
  }
}

export const countryPhoneData = {
  US: { code: "US" as CountryCode, flag: "🇺🇸", name: "United States", callingCode: "+1" },
  CA: { code: "CA" as CountryCode, flag: "🇨🇦", name: "Canada", callingCode: "+1" },
  GB: { code: "GB" as CountryCode, flag: "🇬🇧", name: "United Kingdom", callingCode: "+44" },
  AU: { code: "AU" as CountryCode, flag: "🇦🇺", name: "Australia", callingCode: "+61" },
  DE: { code: "DE" as CountryCode, flag: "🇩🇪", name: "Germany", callingCode: "+49" },
  FR: { code: "FR" as CountryCode, flag: "🇫🇷", name: "France", callingCode: "+33" },
  IT: { code: "IT" as CountryCode, flag: "🇮🇹", name: "Italy", callingCode: "+39" },
  ES: { code: "ES" as CountryCode, flag: "🇪🇸", name: "Spain", callingCode: "+34" },
  JP: { code: "JP" as CountryCode, flag: "🇯🇵", name: "Japan", callingCode: "+81" },
  KR: { code: "KR" as CountryCode, flag: "🇰🇷", name: "South Korea", callingCode: "+82" },
  CN: { code: "CN" as CountryCode, flag: "🇨🇳", name: "China", callingCode: "+86" },
  IN: { code: "IN" as CountryCode, flag: "🇮🇳", name: "India", callingCode: "+91" },
  BR: { code: "BR" as CountryCode, flag: "🇧🇷", name: "Brazil", callingCode: "+55" },
  MX: { code: "MX" as CountryCode, flag: "🇲🇽", name: "Mexico", callingCode: "+52" },
  RU: { code: "RU" as CountryCode, flag: "🇷🇺", name: "Russia", callingCode: "+7" },
  UA: { code: "UA" as CountryCode, flag: "🇺🇦", name: "Ukraine", callingCode: "+380" },
  PK: { code: "PK" as CountryCode, flag: "🇵🇰", name: "Pakistan", callingCode: "+92" },
  SA: { code: "SA" as CountryCode, flag: "🇸🇦", name: "Saudi Arabia", callingCode: "+966" },
  AE: { code: "AE" as CountryCode, flag: "🇦🇪", name: "UAE", callingCode: "+971" },
  TH: { code: "TH" as CountryCode, flag: "🇹🇭", name: "Thailand", callingCode: "+66" },
  VN: { code: "VN" as CountryCode, flag: "🇻🇳", name: "Vietnam", callingCode: "+84" },
  PL: { code: "PL" as CountryCode, flag: "🇵🇱", name: "Poland", callingCode: "+48" },
  TR: { code: "TR" as CountryCode, flag: "🇹🇷", name: "Turkey", callingCode: "+90" },
  IL: { code: "IL" as CountryCode, flag: "🇮🇱", name: "Israel", callingCode: "+972" },
} as const
