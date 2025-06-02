export interface CityLocation {
  city: string
  state: string
  slug: string
  population: number
  timezone: string
}

export const cityLocations: CityLocation[] = [
  {
    city: "New York",
    state: "NY",
    slug: "new-york-mobile-repair-software",
    population: 8336817,
    timezone: "America/New_York",
  },
  {
    city: "Los Angeles",
    state: "CA",
    slug: "los-angeles-mobile-repair-software",
    population: 3979576,
    timezone: "America/Los_Angeles",
  },
  {
    city: "Chicago",
    state: "IL",
    slug: "chicago-mobile-repair-software",
    population: 2693976,
    timezone: "America/Chicago",
  },
  {
    city: "Houston",
    state: "TX",
    slug: "houston-mobile-repair-software",
    population: 2320268,
    timezone: "America/Chicago",
  },
  {
    city: "Phoenix",
    state: "AZ",
    slug: "phoenix-mobile-repair-software",
    population: 1680992,
    timezone: "America/Phoenix",
  },
  {
    city: "Philadelphia",
    state: "PA",
    slug: "philadelphia-mobile-repair-software",
    population: 1584064,
    timezone: "America/New_York",
  },
  {
    city: "San Antonio",
    state: "TX",
    slug: "san-antonio-mobile-repair-software",
    population: 1547253,
    timezone: "America/Chicago",
  },
  {
    city: "San Diego",
    state: "CA",
    slug: "san-diego-mobile-repair-software",
    population: 1423851,
    timezone: "America/Los_Angeles",
  },
  {
    city: "Dallas",
    state: "TX",
    slug: "dallas-mobile-repair-software",
    population: 1343573,
    timezone: "America/Chicago",
  },
  {
    city: "San Jose",
    state: "CA",
    slug: "san-jose-mobile-repair-software",
    population: 1021795,
    timezone: "America/Los_Angeles",
  },
]

export function getLocationSlugs(): string[] {
  return cityLocations.map((location) => location.slug)
}

export function getCityLocationBySlug(slug: string): CityLocation | undefined {
  return cityLocations.find((location) => location.slug === slug)
}

export function getCityLocations(): CityLocation[] {
  return cityLocations
}
