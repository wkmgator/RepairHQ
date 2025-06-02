import { countryDatabase, CountryLandingPage } from "@/components/international-landing-generator"

export default function BrazilPage() {
  const brazilData = countryDatabase.find((country) => country.code === "BR")!
  return <CountryLandingPage countryData={brazilData} />
}
