import { countryDatabase, CountryLandingPage } from "@/components/international-landing-generator"

export default function UAEPage() {
  const uaeData = countryDatabase.find((country) => country.code === "AE")!
  return <CountryLandingPage countryData={uaeData} />
}
