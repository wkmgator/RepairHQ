"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase" // Client-side Supabase
import type { Customer } from "@/lib/supabase-types"

interface NewCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onCustomerCreated: (customer: Customer) => void
}

export function NewCustomerModal({ isOpen, onClose, onCustomerCreated }: NewCustomerModalProps) {
  const { toast } = useToast()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName || !lastName) {
      toast({ title: "Missing Fields", description: "First and last name are required.", variant: "destructive" })
      return
    }
    setIsSaving(true)
    try {
      const { data, error } = await supabase
        .from("customers")
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: email || null,
          phone: phone || null,
          // user_id: (await supabase.auth.getUser()).data.user?.id // Associate with current business if needed
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        toast({ title: "Customer Created", description: `${data.first_name} ${data.last_name} added.` })
        onCustomerCreated(data as Customer) // Pass the full customer object
        resetForm()
        onClose()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create customer.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const resetForm = () => {
    setFirstName("")
    setLastName("")
    setEmail("")
    setPhone("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>Enter the details for the new customer.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewCustomerModal
