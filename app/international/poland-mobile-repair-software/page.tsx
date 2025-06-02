import { CountryLandingPage, countryDatabase } from "@/components/international-landing-generator"

export default function PolandMobileRepairSoftwarePage() {
  const polandData = countryDatabase.find((country) => country.code === "PL")

  if (!polandData) {
    return <div>Country data not found</div>
  }

  return <CountryLandingPage countryData={polandData} />
}
