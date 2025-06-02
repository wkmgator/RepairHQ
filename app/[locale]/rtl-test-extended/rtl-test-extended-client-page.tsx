"use client"

import { useTranslations } from "next-intl"
import RtlTestExtendedClient from "./rtl-test-extended-client"

export default function RtlTestExtendedClientPage() {
  const t = useTranslations("RTLTest")

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")} - Extended</h1>
      <p className="mb-6">{t("description")}</p>

      <RtlTestExtendedClient />
    </div>
  )
}
