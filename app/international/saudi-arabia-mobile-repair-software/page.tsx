import { countryDatabase, CountryLandingPage } from "@/components/international-landing-generator"

export default function SaudiArabiaPage() {
  const saudiData = countryDatabase.find((country) => country.code === "SA")!
  return <CountryLandingPage countryData={saudiData} />
}
