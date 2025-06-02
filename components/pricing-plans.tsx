"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Crown, Building, X } from "lucide-react"
import Link from "next/link"

interface PricingPlansProps {
  currency?: string
  currencySymbol?: string
  countryCode?: string
  showTrialInfo?: boolean
}

export const pricingPlans = [
  {
    id: "starter",
    name: "Starter Plan",
    price: 29,
    description: "Perfect for small repair shops just getting started",
    icon: Zap,
    popular: false,
    features: [
      "Up to 100 customers",
      "Basic ticket management",
      "Simple inventory tracking",
      "Email support",
      "1 user account",
      "Basic reporting",
      "Mobile app access",
      "Customer notifications",
      "Basic templates",
      "30-day free trial",
    ],
    limitations: [
      "Limited to 50 tickets/month",
      "Basic templates only",
      "No advanced analytics",
      "No API access",
      "No custom branding",
    ],
  },
  {
    id: "pro",
    name: "Pro Plan",
    price: 59,
    description: "Most popular choice for growing repair businesses",
    icon: Star,
    popular: true,
    features: [
      "Unlimited customers",
      "Advanced ticket management",
      "Full inventory management",
      "Priority email & chat support",
      "Up to 5 user accounts",
      "Advanced reporting & analytics",
      "Mobile app access",
      "Customer portal",
      "Automated workflows",
      "SMS notifications",
      "Custom templates",
      "Barcode scanning",
      "Multi-location support (up to 3)",
      "API access",
      "30-day free trial",
    ],
    limitations: ["Limited to 3 locations", "No white-label branding", "No dedicated support"],
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    price: 99,
    description: "Advanced features for established repair businesses",
    icon: Crown,
    popular: false,
    features: [
      "Everything in Pro",
      "Unlimited locations",
      "Advanced analytics dashboard",
      "Full API access",
      "Custom integrations",
      "Unlimited user accounts",
      "Phone support",
      "Custom branding",
      "Advanced automation",
      "Priority feature requests",
      "Dedicated account manager",
      "Custom training",
      "SLA guarantee",
      "Advanced security features",
      "Data export tools",
      "30-day free trial",
    ],
    limitations: ["No white-label solution", "No franchise management tools"],
  },
  {
    id: "franchise",
    name: "Franchise Plan",
    price: 199,
    description: "Complete solution for franchise operations and multi-brand businesses",
    icon: Building,
    popular: false,
    features: [
      "Everything in Enterprise",
      "Unlimited locations & franchises",
      "Franchise management tools",
      "Centralized reporting across all locations",
      "White-label solution",
      "Multi-brand support",
      "Franchise performance analytics",
      "Territory management",
      "Royalty tracking",
      "Franchise onboarding system",
      "Custom franchise portal",
      "Dedicated franchise support team",
      "24/7 phone support",
      "Custom development",
      "Franchise compliance tools",
      "30-day free trial",
    ],
    limitations: [],
  },
]

export function PricingPlans({
  currency = "USD",
  currencySymbol = "$",
  countryCode = "US",
  showTrialInfo = true,
}: PricingPlansProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")

  const getLocalizedPrice = (basePrice: number) => {
    // Price localization based on country
    const priceMultipliers: Record<string, number> = {
      US: 1.0,
      CA: 1.35,
      GB: 0.85,
      EU: 0.95,
      AU: 1.45,
      IN: 0.25,
      BR: 0.35,
      MX: 0.45,
      UA: 0.15,
      PK: 0.12,
    }

    const multiplier = priceMultipliers[countryCode] || 1.0
    const localPrice = Math.round(basePrice * multiplier)

    if (billingCycle === "annual") {
      return Math.round(localPrice * 0.83) // 17% annual discount
    }

    return localPrice
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-600 mb-8">
            Start with a 30-day free trial. Credit card required, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${billingCycle === "monthly" ? "text-gray-900 font-medium" : "text-gray-500"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                billingCycle === "annual" ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === "annual" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`ml-3 ${billingCycle === "annual" ? "text-gray-900 font-medium" : "text-gray-500"}`}>
              Annual
            </span>
            {billingCycle === "annual" && <Badge className="ml-2 bg-green-100 text-green-800">Save 17%</Badge>}
          </div>

          {showTrialInfo && (
            <div className="inline-flex items-center space-x-4 bg-blue-50 px-6 py-3 rounded-full">
              <span className="text-blue-600 font-medium">✓ 30-day free trial</span>
              <span className="text-blue-600 font-medium">✓ Credit card required</span>
              <span className="text-blue-600 font-medium">✓ Cancel anytime</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingPlans.map((plan) => {
            const Icon = plan.icon
            const localPrice = getLocalizedPrice(plan.price)

            return (
              <Card
                key={plan.id}
                className={`relative ${plan.popular ? "border-blue-500 shadow-lg scale-105" : "border-gray-200"}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {currencySymbol}
                      {localPrice}
                    </span>
                    <span className="text-gray-600">/{billingCycle === "monthly" ? "month" : "year"}</span>
                  </div>
                  {billingCycle === "annual" && (
                    <p className="text-sm text-green-600 font-medium mt-1">
                      Save {currencySymbol}
                      {getLocalizedPrice(plan.price) * 12 - localPrice} annually
                    </p>
                  )}
                  {showTrialInfo && (
                    <p className="text-sm text-green-600 font-medium mt-2">30-day free trial included</p>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium text-gray-500 mb-2">Limitations:</p>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start">
                            <X className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                            <span className="text-sm text-gray-500">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-4">
                    <Link href={`/auth/signup?plan=${plan.id}&billing=${billingCycle}&country=${countryCode}`}>
                      <Button
                        className={`w-full ${
                          plan.popular ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-900 hover:bg-gray-800"
                        }`}
                      >
                        Start Free Trial
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Need a custom solution? Contact our sales team for enterprise pricing.</p>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
            <Button variant="outline" size="lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PricingPlans
