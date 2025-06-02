import { SEODashboard } from "@/components/seo-dashboard"

export const metadata = {
  title: "SEO Dashboard | RepairHQ Admin",
  description: "Monitor and optimize your SEO performance",
}

export default function SEODashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">SEO Dashboard</h1>
      <SEODashboard />
    </div>
  )
}
