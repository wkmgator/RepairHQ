import { CountryLandingPage, countryDatabase } from "@/components/international-landing-generator"

export default function NetherlandsMobileRepairSoftwarePage() {
  const netherlandsData = countryDatabase.find((country) => country.code === "NL")

  if (!netherlandsData) {
    return <div>Country data not found</div>
  }

  return <CountryLandingPage countryData={netherlandsData} />
}
