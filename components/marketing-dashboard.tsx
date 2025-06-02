"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Loader2, BarChart3, TrendingUp, Users, Mail, RefreshCcw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { getCampaigns, analyzeMarketingPerformance, getCustomerSegments } from "@/lib/marketing-service"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function MarketingDashboard() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [segments, setSegments] = useState<any[]>([])
  const [metrics, setMetrics] = useState<any>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalRecipients: 0,
    totalSent: 0,
    totalDelivered: 0,
    totalOpened: 0,
    totalClicked: 0,
    totalConverted: 0,
    averageOpenRate: 0,
    averageClickRate: 0,
    averageConversionRate: 0,
  })
  const [performanceData, setPerformanceData] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [campaignsData, segmentsData] = await Promise.all([getCampaigns(), getCustomerSegments()])

      setCampaigns(campaignsData)
      setSegments(segmentsData)

      // Calculate overall metrics
      const totalCampaigns = campaignsData.length
      const activeCampaigns = campaignsData.filter((c) => c.status === "active").length

      let totalRecipients = 0
      let totalSent = 0
      let totalDelivered = 0
      let totalOpened = 0
      let totalClicked = 0
      let totalConverted = 0

      // Calculate campaign metrics
      campaignsData.forEach((campaign) => {
        if (campaign.metrics) {
          totalRecipients += campaign.metrics.total || 0
          totalSent += campaign.metrics.sent || 0
          totalDelivered += campaign.metrics.delivered || 0
          totalOpened += campaign.metrics.opened || 0
          totalClicked += campaign.metrics.clicked || 0
          totalConverted += campaign.metrics.converted || 0
        }
      })

      // Calculate rates
      const averageOpenRate = totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0
      const averageClickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0
      const averageConversionRate = totalClicked > 0 ? (totalConverted / totalClicked) * 100 : 0

      setMetrics({
        totalCampaigns,
        activeCampaigns,
        totalRecipients,
        totalSent,
        totalDelivered,
        totalOpened,
        totalClicked,
        totalConverted,
        averageOpenRate,
        averageClickRate,
        averageConversionRate,
      })

      // Prepare performance data for charts
      const performanceData = campaignsData
        .filter((c) => c.metrics && c.metrics.total > 0)
        .map((campaign) => {
          const openRate =
            campaign.metrics.delivered > 0 ? (campaign.metrics.opened / campaign.metrics.delivered) * 100 : 0
          const clickRate = campaign.metrics.opened > 0 ? (campaign.metrics.clicked / campaign.metrics.opened) * 100 : 0
          const conversionRate =
            campaign.metrics.clicked > 0 ? (campaign.metrics.converted / campaign.metrics.clicked) * 100 : 0

          return {
            name: campaign.name,
            openRate: Number.parseFloat(openRate.toFixed(2)),
            clickRate: Number.parseFloat(clickRate.toFixed(2)),
            conversionRate: Number.parseFloat(conversionRate.toFixed(2)),
            type: campaign.type,
          }
        })

      setPerformanceData(performanceData)

      // Get AI analysis if we have enough data
      if (performanceData.length > 0) {
        try {
          const analysisResult = await analyzeMarketingPerformance({
            campaigns: campaignsData.filter((c) => c.metrics && c.metrics.total > 0),
            metrics: {
              totalCampaigns,
              activeCampaigns,
              totalRecipients,
              totalSent,
              totalDelivered,
              totalOpened,
              totalClicked,
              totalConverted,
              averageOpenRate,
              averageClickRate,
              averageConversionRate,
            },
          })
          setAnalysis(analysisResult)
        } catch (error) {
          console.error("Error analyzing marketing performance:", error)
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
    toast({
      title: "Success",
      description: "Dashboard data refreshed successfully.",
    })
  }

  if (loading && !campaigns.length) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Marketing Dashboard</h2>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCcw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">{metrics.activeCampaigns} active campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRecipients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{metrics.totalSent.toLocaleString()} messages sent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Open Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageOpenRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{metrics.totalOpened.toLocaleString()} opens</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageConversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{metrics.totalConverted.toLocaleString()} conversions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="segments">Customer Segments</TabsTrigger>
        </TabsList>
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Compare open rates, click rates, and conversion rates across campaigns</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {performanceData.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-center text-muted-foreground">
                    No campaign performance data available yet. Run campaigns to see performance metrics.
                  </p>
                </div>
              ) : (
                <ChartContainer
                  config={{
                    openRate: {
                      label: "Open Rate (%)",
                      color: "hsl(var(--chart-1))",
                    },
                    clickRate: {
                      label: "Click Rate (%)",
                      color: "hsl(var(--chart-2))",
                    },
                    conversionRate: {
                      label: "Conversion Rate (%)",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="openRate" name="Open Rate (%)" fill="var(--color-openRate)" />
                      <Bar dataKey="clickRate" name="Click Rate (%)" fill="var(--color-clickRate)" />
                      <Bar dataKey="conversionRate" name="Conversion Rate (%)" fill="var(--color-conversionRate)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Email vs SMS Performance</CardTitle>
                <CardDescription>Compare performance metrics between email and SMS campaigns</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {performanceData.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-center text-muted-foreground">No campaign data available yet.</p>
                  </div>
                ) : (
                  <ChartContainer
                    config={{
                      email: {
                        label: "Email",
                        color: "hsl(var(--chart-1))",
                      },
                      sms: {
                        label: "SMS",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            metric: "Open Rate",
                            email: Number.parseFloat(
                              (
                                performanceData
                                  .filter((d) => d.type === "email")
                                  .reduce((acc, curr) => acc + curr.openRate, 0) /
                                Math.max(performanceData.filter((d) => d.type === "email").length, 1)
                              ).toFixed(2),
                            ),
                            sms: Number.parseFloat(
                              (
                                performanceData
                                  .filter((d) => d.type === "sms")
                                  .reduce((acc, curr) => acc + curr.openRate, 0) /
                                Math.max(performanceData.filter((d) => d.type === "sms").length, 1)
                              ).toFixed(2),
                            ),
                          },
                          {
                            metric: "Click Rate",
                            email: Number.parseFloat(
                              (
                                performanceData
                                  .filter((d) => d.type === "email")
                                  .reduce((acc, curr) => acc + curr.clickRate, 0) /
                                Math.max(performanceData.filter((d) => d.type === "email").length, 1)
                              ).toFixed(2),
                            ),
                            sms: Number.parseFloat(
                              (
                                performanceData
                                  .filter((d) => d.type === "sms")
                                  .reduce((acc, curr) => acc + curr.clickRate, 0) /
                                Math.max(performanceData.filter((d) => d.type === "sms").length, 1)
                              ).toFixed(2),
                            ),
                          },
                          {
                            metric: "Conversion Rate",
                            email: Number.parseFloat(
                              (
                                performanceData
                                  .filter((d) => d.type === "email")
                                  .reduce((acc, curr) => acc + curr.conversionRate, 0) /
                                Math.max(performanceData.filter((d) => d.type === "email").length, 1)
                              ).toFixed(2),
                            ),
                            sms: Number.parseFloat(
                              (
                                performanceData
                                  .filter((d) => d.type === "sms")
                                  .reduce((acc, curr) => acc + curr.conversionRate, 0) /
                                Math.max(performanceData.filter((d) => d.type === "sms").length, 1)
                              ).toFixed(2),
                            ),
                          },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="metric" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="email" name="Email" fill="var(--color-email)" />
                        <Bar dataKey="sms" name="SMS" fill="var(--color-sms)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Campaign Timeline</CardTitle>
                <CardDescription>Campaign activity over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {campaigns.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-center text-muted-foreground">No campaign data available yet.</p>
                  </div>
                ) : (
                  <ChartContainer
                    config={{
                      campaigns: {
                        label: "Campaigns",
                        color: "hsl(var(--chart-1))",
                      },
                      recipients: {
                        label: "Recipients",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={campaigns
                          .filter((c) => c.created_at)
                          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                          .map((campaign) => ({
                            date: new Date(campaign.created_at).toLocaleDateString(),
                            campaigns: 1,
                            recipients: campaign.metrics?.total || 0,
                          }))
                          .reduce((acc, curr) => {
                            const existingEntry = acc.find((entry) => entry.date === curr.date)
                            if (existingEntry) {
                              existingEntry.campaigns += curr.campaigns
                              existingEntry.recipients += curr.recipients
                            } else {
                              acc.push(curr)
                            }
                            return acc
                          }, [] as any[])
                          .map((entry, index, array) => ({
                            ...entry,
                            campaigns: index > 0 ? array[index - 1].campaigns + entry.campaigns : entry.campaigns,
                          }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="campaigns"
                          name="Campaigns"
                          stroke="var(--color-campaigns)"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="recipients"
                          name="Recipients"
                          stroke="var(--color-recipients)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Marketing Analysis</CardTitle>
              <CardDescription>Insights and recommendations based on your campaign performance</CardDescription>
            </CardHeader>
            <CardContent>
              {!analysis ? (
                <div className="flex h-[300px] items-center justify-center">
                  <p className="text-center text-muted-foreground">
                    {performanceData.length === 0
                      ? "Run campaigns to get AI-powered analysis and recommendations."
                      : "Generating analysis..."}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2 text-lg font-medium">Overall Performance</h3>
                    <p className="text-sm text-muted-foreground">{analysis.overallPerformance}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-medium">Key Strengths</h3>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {analysis.strengths.map((strength: string, index: number) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-medium">Areas for Improvement</h3>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {analysis.weaknesses.map((weakness: string, index: number) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-medium">Recommendations</h3>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {analysis.recommendations.map((recommendation: string, index: number) => (
                        <li key={index}>{recommendation}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="segments">
          <Card>
            <CardHeader>
              <CardTitle>Customer Segments</CardTitle>
              <CardDescription>Overview of your customer segments and their sizes</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {segments.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-center text-muted-foreground">
                    No customer segments available yet. Create segments to see them here.
                  </p>
                </div>
              ) : (
                <ChartContainer
                  config={{
                    customers: {
                      label: "Customers",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={segments.map((segment) => ({
                        name: segment.name,
                        customers: segment.customer_count,
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="customers" name="Customers" fill="var(--color-customers)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
