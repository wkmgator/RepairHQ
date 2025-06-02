"use client"

import type React from "react"

import { useState } from "react"
import { IndustryTicketForm } from "@/components/industry-ticket-form"
import { RepairIndustry, getAllIndustries, getIndustryConfig } from "@/lib/industry-config"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TestIndustryFormPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<RepairIndustry>(RepairIndustry.DIGITAL_DEVICES_GAMING)
  const [customerId, setCustomerId] = useState<string | null>("CUST-12345") // Mock customer ID
  const [formKey, setFormKey] = useState<number>(0) // To force re-render of the form

  const industries = getAllIndustries()

  const handleIndustryChange = (industryId: string) => {
    setSelectedIndustry(industryId as RepairIndustry)
    setFormKey((prevKey) => prevKey + 1) // Change key to force re-mount and reset of IndustryTicketForm
  }

  const handleCustomerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerId(e.target.value || null)
  }

  const currentConfig = getIndustryConfig(selectedIndustry)

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Test Industry Ticket Form</CardTitle>
          <CardDescription>
            Select an industry to see how the ticket form fields change dynamically based on its configuration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="industry-selector">Select Repair Industry</Label>
              <Select value={selectedIndustry} onValueChange={handleIndustryChange}>
                <SelectTrigger id="industry-selector">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.id} value={industry.id}>
                      {industry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="customer-id-input">Customer ID (Optional)</Label>
              <Input
                id="customer-id-input"
                value={customerId || ""}
                onChange={handleCustomerIdChange}
                placeholder="Enter Customer ID"
              />
            </div>
          </div>
          <Button onClick={() => setFormKey((prevKey) => prevKey + 1)} variant="outline" className="mt-2">
            Reload Form with Current Settings
          </Button>
        </CardContent>
      </Card>

      {currentConfig ? (
        <IndustryTicketForm
          key={formKey} // Crucial for re-rendering when industry changes
          industry={selectedIndustry}
          customerId={customerId}
          onSuccess={(ticketId) => {
            alert(`Test Ticket Created (Simulated): ${ticketId}`)
          }}
        />
      ) : (
        <p>Could not load configuration for the selected industry.</p>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Current Industry Configuration Preview</CardTitle>
          <CardDescription>Schema for: {currentConfig?.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold text-lg mb-2">Device Attributes Schema:</h3>
          {currentConfig?.deviceAttributesSchema && currentConfig.deviceAttributesSchema.length > 0 ? (
            <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
              {JSON.stringify(currentConfig.deviceAttributesSchema, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">No device attributes schema defined.</p>
          )}

          <h3 className="font-semibold text-lg mt-4 mb-2">Ticket Custom Fields Schema:</h3>
          {currentConfig?.ticketCustomFieldsSchema && currentConfig.ticketCustomFieldsSchema.length > 0 ? (
            <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
              {JSON.stringify(currentConfig.ticketCustomFieldsSchema, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">No ticket custom fields schema defined.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
