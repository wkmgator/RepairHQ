"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check, AlertTriangle, X, Search, Globe, FileText, Tag } from "lucide-react"

export function SEODashboard() {
  const [url, setUrl] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)

  const analyzeSEO = async () => {
    setAnalyzing(true)
    // In a real implementation, this would call an API to analyze the URL
    // For demo purposes, we'll simulate a response
    setTimeout(() => {
      setResults({
        score: 87,
        issues: [
          { type: "warning", message: "Meta description could be more compelling" },
          { type: "warning", message: "H1 tag could be more keyword-focused" },
          { type: "error", message: "Missing alt text on 2 images" },
        ],
        metadata: {
          title: "Phone Repair Software | RepairHQ",
          description:
            "Complete phone repair shop management system. Streamline operations, increase revenue, and delight customers with RepairHQ.",
          ogTags: {
            title: "Phone Repair Software | RepairHQ",
            description: "Complete phone repair shop management system.",
            image: "https://repairhq.io/images/og-phone-repair.jpg",
            url: "https://repairhq.io/repair/phone-repair",
          },
          twitterTags: {
            card: "summary_large_image",
            title: "Phone Repair Software | RepairHQ",
            description: "Complete phone repair shop management system.",
            image: "https://repairhq.io/images/og-phone-repair.jpg",
          },
          structuredData: [
            { type: "SoftwareApplication", valid: true },
            { type: "FAQPage", valid: true },
          ],
        },
        keywords: [
          { keyword: "phone repair software", position: 3, volume: 1200 },
          { keyword: "repair shop management", position: 5, volume: 880 },
          { keyword: "cell phone repair pos", position: 2, volume: 720 },
        ],
      })
      setAnalyzing(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SEO Analysis Tool</CardTitle>
          <CardDescription>Analyze any page on your site for SEO optimization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="url">URL to analyze</Label>
              <Input
                id="url"
                placeholder="https://repairhq.io/repair/phone-repair"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <Button className="mt-8" onClick={analyzeSEO} disabled={analyzing || !url}>
              {analyzing ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>SEO Score</CardTitle>
                <CardDescription>Overall optimization score for this page</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8">
                  <div
                    className={`text-6xl font-bold ${
                      results.score >= 90 ? "text-green-500" : results.score >= 70 ? "text-amber-500" : "text-red-500"
                    }`}
                  >
                    {results.score}/100
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold">{results.metadata.structuredData.length}</div>
                    <div className="text-sm text-gray-500">Schema Types</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold">{results.keywords.length}</div>
                    <div className="text-sm text-gray-500">Keywords Tracked</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold">{results.issues.length}</div>
                    <div className="text-sm text-gray-500">Issues Found</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metadata">
            <Card>
              <CardHeader>
                <CardTitle>Page Metadata</CardTitle>
                <CardDescription>SEO metadata found on the page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <Tag className="mr-2 h-5 w-5" /> Basic Meta Tags
                  </h3>
                  <div className="mt-2 space-y-2">
                    <div>
                      <Label>Title</Label>
                      <Input value={results.metadata.title} readOnly />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={results.metadata.description} readOnly />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <FileText className="mr-2 h-5 w-5" /> Open Graph Tags
                  </h3>
                  <div className="mt-2 space-y-2">
                    {Object.entries(results.metadata.ogTags).map(([key, value]: [string, any]) => (
                      <div key={key}>
                        <Label>og:{key}</Label>
                        <Input value={value} readOnly />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <Globe className="mr-2 h-5 w-5" /> Twitter Card Tags
                  </h3>
                  <div className="mt-2 space-y-2">
                    {Object.entries(results.metadata.twitterTags).map(([key, value]: [string, any]) => (
                      <div key={key}>
                        <Label>twitter:{key}</Label>
                        <Input value={value} readOnly />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <Search className="mr-2 h-5 w-5" /> Structured Data
                  </h3>
                  <div className="mt-2">
                    <ul className="space-y-2">
                      {results.metadata.structuredData.map((item: any, index: number) => (
                        <li key={index} className="flex items-center">
                          {item.valid ? (
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                          ) : (
                            <X className="h-5 w-5 text-red-500 mr-2" />
                          )}
                          <span>{item.type}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keywords">
            <Card>
              <CardHeader>
                <CardTitle>Keyword Rankings</CardTitle>
                <CardDescription>Current search engine positions for target keywords</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.keywords.map((keyword: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{keyword.keyword}</div>
                        <div className="text-sm text-gray-500">{keyword.volume} searches/month</div>
                      </div>
                      <div
                        className={`text-lg font-bold ${
                          keyword.position <= 3
                            ? "text-green-500"
                            : keyword.position <= 10
                              ? "text-amber-500"
                              : "text-red-500"
                        }`}
                      >
                        #{keyword.position}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues">
            <Card>
              <CardHeader>
                <CardTitle>SEO Issues</CardTitle>
                <CardDescription>Problems that need to be addressed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.issues.map((issue: any, index: number) => (
                    <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                      {issue.type === "error" ? (
                        <X className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      )}
                      <div>
                        <div className={`font-medium ${issue.type === "error" ? "text-red-700" : "text-amber-700"}`}>
                          {issue.type === "error" ? "Error" : "Warning"}
                        </div>
                        <div>{issue.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
