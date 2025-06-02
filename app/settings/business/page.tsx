"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseClient } from "@/lib/supabase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Clock, DollarSign, Settings, Bell, Shield } from "lucide-react"

interface BusinessSettings {
  business_name: string
  business_type: string
  address: string
  city: string
  state: string
  zip_code: string
  phone: string
  email: string
  website: string
  description: string
  logo_url?: string
  timezone: string
  currency: string
  tax_rate: number
  business_hours: {
    monday: { open: string; close: string; closed: boolean }
    tuesday: { open: string; close: string; closed: boolean }
    wednesday: { open: string; close: string; closed: boolean }
    thursday: { open: string; close: string; closed: boolean }
    friday: { open: string; close: string; closed: boolean }
    saturday: { open: string; close: string; closed: boolean }
    sunday: { open: string; close: string; closed: boolean }
  }
  notifications: {
    email_notifications: boolean
    sms_notifications: boolean
    appointment_reminders: boolean
    low_stock_alerts: boolean
    payment_confirmations: boolean
  }
  features: {
    online_booking: boolean
    customer_portal: boolean
    loyalty_program: boolean
    multi_location: boolean
    advanced_reporting: boolean
  }
}

const defaultBusinessHours = {
  monday: { open: "09:00", close: "17:00", closed: false },
  tuesday: { open: "09:00", close: "17:00", closed: false },
  wednesday: { open: "09:00", close: "17:00", closed: false },
  thursday: { open: "09:00", close: "17:00", closed: false },
  friday: { open: "09:00", close: "17:00", closed: false },
  saturday: { open: "09:00", close: "15:00", closed: false },
  sunday: { open: "10:00", close: "14:00", closed: true },
}

const defaultNotifications = {
  email_notifications: true,
  sms_notifications: false,
  appointment_reminders: true,
  low_stock_alerts: true,
  payment_confirmations: true,
}

const defaultFeatures = {
  online_booking: false,
  customer_portal: false,
  loyalty_program: false,
  multi_location: false,
  advanced_reporting: true,
}

export default function BusinessSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<BusinessSettings>({
    business_name: "",
    business_type: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    timezone: "America/New_York",
    currency: "USD",
    tax_rate: 8.25,
    business_hours: defaultBusinessHours,
    notifications: defaultNotifications,
    features: defaultFeatures,
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("business_settings").select("*").single()

      if (error && error.code !== "PGRST116") throw error

      if (data) {
        setSettings({
          ...settings,
          ...data,
          business_hours: data.business_hours || defaultBusinessHours,
          notifications: data.notifications || defaultNotifications,
          features: data.features || defaultFeatures,
        })
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast({
        title: "Error",
        description: "Failed to load business settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("business_settings").upsert({
        ...settings,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Business settings saved successfully",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save business settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const updateBusinessHours = (day: string, field: string, value: string | boolean) => {
    setSettings({
      ...settings,
      business_hours: {
        ...settings.business_hours,
        [day]: {
          ...settings.business_hours[day as keyof typeof settings.business_hours],
          [field]: value,
        },
      },
    })
  }

  const updateNotifications = (key: string, value: boolean) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    })
  }

  const updateFeatures = (key: string, value: boolean) => {
    setSettings({
      ...settings,
      features: {
        ...settings.features,
        [key]: value,
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Business Settings</h1>
          <p className="text-muted-foreground">Configure your business information and preferences</p>
        </div>
        <Button onClick={saveSettings} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="hours">Business Hours</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Business Information
              </CardTitle>
              <CardDescription>Basic information about your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business_name">Business Name</Label>
                  <Input
                    id="business_name"
                    value={settings.business_name}
                    onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="business_type">Business Type</Label>
                  <Input
                    id="business_type"
                    value={settings.business_type}
                    onChange={(e) => setSettings({ ...settings, business_type: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={settings.city}
                    onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={settings.state}
                    onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="zip_code">ZIP Code</Label>
                  <Input
                    id="zip_code"
                    value={settings.zip_code}
                    onChange={(e) => setSettings({ ...settings, zip_code: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={settings.website}
                  onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Settings
              </CardTitle>
              <CardDescription>Configure currency and tax settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    className="w-full p-2 border rounded"
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                  <Input
                    id="tax_rate"
                    type="number"
                    step="0.01"
                    value={settings.tax_rate}
                    onChange={(e) => setSettings({ ...settings, tax_rate: Number.parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  className="w-full p-2 border rounded"
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Business Hours
              </CardTitle>
              <CardDescription>Set your operating hours for each day of the week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.business_hours).map(([day, hours]) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-24">
                    <Label className="capitalize">{day}</Label>
                  </div>
                  <Switch
                    checked={!hours.closed}
                    onCheckedChange={(checked) => updateBusinessHours(day, "closed", !checked)}
                  />
                  {!hours.closed && (
                    <>
                      <div>
                        <Input
                          type="time"
                          value={hours.open}
                          onChange={(e) => updateBusinessHours(day, "open", e.target.value)}
                          className="w-32"
                        />
                      </div>
                      <span>to</span>
                      <div>
                        <Input
                          type="time"
                          value={hours.close}
                          onChange={(e) => updateBusinessHours(day, "close", e.target.value)}
                          className="w-32"
                        />
                      </div>
                    </>
                  )}
                  {hours.closed && <span className="text-muted-foreground">Closed</span>}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label className="capitalize">{key.replace(/_/g, " ")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {key === "email_notifications" && "Receive notifications via email"}
                      {key === "sms_notifications" && "Receive notifications via SMS"}
                      {key === "appointment_reminders" && "Send appointment reminders to customers"}
                      {key === "low_stock_alerts" && "Get alerts when inventory is low"}
                      {key === "payment_confirmations" && "Send payment confirmations to customers"}
                    </p>
                  </div>
                  <Switch checked={value} onCheckedChange={(checked) => updateNotifications(key, checked)} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Feature Settings
              </CardTitle>
              <CardDescription>Enable or disable features for your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.features).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label className="capitalize">{key.replace(/_/g, " ")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {key === "online_booking" && "Allow customers to book appointments online"}
                      {key === "customer_portal" && "Provide customers with a self-service portal"}
                      {key === "loyalty_program" && "Enable customer loyalty and rewards program"}
                      {key === "multi_location" && "Support for multiple business locations"}
                      {key === "advanced_reporting" && "Access to advanced analytics and reports"}
                    </p>
                  </div>
                  <Switch checked={value} onCheckedChange={(checked) => updateFeatures(key, checked)} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Advanced Settings
              </CardTitle>
              <CardDescription>Advanced configuration options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Data Backup</Label>
                  <p className="text-sm text-muted-foreground mb-2">Automatically backup your data daily</p>
                  <Button variant="outline">Configure Backup</Button>
                </div>

                <div>
                  <Label>API Access</Label>
                  <p className="text-sm text-muted-foreground mb-2">Generate API keys for third-party integrations</p>
                  <Button variant="outline">Manage API Keys</Button>
                </div>

                <div>
                  <Label>Data Export</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Export your business data for backup or migration
                  </p>
                  <Button variant="outline">Export Data</Button>
                </div>

                <div>
                  <Label>Security Settings</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Configure two-factor authentication and security policies
                  </p>
                  <Button variant="outline">Security Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
