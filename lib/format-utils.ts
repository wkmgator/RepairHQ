"use client"

import { useMemo } from "react"

export function useNumberFormatter(options?: Intl.NumberFormatOptions) {
  return useMemo(() => {
    const formatter = new Intl.NumberFormat("en-US", options)
    return (num: number) => formatter.format(num)
  }, [options])
}

export function useCurrencyFormatter(currency = "USD", options?: Intl.NumberFormatOptions) {
  const memoOptions = useMemo(() => ({ style: "currency", currency, ...options }), [currency, options])
  return useMemo(() => {
    const formatter = new Intl.NumberFormat("en-US", memoOptions)
    return (amount: number) => formatter.format(amount)
  }, [memoOptions])
}

export function useDateFormatter(options?: Intl.DateTimeFormatOptions) {
  const defaultOptions = useMemo(
    () => ({
      year: "numeric",
      month: "long",
      day: "numeric",
      ...options,
    }),
    [options],
  )
  return useMemo(() => {
    const formatter = new Intl.DateTimeFormat("en-US", defaultOptions)
    return (date: Date | string | number) => formatter.format(new Date(date))
  }, [defaultOptions])
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export function formatDate(date: Date | string | number): string {
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num)
}

export function formatPercentage(num: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num / 100)
}
