import { countryDatabase, CountryLandingPage } from "@/components/international-landing-generator"

export default function PakistanPage() {
  const pakistanData = countryDatabase.find((country) => country.code === "PK")!
  return <CountryLandingPage countryData={pakistanData} />
}
