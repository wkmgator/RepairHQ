import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink, Database, Shield, Key, RefreshCw } from "lucide-react"

export const metadata: Metadata = {
  title: "Database Configuration | RepairHQ Admin",
  description: "Configure and manage database connections for RepairHQ",
}

export default function DatabaseConfigPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Database Configuration</h1>

      <Tabs defaultValue="connections">
        <TabsList className="mb-6">
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="migrations">Migrations</TabsTrigger>
        </TabsList>

        <TabsContent value="connections">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>PostgreSQL Connection</CardTitle>
                <CardDescription>Direct PostgreSQL database connection settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">Connection String</div>
                    <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                      {process.env.POSTGRES_URL || "postgresql://user:password@host:port/database"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium">Host</div>
                      <div className="font-mono text-sm mt-1">{process.env.POSTGRES_HOST || "localhost"}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Database</div>
                      <div className="font-mono text-sm mt-1">{process.env.POSTGRES_DATABASE || "repairhq"}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">User</div>
                      <div className="font-mono text-sm mt-1">{process.env.POSTGRES_USER || "postgres"}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Connection Pool</div>
                      <div className="font-mono text-sm mt-1">Max: 20, Idle Timeout: 30s</div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Test Connection
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href="https://www.postgresql.org/docs/" target="_blank" rel="noopener noreferrer">
                        Documentation
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supabase Connection</CardTitle>
                <CardDescription>Supabase platform connection settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">Project URL</div>
                    <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                      {process.env.SUPABASE_URL || "https://example.supabase.co"}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <div className="text-sm font-medium">Anon Key</div>
                      <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                        {process.env.SUPABASE_ANON_KEY ? "••••••••••••••••••••••••••••••" : "Not configured"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Service Role Key</div>
                      <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                        {process.env.SUPABASE_SERVICE_ROLE_KEY ? "••••••••••••••••••••••••••••••" : "Not configured"}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Test Connection
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                        Supabase Dashboard
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Database Security</CardTitle>
              <CardDescription>Security settings and access controls for your database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Access Control</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">anon</TableCell>
                        <TableCell>Anonymous public access</TableCell>
                        <TableCell>Read-only on public tables</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">authenticated</TableCell>
                        <TableCell>Logged-in users</TableCell>
                        <TableCell>Read/write on user-specific data</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">service_role</TableCell>
                        <TableCell>Admin access</TableCell>
                        <TableCell>Full access to all tables</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Security Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 flex items-center space-x-4">
                        <Shield className="h-8 w-8 text-green-500" />
                        <div>
                          <h4 className="font-medium">Row Level Security</h4>
                          <p className="text-sm text-gray-500">Enabled on all tables</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex items-center space-x-4">
                        <Database className="h-8 w-8 text-green-500" />
                        <div>
                          <h4 className="font-medium">Data Encryption</h4>
                          <p className="text-sm text-gray-500">At-rest & in-transit</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex items-center space-x-4">
                        <Key className="h-8 w-8 text-green-500" />
                        <div>
                          <h4 className="font-medium">JWT Authentication</h4>
                          <p className="text-sm text-gray-500">Secure token-based auth</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="migrations">
          <Card>
            <CardHeader>
              <CardTitle>Database Migrations</CardTitle>
              <CardDescription>Manage database schema migrations and version control</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Migration History</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Version</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Applied At</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono">001</TableCell>
                        <TableCell>Initial schema setup</TableCell>
                        <TableCell>2023-10-01 14:23:45</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Applied</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">002</TableCell>
                        <TableCell>Add customer tables</TableCell>
                        <TableCell>2023-10-05 09:12:33</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Applied</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">003</TableCell>
                        <TableCell>Add inventory management</TableCell>
                        <TableCell>2023-10-10 11:34:21</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Applied</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">004</TableCell>
                        <TableCell>Add payment processing</TableCell>
                        <TableCell>2023-10-15 15:22:18</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Applied</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Check for New Migrations
                  </Button>
                  <Button>Run Migrations</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
