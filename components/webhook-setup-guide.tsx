"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Copy, ExternalLink, RefreshCw } from "lucide-react"

interface WebhookConfig {
  service: string
  endpoint: string
  events: string[]
  description: string
  setupUrl: string
  setupInstructions: string
  headers?: Record<string, string>
}

export default function WebhookSetupGuide() {
  const [webhookConfigs, setWebhookConfigs] = useState<WebhookConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchWebhookConfigs()
  }, [])

  const fetchWebhookConfigs = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/webhook-configs")
      const data = await response.json()

      if (data.success) {
        setWebhookConfigs(data.configs)
      }
    } catch (error) {
      console.error("Failed to fetch webhook configs:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied({ ...copied, [key]: true })
    setTimeout(() => {
      setCopied({ ...copied, [key]: false })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Webhook Setup Guide</h2>
        <Button onClick={fetchWebhookConfigs} disabled={loading}>
          {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
      </div>

      <Alert>
        <AlertDescription>
          Configure these webhooks to enable real-time communication between RepairHQ and external services. Each
          service requires specific webhook endpoints to be set up in their respective dashboards.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Services</TabsTrigger>
          {webhookConfigs.map((config) => (
            <TabsTrigger key={config.service} value={config.service}>
              {config.service.charAt(0).toUpperCase() + config.service.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          <Accordion type="single" collapsible className="w-full">
            {webhookConfigs.map((config) => (
              <AccordionItem key={config.service} value={config.service}>
                <AccordionTrigger>
                  <div className="flex items-center">
                    <span className="mr-2">
                      {config.service.charAt(0).toUpperCase() + config.service.slice(1)} Webhooks
                    </span>
                    <Badge variant="outline">{config.events.length} events</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardHeader>
                      <CardTitle>{config.description}</CardTitle>
                      <CardDescription>
                        Configure these webhooks in your{" "}
                        {config.service.charAt(0).toUpperCase() + config.service.slice(1)} dashboard
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Endpoint URL</h4>
                        <div className="flex items-center">
                          <code className="bg-gray-100 p-2 rounded text-sm flex-1 overflow-auto">
                            {config.endpoint}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(config.endpoint, `${config.service}-endpoint`)}
                            className="ml-2"
                          >
                            {copied[`${config.service}-endpoint`] ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1">Events to Configure</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {config.events.map((event) => (
                            <li key={event} className="text-sm">
                              <code className="bg-gray-100 px-1 py-0.5 rounded">{event}</code>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {config.headers && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Required Headers</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {Object.entries(config.headers).map(([key, value]) => (
                              <li key={key} className="text-sm">
                                <code className="bg-gray-100 px-1 py-0.5 rounded">
                                  {key}: {value}
                                </code>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-medium mb-1">Setup Instructions</h4>
                        <div className="bg-gray-50 p-3 rounded border text-sm whitespace-pre-line">
                          {config.setupInstructions}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" asChild>
                        <a href={config.setupUrl} target="_blank" rel="noopener noreferrer">
                          Open {config.service.charAt(0).toUpperCase() + config.service.slice(1)} Dashboard
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        {webhookConfigs.map((config) => (
          <TabsContent key={config.service} value={config.service} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{config.description}</CardTitle>
                <CardDescription>
                  Configure these webhooks in your {config.service.charAt(0).toUpperCase() + config.service.slice(1)}{" "}
                  dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Endpoint URL</h4>
                  <div className="flex items-center">
                    <code className="bg-gray-100 p-2 rounded text-sm flex-1 overflow-auto">{config.endpoint}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(config.endpoint, `${config.service}-tab-endpoint`)}
                      className="ml-2"
                    >
                      {copied[`${config.service}-tab-endpoint`] ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Events to Configure</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {config.events.map((event) => (
                      <li key={event} className="text-sm">
                        <code className="bg-gray-100 px-1 py-0.5 rounded">{event}</code>
                      </li>
                    ))}
                  </ul>
                </div>

                {config.headers && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Required Headers</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {Object.entries(config.headers).map(([key, value]) => (
                        <li key={key} className="text-sm">
                          <code className="bg-gray-100 px-1 py-0.5 rounded">
                            {key}: {value}
                          </code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-1">Setup Instructions</h4>
                  <div className="bg-gray-50 p-3 rounded border text-sm whitespace-pre-line">
                    {config.setupInstructions}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild>
                  <a href={config.setupUrl} target="_blank" rel="noopener noreferrer">
                    Open {config.service.charAt(0).toUpperCase() + config.service.slice(1)} Dashboard
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
