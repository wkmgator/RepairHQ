import { countryDatabase, CountryLandingPage } from "@/components/international-landing-generator"

export default function MexicoPage() {
  const mexicoData = countryDatabase.find((country) => country.code === "MX")!
  return <CountryLandingPage countryData={mexicoData} />
}
