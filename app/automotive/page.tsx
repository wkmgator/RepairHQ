import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, Bike, Circle, Droplet, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AutomotiveServicesPage() {
  return (
    <div className="container mx-auto py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          RepairHQ for <span className="text-red-600">Automotive Services</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          The complete management solution for auto repair shops, motorcycle service centers, tire shops, and quick lube
          facilities.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button size="lg" asChild>
            <Link href="/onboarding">
              Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/demo">Schedule Demo</Link>
          </Button>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/90 to-red-800/90 mix-blend-multiply" />
        <Image
          src="/placeholder.svg?height=500&width=1200&query=auto repair shop with mechanics working on cars"
          alt="Automotive repair shop"
          width={1200}
          height={500}
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-xl text-white">
              <h2 className="text-3xl font-bold mb-4">Streamline Your Automotive Service Business</h2>
              <p className="text-lg mb-6">
                From appointment scheduling to inventory management, RepairHQ helps you run your automotive service
                business more efficiently.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                  <span>Manage appointments and service schedules</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                  <span>Track vehicle service history and customer information</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                  <span>Manage parts inventory and vendor relationships</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                  <span>Process payments and generate detailed invoices</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="auto" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-3xl mx-auto">
          <TabsTrigger value="auto">Auto Repair</TabsTrigger>
          <TabsTrigger value="motorcycle">Motorcycle</TabsTrigger>
          <TabsTrigger value="tire">Tire Service</TabsTrigger>
          <TabsTrigger value="oil">Oil & Lube</TabsTrigger>
        </TabsList>

        <TabsContent value="auto" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-800 mb-4">
                <Car className="mr-2 h-4 w-4" />
                Auto Repair
              </div>
              <h2 className="text-3xl font-bold mb-4">Complete Auto Repair Shop Management</h2>
              <p className="text-lg text-muted-foreground mb-6">
                RepairHQ provides everything you need to manage your auto repair shop, from scheduling to invoicing and
                everything in between.
              </p>
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Service History Tracking</h3>
                    <p className="text-muted-foreground">
                      Keep detailed records of all services performed on each vehicle.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Digital Vehicle Inspections</h3>
                    <p className="text-muted-foreground">
                      Perform and document inspections with photos and notes for customers.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Parts Ordering & Management</h3>
                    <p className="text-muted-foreground">
                      Track parts inventory, create purchase orders, and manage vendors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600&query=mechanic working on car engine in auto repair shop"
                alt="Auto repair shop"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="motorcycle" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center rounded-lg bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800 mb-4">
                <Bike className="mr-2 h-4 w-4" />
                Motorcycle Repair
              </div>
              <h2 className="text-3xl font-bold mb-4">Specialized Motorcycle Service Management</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Manage your motorcycle repair shop with tools designed specifically for motorcycle service centers.
              </p>
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Motorcycle-Specific Service Templates</h3>
                    <p className="text-muted-foreground">
                      Pre-built service templates for common motorcycle repairs and maintenance.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Seasonal Service Reminders</h3>
                    <p className="text-muted-foreground">
                      Automated reminders for seasonal maintenance and storage preparation.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Performance Modifications Tracking</h3>
                    <p className="text-muted-foreground">
                      Track performance upgrades and modifications for each motorcycle.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600&query=mechanic working on motorcycle in repair shop"
                alt="Motorcycle repair shop"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tire" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 mb-4">
                <Circle className="mr-2 h-4 w-4" />
                Tire Service
              </div>
              <h2 className="text-3xl font-bold mb-4">Streamlined Tire Shop Management</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Manage your tire shop efficiently with tools designed for tire sales, installation, and service.
              </p>
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Tire Inventory Management</h3>
                    <p className="text-muted-foreground">
                      Track tire inventory by size, brand, model, and location in your warehouse.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">TPMS Service Tracking</h3>
                    <p className="text-muted-foreground">Manage TPMS sensors, programming, and replacement services.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Seasonal Changeover Management</h3>
                    <p className="text-muted-foreground">
                      Schedule and manage seasonal tire changeovers and storage services.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600&query=mechanic changing tires in tire shop"
                alt="Tire shop"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="oil" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center rounded-lg bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 mb-4">
                <Droplet className="mr-2 h-4 w-4" />
                Oil Change & Lube
              </div>
              <h2 className="text-3xl font-bold mb-4">Quick Lube Service Management</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Optimize your quick lube or oil change business with tools designed for fast service operations.
              </p>
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Quick Service Workflows</h3>
                    <p className="text-muted-foreground">Streamlined workflows designed for fast service operations.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Service Reminder System</h3>
                    <p className="text-muted-foreground">
                      Automated service reminders based on mileage or time intervals.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Fluid Inventory Management</h3>
                    <p className="text-muted-foreground">
                      Track bulk oil and fluid inventory with automatic usage calculations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600&query=mechanic changing oil in quick lube service center"
                alt="Oil change service"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Automotive-Specific Features</CardTitle>
            <CardDescription>Tailored tools for automotive service businesses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
              <span>VIN decoding and vehicle information lookup</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
              <span>Service interval tracking and maintenance reminders</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
              <span>Digital vehicle inspection forms with photos</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
              <span>Labor time guides and service pricing</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
              <span>Multi-point inspection checklists</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Management</CardTitle>
            <CardDescription>Tools to run your automotive business efficiently</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
              <span>Appointment scheduling and bay management</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
              <span>Customer communication tools (SMS, email)</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
              <span>Parts ordering and inventory management</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
              <span>Employee time tracking and performance metrics</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
              <span>Financial reporting and business analytics</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Experience</CardTitle>
            <CardDescription>Enhance your customer service and retention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
              <span>Customer portal for service history and appointments</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
              <span>Digital approval for additional services</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
              <span>Automated service reminders and follow-ups</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
              <span>Online appointment booking</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
              <span>Customer loyalty and rewards program</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-red-50 rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to transform your automotive service business?</h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join thousands of automotive service businesses that trust RepairHQ to streamline their operations and improve
          customer satisfaction.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/onboarding">
              Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
