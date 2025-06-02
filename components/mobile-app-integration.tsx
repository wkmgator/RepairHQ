"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Smartphone,
  Download,
  Bell,
  Camera,
  MapPin,
  CreditCard,
  Star,
  Users,
  TrendingUp,
  Shield,
  Wifi,
} from "lucide-react"

const mobileFeatures = [
  {
    id: 1,
    name: "Push Notifications",
    description: "Real-time updates for repair status and appointments",
    enabled: true,
    usage: 87,
    icon: Bell,
  },
  {
    id: 2,
    name: "Photo Upload",
    description: "Customers can upload device photos for diagnostics",
    enabled: true,
    usage: 92,
    icon: Camera,
  },
  {
    id: 3,
    name: "Location Services",
    description: "Find nearest store locations and get directions",
    enabled: true,
    usage: 76,
    icon: MapPin,
  },
  {
    id: 4,
    name: "Mobile Payments",
    description: "Secure in-app payment processing",
    enabled: true,
    usage: 94,
    icon: CreditCard,
  },
  {
    id: 5,
    name: "Offline Mode",
    description: "Basic functionality when internet is unavailable",
    enabled: false,
    usage: 0,
    icon: Wifi,
  },
]

const appMetrics = [
  { label: "Total Downloads", value: "12,450", change: "+23%", icon: Download },
  { label: "Active Users", value: "8,920", change: "+15%", icon: Users },
  { label: "App Rating", value: "4.7", change: "+0.2", icon: Star },
  { label: "Session Duration", value: "3.2 min", change: "+8%", icon: TrendingUp },
]

export function MobileAppIntegration() {
  const [selectedPlatform, setSelectedPlatform] = useState("ios")

  const toggleFeature = (featureId: number) => {
    console.log(`Toggling feature ${featureId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mobile App Integration</h2>
          <p className="text-muted-foreground">Manage your mobile app features and analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download APK
          </Button>
          <Button>
            <Smartphone className="mr-2 h-4 w-4" />
            App Store
          </Button>
        </div>
      </div>

      {/* App Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        {appMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                <Icon className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline mr-1 h-3 w-3 text-green-600" />
                  {metric.change} from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="features" className="space-y-4">
        <TabsList>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="notifications">Push Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Mobile App Features</CardTitle>
              <CardDescription>Configure and monitor app functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mobileFeatures.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <div key={feature.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{feature.name}</div>
                          <div className="text-sm text-muted-foreground">{feature.description}</div>
                          {feature.enabled && (
                            <div className="mt-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-muted-foreground">Usage:</span>
                                <Progress value={feature.usage} className="w-20 h-2" />
                                <span className="text-xs font-medium">{feature.usage}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={feature.enabled ? "default" : "secondary"}>
                          {feature.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch checked={feature.enabled} onCheckedChange={() => toggleFeature(feature.id)} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure push notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Repair Status Updates</div>
                    <div className="text-sm text-muted-foreground">Notify when repair status changes</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Appointment Reminders</div>
                    <div className="text-sm text-muted-foreground">24h and 2h before appointments</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Promotional Offers</div>
                    <div className="text-sm text-muted-foreground">Special deals and discounts</div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Device Ready</div>
                    <div className="text-sm text-muted-foreground">When repair is completed</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Latest push notifications sent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Bell className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Repair Complete</div>
                      <div className="text-xs text-muted-foreground">Your iPhone is ready for pickup</div>
                    </div>
                    <div className="text-xs text-muted-foreground">2h ago</div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Bell className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Appointment Reminder</div>
                      <div className="text-xs text-muted-foreground">Tomorrow at 2:00 PM</div>
                    </div>
                    <div className="text-xs text-muted-foreground">1d ago</div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Bell className="h-4 w-4 text-purple-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Special Offer</div>
                      <div className="text-xs text-muted-foreground">20% off screen protectors</div>
                    </div>
                    <div className="text-xs text-muted-foreground">3d ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Security Features</CardTitle>
                <CardDescription>App security and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-muted-foreground">SMS and email verification</div>
                    </div>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Biometric Login</div>
                      <div className="text-sm text-muted-foreground">Fingerprint and Face ID</div>
                    </div>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium">Data Encryption</div>
                      <div className="text-sm text-muted-foreground">End-to-end encryption</div>
                    </div>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>App Permissions</CardTitle>
                <CardDescription>Required permissions for app functionality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Camera Access</span>
                  <Badge variant="outline">Required</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Location Services</span>
                  <Badge variant="outline">Optional</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Push Notifications</span>
                  <Badge variant="outline">Optional</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Photo Library</span>
                  <Badge variant="outline">Optional</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Contacts</span>
                  <Badge variant="secondary">Not Used</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
