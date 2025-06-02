import { CountryLandingPage, countryDatabase } from "@/components/international-landing-generator"

export default function SwedenMobileRepairSoftwarePage() {
  const swedenData = countryDatabase.find((country) => country.code === "SE")

  if (!swedenData) {
    return <div>Country data not found</div>
  }

  return <CountryLandingPage countryData={swedenData} />
}
