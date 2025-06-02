"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getSupabaseClient } from "@/lib/supabase-pos"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Trash2, Edit, Computer, Printer, CreditCard } from "lucide-react"

interface Register {
  id: string
  name: string
  location_id: string
  status: "active" | "inactive" | "maintenance"
  register_type: "main" | "mobile" | "kiosk"
  ip_address?: string
  printer_connected: boolean
  card_reader_connected: boolean
  cash_drawer_connected: boolean
  created_at: string
  current_user_id?: string
}

interface RegisterManagementProps {
  initialRegisters: Register[]
}

export default function RegisterManagement({ initialRegisters }: RegisterManagementProps) {
  const [registers, setRegisters] = useState<Register[]>(initialRegisters)
  const [isCreating, setIsCreating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newRegister, setNewRegister] = useState({
    name: "",
    register_type: "main" as const,
    ip_address: "",
    printer_connected: true,
    card_reader_connected: true,
    cash_drawer_connected: true,
  })
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  const handleCreateRegister = async () => {
    if (!newRegister.name) {
      toast({
        title: "Error",
        description: "Register name is required",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const { data: userData } = await supabase.auth.getUser()

      const { data, error } = await supabase
        .from("pos_registers")
        .insert({
          name: newRegister.name,
          register_type: newRegister.register_type,
          ip_address: newRegister.ip_address || null,
          printer_connected: newRegister.printer_connected,
          card_reader_connected: newRegister.card_reader_connected,
          cash_drawer_connected: newRegister.cash_drawer_connected,
          status: "active",
          location_id: "main", // Default location
          current_user_id: userData.user?.id,
        })
        .select()
        .single()

      if (error) throw error

      setRegisters([...registers, data])
      setIsCreating(false)
      setNewRegister({
        name: "",
        register_type: "main",
        ip_address: "",
        printer_connected: true,
        card_reader_connected: true,
        cash_drawer_connected: true,
      })

      toast({
        title: "Register Created",
        description: `Register "${data.name}" has been created successfully.`,
      })

      router.refresh()
    } catch (error) {
      console.error("Error creating register:", error)
      toast({
        title: "Error",
        description: "Failed to create register. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleStatus = async (register: Register) => {
    try {
      const newStatus = register.status === "active" ? "inactive" : "active"

      const { error } = await supabase
        .from("pos_registers")
        .update({
          status: newStatus,
          current_user_id: newStatus === "inactive" ? null : register.current_user_id,
        })
        .eq("id", register.id)

      if (error) throw error

      setRegisters(registers.map((r) => (r.id === register.id ? { ...r, status: newStatus } : r)))

      toast({
        title: `Register ${newStatus === "active" ? "Activated" : "Deactivated"}`,
        description: `Register "${register.name}" has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
      })

      router.refresh()
    } catch (error) {
      console.error("Error toggling register status:", error)
      toast({
        title: "Error",
        description: "Failed to update register status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRegister = async (register: Register) => {
    if (!confirm(`Are you sure you want to delete register "${register.name}"?`)) {
      return
    }

    try {
      const { error } = await supabase.from("pos_registers").delete().eq("id", register.id)

      if (error) throw error

      setRegisters(registers.filter((r) => r.id !== register.id))

      toast({
        title: "Register Deleted",
        description: `Register "${register.name}" has been deleted.`,
      })

      router.refresh()
    } catch (error) {
      console.error("Error deleting register:", error)
      toast({
        title: "Error",
        description: "Failed to delete register. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadgeVariant = (status: Register["status"]) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "maintenance":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Register Management</h1>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="mr-2 h-4 w-4" />
          Add Register
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Registers</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {registers.length === 0 ? (
              <div className="col-span-full py-8 text-center text-gray-500">
                No registers found. Click "Add Register" to create one.
              </div>
            ) : (
              registers.map((register) => (
                <RegisterCard
                  key={register.id}
                  register={register}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteRegister}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {registers.filter((r) => r.status === "active").length === 0 ? (
              <div className="col-span-full py-8 text-center text-gray-500">No active registers found.</div>
            ) : (
              registers
                .filter((r) => r.status === "active")
                .map((register) => (
                  <RegisterCard
                    key={register.id}
                    register={register}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDeleteRegister}
                  />
                ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="inactive">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {registers.filter((r) => r.status === "inactive").length === 0 ? (
              <div className="col-span-full py-8 text-center text-gray-500">No inactive registers found.</div>
            ) : (
              registers
                .filter((r) => r.status === "inactive")
                .map((register) => (
                  <RegisterCard
                    key={register.id}
                    register={register}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDeleteRegister}
                  />
                ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {isCreating && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Create New Register</CardTitle>
            <CardDescription>Add a new POS register to your system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="register-name">Register Name</Label>
                <Input
                  id="register-name"
                  placeholder="Main Register"
                  value={newRegister.name}
                  onChange={(e) => setNewRegister({ ...newRegister, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-type">Register Type</Label>
                <select
                  id="register-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newRegister.register_type}
                  onChange={(e) =>
                    setNewRegister({
                      ...newRegister,
                      register_type: e.target.value as "main" | "mobile" | "kiosk",
                    })
                  }
                >
                  <option value="main">Main Register</option>
                  <option value="mobile">Mobile Register</option>
                  <option value="kiosk">Self-Service Kiosk</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ip-address">IP Address (Optional)</Label>
                <Input
                  id="ip-address"
                  placeholder="192.168.1.100"
                  value={newRegister.ip_address}
                  onChange={(e) => setNewRegister({ ...newRegister, ip_address: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="printer"
                  checked={newRegister.printer_connected}
                  onCheckedChange={(checked) => setNewRegister({ ...newRegister, printer_connected: checked })}
                />
                <Label htmlFor="printer">Receipt Printer</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="card-reader"
                  checked={newRegister.card_reader_connected}
                  onCheckedChange={(checked) => setNewRegister({ ...newRegister, card_reader_connected: checked })}
                />
                <Label htmlFor="card-reader">Card Reader</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="cash-drawer"
                  checked={newRegister.cash_drawer_connected}
                  onCheckedChange={(checked) => setNewRegister({ ...newRegister, cash_drawer_connected: checked })}
                />
                <Label htmlFor="cash-drawer">Cash Drawer</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRegister} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Register"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

function RegisterCard({
  register,
  onToggleStatus,
  onDelete,
}: {
  register: Register
  onToggleStatus: (register: Register) => void
  onDelete: (register: Register) => void
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Computer className="mr-2 h-5 w-5" />
            {register.name}
          </CardTitle>
          <Badge variant={register.status === "active" ? "default" : "secondary"}>
            {register.status === "active" ? "Active" : "Inactive"}
          </Badge>
        </div>
        <CardDescription>
          {register.register_type === "main"
            ? "Main Register"
            : register.register_type === "mobile"
              ? "Mobile Register"
              : "Self-Service Kiosk"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          {register.ip_address && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">IP Address:</span>
              <span>{register.ip_address}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Created:</span>
            <span>{new Date(register.created_at).toLocaleDateString()}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {register.printer_connected && (
              <Badge variant="outline" className="flex items-center">
                <Printer className="mr-1 h-3 w-3" />
                Printer
              </Badge>
            )}
            {register.card_reader_connected && (
              <Badge variant="outline" className="flex items-center">
                <CreditCard className="mr-1 h-3 w-3" />
                Card Reader
              </Badge>
            )}
            {register.cash_drawer_connected && (
              <Badge variant="outline" className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1 h-3 w-3"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
                Cash Drawer
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" onClick={() => onToggleStatus(register)}>
          {register.status === "active" ? "Deactivate" : "Activate"}
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onDelete(register)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
