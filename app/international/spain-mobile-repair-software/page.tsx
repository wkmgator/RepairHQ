import { CountryLandingPage, countryDatabase } from "@/components/international-landing-generator"

export default function SpainMobileRepairSoftwarePage() {
  const spainData = countryDatabase.find((country) => country.code === "ES")

  if (!spainData) {
    return <div>Country data not found</div>
  }

  return <CountryLandingPage countryData={spainData} />
}
