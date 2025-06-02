import { CountryLandingPage, countryDatabase } from "@/components/international-landing-generator"

export default function DenmarkMobileRepairSoftwarePage() {
  const denmarkData = countryDatabase.find((country) => country.code === "DK")

  if (!denmarkData) {
    return <div>Country data not found</div>
  }

  return <CountryLandingPage countryData={denmarkData} />
}
