"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, ArrowRight, Users, Smartphone, Zap, Shield, Phone, Settings } from "lucide-react"
import Link from "next/link"

export default function EnterprisePlanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-purple-100 rounded-full">
                <Crown className="h-12 w-12 text-purple-600" />
              </div>
              <Badge className="ml-4 bg-purple-500 text-white">Advanced</Badge>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">Enterprise Plan</h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Advanced features for established repair businesses. Unlimited locations, custom integrations, and
              dedicated support for serious operations.
            </p>

            <div className="bg-white p-8 rounded-lg shadow-lg mb-12 max-w-md mx-auto border-2 border-purple-500">
              <div className="text-center">
                <span className="text-5xl font-bold text-purple-600">$99</span>
                <span className="text-gray-600 text-xl">/month</span>
                <p className="text-green-600 font-medium mt-2">30-day free trial included</p>
                <p className="text-purple-600 font-medium">Save $1,188 annually</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Link href="/auth/signup?plan=enterprise">
                <Button size="lg" className="px-8 bg-purple-600 hover:bg-purple-700">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything in Pro, Plus</h2>
            <p className="text-xl text-gray-600">Enterprise-grade features for serious businesses</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Unlimited Locations",
                description: "Manage any number of repair shop locations",
              },
              {
                icon: Smartphone,
                title: "Advanced Analytics Dashboard",
                description: "Deep insights with custom dashboards and KPIs",
              },
              {
                icon: Zap,
                title: "Full API Access",
                description: "Complete API access for custom integrations",
              },
              {
                icon: Settings,
                title: "Custom Integrations",
                description: "Connect with any business system or tool",
              },
              {
                icon: Users,
                title: "Unlimited User Accounts",
                description: "No limits on team size or user roles",
              },
              {
                icon: Phone,
                title: "Phone Support",
                description: "Direct phone line to our support team",
              },
              {
                icon: Crown,
                title: "Custom Branding",
                description: "White-label the system with your brand",
              },
              {
                icon: Zap,
                title: "Advanced Automation",
                description: "Complex workflows and business rule automation",
              },
              {
                icon: Shield,
                title: "Priority Feature Requests",
                description: "Your feature requests get priority development",
              },
              {
                icon: Users,
                title: "Dedicated Account Manager",
                description: "Personal account manager for your business",
              },
              {
                icon: Settings,
                title: "Custom Training",
                description: "Personalized training for your team",
              },
              {
                icon: Shield,
                title: "SLA Guarantee",
                description: "99.9% uptime guarantee with SLA",
              },
              {
                icon: Crown,
                title: "Advanced Security",
                description: "Enterprise-grade security and compliance",
              },
              {
                icon: Smartphone,
                title: "Data Export Tools",
                description: "Advanced data export and backup tools",
              },
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {feature.icon && <feature.icon className="h-12 w-12 text-purple-600 mx-auto mb-4" />}
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Perfect For Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Perfect For</h2>
            <p className="text-xl text-gray-600">Ideal for these established repair businesses</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Large Repair Chains",
                description: "Multiple locations requiring centralized management",
                features: ["Unlimited locations", "Centralized reporting", "Advanced analytics"],
              },
              {
                title: "Established Businesses",
                description: "Mature operations needing advanced features and customization",
                features: ["Custom branding", "API integrations", "Advanced automation"],
              },
              {
                title: "High-Volume Operations",
                description: "Businesses processing hundreds of repairs monthly",
                features: ["Unlimited everything", "Priority support", "SLA guarantee"],
              },
            ].map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {type.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Enterprise Benefits</h2>
            <p className="text-xl text-gray-600">What makes Enterprise different</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-bold">99.9% Uptime SLA</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Guaranteed uptime with service level agreement. Your business never stops.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">24/7 monitoring</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Automatic failover</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Performance guarantees</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-bold">Dedicated Account Manager</h3>
              </div>
              <p className="text-gray-600 mb-4">Personal account manager who understands your business and goals.</p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Regular check-ins</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Strategic planning</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Priority escalation</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8">
              <div className="flex items-center mb-4">
                <Settings className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-bold">Custom Development</h3>
              </div>
              <p className="text-gray-600 mb-4">Custom features and integrations built specifically for your needs.</p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Custom workflows</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">API integrations</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Bespoke features</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8">
              <div className="flex items-center mb-4">
                <Crown className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-bold">White-Label Solution</h3>
              </div>
              <p className="text-gray-600 mb-4">Complete branding customization to match your business identity.</p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Custom logo & colors</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Custom domain</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Branded customer portal</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready for Enterprise-Grade Features?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join established repair businesses using RepairHQ Enterprise to scale operations.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Link href="/auth/signup?plan=enterprise">
              <Button size="lg" variant="secondary" className="px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="px-8 text-white border-white hover:bg-white hover:text-purple-600"
            >
              Contact Sales
            </Button>
          </div>
          <p className="text-sm mt-4 opacity-75">30-day free trial • Dedicated onboarding • Cancel anytime</p>
        </div>
      </section>
    </div>
  )
}
