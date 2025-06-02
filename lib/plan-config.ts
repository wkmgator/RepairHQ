export interface PlanLimits {
  name: string
  displayName: string
  price: {
    monthly: number
    yearly: number
  }
  limits: {
    locations: number | "unlimited"
    users: number | "unlimited"
    customers: number | "unlimited"
    inventory: number | "unlimited"
    storage: string
  }
  features: string[]
  popular?: boolean
}

export const planConfigs: Record<string, PlanLimits> = {
  starter: {
    name: "starter",
    displayName: "Starter",
    price: {
      monthly: 29,
      yearly: 290,
    },
    limits: {
      locations: 1,
      users: 3,
      customers: 500,
      inventory: 1000,
      storage: "5GB",
    },
    features: [
      "Basic ticket management",
      "Customer database",
      "Inventory tracking",
      "Basic reporting",
      "Email support",
    ],
  },
  pro: {
    name: "pro",
    displayName: "Pro",
    price: {
      monthly: 79,
      yearly: 790,
    },
    limits: {
      locations: 5,
      users: 12,
      customers: 2500,
      inventory: 5000,
      storage: "25GB",
    },
    features: [
      "Advanced ticket management",
      "Multi-location support",
      "Advanced reporting",
      "API access",
      "Priority support",
      "Custom fields",
    ],
    popular: true,
  },
  enterprise: {
    name: "enterprise",
    displayName: "Enterprise",
    price: {
      monthly: 199,
      yearly: 1990,
    },
    limits: {
      locations: 10,
      users: 25,
      customers: 10000,
      inventory: 25000,
      storage: "100GB",
    },
    features: [
      "Everything in Pro",
      "Advanced analytics",
      "Custom integrations",
      "Dedicated support",
      "Custom branding",
      "Advanced security",
    ],
  },
  franchise: {
    name: "franchise",
    displayName: "Franchise",
    price: {
      monthly: 499,
      yearly: 4990,
    },
    limits: {
      locations: "unlimited",
      users: "unlimited",
      customers: "unlimited",
      inventory: "unlimited",
      storage: "Unlimited",
    },
    features: [
      "Everything in Enterprise",
      "Unlimited locations",
      "Franchise management",
      "Territory management",
      "White-label solution",
      "Custom development",
    ],
  },
}

export const getDefaultPlan = () => planConfigs.starter
