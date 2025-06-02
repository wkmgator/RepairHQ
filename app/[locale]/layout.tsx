import type React from "react"
import { Inter, Noto_Sans_Arabic, Noto_Nastaliq_Urdu } from "next/font/google"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations, unstable_setRequestLocale } from "next-intl/server"
import { locales, localeMetadata } from "@/lib/i18n"
import { AuthProvider } from "@/lib/auth-context"
import "../globals.css"

// Load fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})
const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-urdu",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "Metadata" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Validate that the incoming locale is valid
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // Enable static rendering
  unstable_setRequestLocale(locale)

  // Get messages for client-side providers
  const messages = await getMessages()

  // Check if the language is RTL
  const isRtl = localeMetadata[locale as keyof typeof localeMetadata]?.rtl || false

  // Determine the appropriate font class based on locale
  let fontClass = inter.className
  if (locale === "ar" || locale === "fa") {
    fontClass = `${inter.variable} ${notoSansArabic.variable}`
  } else if (locale === "ur") {
    fontClass = `${inter.variable} ${notoNastaliqUrdu.variable}`
  }

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"}>
      <body className={`${fontClass} ${isRtl ? "rtl" : "ltr"}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>{children}</AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
