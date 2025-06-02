import { CountryLandingPage, countryDatabase } from "@/components/international-landing-generator"

export default function IcelandMobileRepairSoftwarePage() {
  const icelandData = countryDatabase.find((country) => country.code === "IS")

  if (!icelandData) {
    return <div>Country data not found</div>
  }

  return <CountryLandingPage countryData={icelandData} />
}
