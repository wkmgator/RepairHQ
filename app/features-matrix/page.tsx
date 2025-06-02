import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { getModulesWithFeatures } from "@/lib/features-utils"

export const metadata: Metadata = {
  title: "Features Matrix | RepairHQ",
  description: "Comprehensive breakdown of all RepairHQ system features and modules",
}

export default async function FeaturesMatrixPage() {
  const modules = await getModulesWithFeatures()

  // Calculate statistics
  const completeCount = modules.reduce(
    (count, module) => count + (module.features?.filter((f) => f.status === "complete").length || 0),
    0,
  )

  const inProgressCount = modules.reduce(
    (count, module) => count + (module.features?.filter((f) => f.status === "in-progress").length || 0),
    0,
  )

  const plannedCount = modules.reduce(
    (count, module) => count + (module.features?.filter((f) => f.status === "planned").length || 0),
    0,
  )

  const totalCount = completeCount + inProgressCount + plannedCount
  const completionPercentage = totalCount > 0 ? Math.round((completeCount / totalCount) * 100) : 0

  // Core modules
  const coreModuleNames = ["POS System", "Ticketing", "CRM", "Inventory"]
  const coreModules = modules.filter((m) => coreModuleNames.includes(m.name))

  // Advanced modules
  const advancedModuleNames = ["Multi-Store", "Marketing Tools", "Reports", "Communication"]
  const advancedModules = modules.filter((m) => advancedModuleNames.includes(m.name))

  // Web3 modules
  const web3ModuleNames = ["NFT / Token Rewards"]
  const web3Modules = modules.filter((m) => web3ModuleNames.includes(m.name))

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">RepairHQ Master Features Matrix</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive breakdown of all system modules and features for the complete repair shop management platform
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-8">
          <TabsTrigger value="all">All Modules</TabsTrigger>
          <TabsTrigger value="complete">Complete</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="planned">Planned</TabsTrigger>
          <TabsTrigger value="core">Core Features</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="web3">Web3/Blockchain</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-8">
          {modules.map((module) => (
            <Card key={module.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <CardTitle>{module.name}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {module.features?.map((feature) => (
                    <div key={feature.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{feature.name}</h3>
                        {feature.status === "complete" && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                        )}
                        {feature.status === "in-progress" && (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            In Progress
                          </Badge>
                        )}
                        {feature.status === "planned" && (
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                            <XCircle className="h-3 w-3 mr-1" />
                            Planned
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="complete" className="space-y-8">
          {modules.map((module) => {
            const completeFeatures = module.features?.filter((f) => f.status === "complete") || []
            if (completeFeatures.length === 0) return null

            return (
              <Card key={module.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <CardTitle>{module.name}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {completeFeatures.map((feature) => (
                      <div key={feature.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{feature.name}</h3>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-8">
          {modules.map((module) => {
            const inProgressFeatures = module.features?.filter((f) => f.status === "in-progress") || []
            if (inProgressFeatures.length === 0) return null

            return (
              <Card key={module.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <CardTitle>{module.name}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {inProgressFeatures.map((feature) => (
                      <div key={feature.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{feature.name}</h3>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            In Progress
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="planned" className="space-y-8">
          {modules.map((module) => {
            const plannedFeatures = module.features?.filter((f) => f.status === "planned") || []
            if (plannedFeatures.length === 0) return null

            return (
              <Card key={module.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <CardTitle>{module.name}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {plannedFeatures.map((feature) => (
                      <div key={feature.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{feature.name}</h3>
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                            <XCircle className="h-3 w-3 mr-1" />
                            Planned
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="core" className="space-y-8">
          {coreModules.map((module) => (
            <Card key={module.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <CardTitle>{module.name}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {module.features?.map((feature) => (
                    <div key={feature.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{feature.name}</h3>
                        {feature.status === "complete" && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                        )}
                        {feature.status === "in-progress" && (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            In Progress
                          </Badge>
                        )}
                        {feature.status === "planned" && (
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                            <XCircle className="h-3 w-3 mr-1" />
                            Planned
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="advanced" className="space-y-8">
          {advancedModules.map((module) => (
            <Card key={module.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <CardTitle>{module.name}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {module.features?.map((feature) => (
                    <div key={feature.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{feature.name}</h3>
                        {feature.status === "complete" && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                        )}
                        {feature.status === "in-progress" && (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            In Progress
                          </Badge>
                        )}
                        {feature.status === "planned" && (
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                            <XCircle className="h-3 w-3 mr-1" />
                            Planned
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="web3" className="space-y-8">
          {web3Modules.map((module) => (
            <Card key={module.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <CardTitle>{module.name}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {module.features?.map((feature) => (
                    <div key={feature.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{feature.name}</h3>
                        {feature.status === "complete" && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                        )}
                        {feature.status === "in-progress" && (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            In Progress
                          </Badge>
                        )}
                        {feature.status === "planned" && (
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                            <XCircle className="h-3 w-3 mr-1" />
                            Planned
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <div className="mt-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">System Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Frontend</CardTitle>
              <CardDescription>Next.js App Router</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>React Server Components</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Tailwind CSS + shadcn/ui</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Server Actions</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Responsive Design</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Progressive Web App</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Backend</CardTitle>
              <CardDescription>Supabase Platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>PostgreSQL Database</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Row-Level Security</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Authentication System</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Storage for Files/Images</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Realtime Subscriptions</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deployment</CardTitle>
              <CardDescription>Vercel Platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Global Edge Network</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Middleware for Access Control</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Environment Variables</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Continuous Deployment</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <span>Analytics & Monitoring</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Implementation Progress</h2>
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-3xl bg-gray-200 rounded-full h-4">
            <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
          </div>
        </div>
        <div className="flex justify-center gap-8 text-lg">
          <div>
            <span className="font-bold text-green-600">{completeCount}</span> Complete Features
          </div>
          <div>
            <span className="font-bold text-blue-600">{inProgressCount}</span> In Progress
          </div>
          <div>
            <span className="font-bold text-gray-600">{plannedCount}</span> Planned
          </div>
        </div>
      </div>
    </div>
  )
}
