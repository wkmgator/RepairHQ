"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Wrench, Clock, Star, CheckCircle } from "lucide-react"

export default function PhoneRepairLanding() {
  const features = [
    "Device diagnostics & repair tracking",
    "Parts inventory management",
    "Customer check-in system",
    "Warranty management",
    "SMS notifications",
    "Point of sale integration",
  ]

  const testimonials = [
    {
      name: "Mike's Phone Repair",
      location: "Austin, TX",
      quote: "RepairHQ increased our efficiency by 300%. We can handle 3x more repairs daily!",
      rating: 5,
    },
    {
      name: "TechFix Solutions",
      location: "Miami, FL",
      quote: "The inventory tracking alone saved us $50k in lost parts this year.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-800">#1 Phone Repair Software</Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Phone Repair Shop Management Made Simple
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your phone repair business with our all-in-one platform. Track repairs, manage inventory, and
            delight customers.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Smartphone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Device Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Track every device from check-in to completion. Support for iPhone, Samsung, Google Pixel, and more.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Wrench className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Repair Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Real-time repair status updates. Automated customer notifications via SMS and email.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Quick Turnaround</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Reduce repair time by 40% with streamlined workflows and automated processes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features List */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Everything You Need for Phone Repair Success</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Trusted by 1000+ Phone Repair Shops</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Phone Repair Business?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of repair shops already using RepairHQ to grow their business.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Your Free Trial Today
            </Button>
            <p className="mt-4 text-sm opacity-75">No credit card required • 14-day free trial</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
