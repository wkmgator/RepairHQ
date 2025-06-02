export interface VerticalLandingData {
  slug: string
  title: string
  description: string
  h1: string
  subtitle: string
  keywords: string[]
  features: string[]
  benefits: string[]
  testimonials: {
    name: string
    business: string
    quote: string
    rating: number
    image?: string
  }[]
  faq: {
    question: string
    answer: string
  }[]
  ctaText: string
  heroImage: string
}

export const verticalLandingData: Record<string, VerticalLandingData> = {
  "phone-repair": {
    slug: "phone-repair",
    title: "Top-Rated Phone Repair Shop Software | RepairHQ",
    description:
      "Run your phone repair business like a pro with RepairHQ. POS, inventory, tickets, SMS alerts, GBT crypto rewards, and more – all-in-one platform.",
    h1: "Phone Repair Software Built for Speed",
    subtitle:
      "Manage repairs, inventory, and customers with the #1 phone repair POS system. Get paid faster with built-in crypto rewards.",
    keywords: [
      "phone repair software",
      "cell phone POS",
      "repair shop software",
      "repairhq",
      "mobile repair management",
    ],
    features: [
      "IMEI tracking & device history",
      "Parts inventory with auto-reorder",
      "Customer SMS notifications",
      "Repair ticket management",
      "Integrated POS system",
      "GBT crypto rewards program",
    ],
    benefits: [
      "Reduce repair time by 40%",
      "Increase customer satisfaction",
      "Automate inventory management",
      "Boost revenue with crypto rewards",
    ],
    testimonials: [
      {
        name: "Mike Chen",
        business: "TechFix Mobile",
        quote: "RepairHQ transformed our phone repair shop. We process 3x more repairs daily!",
        rating: 5,
      },
      {
        name: "Sarah Johnson",
        business: "QuickFix Phones",
        quote: "The IMEI tracking and SMS alerts keep our customers happy and coming back.",
        rating: 5,
      },
    ],
    faq: [
      {
        question: "Does RepairHQ work with all phone models?",
        answer:
          "Yes! RepairHQ supports iPhone, Samsung, Google Pixel, and all major Android devices with comprehensive parts databases.",
      },
      {
        question: "Can I track warranty information?",
        answer: "Absolutely. RepairHQ automatically tracks warranty periods and sends alerts before expiration.",
      },
    ],
    ctaText: "Start Your Free Phone Repair Trial",
    heroImage: "/images/verticals/phone-repair-hero.png",
  },
  "appliance-repair": {
    slug: "appliance-repair",
    title: "Powerful Appliance Repair Business Software | RepairHQ",
    description:
      "POS, dispatch, job tracking, and customer scheduling for appliance repair shops. Grow smarter with RepairHQ.",
    h1: "Modern Appliance Repair Shop Management",
    subtitle:
      "Schedule in-home repairs, manage technicians, and track parts inventory all from one powerful dashboard.",
    keywords: [
      "appliance repair software",
      "appliance repair POS",
      "job tracking software",
      "field service management",
    ],
    features: [
      "In-home service scheduling",
      "Route optimization for technicians",
      "Appliance model database",
      "Parts compatibility checker",
      "Customer communication portal",
      "Mobile technician app",
    ],
    benefits: [
      "Optimize technician routes",
      "Reduce callback rates",
      "Improve first-time fix rates",
      "Increase customer satisfaction",
    ],
    testimonials: [
      {
        name: "David Martinez",
        business: "Home Appliance Pros",
        quote: "The scheduling system transformed our business. No more double bookings!",
        rating: 5,
      },
    ],
    faq: [
      {
        question: "Does it work for both residential and commercial appliances?",
        answer: "Yes, RepairHQ handles everything from home refrigerators to commercial kitchen equipment.",
      },
    ],
    ctaText: "Optimize Your Appliance Business",
    heroImage: "/images/verticals/appliance-repair-hero.png",
  },
  "auto-repair": {
    slug: "auto-repair",
    title: "Auto Repair Software with POS & Inventory | RepairHQ",
    description:
      "Run your auto shop smarter – RepairHQ includes parts inventory, customer check-ins, repair tickets, and more.",
    h1: "Smarter Auto Shop Software",
    subtitle: "From oil changes to engine rebuilds, manage every aspect of your automotive repair business.",
    keywords: ["auto repair POS", "auto shop software", "mechanic POS", "automotive management system"],
    features: [
      "VIN lookup & vehicle history",
      "Diagnostic code integration",
      "Parts ordering system",
      "Service bay scheduling",
      "Customer check-in kiosk",
      "Digital vehicle inspection",
    ],
    benefits: [
      "Faster vehicle diagnostics",
      "Streamlined parts ordering",
      "Improved bay utilization",
      "Enhanced customer trust",
    ],
    testimonials: [
      {
        name: "Tom Wilson",
        business: "Wilson Auto Care",
        quote: "The VIN lookup feature saves us hours every day. Game changer!",
        rating: 5,
      },
    ],
    faq: [
      {
        question: "Does it integrate with parts suppliers?",
        answer: "Yes, RepairHQ connects with major auto parts suppliers for real-time pricing and availability.",
      },
    ],
    ctaText: "Modernize Your Auto Shop",
    heroImage: "/images/verticals/auto-repair-hero.png",
  },
  "aerospace-repair": {
    slug: "aerospace-repair",
    title: "Aerospace & Aircraft Maintenance Software | RepairHQ",
    description:
      "Manage aircraft repair, inventory, work orders and compliance all from one dashboard. RepairHQ is trusted by serious aerospace shops.",
    h1: "Aerospace Maintenance. Simplified.",
    subtitle:
      "FAA-compliant maintenance tracking, parts traceability, and work order management for aviation professionals.",
    keywords: ["aerospace repair software", "aircraft maintenance software", "MRO tools", "aviation management"],
    features: [
      "FAA compliance tracking",
      "Aircraft registration lookup",
      "Parts traceability system",
      "Maintenance scheduling",
      "Airworthiness directives",
      "Digital logbook entries",
    ],
    benefits: [
      "Ensure FAA compliance",
      "Reduce maintenance errors",
      "Streamline inspections",
      "Improve aircraft availability",
    ],
    testimonials: [
      {
        name: "Captain James Rodriguez",
        business: "Skyline Aviation",
        quote: "RepairHQ keeps us compliant and our aircraft flying safely.",
        rating: 5,
      },
    ],
    faq: [
      {
        question: "Is RepairHQ FAA certified?",
        answer: "RepairHQ follows FAA guidelines and helps maintain compliance with Part 145 requirements.",
      },
    ],
    ctaText: "Elevate Your Aviation Business",
    heroImage: "/images/verticals/aerospace-repair-hero.png",
  },
  "digital-devices-gaming": {
    slug: "digital-devices-gaming",
    title: "Gaming Console & Electronics Repair Software | RepairHQ",
    description:
      "Manage repairs for gaming consoles, PCs, tablets, and electronics. Track components, warranties, and customer devices.",
    h1: "Master Your Electronics & Gaming Repairs",
    subtitle: "From PlayStation repairs to PC builds, manage all your digital device services in one platform.",
    keywords: ["gaming console repair", "electronics repair software", "PC repair management", "device tracking"],
    features: [
      "Device serial tracking",
      "Component inventory",
      "Gaming console diagnostics",
      "PC build management",
      "Warranty tracking",
      "Customer device history",
    ],
    benefits: [
      "Track complex repairs",
      "Manage component inventory",
      "Reduce diagnostic time",
      "Improve repair accuracy",
    ],
    testimonials: [
      {
        name: "Alex Chen",
        business: "GameFix Pro",
        quote: "Perfect for our gaming console and PC repair business!",
        rating: 5,
      },
    ],
    faq: [
      {
        question: "Does it support all gaming consoles?",
        answer: "Yes, RepairHQ supports PlayStation, Xbox, Nintendo, and PC gaming systems.",
      },
    ],
    ctaText: "Level Up Your Repair Game",
    heroImage: "/images/verticals/gaming-repair-hero.png",
  },
}

export function getVerticalLandingData(slug: string): VerticalLandingData | null {
  return verticalLandingData[slug] || null
}

export function getAllVerticalSlugs(): string[] {
  return Object.keys(verticalLandingData)
}
