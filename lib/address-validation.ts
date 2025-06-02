export interface AddressValidationResult {
  isValid: boolean
  formattedAddress?: FormattedAddress
  suggestions?: FormattedAddress[]
  errorMessage?: string
  confidence?: number
}

export interface FormattedAddress {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  countryCode: string
  latitude?: number
  longitude?: number
  fullAddress?: string
}

export interface AddressComponents {
  street?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export class AddressValidationService {
  private static readonly GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  private static readonly MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_API_KEY

  static async validateAddress(
    address: string | AddressComponents,
    country?: string,
  ): Promise<AddressValidationResult> {
    try {
      let addressString: string

      if (typeof address === "string") {
        addressString = address
      } else {
        addressString = this.buildAddressString(address)
      }

      if (!addressString.trim()) {
        return {
          isValid: false,
          errorMessage: "Address is required",
        }
      }

      // Try Google Maps Geocoding API first
      if (this.GOOGLE_MAPS_API_KEY) {
        const googleResult = await this.validateWithGoogle(addressString, country)
        if (googleResult.isValid) {
          return googleResult
        }
      }

      // Fallback to Mapbox
      if (this.MAPBOX_API_KEY) {
        return await this.validateWithMapbox(addressString, country)
      }

      // Basic validation fallback
      return this.basicAddressValidation(addressString)
    } catch (error) {
      return {
        isValid: false,
        errorMessage: "Address validation service unavailable",
      }
    }
  }

  private static async validateWithGoogle(address: string, country?: string): Promise<AddressValidationResult> {
    try {
      const params = new URLSearchParams({
        address: address,
        key: this.GOOGLE_MAPS_API_KEY!,
      })

      if (country) {
        params.append("components", `country:${country}`)
      }

      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`)

      const data = await response.json()

      if (data.status !== "OK" || !data.results?.length) {
        return {
          isValid: false,
          errorMessage: "Address not found",
        }
      }

      const result = data.results[0]
      const components = result.address_components
      const geometry = result.geometry

      const formattedAddress: FormattedAddress = {
        street: this.extractComponent(components, ["street_number", "route"]),
        city: this.extractComponent(components, ["locality", "administrative_area_level_2"]),
        state: this.extractComponent(components, ["administrative_area_level_1"]),
        postalCode: this.extractComponent(components, ["postal_code"]),
        country: this.extractComponent(components, ["country"]),
        countryCode: this.extractComponent(components, ["country"], "short_name"),
        latitude: geometry.location.lat,
        longitude: geometry.location.lng,
        fullAddress: result.formatted_address,
      }

      return {
        isValid: true,
        formattedAddress,
        confidence: this.calculateConfidence(result.types),
      }
    } catch (error) {
      throw new Error("Google Maps validation failed")
    }
  }

  private static async validateWithMapbox(address: string, country?: string): Promise<AddressValidationResult> {
    try {
      const params = new URLSearchParams({
        access_token: this.MAPBOX_API_KEY!,
        limit: "1",
      })

      if (country) {
        params.append("country", country.toLowerCase())
      }

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?${params}`,
      )

      const data = await response.json()

      if (!data.features?.length) {
        return {
          isValid: false,
          errorMessage: "Address not found",
        }
      }

      const feature = data.features[0]
      const context = feature.context || []

      const formattedAddress: FormattedAddress = {
        street: feature.address ? `${feature.address} ${feature.text}` : feature.text,
        city: this.extractMapboxContext(context, "place"),
        state: this.extractMapboxContext(context, "region"),
        postalCode: this.extractMapboxContext(context, "postcode"),
        country: this.extractMapboxContext(context, "country"),
        countryCode: this.extractMapboxContext(context, "country", true),
        latitude: feature.center[1],
        longitude: feature.center[0],
        fullAddress: feature.place_name,
      }

      return {
        isValid: true,
        formattedAddress,
        confidence: feature.relevance || 0.8,
      }
    } catch (error) {
      throw new Error("Mapbox validation failed")
    }
  }

  private static basicAddressValidation(address: string): AddressValidationResult {
    // Basic regex-based validation for common patterns
    const patterns = {
      US: /^(\d+\s+[\w\s]+),\s*([\w\s]+),\s*([A-Z]{2})\s*(\d{5}(-\d{4})?)?$/,
      CA: /^(\d+\s+[\w\s]+),\s*([\w\s]+),\s*([A-Z]{2})\s*([A-Z]\d[A-Z]\s*\d[A-Z]\d)?$/,
      UK: /^([\w\s]+),\s*([\w\s]+),\s*([\w\s]+)\s*([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})?$/,
    }

    // Try to match common patterns
    for (const [country, pattern] of Object.entries(patterns)) {
      const match = address.match(pattern)
      if (match) {
        return {
          isValid: true,
          formattedAddress: {
            street: match[1] || "",
            city: match[2] || "",
            state: match[3] || "",
            postalCode: match[4] || "",
            country: country === "UK" ? "United Kingdom" : country === "CA" ? "Canada" : "United States",
            countryCode: country === "UK" ? "GB" : country,
            fullAddress: address,
          },
          confidence: 0.6, // Lower confidence for basic validation
        }
      }
    }

    return {
      isValid: false,
      errorMessage: "Unable to validate address format",
    }
  }

  private static buildAddressString(components: AddressComponents): string {
    const parts = [
      components.street,
      components.city,
      components.state,
      components.postalCode,
      components.country,
    ].filter(Boolean)

    return parts.join(", ")
  }

  private static extractComponent(
    components: any[],
    types: string[],
    nameType: "long_name" | "short_name" = "long_name",
  ): string {
    for (const component of components) {
      for (const type of types) {
        if (component.types.includes(type)) {
          return component[nameType] || ""
        }
      }
    }
    return ""
  }

  private static extractMapboxContext(context: any[], type: string, shortName = false): string {
    const item = context.find((ctx) => ctx.id.startsWith(type))
    if (!item) return ""

    if (shortName && item.short_code) {
      return item.short_code.replace(/^[^-]+-/, "") // Remove prefix
    }

    return item.text || ""
  }

  private static calculateConfidence(types: string[]): number {
    // Higher confidence for more specific address types
    const highConfidenceTypes = ["street_address", "premise"]
    const mediumConfidenceTypes = ["route", "intersection"]
    const lowConfidenceTypes = ["neighborhood", "locality"]

    if (types.some((type) => highConfidenceTypes.includes(type))) return 0.95
    if (types.some((type) => mediumConfidenceTypes.includes(type))) return 0.8
    if (types.some((type) => lowConfidenceTypes.includes(type))) return 0.6

    return 0.4
  }

  // Geolocation utilities
  static async getCurrentLocation(): Promise<{
    latitude: number
    longitude: number
    accuracy: number
  } | null> {
    if (!navigator.geolocation) {
      return null
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          })
        },
        () => resolve(null),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      )
    })
  }

  static async reverseGeocode(latitude: number, longitude: number): Promise<FormattedAddress | null> {
    try {
      if (this.GOOGLE_MAPS_API_KEY) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${this.GOOGLE_MAPS_API_KEY}`,
        )

        const data = await response.json()

        if (data.status === "OK" && data.results?.length) {
          const result = data.results[0]
          const components = result.address_components

          return {
            street: this.extractComponent(components, ["street_number", "route"]),
            city: this.extractComponent(components, ["locality", "administrative_area_level_2"]),
            state: this.extractComponent(components, ["administrative_area_level_1"]),
            postalCode: this.extractComponent(components, ["postal_code"]),
            country: this.extractComponent(components, ["country"]),
            countryCode: this.extractComponent(components, ["country"], "short_name"),
            latitude,
            longitude,
            fullAddress: result.formatted_address,
          }
        }
      }

      return null
    } catch (error) {
      return null
    }
  }
}
