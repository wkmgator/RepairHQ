import { CountryLandingPage, countryDatabase } from "@/components/international-landing-generator"

export default function FinlandMobileRepairSoftwarePage() {
  const finlandData = countryDatabase.find((country) => country.code === "FI")

  if (!finlandData) {
    return <div>Country data not found</div>
  }

  return <CountryLandingPage countryData={finlandData} />
}
