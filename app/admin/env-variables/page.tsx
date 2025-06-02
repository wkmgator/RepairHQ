import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { RefreshCw, Search, Settings } from "lucide-react"

export const metadata: Metadata = {
  title: "Environment Variables | RepairHQ Admin",
  description: "Manage environment variables for RepairHQ",
}

export default function EnvVariablesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Environment Variables</h1>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input placeholder="Search variables..." className="pl-8" />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Variables</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="application">Application</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Environment Variables</CardTitle>
              <CardDescription>Complete list of environment variables for RepairHQ</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variable</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono">POSTGRES_URL</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>Database</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">POSTGRES_PRISMA_URL</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>Database</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">SUPABASE_URL</TableCell>
                    <TableCell className="font-mono">https://example.supabase.co</TableCell>
                    <TableCell>Database</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">NEXT_PUBLIC_SUPABASE_URL</TableCell>
                    <TableCell className="font-mono">https://example.supabase.co</TableCell>
                    <TableCell>Database</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">STRIPE_SECRET_KEY</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</TableCell>
                    <TableCell className="font-mono">pk_test_••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">SENDGRID_API_KEY</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>Communication</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">TWILIO_ACCOUNT_SID</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>Communication</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">NEXT_PUBLIC_BASE_URL</TableCell>
                    <TableCell className="font-mono">https://repairhq.com</TableCell>
                    <TableCell>Application</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">WEBHOOK_BASE_URL</TableCell>
                    <TableCell className="font-mono">https://repairhq.com</TableCell>
                    <TableCell>Application</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Environment Variables</CardTitle>
              <CardDescription>Database connection and configuration variables</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variable</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono">POSTGRES_URL</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>PostgreSQL connection URL</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">POSTGRES_PRISMA_URL</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>PostgreSQL URL for Prisma</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">POSTGRES_URL_NON_POOLING</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>Non-pooling PostgreSQL URL</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">POSTGRES_USER</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>PostgreSQL username</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">POSTGRES_PASSWORD</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>PostgreSQL password</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">POSTGRES_HOST</TableCell>
                    <TableCell className="font-mono">db.example.com</TableCell>
                    <TableCell>PostgreSQL host</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">POSTGRES_DATABASE</TableCell>
                    <TableCell className="font-mono">repairhq</TableCell>
                    <TableCell>PostgreSQL database name</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">SUPABASE_URL</TableCell>
                    <TableCell className="font-mono">https://example.supabase.co</TableCell>
                    <TableCell>Supabase project URL</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">NEXT_PUBLIC_SUPABASE_URL</TableCell>
                    <TableCell className="font-mono">https://example.supabase.co</TableCell>
                    <TableCell>Public Supabase URL for client</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">SUPABASE_ANON_KEY</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>Supabase anonymous key</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>Public Supabase anonymous key for client</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">SUPABASE_SERVICE_ROLE_KEY</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>Supabase service role key for admin operations</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">SUPABASE_JWT_SECRET</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>Supabase JWT secret for token verification</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Environment Variables</CardTitle>
              <CardDescription>Payment processing configuration variables</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variable</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono">STRIPE_SECRET_KEY</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>Stripe secret API key</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</TableCell>
                    <TableCell className="font-mono">pk_test_••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>Stripe publishable key for client</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">STRIPE_WEBHOOK_SECRET</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>Stripe webhook signing secret</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication">
          <Card>
            <CardHeader>
              <CardTitle>Communication Environment Variables</CardTitle>
              <CardDescription>Email and SMS service configuration variables</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variable</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono">SENDGRID_API_KEY</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>SendGrid API key for email sending</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">FROM_EMAIL</TableCell>
                    <TableCell className="font-mono">support@repairhq.com</TableCell>
                    <TableCell>Default sender email address</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">FROM_NAME</TableCell>
                    <TableCell className="font-mono">RepairHQ Support</TableCell>
                    <TableCell>Default sender name</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">TWILIO_ACCOUNT_SID</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>Twilio account SID</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">TWILIO_AUTH_TOKEN</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>Twilio auth token</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">TWILIO_FROM_NUMBER</TableCell>
                    <TableCell className="font-mono">+15551234567</TableCell>
                    <TableCell>Twilio sender phone number</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="application">
          <Card>
            <CardHeader>
              <CardTitle>Application Environment Variables</CardTitle>
              <CardDescription>Core application configuration variables</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variable</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono">NEXT_PUBLIC_BASE_URL</TableCell>
                    <TableCell className="font-mono">https://repairhq.com</TableCell>
                    <TableCell>Base URL of the application</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">WEBHOOK_BASE_URL</TableCell>
                    <TableCell className="font-mono">https://repairhq.com</TableCell>
                    <TableCell>Base URL for webhooks</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">OPENAI_API_KEY</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>OpenAI API key for AI features</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>Google Maps API key</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">NEXT_PUBLIC_MAPBOX_API_KEY</TableCell>
                    <TableCell className="font-mono">••••••••••••••••••••••••••••••</TableCell>
                    <TableCell>Mapbox API key</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Set</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">ENABLE_LEGACY_FEATURES</TableCell>
                    <TableCell className="font-mono">false</TableCell>
                    <TableCell>Enable legacy features</TableCell>
                    <TableCell>
                      <Badge variant="outline">Optional</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">ENABLE_AI_FEATURES</TableCell>
                    <TableCell className="font-mono">true</TableCell>
                    <TableCell>Enable AI-powered features</TableCell>
                    <TableCell>
                      <Badge variant="outline">Optional</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">ENABLE_BETA_FEATURES</TableCell>
                    <TableCell className="font-mono">false</TableCell>
                    <TableCell>Enable beta features</TableCell>
                    <TableCell>
                      <Badge variant="outline">Optional</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
