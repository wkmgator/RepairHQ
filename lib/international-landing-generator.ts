export interface InternationalLocation {
  country: string
  slug: string
  name: string
  currency: string
  language: string
  timezone: string
}

export const internationalLocations: InternationalLocation[] = [
  {
    country: "CA",
    slug: "canada-mobile-repair-software",
    name: "Canada",
    currency: "CAD",
    language: "en",
    timezone: "America/Toronto",
  },
  {
    country: "UK",
    slug: "uk-mobile-repair-software",
    name: "United Kingdom",
    currency: "GBP",
    language: "en",
    timezone: "Europe/London",
  },
  {
    country: "AU",
    slug: "australia-mobile-repair-software",
    name: "Australia",
    currency: "AUD",
    language: "en",
    timezone: "Australia/Sydney",
  },
  {
    country: "DE",
    slug: "germany-mobile-repair-software",
    name: "Germany",
    currency: "EUR",
    language: "de",
    timezone: "Europe/Berlin",
  },
  {
    country: "FR",
    slug: "france-mobile-repair-software",
    name: "France",
    currency: "EUR",
    language: "fr",
    timezone: "Europe/Paris",
  },
  {
    country: "ES",
    slug: "spain-mobile-repair-software",
    name: "Spain",
    currency: "EUR",
    language: "es",
    timezone: "Europe/Madrid",
  },
  {
    country: "IT",
    slug: "italy-mobile-repair-software",
    name: "Italy",
    currency: "EUR",
    language: "it",
    timezone: "Europe/Rome",
  },
  {
    country: "NL",
    slug: "netherlands-mobile-repair-software",
    name: "Netherlands",
    currency: "EUR",
    language: "nl",
    timezone: "Europe/Amsterdam",
  },
  {
    country: "BR",
    slug: "brazil-mobile-repair-software",
    name: "Brazil",
    currency: "BRL",
    language: "pt",
    timezone: "America/Sao_Paulo",
  },
  {
    country: "MX",
    slug: "mexico-mobile-repair-software",
    name: "Mexico",
    currency: "MXN",
    language: "es",
    timezone: "America/Mexico_City",
  },
]

export function getInternationalLocations(): InternationalLocation[] {
  return internationalLocations
}

export function getInternationalLocationBySlug(slug: string): InternationalLocation | undefined {
  return internationalLocations.find((location) => location.slug === slug)
}
