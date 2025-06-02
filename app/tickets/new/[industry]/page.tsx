"use client"

import { useParams, useSearchParams } from "next/navigation"
import { IndustryTicketForm } from "@/components/industry-ticket-form"
import { RepairIndustry, getIndustryConfig, getAllIndustries } from "@/lib/industry-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Info } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Helper to check if a string is a valid RepairIndustry key
function isValidRepairIndustry(value: string): value is RepairIndustry {
  return Object.values(RepairIndustry).includes(value as RepairIndustry)
}

export default function NewTicketForIndustryPage() {
  const params = useParams()
  const searchParams = useSearchParams()

  const industrySlug = typeof params.industry === "string" ? params.industry : ""
  const customerId = searchParams.get("customerId") || null

  if (!industrySlug) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Industry not specified in the URL.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!isValidRepairIndustry(industrySlug)) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Invalid Industry</AlertTitle>
          <AlertDescription>
            The industry "{industrySlug}" is not recognized. Please select a valid industry.
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Available Industries</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getAllIndustries().map((industryConfig) => (
              <Link
                key={industryConfig.id}
                href={`/tickets/new/${industryConfig.id}${customerId ? `?customerId=${customerId}` : ""}`}
                passHref
              >
                <Button variant="outline" className="w-full justify-start">
                  <industryConfig.icon className="mr-2 h-5 w-5" />
                  {industryConfig.name}
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  // At this point, industrySlug is a valid RepairIndustry
  const industry = industrySlug as RepairIndustry
  const industryConfig = getIndustryConfig(industry)

  if (!industryConfig) {
    // Should not happen if isValidRepairIndustry works correctly with getIndustryConfig
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Configuration Error</AlertTitle>
          <AlertDescription>Could not load configuration for industry: {industry}.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">New Ticket for {industryConfig.name}</h1>
        <p className="text-muted-foreground">
          Fill in the details below to create a new repair ticket.
          {customerId && ` For Customer ID: ${customerId}`}
        </p>
      </div>
      {!customerId && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Customer Not Selected</AlertTitle>
          <AlertDescription>
            No customer ID was provided. You may need to select or create a customer before associating this ticket. The
            form will require a Customer ID to be entered manually or selected.
          </AlertDescription>
        </Alert>
      )}
      <IndustryTicketForm industry={industry} customerId={customerId} />
    </div>
  )
}
