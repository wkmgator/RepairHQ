import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, AlertTriangle, FileCode, Globe } from "lucide-react"

export function SEOImplementationGuide() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SEO Implementation Guide</CardTitle>
          <CardDescription>Follow this guide to ensure proper SEO implementation across all pages</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basics">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="schema">Schema.org</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>

            <TabsContent value="basics">
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium">Basic SEO Implementation</h3>
                <p className="text-gray-600">Ensure these basic elements are implemented on every page:</p>

                <div className="space-y-2">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium">Page Title</div>
                      <div className="text-sm text-gray-600">
                        Use format: <code>[Primary Keyword] | RepairHQ</code>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium">Meta Description</div>
                      <div className="text-sm text-gray-600">
                        150-160 characters with primary and secondary keywords
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium">Heading Structure</div>
                      <div className="text-sm text-gray-600">
                        H1 for main title, H2 for sections, H3 for subsections
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium">Image Alt Text</div>
                      <div className="text-sm text-gray-600">
                        Descriptive alt text for all images, including keywords where natural
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium">Canonical URL</div>
                      <div className="text-sm text-gray-600">Set canonical URL to prevent duplicate content issues</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schema">
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium">Schema.org Implementation</h3>
                <p className="text-gray-600">Add these structured data types to enhance search results:</p>

                <div className="space-y-4">
                  <div className="border p-4 rounded-lg">
                    <div className="font-medium flex items-center">
                      <FileCode className="h-5 w-5 mr-2" />
                      SoftwareApplication Schema
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Use for all product pages. Include name, description, offers, and aggregateRating.
                    </div>
                    <div className="mt-2 bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                      <pre>{`{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "RepairHQ [Vertical] Software",
  "description": "...",
  "offers": {
    "@type": "Offer",
    "price": "29",
    "priceCurrency": "USD"
  }
}`}</pre>
                    </div>
                  </div>

                  <div className="border p-4 rounded-lg">
                    <div className="font-medium flex items-center">
                      <FileCode className="h-5 w-5 mr-2" />
                      FAQPage Schema
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Add to any page with FAQ sections to get rich results in search.
                    </div>
                  </div>

                  <div className="border p-4 rounded-lg">
                    <div className="font-medium flex items-center">
                      <FileCode className="h-5 w-5 mr-2" />
                      BreadcrumbList Schema
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Add to all pages to show breadcrumb navigation in search results.
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social">
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium">Social Media Tags</h3>
                <p className="text-gray-600">Implement these tags for better social media sharing:</p>

                <div className="space-y-4">
                  <div className="border p-4 rounded-lg">
                    <div className="font-medium flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      Open Graph Tags
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Required tags: og:title, og:description, og:image, og:url, og:type, og:site_name
                    </div>
                    <div className="mt-2 bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                      <pre>{`<meta property="og:title" content="Title Here" />
<meta property="og:description" content="Description here" />
<meta property="og:image" content="https://repairhq.io/image.jpg" />
<meta property="og:url" content="https://repairhq.io/page" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="RepairHQ" />`}</pre>
                    </div>
                  </div>

                  <div className="border p-4 rounded-lg">
                    <div className="font-medium flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      Twitter Card Tags
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Required tags: twitter:card, twitter:title, twitter:description, twitter:image
                    </div>
                    <div className="mt-2 bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                      <pre>{`<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Title Here" />
<meta name="twitter:description" content="Description here" />
<meta name="twitter:image" content="https://repairhq.io/image.jpg" />`}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="technical">
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium">Technical SEO</h3>
                <p className="text-gray-600">Implement these technical optimizations:</p>

                <div className="space-y-2">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium">XML Sitemaps</div>
                      <div className="text-sm text-gray-600">
                        Generate and submit sitemaps for all content types and languages
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium">Robots.txt</div>
                      <div className="text-sm text-gray-600">
                        Configure to allow indexing of important pages and block admin areas
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium">Page Speed</div>
                      <div className="text-sm text-gray-600">Optimize images, use lazy loading, minimize CSS/JS</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium">Mobile Optimization</div>
                      <div className="text-sm text-gray-600">
                        Ensure responsive design and mobile-friendly experience
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium">HTTPS</div>
                      <div className="text-sm text-gray-600">Ensure all pages use HTTPS and redirect HTTP to HTTPS</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium">Hreflang Tags</div>
                      <div className="text-sm text-gray-600">Implement for all multi-language pages</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
