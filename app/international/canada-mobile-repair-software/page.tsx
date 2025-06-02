import { countryDatabase, CountryLandingPage } from "@/components/international-landing-generator"

export default function CanadaPage() {
  const canadaData = countryDatabase.find((country) => country.code === "CA")!
  return <CountryLandingPage countryData={canadaData} />
}
