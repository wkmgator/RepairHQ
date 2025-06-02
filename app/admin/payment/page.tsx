import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink, CreditCard, DollarSign, Receipt, RefreshCw, Settings } from "lucide-react"

export const metadata: Metadata = {
  title: "Payment Configuration | RepairHQ Admin",
  description: "Configure and manage payment processing for RepairHQ",
}

export default function PaymentConfigPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Payment Configuration</h1>

      <Tabs defaultValue="stripe">
        <TabsList className="mb-6">
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="stripe">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stripe Configuration</CardTitle>
                <CardDescription>Stripe payment gateway settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">API Keys</div>
                    <div className="space-y-2 mt-1">
                      <div>
                        <div className="text-xs text-gray-500">Secret Key</div>
                        <div className="font-mono text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                          {process.env.STRIPE_SECRET_KEY ? "••••••••••••••••••••••••••••••" : "Not configured"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Publishable Key</div>
                        <div className="font-mono text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                          {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "Not configured"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Webhook Secret</div>
                        <div className="font-mono text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                          {process.env.STRIPE_WEBHOOK_SECRET ? "••••••••••••••••••••••••••••••" : "Not configured"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium">Mode</div>
                    <Badge className="mt-1 bg-yellow-100 text-yellow-800">Test Mode</Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      Switch to live mode in production by updating your API keys.
                    </p>
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Test Connection
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">
                        Stripe Dashboard
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Configured payment methods for your customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Credit Cards</span>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" />
                          <span>ACH Direct Debit</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Disabled</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="flex items-center space-x-2">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M12 2L2 7L12 12L22 7L12 2Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M2 17L12 22L22 17"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M2 12L12 17L22 12"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>Crypto</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Disabled</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="flex items-center space-x-2">
                          <Receipt className="h-4 w-4" />
                          <span>Invoicing</span>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Methods
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Stripe Webhooks</CardTitle>
              <CardDescription>Configure webhooks to handle Stripe events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-medium mb-2">Webhook Endpoint</div>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                    {process.env.WEBHOOK_BASE_URL
                      ? `${process.env.WEBHOOK_BASE_URL}/api/webhooks/stripe`
                      : "https://example.com/api/webhooks/stripe"}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Add this endpoint to your Stripe dashboard to receive webhook events.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Configured Events</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono text-sm">checkout.session.completed</TableCell>
                        <TableCell>When a checkout is completed successfully</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono text-sm">invoice.payment_succeeded</TableCell>
                        <TableCell>When an invoice is paid successfully</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono text-sm">invoice.payment_failed</TableCell>
                        <TableCell>When an invoice payment fails</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono text-sm">customer.subscription.created</TableCell>
                        <TableCell>When a subscription is created</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono text-sm">customer.subscription.updated</TableCell>
                        <TableCell>When a subscription is updated</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono text-sm">customer.subscription.deleted</TableCell>
                        <TableCell>When a subscription is cancelled</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Test Webhook
                  </Button>
                  <Button variant="ghost" asChild>
                    <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noopener noreferrer">
                      Stripe Webhooks Dashboard
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Products</CardTitle>
              <CardDescription>Manage your subscription products and pricing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan</TableHead>
                      <TableHead>Price (Monthly)</TableHead>
                      <TableHead>Price (Annual)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Starter</TableCell>
                      <TableCell>$29.99</TableCell>
                      <TableCell>$299.90 ($59.98 savings)</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Professional</TableCell>
                      <TableCell>$59.99</TableCell>
                      <TableCell>$599.90 ($119.98 savings)</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Business</TableCell>
                      <TableCell>$99.99</TableCell>
                      <TableCell>$999.90 ($199.98 savings)</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Enterprise</TableCell>
                      <TableCell>Custom</TableCell>
                      <TableCell>Custom</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="flex justify-between">
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Plans
                  </Button>
                  <Button variant="ghost" asChild>
                    <a href="https://dashboard.stripe.com/products" target="_blank" rel="noopener noreferrer">
                      Stripe Products Dashboard
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
