"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { InventoryItem } from "@/lib/supabase-types"
import { toast } from "@/hooks/use-toast"

interface StockAdjustmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: InventoryItem
  onAdjustmentComplete?: (updatedItem: InventoryItem) => void
}

const ADJUSTMENT_TYPES = [
  { value: "add", label: "Add Stock" },
  { value: "remove", label: "Remove Stock" },
  { value: "set", label: "Set Exact Quantity" },
]

const ADJUSTMENT_REASONS = [
  { value: "purchase", label: "New Purchase" },
  { value: "return", label: "Customer Return" },
  { value: "damaged", label: "Damaged/Defective" },
  { value: "loss", label: "Lost/Stolen" },
  { value: "correction", label: "Inventory Correction" },
  { value: "sale", label: "Sale" },
  { value: "transfer", label: "Location Transfer" },
  { value: "other", label: "Other" },
]

export function StockAdjustmentModal({ open, onOpenChange, item, onAdjustmentComplete }: StockAdjustmentModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [adjustmentType, setAdjustmentType] = useState("add")
  const [quantity, setQuantity] = useState(1)
  const [reason, setReason] = useState("purchase")
  const [notes, setNotes] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !item?.id) return

    setLoading(true)
    try {
      // Calculate the new quantity
      let newQuantity = item.quantity_in_stock || 0

      if (adjustmentType === "add") {
        newQuantity += quantity
      } else if (adjustmentType === "remove") {
        newQuantity = Math.max(0, newQuantity - quantity)
      } else if (adjustmentType === "set") {
        newQuantity = Math.max(0, quantity)
      }

      // Update the inventory item
      const { data, error } = await supabase
        .from("inventory_items")
        .update({
          quantity_in_stock: newQuantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id)
        .select()
        .single()

      if (error) throw error

      // Record the transaction
      const { error: transactionError } = await supabase.from("inventory_transactions").insert({
        item_id: item.id,
        user_id: user.id,
        store_id: item.store_id,
        transaction_type: adjustmentType,
        quantity: quantity,
        previous_quantity: item.quantity_in_stock,
        new_quantity: newQuantity,
        reason: reason,
        notes: notes,
        created_at: new Date().toISOString(),
      })

      if (transactionError) throw transactionError

      toast({
        title: "Stock adjusted successfully",
        description: `${item.name} stock is now ${newQuantity}`,
      })

      // Reset form
      setQuantity(1)
      setNotes("")

      // Close modal
      onOpenChange(false)

      // Callback with updated item
      if (onAdjustmentComplete && data) {
        onAdjustmentComplete(data)
      }
    } catch (error) {
      console.error("Error adjusting stock:", error)
      toast({
        title: "Error adjusting stock",
        description: "There was a problem updating the inventory. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
          <DialogDescription>Update the stock quantity for {item?.name}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="adjustment-type" className="text-right">
                Action
              </Label>
              <Select value={adjustmentType} onValueChange={setAdjustmentType} required>
                <SelectTrigger id="adjustment-type" className="col-span-3">
                  <SelectValue placeholder="Select adjustment type" />
                </SelectTrigger>
                <SelectContent>
                  {ADJUSTMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Reason
              </Label>
              <Select value={reason} onValueChange={setReason} required>
                <SelectTrigger id="reason" className="col-span-3">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {ADJUSTMENT_REASONS.map((reasonOption) => (
                    <SelectItem key={reasonOption.value} value={reasonOption.value}>
                      {reasonOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes about this adjustment"
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
