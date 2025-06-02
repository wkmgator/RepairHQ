import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExternalLink, Mail, MessageSquare, RefreshCw, Send, LayoutTemplateIcon as Template } from "lucide-react"

export const metadata: Metadata = {
  title: "Communications Configuration | RepairHQ Admin",
  description: "Configure email and SMS services for RepairHQ",
}

export default function CommunicationsConfigPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Communications Configuration</h1>

      <Tabs defaultValue="email">
        <TabsList className="mb-6">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>SendGrid Configuration</CardTitle>
                <CardDescription>SendGrid email service settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">API Key</div>
                    <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                      {process.env.SENDGRID_API_KEY ? "••••••••••••••••••••••••••••••" : "Not configured"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="from-email">From Email</Label>
                      <Input id="from-email" value={process.env.FROM_EMAIL || "support@repairhq.com"} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="from-name">From Name</Label>
                      <Input id="from-name" value={process.env.FROM_NAME || "RepairHQ Support"} readOnly />
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Test Email
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href="https://app.sendgrid.com" target="_blank" rel="noopener noreferrer">
                        SendGrid Dashboard
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Delivery Statistics</CardTitle>
                <CardDescription>Email sending performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold">98.7%</div>
                      <div className="text-sm text-gray-500">Delivery Rate</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold">45.2%</div>
                      <div className="text-sm text-gray-500">Open Rate</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold">12.8%</div>
                      <div className="text-sm text-gray-500">Click Rate</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold">0.3%</div>
                      <div className="text-sm text-gray-500">Bounce Rate</div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" asChild>
                      <a href="https://app.sendgrid.com/statistics" target="_blank" rel="noopener noreferrer">
                        View Detailed Stats
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sms">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Twilio Configuration</CardTitle>
                <CardDescription>Twilio SMS service settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <div className="text-sm font-medium">Account SID</div>
                      <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                        {process.env.TWILIO_ACCOUNT_SID ? "••••••••••••••••••••••••••••••" : "Not configured"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Auth Token</div>
                      <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                        {process.env.TWILIO_AUTH_TOKEN ? "••••••••••••••••••••••••••••••" : "Not configured"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="from-number">From Number</Label>
                    <Input id="from-number" value={process.env.TWILIO_FROM_NUMBER || "+15551234567"} readOnly />
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Test SMS
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer">
                        Twilio Dashboard
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SMS Delivery Statistics</CardTitle>
                <CardDescription>SMS sending performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold">99.2%</div>
                      <div className="text-sm text-gray-500">Delivery Rate</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold">3.5%</div>
                      <div className="text-sm text-gray-500">Opt-out Rate</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold">$0.0075</div>
                      <div className="text-sm text-gray-500">Avg. Cost per SMS</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold">1,234</div>
                      <div className="text-sm text-gray-500">Monthly Volume</div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" asChild>
                      <a href="https://console.twilio.com/us1/monitor/logs" target="_blank" rel="noopener noreferrer">
                        View Detailed Stats
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
              <CardDescription>Manage email and SMS templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Tabs defaultValue="email-templates">
                  <TabsList className="mb-4">
                    <TabsTrigger value="email-templates">Email Templates</TabsTrigger>
                    <TabsTrigger value="sms-templates">SMS Templates</TabsTrigger>
                  </TabsList>

                  <TabsContent value="email-templates">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Template</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Welcome Email</TableCell>
                          <TableCell>Transactional</TableCell>
                          <TableCell>2023-10-15</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Template className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Password Reset</TableCell>
                          <TableCell>Transactional</TableCell>
                          <TableCell>2023-10-10</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Template className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Invoice</TableCell>
                          <TableCell>Transactional</TableCell>
                          <TableCell>2023-10-05</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Template className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Appointment Confirmation</TableCell>
                          <TableCell>Transactional</TableCell>
                          <TableCell>2023-10-01</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Template className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Repair Status Update</TableCell>
                          <TableCell>Transactional</TableCell>
                          <TableCell>2023-09-25</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Template className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="sms-templates">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Template</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Appointment Confirmation</TableCell>
                          <TableCell>Transactional</TableCell>
                          <TableCell>2023-10-15</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Template className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Appointment Reminder</TableCell>
                          <TableCell>Transactional</TableCell>
                          <TableCell>2023-10-10</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Template className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Repair Status Update</TableCell>
                          <TableCell>Transactional</TableCell>
                          <TableCell>2023-10-05</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Template className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Verification Code</TableCell>
                          <TableCell>Transactional</TableCell>
                          <TableCell>2023-10-01</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Template className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Payment Confirmation</TableCell>
                          <TableCell>Transactional</TableCell>
                          <TableCell>2023-09-25</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Template className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between">
                  <Button>
                    <Mail className="h-4 w-4 mr-2" />
                    New Email Template
                  </Button>
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    New SMS Template
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
