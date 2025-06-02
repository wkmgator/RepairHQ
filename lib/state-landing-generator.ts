export interface StateLocation {
  state: string
  name: string
  slug: string
  abbreviation: string
  timezone: string
  population: number
}

export const stateLocations: StateLocation[] = [
  {
    state: "Alabama",
    name: "Alabama",
    slug: "alabama-mobile-repair-software",
    abbreviation: "AL",
    timezone: "America/Chicago",
    population: 5024279,
  },
  {
    state: "Alaska",
    name: "Alaska",
    slug: "alaska-mobile-repair-software",
    abbreviation: "AK",
    timezone: "America/Anchorage",
    population: 733391,
  },
  {
    state: "Arizona",
    name: "Arizona",
    slug: "arizona-mobile-repair-software",
    abbreviation: "AZ",
    timezone: "America/Phoenix",
    population: 7151502,
  },
  {
    state: "Arkansas",
    name: "Arkansas",
    slug: "arkansas-mobile-repair-software",
    abbreviation: "AR",
    timezone: "America/Chicago",
    population: 3011524,
  },
  {
    state: "California",
    name: "California",
    slug: "california-mobile-repair-software",
    abbreviation: "CA",
    timezone: "America/Los_Angeles",
    population: 39538223,
  },
  {
    state: "Colorado",
    name: "Colorado",
    slug: "colorado-mobile-repair-software",
    abbreviation: "CO",
    timezone: "America/Denver",
    population: 5773714,
  },
  {
    state: "Connecticut",
    name: "Connecticut",
    slug: "connecticut-mobile-repair-software",
    abbreviation: "CT",
    timezone: "America/New_York",
    population: 3605944,
  },
  {
    state: "Delaware",
    name: "Delaware",
    slug: "delaware-mobile-repair-software",
    abbreviation: "DE",
    timezone: "America/New_York",
    population: 989948,
  },
  {
    state: "Florida",
    name: "Florida",
    slug: "florida-mobile-repair-software",
    abbreviation: "FL",
    timezone: "America/New_York",
    population: 21538187,
  },
  {
    state: "Georgia",
    name: "Georgia",
    slug: "georgia-mobile-repair-software",
    abbreviation: "GA",
    timezone: "America/New_York",
    population: 10711908,
  },
]

export function getStateSlugs(): string[] {
  return stateLocations.map((location) => location.slug)
}

export function getStateLocationBySlug(slug: string): StateLocation | undefined {
  return stateLocations.find((location) => location.slug === slug)
}

export function getStateLocations(): StateLocation[] {
  return stateLocations
}
