import { SEOImplementationGuide } from "@/components/seo-implementation-guide"

export const metadata = {
  title: "SEO Implementation Guide | RepairHQ Admin",
  description: "Best practices for implementing SEO across RepairHQ",
}

export default function SEOImplementationGuidePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">SEO Implementation Guide</h1>
      <SEOImplementationGuide />
    </div>
  )
}
