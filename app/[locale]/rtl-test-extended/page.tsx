import { getTranslations } from "next-intl/server"
import RtlTestExtendedClientPage from "./rtl-test-extended-client-page"

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "RTLTest" })

  return {
    title: `${t("title")} - Extended`,
    description: t("description"),
  }
}

export default function RtlTestExtendedPage() {
  return <RtlTestExtendedClientPage />
}
