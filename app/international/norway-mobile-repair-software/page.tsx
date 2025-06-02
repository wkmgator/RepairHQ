import { CountryLandingPage, countryDatabase } from "@/components/international-landing-generator"

export default function NorwayMobileRepairSoftwarePage() {
  const norwayData = countryDatabase.find((country) => country.code === "NO")

  if (!norwayData) {
    return <div>Country data not found</div>
  }

  return <CountryLandingPage countryData={norwayData} />
}
