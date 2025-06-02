import { countryDatabase, CountryLandingPage } from "@/components/international-landing-generator"

export default function UkrainePage() {
  const ukraineData = countryDatabase.find((country) => country.code === "UA")!
  return <CountryLandingPage countryData={ukraineData} />
}
