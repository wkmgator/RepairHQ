"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Building, Crown } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Plan } from "@/lib/supabase-types"

interface PlanSelectorProps {
  onPlanSelect: (plan: Plan) => void
  selectedPlan?: Plan | null
  billingCycle: "monthly" | "yearly"
}

export function PlanSelector({ onPlanSelect, selectedPlan, billingCycle }: PlanSelectorProps) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("is_active", true)
        .order("price_monthly", { ascending: true })

      if (error) throw error
      setPlans(data || [])
    } catch (error) {
      console.error("Error fetching plans:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case "starter":
        return <Zap className="h-6 w-6 text-blue-600" />
      case "professional":
        return <Building className="h-6 w-6 text-purple-600" />
      case "enterprise":
        return <Crown className="h-6 w-6 text-orange-600" />
      case "franchise":
        return <Crown className="h-6 w-6 text-red-600" />
      default:
        return <Zap className="h-6 w-6 text-gray-600" />
    }
  }

  const getPrice = (plan: Plan) => {
    return billingCycle === "yearly" && plan.price_yearly ? plan.price_yearly : plan.price_monthly
  }

  const getMonthlyPrice = (plan: Plan) => {
    if (billingCycle === "yearly" && plan.price_yearly) {
      return plan.price_yearly / 12
    }
    return plan.price_monthly
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={`relative cursor-pointer transition-all hover:shadow-lg ${
            selectedPlan?.id === plan.id ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"
          }`}
          onClick={() => onPlanSelect(plan)}
        >
          {plan.name === "professional" && (
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">Most Popular</Badge>
          )}

          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">{getPlanIcon(plan.name)}</div>
            <CardTitle className="text-xl">{plan.display_name}</CardTitle>
            <CardDescription className="text-sm">{plan.description}</CardDescription>
          </CardHeader>

          <CardContent className="text-center">
            <div className="mb-6">
              <div className="text-3xl font-bold">
                ${Math.round(getMonthlyPrice(plan))}
                <span className="text-lg font-normal text-gray-600">/mo</span>
              </div>
              {billingCycle === "yearly" && plan.price_yearly && (
                <div className="text-sm text-green-600">
                  Save ${Math.round(plan.price_monthly * 12 - plan.price_yearly)} yearly
                </div>
              )}
            </div>

            <div className="space-y-3 text-left">
              {plan.max_stores && (
                <div className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{plan.max_stores === 1 ? "1 store" : `Up to ${plan.max_stores} stores`}</span>
                </div>
              )}

              {plan.max_users && (
                <div className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{plan.max_users === 1 ? "1 user" : `Up to ${plan.max_users} users`}</span>
                </div>
              )}

              {plan.max_customers && (
                <div className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{plan.max_customers.toLocaleString()} customers</span>
                </div>
              )}

              {plan.features &&
                Array.isArray(plan.features) &&
                plan.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}

              {plan.name === "franchise" && (
                <div className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Unlimited everything</span>
                </div>
              )}
            </div>

            <Button
              className={`w-full mt-6 ${
                selectedPlan?.id === plan.id ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-900 hover:bg-gray-800"
              }`}
              onClick={(e) => {
                e.stopPropagation()
                onPlanSelect(plan)
              }}
            >
              {selectedPlan?.id === plan.id ? "Selected" : "Select Plan"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
