import type { Metadata } from "next"
import Link from "next/link"
import { getModulesWithFeatures } from "@/lib/features-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle, Plus, Edit, Trash2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Manage Features | RepairHQ Admin",
  description: "Manage system features and modules",
}

export default async function ManageFeaturesPage() {
  const modules = await getModulesWithFeatures()

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Features</h1>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/admin/features/new-module">
              <Plus className="mr-2 h-4 w-4" />
              Add Module
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/features/new-feature">
              <Plus className="mr-2 h-4 w-4" />
              Add Feature
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="all">All Modules</TabsTrigger>
          <TabsTrigger value="complete">Complete</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="planned">Planned</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-8">
          {modules.map((module) => (
            <Card key={module.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 flex flex-row justify-between items-center">
                <div>
                  <CardTitle>{module.name}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/features/edit-module/${module.id}`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                      <div className="flex justify-end gap-2 mt-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/features/edit-feature/${feature.id}`}>
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button variant="destructive" size="sm" asChild>
                          <Link href={`/admin/features/delete-feature/${feature.id}`}>
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Link>
                        </Button>
                      </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completeFeatures.map((feature) => (
                      <div key={feature.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{feature.name}</h3>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                        <div className="flex justify-end gap-2 mt-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/features/edit-feature/${feature.id}`}>
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button variant="destructive" size="sm" asChild>
                            <Link href={`/admin/features/delete-feature/${feature.id}`}>
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Link>
                          </Button>
                        </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inProgressFeatures.map((feature) => (
                      <div key={feature.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{feature.name}</h3>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            In Progress
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                        <div className="flex justify-end gap-2 mt-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/features/edit-feature/${feature.id}`}>
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button variant="destructive" size="sm" asChild>
                            <Link href={`/admin/features/delete-feature/${feature.id}`}>
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Link>
                          </Button>
                        </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plannedFeatures.map((feature) => (
                      <div key={feature.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{feature.name}</h3>
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                            <XCircle className="h-3 w-3 mr-1" />
                            Planned
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                        <div className="flex justify-end gap-2 mt-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/features/edit-feature/${feature.id}`}>
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button variant="destructive" size="sm" asChild>
                            <Link href={`/admin/features/delete-feature/${feature.id}`}>
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}
