import { notFound } from "next/navigation"
import { getRequestConfig } from "next-intl/server"

// Our supported locales
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
] as const

export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound()

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})

export const defaultLocale: Locale = "en"

// Locale metadata
export const localeMetadata = {
  en: { name: "English", flag: "🇺🇸", rtl: false, currency: "USD" },
  es: { name: "Español", flag: "🇪🇸", rtl: false, currency: "EUR" },
  fr: { name: "Français", flag: "🇫🇷", rtl: false, currency: "EUR" },
  de: { name: "Deutsch", flag: "🇩🇪", rtl: false, currency: "EUR" },
  it: { name: "Italiano", flag: "🇮🇹", rtl: false, currency: "EUR" },
  pt: { name: "Português", flag: "🇧🇷", rtl: false, currency: "BRL" },
  ru: { name: "Русский", flag: "🇷🇺", rtl: false, currency: "RUB" },
  zh: { name: "中文", flag: "🇨🇳", rtl: false, currency: "CNY" },
  ja: { name: "日本語", flag: "🇯🇵", rtl: false, currency: "JPY" },
  ko: { name: "한국어", flag: "🇰🇷", rtl: false, currency: "KRW" },
  ar: { name: "العربية", flag: "🇸🇦", rtl: true, currency: "SAR" },
  hi: { name: "हिन्दी", flag: "🇮🇳", rtl: false, currency: "INR" },
  th: { name: "ไทย", flag: "🇹🇭", rtl: false, currency: "THB" },
  vi: { name: "Tiếng Việt", flag: "🇻🇳", rtl: false, currency: "VND" },
  uk: { name: "Українська", flag: "🇺🇦", rtl: false, currency: "UAH" },
  pl: { name: "Polski", flag: "🇵🇱", rtl: false, currency: "PLN" },
  nl: { name: "Nederlands", flag: "🇳🇱", rtl: false, currency: "EUR" },
  sv: { name: "Svenska", flag: "🇸🇪", rtl: false, currency: "SEK" },
  no: { name: "Norsk", flag: "🇳🇴", rtl: false, currency: "NOK" },
  da: { name: "Dansk", flag: "🇩🇰", rtl: false, currency: "DKK" },
  fi: { name: "Suomi", flag: "🇫🇮", rtl: false, currency: "EUR" },
  tr: { name: "Türkçe", flag: "🇹🇷", rtl: false, currency: "TRY" },
  he: { name: "עברית", flag: "🇮🇱", rtl: true, currency: "ILS" },
  fa: { name: "فارسی", flag: "🇮🇷", rtl: true, currency: "IRR" },
  ur: { name: "اردو", flag: "🇵🇰", rtl: true, currency: "PKR" },
} as const
