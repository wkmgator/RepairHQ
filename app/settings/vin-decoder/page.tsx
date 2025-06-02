import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VinLookup } from "@/components/vin-lookup"
import { VinHistory } from "@/components/vin-history"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "VIN Decoder Settings | RepairHQ",
  description: "Configure VIN decoder settings and view lookup history",
}

export default function VinDecoderSettingsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">VIN Decoder Settings</h1>
          <p className="text-muted-foreground">Configure VIN decoder settings and manage vehicle lookup history</p>
        </div>
      </div>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>VIN Decoder Integration</AlertTitle>
        <AlertDescription>
          The VIN decoder uses a combination of local decoding and external API services. For production use, consider
          integrating with commercial VIN decoder APIs for more comprehensive vehicle data.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="lookup">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lookup">VIN Lookup</TabsTrigger>
          <TabsTrigger value="history">Lookup History</TabsTrigger>
          <TabsTrigger value="settings">API Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="lookup" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>VIN Lookup Tool</CardTitle>
              <CardDescription>Look up vehicle information using a VIN</CardDescription>
            </CardHeader>
            <CardContent>
              <VinLookup showDetails={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <VinHistory limit={20} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Configure external VIN decoder API settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium">API Provider</label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="internal">Internal (Local Decoding)</option>
                      <option value="nhtsa">NHTSA (Free)</option>
                      <option value="carmd">CarMD (Commercial)</option>
                      <option value="vinaudit">VINAudit (Commercial)</option>
                      <option value="custom">Custom API</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">Select which VIN decoder API to use</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">API Key</label>
                    <input
                      type="password"
                      placeholder="Enter API key"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground mt-1">API key for commercial VIN decoder services</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">API Endpoint URL</label>
                  <input
                    type="text"
                    placeholder="https://api.example.com/vin-decoder"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground mt-1">Custom API endpoint URL (for Custom API option)</p>
                </div>

                <div className="flex justify-end">
                  <button
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    disabled
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
