export interface Currency {
  code: string
  symbol: string
  name: string
  decimals: number
  rate: number // Rate relative to USD
  locale: string
  flag: string
  crypto?: boolean
}

export const currencies: Record<string, Currency> = {
  // Fiat currencies
  USD: { code: "USD", symbol: "$", name: "US Dollar", decimals: 2, rate: 1.0, locale: "en-US", flag: "🇺🇸" },
  EUR: { code: "EUR", symbol: "€", name: "Euro", decimals: 2, rate: 0.85, locale: "de-DE", flag: "🇪🇺" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", decimals: 2, rate: 0.73, locale: "en-GB", flag: "🇬🇧" },
  CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar", decimals: 2, rate: 1.35, locale: "en-CA", flag: "🇨🇦" },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", decimals: 2, rate: 1.45, locale: "en-AU", flag: "🇦🇺" },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen", decimals: 0, rate: 110, locale: "ja-JP", flag: "🇯🇵" },
  CNY: { code: "CNY", symbol: "¥", name: "Chinese Yuan", decimals: 2, rate: 6.5, locale: "zh-CN", flag: "🇨🇳" },
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", decimals: 2, rate: 74, locale: "hi-IN", flag: "🇮🇳" },
  BRL: { code: "BRL", symbol: "R$", name: "Brazilian Real", decimals: 2, rate: 5.2, locale: "pt-BR", flag: "🇧🇷" },
  MXN: { code: "MXN", symbol: "$", name: "Mexican Peso", decimals: 2, rate: 18, locale: "es-MX", flag: "🇲🇽" },
  KRW: { code: "KRW", symbol: "₩", name: "South Korean Won", decimals: 0, rate: 1200, locale: "ko-KR", flag: "🇰🇷" },
  RUB: { code: "RUB", symbol: "₽", name: "Russian Ruble", decimals: 2, rate: 75, locale: "ru-RU", flag: "🇷🇺" },
  UAH: { code: "UAH", symbol: "₴", name: "Ukrainian Hryvnia", decimals: 2, rate: 27, locale: "uk-UA", flag: "🇺🇦" },
  PKR: { code: "PKR", symbol: "₨", name: "Pakistani Rupee", decimals: 2, rate: 280, locale: "ur-PK", flag: "🇵🇰" },
  SAR: { code: "SAR", symbol: "﷼", name: "Saudi Riyal", decimals: 2, rate: 3.75, locale: "ar-SA", flag: "🇸🇦" },
  AED: { code: "AED", symbol: "د.إ", name: "UAE Dirham", decimals: 2, rate: 3.67, locale: "ar-AE", flag: "🇦🇪" },
  THB: { code: "THB", symbol: "฿", name: "Thai Baht", decimals: 2, rate: 33, locale: "th-TH", flag: "🇹🇭" },
  VND: { code: "VND", symbol: "₫", name: "Vietnamese Dong", decimals: 0, rate: 23000, locale: "vi-VN", flag: "🇻🇳" },
  PLN: { code: "PLN", symbol: "zł", name: "Polish Zloty", decimals: 2, rate: 4.0, locale: "pl-PL", flag: "🇵🇱" },
  SEK: { code: "SEK", symbol: "kr", name: "Swedish Krona", decimals: 2, rate: 8.5, locale: "sv-SE", flag: "🇸🇪" },
  NOK: { code: "NOK", symbol: "kr", name: "Norwegian Krone", decimals: 2, rate: 8.8, locale: "no-NO", flag: "🇳🇴" },
  DKK: { code: "DKK", symbol: "kr", name: "Danish Krone", decimals: 2, rate: 6.3, locale: "da-DK", flag: "🇩🇰" },
  CHF: { code: "CHF", symbol: "Fr", name: "Swiss Franc", decimals: 2, rate: 0.92, locale: "de-CH", flag: "🇨🇭" },
  TRY: { code: "TRY", symbol: "₺", name: "Turkish Lira", decimals: 2, rate: 27, locale: "tr-TR", flag: "🇹🇷" },
  ILS: { code: "ILS", symbol: "₪", name: "Israeli Shekel", decimals: 2, rate: 3.2, locale: "he-IL", flag: "🇮🇱" },

  // Cryptocurrencies
  BTC: {
    code: "BTC",
    symbol: "₿",
    name: "Bitcoin",
    decimals: 8,
    rate: 0.000023,
    locale: "en-US",
    flag: "₿",
    crypto: true,
  },
  ETH: {
    code: "ETH",
    symbol: "Ξ",
    name: "Ethereum",
    decimals: 6,
    rate: 0.00038,
    locale: "en-US",
    flag: "Ξ",
    crypto: true,
  },
  USDC: {
    code: "USDC",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    rate: 1.0,
    locale: "en-US",
    flag: "💰",
    crypto: true,
  },
  USDT: {
    code: "USDT",
    symbol: "USDT",
    name: "Tether",
    decimals: 6,
    rate: 1.0,
    locale: "en-US",
    flag: "💰",
    crypto: true,
  },
  BNB: {
    code: "BNB",
    symbol: "BNB",
    name: "Binance Coin",
    decimals: 8,
    rate: 0.0033,
    locale: "en-US",
    flag: "🟡",
    crypto: true,
  },
  GBT: {
    code: "GBT",
    symbol: "GBT",
    name: "GatorBite Token",
    decimals: 18,
    rate: 11.8,
    locale: "en-US",
    flag: "🐊",
    crypto: true,
  },
}

export class CurrencyService {
  private static exchangeRates: Record<string, number> = {}
  private static lastUpdate = 0
  private static readonly UPDATE_INTERVAL = 5 * 60 * 1000 // 5 minutes

  static async getExchangeRates(): Promise<Record<string, number>> {
    const now = Date.now()

    if (now - this.lastUpdate > this.UPDATE_INTERVAL) {
      try {
        // Fetch live rates from multiple APIs
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD")
        const data = await response.json()

        this.exchangeRates = {
          ...data.rates,
          // Add crypto rates (would come from crypto API)
          BTC: 43250,
          ETH: 2650,
          USDC: 1.0,
          USDT: 1.0,
          BNB: 310,
          GBT: 0.0847, // GatorBite Token price
        }

        this.lastUpdate = now
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error)
        // Fallback to stored rates
      }
    }

    return this.exchangeRates
  }

  static async convertPrice(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) return amount

    const rates = await this.getExchangeRates()
    const fromRate = rates[fromCurrency] || currencies[fromCurrency]?.rate || 1
    const toRate = rates[toCurrency] || currencies[toCurrency]?.rate || 1

    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate
    return usdAmount * toRate
  }

  static formatPrice(amount: number, currencyCode: string, locale?: string): string {
    const currency = currencies[currencyCode]
    if (!currency) return `${amount} ${currencyCode}`

    const targetLocale = locale || currency.locale

    try {
      return new Intl.NumberFormat(targetLocale, {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: currency.decimals,
        maximumFractionDigits: currency.decimals,
      }).format(amount)
    } catch (error) {
      // Fallback formatting
      return `${currency.symbol}${amount.toFixed(currency.decimals)}`
    }
  }

  static getUserCurrency(userLocale: string, userCountry?: string): string {
    // Determine currency based on locale or country
    if (userCountry) {
      const countryToCurrency: Record<string, string> = {
        US: "USD",
        CA: "CAD",
        GB: "GBP",
        AU: "AUD",
        JP: "JPY",
        CN: "CNY",
        IN: "INR",
        BR: "BRL",
        MX: "MXN",
        KR: "KRW",
        RU: "RUB",
        UA: "UAH",
        PK: "PKR",
        SA: "SAR",
        AE: "AED",
        TH: "THB",
        VN: "VND",
        PL: "PLN",
        SE: "SEK",
        NO: "NOK",
        DK: "DKK",
        CH: "CHF",
        TR: "TRY",
        IL: "ILS",
        // EU countries
        DE: "EUR",
        FR: "EUR",
        IT: "EUR",
        ES: "EUR",
        NL: "EUR",
        FI: "EUR",
      }

      return countryToCurrency[userCountry] || "USD"
    }

    // Fallback to locale-based detection
    const localeToCurrency: Record<string, string> = {
      "en-US": "USD",
      "en-CA": "CAD",
      "en-GB": "GBP",
      "en-AU": "AUD",
      "ja-JP": "JPY",
      "zh-CN": "CNY",
      "hi-IN": "INR",
      "pt-BR": "BRL",
      "es-MX": "MXN",
      "ko-KR": "KRW",
      "ru-RU": "RUB",
      "uk-UA": "UAH",
      "ur-PK": "PKR",
      "ar-SA": "SAR",
      "ar-AE": "AED",
      "th-TH": "THB",
      "vi-VN": "VND",
      "pl-PL": "PLN",
      "sv-SE": "SEK",
      "no-NO": "NOK",
      "da-DK": "DKK",
      "de-CH": "CHF",
      "tr-TR": "TRY",
      "he-IL": "ILS",
    }

    return localeToCurrency[userLocale] || "USD"
  }
}
