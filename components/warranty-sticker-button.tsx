"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tag } from "lucide-react"
import { WarrantyStickerGenerator } from "@/components/warranty-sticker-generator"
import { format } from "date-fns"

interface WarrantyStickerButtonProps {
  ticket: any
  device: any
}

export function WarrantyStickerButton({ ticket, device }: WarrantyStickerButtonProps) {
  const [open, setOpen] = useState(false)

  // Determine repair type based on ticket data
  const getRepairType = () => {
    if (ticket.issue_description) {
      const issue = ticket.issue_description.toLowerCase()
      if (issue.includes("screen") || issue.includes("display")) return "Screen Repair"
      if (issue.includes("battery")) return "Battery Replacement"
      if (issue.includes("charging") || issue.includes("port")) return "Charging Port Repair"
      if (issue.includes("water") || issue.includes("liquid")) return "Water Damage Repair"
      if (issue.includes("board") || issue.includes("logic")) return "Motherboard Repair"
      if (issue.includes("software") || issue.includes("update")) return "Software Fix"
    }
    return "Device Repair"
  }

  // Prepare initial data for the warranty sticker generator
  const initialData = {
    repairType: getRepairType(),
    warrantyPeriod: ticket.warranty_period || 90,
    warrantyUnit: "days" as const,
    repairDate: ticket.actual_completion
      ? format(new Date(ticket.actual_completion), "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd"),
    serialNumber: `WR-${ticket.ticket_number.replace(/[^0-9]/g, "")}`,
    technician: ticket.technician_name || "",
    notes: device ? `${device.brand} ${device.model} ${device.color || ""}`.trim() : "",
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Tag className="h-4 w-4 mr-2" />
          Print Warranty
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Print Warranty Sticker</DialogTitle>
        </DialogHeader>
        <WarrantyStickerGenerator initialData={initialData} />
      </DialogContent>
    </Dialog>
  )
}
