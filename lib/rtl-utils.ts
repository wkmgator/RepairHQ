"use client"

import { useLocale } from "next-intl"

// List of RTL languages
export const rtlLocales = ["ar", "he", "fa", "ur", "dv", "ku", "ps", "sd", "ug", "yi"]

// Hook to check if current locale is RTL
export function useIsRtl() {
  const locale = useLocale()
  return rtlLocales.includes(locale as string)
}

// Function to get direction based on locale
export function getDirection(locale: string) {
  return rtlLocales.includes(locale) ? "rtl" : "ltr"
}

// Function to flip horizontal values for RTL
export function flipValueForRtl(ltrValue: string, rtlValue: string, isRtl: boolean) {
  return isRtl ? rtlValue : ltrValue
}

// Function to flip CSS properties for RTL
export function flipCssForRtl(property: string, isRtl: boolean) {
  const propertyMap: Record<string, string> = {
    left: "right",
    right: "left",
    "margin-left": "margin-right",
    "margin-right": "margin-left",
    "padding-left": "padding-right",
    "padding-right": "padding-left",
    "border-left": "border-right",
    "border-right": "border-left",
    "border-top-left-radius": "border-top-right-radius",
    "border-top-right-radius": "border-top-left-radius",
    "border-bottom-left-radius": "border-bottom-right-radius",
    "border-bottom-right-radius": "border-bottom-left-radius",
  }

  return isRtl && propertyMap[property] ? propertyMap[property] : property
}
