import { notFound } from "next/navigation"
import { getRequestConfig } from "next-intl/server"

// Enhanced locales with more regions
export const locales = [
  "en",
  "es",
  "fr",
  "de",
  "it",
  "pt",
  "ru",
  "zh",
  "ja",
  "ko",
  "ar",
  "hi",
  "th",
  "vi",
  "uk",
  "pl",
  "nl",
  "sv",
  "no",
  "da",
  "fi",
  "tr",
  "he",
  "fa",
  "ur",
  "bn",
  "ta",
  "te",
] as const

export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound()

  return {
    messages: {
      ...(await import(`../messages/${locale}.json`)).default,
      // Industry-specific terminology
      verticals: (await import(`../messages/verticals/${locale}.json`)).default,
      // Technical repair terms
      technical: (await import(`../messages/technical/${locale}.json`)).default,
      // Business/financial terms
      business: (await import(`../messages/business/${locale}.json`)).default,
    },
  }
})

export const defaultLocale: Locale = "en"

// Enhanced locale metadata with currency and business info
export const localeMetadata = {
  en: { name: "English", flag: "🇺🇸", rtl: false, currency: "USD", region: "North America" },
  es: { name: "Español", flag: "🇪🇸", rtl: false, currency: "EUR", region: "Europe" },
  fr: { name: "Français", flag: "🇫🇷", rtl: false, currency: "EUR", region: "Europe" },
  de: { name: "Deutsch", flag: "🇩🇪", rtl: false, currency: "EUR", region: "Europe" },
  it: { name: "Italiano", flag: "🇮🇹", rtl: false, currency: "EUR", region: "Europe" },
  pt: { name: "Português", flag: "🇧🇷", rtl: false, currency: "BRL", region: "South America" },
  ru: { name: "Русский", flag: "🇷🇺", rtl: false, currency: "RUB", region: "Eastern Europe" },
  zh: { name: "中文", flag: "🇨🇳", rtl: false, currency: "CNY", region: "Asia" },
  ja: { name: "日本語", flag: "🇯🇵", rtl: false, currency: "JPY", region: "Asia" },
  ko: { name: "한국어", flag: "🇰🇷", rtl: false, currency: "KRW", region: "Asia" },
  ar: { name: "العربية", flag: "🇸🇦", rtl: true, currency: "SAR", region: "Middle East" },
  hi: { name: "हिन्दी", flag: "🇮🇳", rtl: false, currency: "INR", region: "Asia" },
  th: { name: "ไทย", flag: "🇹🇭", rtl: false, currency: "THB", region: "Asia" },
  vi: { name: "Tiếng Việt", flag: "🇻🇳", rtl: false, currency: "VND", region: "Asia" },
  uk: { name: "Українська", flag: "🇺🇦", rtl: false, currency: "UAH", region: "Eastern Europe" },
  pl: { name: "Polski", flag: "🇵🇱", rtl: false, currency: "PLN", region: "Europe" },
  nl: { name: "Nederlands", flag: "🇳🇱", rtl: false, currency: "EUR", region: "Europe" },
  sv: { name: "Svenska", flag: "🇸🇪", rtl: false, currency: "SEK", region: "Europe" },
  no: { name: "Norsk", flag: "🇳🇴", rtl: false, currency: "NOK", region: "Europe" },
  da: { name: "Dansk", flag: "🇩🇰", rtl: false, currency: "DKK", region: "Europe" },
  fi: { name: "Suomi", flag: "🇫🇮", rtl: false, currency: "EUR", region: "Europe" },
  tr: { name: "Türkçe", flag: "🇹🇷", rtl: false, currency: "TRY", region: "Middle East" },
  he: { name: "עברית", flag: "🇮🇱", rtl: true, currency: "ILS", region: "Middle East" },
  fa: { name: "فارسی", flag: "🇮🇷", rtl: true, currency: "IRR", region: "Middle East" },
  ur: { name: "اردو", flag: "🇵🇰", rtl: true, currency: "PKR", region: "Asia" },
  bn: { name: "বাংলা", flag: "🇧🇩", rtl: false, currency: "BDT", region: "Asia" },
  ta: { name: "தமிழ்", flag: "🇮🇳", rtl: false, currency: "INR", region: "Asia" },
  te: { name: "తెలుగు", flag: "🇮🇳", rtl: false, currency: "INR", region: "Asia" },
} as const

// Industry-specific terminology loader
export async function getVerticalTerminology(locale: string, vertical: string) {
  try {
    return (await import(`../messages/verticals/${locale}/${vertical}.json`)).default
  } catch {
    // Fallback to English if translation doesn't exist
    return (await import(`../messages/verticals/en/${vertical}.json`)).default
  }
}
