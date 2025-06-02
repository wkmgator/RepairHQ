import type { Metadata } from "next"
import { EmailCampaignManager } from "@/components/email-campaign-manager"
import { SmsCampaignManager } from "@/components/sms-campaign-manager"
import { MarketingDashboard } from "@/components/marketing-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Marketing | RepairHQ",
  description: "Create and manage marketing campaigns for your repair business",
}

export default function MarketingPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Marketing</h1>
        <p className="text-muted-foreground">Create and manage marketing campaigns for your repair business</p>
      </div>
      <Separator className="my-6" />

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="email">Email Campaigns</TabsTrigger>
          <TabsTrigger value="sms">SMS Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <MarketingDashboard />
        </TabsContent>

        <TabsContent value="email">
          <EmailCampaignManager />
        </TabsContent>

        <TabsContent value="sms">
          <SmsCampaignManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
