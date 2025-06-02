import { countryDatabase, CountryLandingPage } from "@/components/international-landing-generator"

export default function UKPage() {
  const ukData = countryDatabase.find((country) => country.code === "GB")!
  return <CountryLandingPage countryData={ukData} />
}
