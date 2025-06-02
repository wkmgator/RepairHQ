import { getTranslations } from "next-intl/server"
import { RtlTestClient } from "./rtl-test-client"

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "Metadata" })

  return {
    title: `RTL Testing | ${t("title")}`,
    description: "Test page for RTL language support",
  }
}

export default async function RtlTestPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">RTL Support Testing</h1>
      <p className="text-muted-foreground mb-8">
        This page demonstrates RTL support for various UI components. Switch to an RTL language like Arabic or Hebrew to
        test.
      </p>

      <RtlTestClient />
    </div>
  )
}
