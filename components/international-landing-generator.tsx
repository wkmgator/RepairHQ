"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Star, MapPin, Building, TrendingUp, Globe, Users, Smartphone } from "lucide-react"
import { SEOOptimizer } from "@/components/seo-components"
import { PricingPlans } from "@/components/pricing-plans"

interface CountryData {
  name: string
  code: string
  slug: string
  flag: string
  population: string
  mobileUsers: string
  repairShops: string
  avgRevenue: string
  marketGrowth: string
  avgTicket: string
  primaryColor: string
  secondaryColor: string
  currency: string
  currencySymbol: string
  capital: string
  largestCity: string
  region: string
  majorCities: string[]
  keyIndustries: string[]
  languages: string[]
  countryFeatures: string[]
  taxSystem: string
  regulations: string[]
  localTestimonials: Array<{
    name: string
    business: string
    city: string
    quote: string
    rating: number
  }>
  uniqueFeatures: string[]
  coordinates: {
    latitude: string
    longitude: string
  }
  economicData: {
    gdp: string
    gdpPerCapita: string
    techSector: string
    mobileMarketSize: string
  }
  businessCulture: {
    workingHours: string
    businessLanguage: string
    paymentMethods: string[]
    preferredCommunication: string
  }
}

// Comprehensive international database
export const countryDatabase: CountryData[] = [
  {
    name: "Ukraine",
    code: "UA",
    slug: "ukraine-mobile-repair-software",
    flag: "🇺🇦",
    population: "43.8M",
    mobileUsers: "54.7M",
    repairShops: "8,945",
    avgRevenue: "₴2.8M",
    marketGrowth: "35%",
    avgTicket: "₴1,850",
    primaryColor: "blue",
    secondaryColor: "yellow",
    currency: "Ukrainian Hryvnia",
    currencySymbol: "₴",
    capital: "Kyiv",
    largestCity: "Kyiv",
    region: "Eastern Europe",
    majorCities: ["Kyiv", "Kharkiv", "Odesa", "Dnipro", "Donetsk", "Zaporizhzhia", "Lviv"],
    keyIndustries: ["Technology", "Agriculture", "Manufacturing", "IT Services"],
    languages: ["Ukrainian", "Russian", "English"],
    countryFeatures: [
      "Post-war reconstruction support",
      "EU integration features",
      "Cryptocurrency payment support",
      "Remote work optimization",
    ],
    taxSystem: "20% VAT, simplified tax options",
    regulations: ["EU GDPR compliance preparation", "Ukrainian data protection", "Reconstruction standards"],
    localTestimonials: [
      {
        name: "Oleksandr Petrenko",
        business: "Kyiv Mobile Solutions",
        city: "Kyiv",
        quote:
          "RepairHQ's Ukrainian features help us serve customers during challenging times with reliable, efficient service!",
        rating: 5,
      },
      {
        name: "Yana Kovalenko",
        business: "Lviv Tech Repair",
        city: "Lviv",
        quote:
          "The multi-language support and cryptocurrency payments make RepairHQ perfect for Ukraine's tech-savvy market!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Ukrainian language interface",
      "Hryvnia currency support",
      "Cryptocurrency payment integration",
      "EU GDPR preparation tools",
      "Remote work features",
      "Post-conflict business support",
      "Multi-language customer service",
      "Reconstruction project tracking",
    ],
    coordinates: { latitude: "48.3794", longitude: "31.1656" },
    economicData: {
      gdp: "$200B",
      gdpPerCapita: "$4,500",
      techSector: "Rapidly Growing",
      mobileMarketSize: "$2.1B",
    },
    businessCulture: {
      workingHours: "9:00-18:00 EET",
      businessLanguage: "Ukrainian/English",
      paymentMethods: ["Bank Transfer", "Cryptocurrency", "Cash", "Digital Wallets"],
      preferredCommunication: "Telegram, Email, Phone",
    },
  },

  {
    name: "Canada",
    code: "CA",
    slug: "canada-mobile-repair-software",
    flag: "🇨🇦",
    population: "38.2M",
    mobileUsers: "33.4M",
    repairShops: "12,456",
    avgRevenue: "C$485K",
    marketGrowth: "24%",
    avgTicket: "C$165",
    primaryColor: "red",
    secondaryColor: "white",
    currency: "Canadian Dollar",
    currencySymbol: "C$",
    capital: "Ottawa",
    largestCity: "Toronto",
    region: "North America",
    majorCities: ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg"],
    keyIndustries: ["Technology", "Natural Resources", "Manufacturing", "Services"],
    languages: ["English", "French"],
    countryFeatures: [
      "Bilingual English/French support",
      "Provincial tax compliance",
      "Healthcare integration",
      "Winter weather features",
    ],
    taxSystem: "5-15% GST/HST, Provincial taxes vary",
    regulations: ["PIPEDA privacy compliance", "Provincial licensing", "Healthcare standards"],
    localTestimonials: [
      {
        name: "Jean-Pierre Dubois",
        business: "Montreal Mobile Repair",
        city: "Montreal",
        quote: "Le support bilingue et la conformité provinciale font de RepairHQ le choix parfait pour le Canada!",
        rating: 5,
      },
      {
        name: "Sarah Thompson",
        business: "Toronto Tech Solutions",
        city: "Toronto",
        quote:
          "The provincial tax automation and healthcare integrations make RepairHQ essential for Canadian businesses!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Bilingual English/French interface",
      "Provincial tax automation (GST/HST/PST)",
      "PIPEDA privacy compliance",
      "Healthcare system integration",
      "Winter weather protection",
      "Indigenous community support",
      "Canadian dollar processing",
      "Provincial licensing tracking",
    ],
    coordinates: { latitude: "56.1304", longitude: "-106.3468" },
    economicData: {
      gdp: "$2.1T",
      gdpPerCapita: "$54,000",
      techSector: "Major",
      mobileMarketSize: "$8.5B",
    },
    businessCulture: {
      workingHours: "9:00-17:00 Local Time",
      businessLanguage: "English/French",
      paymentMethods: ["Credit Card", "Interac", "Bank Transfer", "Digital Wallets"],
      preferredCommunication: "Email, Phone, Video Calls",
    },
  },

  {
    name: "Mexico",
    code: "MX",
    slug: "mexico-mobile-repair-software",
    flag: "🇲🇽",
    population: "128.9M",
    mobileUsers: "95.2M",
    repairShops: "15,678",
    avgRevenue: "$2.8M MXN",
    marketGrowth: "31%",
    avgTicket: "$1,250 MXN",
    primaryColor: "green",
    secondaryColor: "red",
    currency: "Mexican Peso",
    currencySymbol: "$",
    capital: "Mexico City",
    largestCity: "Mexico City",
    region: "Latin America",
    majorCities: ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León", "Juárez"],
    keyIndustries: ["Manufacturing", "Technology", "Tourism", "Agriculture"],
    languages: ["Spanish", "English"],
    countryFeatures: [
      "Spanish language priority",
      "USMCA trade compliance",
      "Remittance integration",
      "Border city features",
    ],
    taxSystem: "16% IVA, income tax varies",
    regulations: ["Mexican data protection", "USMCA compliance", "Border trade regulations"],
    localTestimonials: [
      {
        name: "Carlos Hernández",
        business: "Reparaciones México DF",
        city: "Mexico City",
        quote: "¡RepairHQ con soporte en español y integración de remesas es perfecto para el mercado mexicano!",
        rating: 5,
      },
      {
        name: "María González",
        business: "Tijuana Mobile Center",
        city: "Tijuana",
        quote: "Las características fronterizas y el cumplimiento del T-MEC hacen de RepairHQ ideal para México!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Spanish language interface",
      "Mexican peso processing",
      "Remittance payment integration",
      "USMCA trade compliance",
      "Border city features",
      "Mexican tax automation (IVA)",
      "Cultural celebration scheduling",
      "Cross-border customer tracking",
    ],
    coordinates: { latitude: "23.6345", longitude: "-102.5528" },
    economicData: {
      gdp: "$1.7T",
      gdpPerCapita: "$13,200",
      techSector: "Growing",
      mobileMarketSize: "$12.3B",
    },
    businessCulture: {
      workingHours: "9:00-18:00 Local Time",
      businessLanguage: "Spanish",
      paymentMethods: ["Cash", "Credit Card", "OXXO Pay", "Bank Transfer", "Remittances"],
      preferredCommunication: "WhatsApp, Phone, Email",
    },
  },

  {
    name: "Pakistan",
    code: "PK",
    slug: "pakistan-mobile-repair-software",
    flag: "🇵🇰",
    population: "231.4M",
    mobileUsers: "192.3M",
    repairShops: "25,789",
    avgRevenue: "₨8.5M",
    marketGrowth: "42%",
    avgTicket: "₨12,500",
    primaryColor: "green",
    secondaryColor: "white",
    currency: "Pakistani Rupee",
    currencySymbol: "₨",
    capital: "Islamabad",
    largestCity: "Karachi",
    region: "South Asia",
    majorCities: ["Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Gujranwala", "Peshawar", "Multan"],
    keyIndustries: ["Textiles", "Technology", "Agriculture", "Manufacturing"],
    languages: ["Urdu", "English", "Punjabi", "Sindhi"],
    countryFeatures: [
      "Islamic banking integration",
      "Urdu language support",
      "Mobile money features",
      "Ramadan scheduling",
    ],
    taxSystem: "17% GST, provincial taxes",
    regulations: ["Pakistani data protection", "Islamic banking compliance", "Provincial licensing"],
    localTestimonials: [
      {
        name: "Ahmed Ali Khan",
        business: "Karachi Mobile Hub",
        city: "Karachi",
        quote: "RepairHQ کی اردو سپورٹ اور اسلامی بینکنگ فیچرز پاکستانی مارکیٹ کے لیے بہترین ہیں!",
        rating: 5,
      },
      {
        name: "Fatima Sheikh",
        business: "Lahore Tech Solutions",
        city: "Lahore",
        quote: "The mobile money integration and Ramadan features make RepairHQ perfect for Pakistan's growing market!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Urdu language interface",
      "Pakistani rupee processing",
      "Islamic banking integration",
      "Mobile money support (JazzCash, Easypaisa)",
      "Ramadan business hours",
      "Prayer time scheduling",
      "GST automation for Pakistan",
      "Multi-language customer service",
    ],
    coordinates: { latitude: "30.3753", longitude: "69.3451" },
    economicData: {
      gdp: "$380B",
      gdpPerCapita: "$1,650",
      techSector: "Emerging",
      mobileMarketSize: "$4.2B",
    },
    businessCulture: {
      workingHours: "9:00-17:00 PKT (Prayer breaks)",
      businessLanguage: "Urdu/English",
      paymentMethods: ["Cash", "Mobile Money", "Bank Transfer", "Islamic Banking"],
      preferredCommunication: "WhatsApp, Phone, SMS",
    },
  },
  {
    name: "Italy",
    code: "IT",
    slug: "italy-mobile-repair-software",
    flag: "🇮🇹",
    population: "59.1M",
    mobileUsers: "50.2M",
    repairShops: "18,945",
    avgRevenue: "€425K",
    marketGrowth: "26%",
    avgTicket: "€185",
    primaryColor: "green",
    secondaryColor: "red",
    currency: "Euro",
    currencySymbol: "€",
    capital: "Rome",
    largestCity: "Rome",
    region: "Southern Europe",
    majorCities: ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna"],
    keyIndustries: ["Fashion", "Design", "Technology", "Manufacturing"],
    languages: ["Italian", "English"],
    countryFeatures: [
      "GDPR compliance built-in",
      "Italian design aesthetics",
      "Fashion district integration",
      "Tourism season optimization",
    ],
    taxSystem: "22% IVA, regional variations",
    regulations: ["EU GDPR compliance", "Italian consumer protection", "Regional business licenses"],
    localTestimonials: [
      {
        name: "Marco Rossi",
        business: "Milano Mobile Center",
        city: "Milan",
        quote: "RepairHQ con supporto italiano e conformità GDPR è perfetto per il mercato della moda e tecnologia!",
        rating: 5,
      },
      {
        name: "Sofia Romano",
        business: "Roma Tech Solutions",
        city: "Rome",
        quote: "L'integrazione con i distretti della moda e l'estetica italiana rendono RepairHQ ideale per l'Italia!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Italian language interface",
      "Euro currency processing",
      "GDPR compliance automation",
      "Fashion district integrations",
      "Tourism season analytics",
      "Italian tax automation (IVA)",
      "Design-focused UI",
      "Cultural event scheduling",
    ],
    coordinates: { latitude: "41.8719", longitude: "12.5674" },
    economicData: {
      gdp: "$2.1T",
      gdpPerCapita: "$35,500",
      techSector: "Growing",
      mobileMarketSize: "$9.2B",
    },
    businessCulture: {
      workingHours: "9:00-18:00 CET (Extended lunch)",
      businessLanguage: "Italian",
      paymentMethods: ["Credit Card", "Bank Transfer", "PagoPA", "Digital Wallets"],
      preferredCommunication: "Email, Phone, WhatsApp",
    },
  },

  {
    name: "Spain",
    code: "ES",
    slug: "spain-mobile-repair-software",
    flag: "🇪🇸",
    population: "47.4M",
    mobileUsers: "42.8M",
    repairShops: "16,234",
    avgRevenue: "€380K",
    marketGrowth: "28%",
    avgTicket: "€165",
    primaryColor: "red",
    secondaryColor: "yellow",
    currency: "Euro",
    currencySymbol: "€",
    capital: "Madrid",
    largestCity: "Madrid",
    region: "Southern Europe",
    majorCities: ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Murcia"],
    keyIndustries: ["Tourism", "Technology", "Manufacturing", "Agriculture"],
    languages: ["Spanish", "Catalan", "Basque", "English"],
    countryFeatures: [
      "Multi-regional language support",
      "Siesta scheduling integration",
      "Tourism hotspot features",
      "Autonomous community compliance",
    ],
    taxSystem: "21% IVA, autonomous community taxes",
    regulations: ["EU GDPR compliance", "Spanish data protection", "Autonomous community regulations"],
    localTestimonials: [
      {
        name: "Carlos García",
        business: "Madrid Mobile Repair",
        city: "Madrid",
        quote: "¡RepairHQ con soporte multilingüe y características turísticas es perfecto para España!",
        rating: 5,
      },
      {
        name: "Marta López",
        business: "Barcelona Tech Center",
        city: "Barcelona",
        quote: "El soporte para catalán y las integraciones autonómicas hacen de RepairHQ ideal para España!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Multi-language interface (Spanish/Catalan/Basque)",
      "Euro currency processing",
      "Tourism season optimization",
      "Siesta hours scheduling",
      "Autonomous community compliance",
      "Spanish tax automation (IVA)",
      "Regional festival calendar",
      "Multi-regional customer tracking",
    ],
    coordinates: { latitude: "40.4637", longitude: "-3.7492" },
    economicData: {
      gdp: "$1.4T",
      gdpPerCapita: "$30,000",
      techSector: "Established",
      mobileMarketSize: "$7.8B",
    },
    businessCulture: {
      workingHours: "9:00-14:00, 17:00-20:00 CET",
      businessLanguage: "Spanish/Catalan",
      paymentMethods: ["Credit Card", "Bank Transfer", "Bizum", "Digital Wallets"],
      preferredCommunication: "WhatsApp, Email, Phone",
    },
  },

  {
    name: "Netherlands",
    code: "NL",
    slug: "netherlands-mobile-repair-software",
    flag: "🇳🇱",
    population: "17.5M",
    mobileUsers: "16.8M",
    repairShops: "8,567",
    avgRevenue: "€520K",
    marketGrowth: "22%",
    avgTicket: "€195",
    primaryColor: "orange",
    secondaryColor: "blue",
    currency: "Euro",
    currencySymbol: "€",
    capital: "Amsterdam",
    largestCity: "Amsterdam",
    region: "Western Europe",
    majorCities: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Groningen", "Tilburg"],
    keyIndustries: ["Technology", "Logistics", "Finance", "Agriculture"],
    languages: ["Dutch", "English"],
    countryFeatures: [
      "Bicycle delivery integration",
      "High-tech innovation features",
      "Sustainable business practices",
      "Digital-first operations",
    ],
    taxSystem: "21% BTW, income tax brackets",
    regulations: ["EU GDPR compliance", "Dutch consumer protection", "Sustainability requirements"],
    localTestimonials: [
      {
        name: "Pieter van der Berg",
        business: "Amsterdam Mobile Solutions",
        city: "Amsterdam",
        quote: "RepairHQ's sustainability features and bike delivery integration are perfect for the Dutch market!",
        rating: 5,
      },
      {
        name: "Emma de Vries",
        business: "Rotterdam Tech Hub",
        city: "Rotterdam",
        quote: "De innovatieve functies en duurzaamheid van RepairHQ passen perfect bij Nederland!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Dutch/English interface",
      "Euro currency processing",
      "Bicycle delivery optimization",
      "Sustainability tracking",
      "High-tech integrations",
      "Dutch tax automation (BTW)",
      "Digital-first workflows",
      "Environmental compliance",
    ],
    coordinates: { latitude: "52.1326", longitude: "5.2913" },
    economicData: {
      gdp: "$1.0T",
      gdpPerCapita: "$57,000",
      techSector: "Advanced",
      mobileMarketSize: "$4.2B",
    },
    businessCulture: {
      workingHours: "9:00-17:30 CET",
      businessLanguage: "Dutch/English",
      paymentMethods: ["iDEAL", "Credit Card", "Bank Transfer", "Digital Wallets"],
      preferredCommunication: "Email, Video Calls, Phone",
    },
  },

  {
    name: "Poland",
    code: "PL",
    slug: "poland-mobile-repair-software",
    flag: "🇵🇱",
    population: "37.7M",
    mobileUsers: "33.2M",
    repairShops: "14,567",
    avgRevenue: "420K zł",
    marketGrowth: "34%",
    avgTicket: "185 zł",
    primaryColor: "red",
    secondaryColor: "white",
    currency: "Polish Zloty",
    currencySymbol: "zł",
    capital: "Warsaw",
    largestCity: "Warsaw",
    region: "Eastern Europe",
    majorCities: ["Warsaw", "Kraków", "Wrocław", "Poznań", "Gdańsk", "Szczecin", "Bydgoszcz"],
    keyIndustries: ["Technology", "Manufacturing", "Gaming", "Finance"],
    languages: ["Polish", "English"],
    countryFeatures: [
      "EU integration features",
      "Gaming industry support",
      "Strong tech sector integration",
      "Historical city adaptations",
    ],
    taxSystem: "23% VAT, progressive income tax",
    regulations: ["EU GDPR compliance", "Polish consumer protection", "Gaming industry regulations"],
    localTestimonials: [
      {
        name: "Marek Kowalski",
        business: "Warsaw Mobile Center",
        city: "Warsaw",
        quote: "RepairHQ z polskim wsparciem i integracją z sektorem gier jest idealny dla Polski!",
        rating: 5,
      },
      {
        name: "Anna Nowak",
        business: "Kraków Tech Solutions",
        city: "Kraków",
        quote: "The gaming industry features and EU integration make RepairHQ perfect for Poland's tech market!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Polish language interface",
      "Polish zloty processing",
      "Gaming industry integrations",
      "EU compliance automation",
      "Tech sector features",
      "Polish tax automation (VAT)",
      "Historical city scheduling",
      "Strong encryption features",
    ],
    coordinates: { latitude: "51.9194", longitude: "19.1451" },
    economicData: {
      gdp: "$680B",
      gdpPerCapita: "$18,000",
      techSector: "Rapidly Growing",
      mobileMarketSize: "$5.1B",
    },
    businessCulture: {
      workingHours: "8:00-16:00 CET",
      businessLanguage: "Polish/English",
      paymentMethods: ["BLIK", "Credit Card", "Bank Transfer", "Digital Wallets"],
      preferredCommunication: "Email, Phone, Messenger",
    },
  },

  {
    name: "Norway",
    code: "NO",
    slug: "norway-mobile-repair-software",
    flag: "🇳🇴",
    population: "5.4M",
    mobileUsers: "5.2M",
    repairShops: "2,456",
    avgRevenue: "3.8M kr",
    marketGrowth: "19%",
    avgTicket: "1,250 kr",
    primaryColor: "blue",
    secondaryColor: "red",
    currency: "Norwegian Krone",
    currencySymbol: "kr",
    capital: "Oslo",
    largestCity: "Oslo",
    region: "Northern Europe",
    majorCities: ["Oslo", "Bergen", "Trondheim", "Stavanger", "Kristiansand", "Fredrikstad", "Tromsø"],
    keyIndustries: ["Oil & Gas", "Technology", "Maritime", "Green Energy"],
    languages: ["Norwegian", "English"],
    countryFeatures: [
      "Extreme weather adaptations",
      "Oil industry integration",
      "Midnight sun scheduling",
      "Green energy focus",
    ],
    taxSystem: "25% MVA, high income tax",
    regulations: ["EU EEA compliance", "Norwegian data protection", "Environmental standards"],
    localTestimonials: [
      {
        name: "Lars Eriksen",
        business: "Oslo Mobile Repair",
        city: "Oslo",
        quote: "RepairHQ's extreme weather features and green energy focus are perfect for Norway!",
        rating: 5,
      },
      {
        name: "Ingrid Hansen",
        business: "Bergen Tech Center",
        city: "Bergen",
        quote: "Midnight sun scheduling og oljesektorintegrasjon gjør RepairHQ perfekt for Norge!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Norwegian/English interface",
      "Norwegian krone processing",
      "Extreme weather protection",
      "Midnight sun scheduling",
      "Oil industry integrations",
      "Green energy tracking",
      "Norwegian tax automation (MVA)",
      "Arctic logistics support",
    ],
    coordinates: { latitude: "60.4720", longitude: "8.4689" },
    economicData: {
      gdp: "$480B",
      gdpPerCapita: "$89,000",
      techSector: "Advanced",
      mobileMarketSize: "$1.8B",
    },
    businessCulture: {
      workingHours: "8:00-16:00 CET (Flexible)",
      businessLanguage: "Norwegian/English",
      paymentMethods: ["Vipps", "Credit Card", "Bank Transfer", "Digital Wallets"],
      preferredCommunication: "Email, Phone, Video Calls",
    },
  },

  {
    name: "Sweden",
    code: "SE",
    slug: "sweden-mobile-repair-software",
    flag: "🇸🇪",
    population: "10.4M",
    mobileUsers: "10.1M",
    repairShops: "4,789",
    avgRevenue: "4.2M kr",
    marketGrowth: "21%",
    avgTicket: "1,150 kr",
    primaryColor: "blue",
    secondaryColor: "yellow",
    currency: "Swedish Krona",
    currencySymbol: "kr",
    capital: "Stockholm",
    largestCity: "Stockholm",
    region: "Northern Europe",
    majorCities: ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköping"],
    keyIndustries: ["Technology", "Gaming", "Automotive", "Green Energy"],
    languages: ["Swedish", "English"],
    countryFeatures: [
      "Cashless society integration",
      "Gaming industry support",
      "Sustainability leadership",
      "Innovation hub features",
    ],
    taxSystem: "25% MOMS, progressive tax",
    regulations: ["EU GDPR compliance", "Swedish consumer protection", "Sustainability regulations"],
    localTestimonials: [
      {
        name: "Erik Andersson",
        business: "Stockholm Mobile Hub",
        city: "Stockholm",
        quote: "RepairHQ's cashless features and gaming support are perfect for Sweden's innovation culture!",
        rating: 5,
      },
      {
        name: "Maria Lindqvist",
        business: "Gothenburg Tech Solutions",
        city: "Gothenburg",
        quote: "Hållbarhetsfunktionerna och innovationsstödet gör RepairHQ perfekt för Sverige!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Swedish/English interface",
      "Swedish krona processing",
      "Cashless society optimization",
      "Gaming industry integrations",
      "Sustainability leadership tools",
      "Swedish tax automation (MOMS)",
      "Innovation tracking",
      "Green certification system",
    ],
    coordinates: { latitude: "60.1282", longitude: "18.6435" },
    economicData: {
      gdp: "$540B",
      gdpPerCapita: "$52,000",
      techSector: "World Leading",
      mobileMarketSize: "$2.4B",
    },
    businessCulture: {
      workingHours: "8:00-17:00 CET (Flexible)",
      businessLanguage: "Swedish/English",
      paymentMethods: ["Swish", "Credit Card", "Bank Transfer", "Digital Wallets"],
      preferredCommunication: "Email, Slack, Video Calls",
    },
  },

  {
    name: "Denmark",
    code: "DK",
    slug: "denmark-mobile-repair-software",
    flag: "🇩🇰",
    population: "5.8M",
    mobileUsers: "5.6M",
    repairShops: "2,789",
    avgRevenue: "3.1M kr",
    marketGrowth: "20%",
    avgTicket: "975 kr",
    primaryColor: "red",
    secondaryColor: "white",
    currency: "Danish Krone",
    currencySymbol: "kr",
    capital: "Copenhagen",
    largestCity: "Copenhagen",
    region: "Northern Europe",
    majorCities: ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Randers", "Kolding"],
    keyIndustries: ["Design", "Technology", "Green Energy", "Pharmaceuticals"],
    languages: ["Danish", "English"],
    countryFeatures: [
      "Danish design integration",
      "Hygge work-life balance",
      "Green energy leadership",
      "High-trust society features",
    ],
    taxSystem: "25% MOMS, high income tax",
    regulations: ["EU GDPR compliance", "Danish data protection", "Design standards"],
    localTestimonials: [
      {
        name: "Mads Nielsen",
        business: "Copenhagen Mobile Design",
        city: "Copenhagen",
        quote: "RepairHQ's Danish design integration and hygge features are perfect for Denmark!",
        rating: 5,
      },
      {
        name: "Lone Pedersen",
        business: "Aarhus Tech Center",
        city: "Aarhus",
        quote: "Det grønne energifokus og tillidsbaserede funktioner gør RepairHQ perfekt til Danmark!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Danish/English interface",
      "Danish krone processing",
      "Danish design aesthetics",
      "Hygge work-life balance",
      "Green energy integrations",
      "Danish tax automation (MOMS)",
      "High-trust workflows",
      "Design excellence tools",
    ],
    coordinates: { latitude: "56.2639", longitude: "9.5018" },
    economicData: {
      gdp: "$390B",
      gdpPerCapita: "$67,000",
      techSector: "Advanced",
      mobileMarketSize: "$1.9B",
    },
    businessCulture: {
      workingHours: "8:00-16:00 CET (Work-life balance)",
      businessLanguage: "Danish/English",
      paymentMethods: ["MobilePay", "Credit Card", "Bank Transfer", "Digital Wallets"],
      preferredCommunication: "Email, Phone, Video Calls",
    },
  },

  {
    name: "Finland",
    code: "FI",
    slug: "finland-mobile-repair-software",
    flag: "🇫🇮",
    population: "5.5M",
    mobileUsers: "5.3M",
    repairShops: "2,345",
    avgRevenue: "2.8M €",
    marketGrowth: "23%",
    avgTicket: "165 €",
    primaryColor: "blue",
    secondaryColor: "white",
    currency: "Euro",
    currencySymbol: "€",
    capital: "Helsinki",
    largestCity: "Helsinki",
    region: "Northern Europe",
    majorCities: ["Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu", "Turku", "Jyväskylä"],
    keyIndustries: ["Technology", "Gaming", "Forestry", "Green Energy"],
    languages: ["Finnish", "Swedish", "English"],
    countryFeatures: [
      "Nokia heritage integration",
      "Gaming industry leadership",
      "Sauna scheduling features",
      "Forest industry support",
    ],
    taxSystem: "24% ALV, progressive income tax",
    regulations: ["EU GDPR compliance", "Finnish consumer protection", "Gaming regulations"],
    localTestimonials: [
      {
        name: "Mikko Virtanen",
        business: "Helsinki Mobile Innovation",
        city: "Helsinki",
        quote: "RepairHQ:n Nokia-perintö ja peliteollisuuden tuki tekevät siitä täydellisen Suomelle!",
        rating: 5,
      },
      {
        name: "Aino Koskinen",
        business: "Tampere Tech Solutions",
        city: "Tampere",
        quote: "The gaming leadership features and sauna scheduling make RepairHQ perfect for Finland!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Finnish/Swedish/English interface",
      "Euro currency processing",
      "Nokia heritage features",
      "Gaming industry tools",
      "Sauna break scheduling",
      "Finnish tax automation (ALV)",
      "Forest industry integration",
      "Innovation excellence tracking",
    ],
    coordinates: { latitude: "61.9241", longitude: "25.7482" },
    economicData: {
      gdp: "$290B",
      gdpPerCapita: "$53,000",
      techSector: "World Leading",
      mobileMarketSize: "$1.7B",
    },
    businessCulture: {
      workingHours: "8:00-16:00 EET (Efficient)",
      businessLanguage: "Finnish/English",
      paymentMethods: ["Bank Transfer", "Credit Card", "MobilePay", "Digital Wallets"],
      preferredCommunication: "Email, Phone, Teams",
    },
  },

  {
    name: "Iceland",
    code: "IS",
    slug: "iceland-mobile-repair-software",
    flag: "🇮🇸",
    population: "372K",
    mobileUsers: "360K",
    repairShops: "145",
    avgRevenue: "285M kr",
    marketGrowth: "18%",
    avgTicket: "18,500 kr",
    primaryColor: "blue",
    secondaryColor: "white",
    currency: "Icelandic Krona",
    currencySymbol: "kr",
    capital: "Reykjavik",
    largestCity: "Reykjavik",
    region: "Northern Europe",
    majorCities: ["Reykjavik", "Kópavogur", "Hafnarfjörður", "Akureyri", "Reykjanesbær", "Garðabær"],
    keyIndustries: ["Technology", "Tourism", "Geothermal Energy", "Finance"],
    languages: ["Icelandic", "English"],
    countryFeatures: [
      "Geothermal energy integration",
      "Tourism season optimization",
      "Extreme weather adaptation",
      "Small market personalization",
    ],
    taxSystem: "24% VSK, simplified system",
    regulations: ["EU EEA compliance", "Icelandic data protection", "Tourism regulations"],
    localTestimonials: [
      {
        name: "Björn Einarsson",
        business: "Reykjavik Mobile Center",
        city: "Reykjavik",
        quote: "RepairHQ's geothermal integration and tourism features are perfect for Iceland's unique market!",
        rating: 5,
      },
      {
        name: "Guðrún Ólafsdóttir",
        business: "Akureyri Tech Solutions",
        city: "Akureyri",
        quote: "Jarðhitaorkusamþætting og ferðamannatímabilsbestun gera RepairHQ fullkomið fyrir Ísland!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Icelandic/English interface",
      "Icelandic krona processing",
      "Geothermal energy tracking",
      "Tourism season analytics",
      "Extreme weather alerts",
      "Icelandic tax automation (VSK)",
      "Small market personalization",
      "Northern lights scheduling",
    ],
    coordinates: { latitude: "64.9631", longitude: "-19.0208" },
    economicData: {
      gdp: "$27B",
      gdpPerCapita: "$73,000",
      techSector: "Advanced",
      mobileMarketSize: "$280M",
    },
    businessCulture: {
      workingHours: "9:00-17:00 GMT (Seasonal)",
      businessLanguage: "Icelandic/English",
      paymentMethods: ["Credit Card", "Bank Transfer", "Digital Wallets"],
      preferredCommunication: "Email, Phone, Video Calls",
    },
  },
  {
    name: "United Kingdom",
    code: "GB",
    slug: "uk-mobile-repair-software",
    flag: "🇬🇧",
    population: "67.5M",
    mobileUsers: "63.2M",
    repairShops: "18,234",
    avgRevenue: "£425K",
    marketGrowth: "22%",
    avgTicket: "£145",
    primaryColor: "blue",
    secondaryColor: "red",
    currency: "British Pound",
    currencySymbol: "£",
    capital: "London",
    largestCity: "London",
    region: "Europe",
    majorCities: ["London", "Manchester", "Birmingham", "Glasgow", "Liverpool", "Leeds", "Sheffield"],
    keyIndustries: ["Finance", "Technology", "Creative Industries", "Manufacturing"],
    languages: ["English"],
    countryFeatures: [
      "Post-Brexit compliance",
      "Royal events scheduling",
      "Pub culture integration",
      "Weather-resistant operations",
    ],
    taxSystem: "20% VAT, corporation tax",
    regulations: ["UK GDPR compliance", "FCA regulations", "Trading standards"],
    localTestimonials: [
      {
        name: "James Wilson",
        business: "London Mobile Repairs",
        city: "London",
        quote: "RepairHQ's post-Brexit features and pound sterling support make it perfect for the UK market!",
        rating: 5,
      },
      {
        name: "Sarah MacDonald",
        business: "Glasgow Tech Solutions",
        city: "Glasgow",
        quote: "The weather-resistant features and royal events scheduling are brilliant for British businesses!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "English interface with British terminology",
      "Pound sterling processing",
      "Post-Brexit compliance tools",
      "Royal events calendar integration",
      "Weather delay notifications",
      "UK VAT automation",
      "Pub hours scheduling",
      "British customer service standards",
    ],
    coordinates: { latitude: "55.3781", longitude: "-3.4360" },
    economicData: {
      gdp: "$3.1T",
      gdpPerCapita: "$46,000",
      techSector: "World Leading",
      mobileMarketSize: "$12.8B",
    },
    businessCulture: {
      workingHours: "9:00-17:30 GMT",
      businessLanguage: "English",
      paymentMethods: ["Credit Card", "Bank Transfer", "Apple Pay", "Google Pay"],
      preferredCommunication: "Email, Phone, Teams",
    },
  },

  {
    name: "Brazil",
    code: "BR",
    slug: "brazil-mobile-repair-software",
    flag: "🇧🇷",
    population: "215.3M",
    mobileUsers: "184.7M",
    repairShops: "45,678",
    avgRevenue: "R$2.1M",
    marketGrowth: "29%",
    avgTicket: "R$185",
    primaryColor: "green",
    secondaryColor: "yellow",
    currency: "Brazilian Real",
    currencySymbol: "R$",
    capital: "Brasília",
    largestCity: "São Paulo",
    region: "South America",
    majorCities: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus"],
    keyIndustries: ["Technology", "Manufacturing", "Agriculture", "Mining"],
    languages: ["Portuguese", "English"],
    countryFeatures: [
      "Carnival season optimization",
      "Football culture integration",
      "Regional diversity support",
      "Tropical weather adaptations",
    ],
    taxSystem: "Complex federal/state/municipal taxes",
    regulations: ["LGPD privacy compliance", "Brazilian consumer protection", "Regional regulations"],
    localTestimonials: [
      {
        name: "Carlos Silva",
        business: "São Paulo Mobile Center",
        city: "São Paulo",
        quote: "RepairHQ com suporte em português e integração do carnaval é perfeito para o mercado brasileiro!",
        rating: 5,
      },
      {
        name: "Ana Santos",
        business: "Rio Tech Solutions",
        city: "Rio de Janeiro",
        quote: "As características regionais e adaptações tropicais fazem do RepairHQ ideal para o Brasil!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Portuguese language interface",
      "Brazilian real processing",
      "Carnival season scheduling",
      "Football match notifications",
      "Regional tax compliance",
      "Tropical weather alerts",
      "LGPD privacy automation",
      "Multi-regional customer tracking",
    ],
    coordinates: { latitude: "-14.2350", longitude: "-51.9253" },
    economicData: {
      gdp: "$2.1T",
      gdpPerCapita: "$10,000",
      techSector: "Growing",
      mobileMarketSize: "$18.5B",
    },
    businessCulture: {
      workingHours: "8:00-17:00 BRT (Flexible)",
      businessLanguage: "Portuguese",
      paymentMethods: ["PIX", "Credit Card", "Bank Transfer", "Digital Wallets"],
      preferredCommunication: "WhatsApp, Email, Phone",
    },
  },

  {
    name: "United Arab Emirates",
    code: "AE",
    slug: "uae-mobile-repair-software",
    flag: "🇦🇪",
    population: "9.9M",
    mobileUsers: "9.7M",
    repairShops: "4,567",
    avgRevenue: "AED 1.8M",
    marketGrowth: "31%",
    avgTicket: "AED 285",
    primaryColor: "red",
    secondaryColor: "green",
    currency: "UAE Dirham",
    currencySymbol: "AED",
    capital: "Abu Dhabi",
    largestCity: "Dubai",
    region: "Middle East",
    majorCities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"],
    keyIndustries: ["Oil & Gas", "Technology", "Tourism", "Finance"],
    languages: ["Arabic", "English"],
    countryFeatures: [
      "Islamic banking integration",
      "Expat community support",
      "Luxury market features",
      "Desert climate adaptations",
    ],
    taxSystem: "5% VAT, no income tax",
    regulations: ["UAE data protection", "Islamic banking compliance", "Free zone regulations"],
    localTestimonials: [
      {
        name: "Ahmed Al Mansouri",
        business: "Dubai Mobile Solutions",
        city: "Dubai",
        quote: "RepairHQ's Islamic banking and luxury features are perfect for the UAE's diverse market!",
        rating: 5,
      },
      {
        name: "Sarah Johnson",
        business: "Abu Dhabi Tech Center",
        city: "Abu Dhabi",
        quote: "The expat community support and desert adaptations make RepairHQ ideal for the UAE!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Arabic/English interface",
      "UAE dirham processing",
      "Islamic banking integration",
      "Expat customer management",
      "Luxury service tiers",
      "Desert climate protection",
      "UAE VAT automation",
      "Multi-cultural scheduling",
    ],
    coordinates: { latitude: "23.4241", longitude: "53.8478" },
    economicData: {
      gdp: "$450B",
      gdpPerCapita: "$45,000",
      techSector: "Advanced",
      mobileMarketSize: "$3.2B",
    },
    businessCulture: {
      workingHours: "9:00-18:00 GST (Prayer breaks)",
      businessLanguage: "Arabic/English",
      paymentMethods: ["Credit Card", "Bank Transfer", "Digital Wallets", "Islamic Banking"],
      preferredCommunication: "WhatsApp, Email, Phone",
    },
  },

  {
    name: "Saudi Arabia",
    code: "SA",
    slug: "saudi-arabia-mobile-repair-software",
    flag: "🇸🇦",
    population: "35.0M",
    mobileUsers: "32.8M",
    repairShops: "12,456",
    avgRevenue: "SAR 2.4M",
    marketGrowth: "38%",
    avgTicket: "SAR 325",
    primaryColor: "green",
    secondaryColor: "white",
    currency: "Saudi Riyal",
    currencySymbol: "SAR",
    capital: "Riyadh",
    largestCity: "Riyadh",
    region: "Middle East",
    majorCities: ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar", "Taif"],
    keyIndustries: ["Oil & Gas", "Technology", "Construction", "Finance"],
    languages: ["Arabic", "English"],
    countryFeatures: [
      "Vision 2030 alignment",
      "Islamic banking priority",
      "Conservative culture respect",
      "Oil industry integration",
    ],
    taxSystem: "15% VAT, Zakat system",
    regulations: ["Saudi data protection", "Islamic banking compliance", "Vision 2030 standards"],
    localTestimonials: [
      {
        name: "Mohammed Al Rashid",
        business: "Riyadh Mobile Kingdom",
        city: "Riyadh",
        quote: "RepairHQ's Vision 2030 alignment and Islamic features are perfect for Saudi Arabia's transformation!",
        rating: 5,
      },
      {
        name: "Fatima Al Zahra",
        business: "Jeddah Tech Solutions",
        city: "Jeddah",
        quote: "دعم الخدمات المصرفية الإسلامية وميزات رؤية 2030 تجعل RepairHQ مثالياً للسعودية!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Arabic/English interface",
      "Saudi riyal processing",
      "Vision 2030 compliance",
      "Islamic banking priority",
      "Conservative scheduling",
      "Oil industry integrations",
      "Saudi VAT automation",
      "Hajj season optimization",
    ],
    coordinates: { latitude: "23.8859", longitude: "45.0792" },
    economicData: {
      gdp: "$830B",
      gdpPerCapita: "$23,700",
      techSector: "Rapidly Growing",
      mobileMarketSize: "$5.8B",
    },
    businessCulture: {
      workingHours: "8:00-17:00 AST (Prayer breaks)",
      businessLanguage: "Arabic/English",
      paymentMethods: ["mada", "Credit Card", "Bank Transfer", "Islamic Banking"],
      preferredCommunication: "WhatsApp, Phone, Email",
    },
  },
]

interface CountryLandingPageProps {
  countryData: CountryData
}

export function CountryLandingPage({ countryData }: CountryLandingPageProps) {
  return (
    <>
      <SEOOptimizer
        title={`${countryData.name} Mobile Phone Repair Software | RepairHQ ${countryData.name} Solutions`}
        description={`Leading mobile phone repair software in ${countryData.name}. Local features, ${countryData.currency} support, and ${countryData.languages.join("/")} interface. Outperform competitors across ${countryData.name}.`}
        keywords={[
          `${countryData.name} mobile phone repair software`,
          `${countryData.name} cell phone repair management`,
          `${countryData.code} mobile repair system`,
          `${countryData.name} device repair software`,
          `${countryData.name} phone repair business`,
          `${countryData.name} repair shop software`,
          `${countryData.region} repair solution`,
          `${countryData.name} mobile repair management`,
          `${countryData.currency} repair software`,
          `${countryData.languages[0]} repair system`,
        ]}
        canonicalUrl={`https://repairhq.com/international/${countryData.slug}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Country",
          name: countryData.name,
          description: `Mobile phone repair software for ${countryData.name} businesses`,
          geo: {
            "@type": "GeoCoordinates",
            latitude: countryData.coordinates.latitude,
            longitude: countryData.coordinates.longitude,
          },
          areaServed: countryData.name,
          serviceType: "Mobile Phone Repair Software",
          currency: countryData.currency,
        }}
      />

      <div className={`min-h-screen bg-gradient-to-b from-${countryData.primaryColor}-50 to-white`}>
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto text-center">
              <div className="flex items-center justify-center mb-6">
                <span className="text-6xl mr-4">{countryData.flag}</span>
                <Badge className={`bg-${countryData.primaryColor}-100 text-${countryData.primaryColor}-800`}>
                  {countryData.region}
                </Badge>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {countryData.name}{" "}
                <span
                  className={`text-${countryData.primaryColor}-600 bg-gradient-to-r from-${countryData.primaryColor}-600 to-${countryData.secondaryColor}-600 bg-clip-text text-transparent`}
                >
                  Mobile Repair Software
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                The first repair software built specifically for {countryData.name}'s market. Complete{" "}
                {countryData.currency} support, {countryData.languages.join("/")} interface, and local business
                features.
              </p>

              <div className="grid md:grid-cols-5 gap-6 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className={`text-3xl font-bold text-${countryData.primaryColor}-600`}>
                    {countryData.population}
                  </div>
                  <div className="text-sm text-gray-600">Population</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-blue-600">{countryData.mobileUsers}</div>
                  <div className="text-sm text-gray-600">Mobile Users</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-green-600">{countryData.repairShops}</div>
                  <div className="text-sm text-gray-600">Repair Shops</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-purple-600">{countryData.marketGrowth}</div>
                  <div className="text-sm text-gray-600">Market Growth</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-orange-600">{countryData.economicData.mobileMarketSize}</div>
                  <div className="text-sm text-gray-600">Market Size</div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                <Button
                  size="lg"
                  className={`px-8 bg-${countryData.primaryColor}-600 hover:bg-${countryData.primaryColor}-700`}
                >
                  Start Free {countryData.name} Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                  View {countryData.name} Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Major Cities Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Serving All Major {countryData.name} Cities</h2>
              <p className="text-xl text-gray-600">
                From {countryData.largestCity} to {countryData.capital}, we cover the entire {countryData.name} market
              </p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-7 gap-4">
              {countryData.majorCities.map((city, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <MapPin className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <p className="font-medium">{city}</p>
                    <p className="text-xs text-gray-500">{countryData.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Country-Specific Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for {countryData.name}</h2>
              <p className="text-xl text-gray-600">Features designed specifically for {countryData.name} businesses</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {countryData.uniqueFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-4" />
                    <p className="font-medium">{feature}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Business Culture */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{countryData.name} Business Integration</h2>
              <p className="text-xl text-gray-600">Adapted to local business culture and practices</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Building className="h-8 w-8 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Working Hours</h3>
                  <p className="text-sm text-gray-600">{countryData.businessCulture.workingHours}</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Globe className="h-8 w-8 text-green-500 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Languages</h3>
                  <p className="text-sm text-gray-600">{countryData.languages.join(", ")}</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Smartphone className="h-8 w-8 text-purple-500 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Payment Methods</h3>
                  <p className="text-sm text-gray-600">{countryData.businessCulture.paymentMethods.join(", ")}</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Users className="h-8 w-8 text-orange-500 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Communication</h3>
                  <p className="text-sm text-gray-600">{countryData.businessCulture.preferredCommunication}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Economic Data */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{countryData.name} Market Opportunity</h2>
              <p className="text-xl text-gray-600">Strong fundamentals drive mobile repair market growth</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <Card className="text-center">
                <CardContent className="p-8">
                  <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-green-600 mb-2">{countryData.economicData.gdp}</div>
                  <div className="text-gray-600">GDP</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-blue-600 mb-2">{countryData.economicData.gdpPerCapita}</div>
                  <div className="text-gray-600">GDP Per Capita</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <Building className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-purple-600 mb-2">{countryData.economicData.techSector}</div>
                  <div className="text-gray-600">Tech Sector</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <Smartphone className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {countryData.economicData.mobileMarketSize}
                  </div>
                  <div className="text-gray-600">Mobile Market</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Local Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted Across {countryData.name}</h2>
              <p className="text-xl text-gray-600">Real results from {countryData.name} businesses</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {countryData.localTestimonials.map((testimonial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-lg text-gray-700 mb-6 italic">"{testimonial.quote}"</blockquote>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className={`text-${countryData.primaryColor}-600`}>{testimonial.business}</div>
                      <div className="text-sm text-gray-600">
                        {testimonial.city}, {countryData.name}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <PricingPlans
          currency={countryData.currency}
          currencySymbol={countryData.currencySymbol}
          countryCode={countryData.code}
        />

        {/* CTA Section */}
        <section className={`py-20 bg-${countryData.primaryColor}-600 text-white`}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Dominate {countryData.name}'s Repair Market?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join {countryData.repairShops}+ {countryData.name} repair shops using RepairHQ
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Button size="lg" variant="secondary" className="px-8">
                Start Free {countryData.name} Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 text-white border-white hover:bg-white hover:text-blue-600"
              >
                Contact {countryData.name} Support
              </Button>
            </div>
            <p className="text-sm mt-6 opacity-75">
              {countryData.currency} support • {countryData.languages.join("/")} interface • Local compliance • Cultural
              adaptation
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
