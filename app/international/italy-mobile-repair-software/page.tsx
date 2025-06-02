import { CountryLandingPage, countryDatabase } from "@/components/international-landing-generator"

export default function ItalyMobileRepairSoftwarePage() {
  const italyData = countryDatabase.find((country) => country.code === "IT")

  if (!italyData) {
    return <div>Country data not found</div>
  }

  return <CountryLandingPage countryData={italyData} />
}
