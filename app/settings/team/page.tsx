"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseClient } from "@/lib/supabase"
import { Users, Plus, Edit, Trash2, UserCheck, UserX } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  permissions: string[]
  status: "active" | "invited" | "suspended"
  last_login?: string
  created_at: string
}

const roles = [
  {
    name: "Owner",
    description: "Full access to all features and settings",
    permissions: ["*"],
  },
  {
    name: "Manager",
    description: "Manage operations, view reports, manage team",
    permissions: [
      "view_dashboard",
      "manage_tickets",
      "manage_customers",
      "manage_inventory",
      "view_reports",
      "manage_team",
      "manage_settings",
      "process_payments",
    ],
  },
  {
    name: "Technician",
    description: "Handle repairs, update tickets, manage inventory",
    permissions: ["view_dashboard", "manage_tickets", "view_customers", "manage_inventory", "view_basic_reports"],
  },
  {
    name: "Cashier",
    description: "Process payments, handle POS, basic customer service",
    permissions: ["view_dashboard", "process_payments", "view_customers", "create_tickets", "view_inventory"],
  },
  {
    name: "Viewer",
    description: "Read-only access to most features",
    permissions: ["view_dashboard", "view_tickets", "view_customers", "view_inventory", "view_basic_reports"],
  },
]

const allPermissions = [
  { id: "view_dashboard", name: "View Dashboard", category: "General" },
  { id: "manage_tickets", name: "Manage Tickets", category: "Operations" },
  { id: "create_tickets", name: "Create Tickets", category: "Operations" },
  { id: "view_tickets", name: "View Tickets", category: "Operations" },
  { id: "manage_customers", name: "Manage Customers", category: "Customers" },
  { id: "view_customers", name: "View Customers", category: "Customers" },
  { id: "manage_inventory", name: "Manage Inventory", category: "Inventory" },
  { id: "view_inventory", name: "View Inventory", category: "Inventory" },
  { id: "process_payments", name: "Process Payments", category: "Financial" },
  { id: "view_reports", name: "View Reports", category: "Reports" },
  { id: "view_basic_reports", name: "View Basic Reports", category: "Reports" },
  { id: "manage_team", name: "Manage Team", category: "Administration" },
  { id: "manage_settings", name: "Manage Settings", category: "Administration" },
]

export default function TeamManagementPage() {
  const { toast } = useToast()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Technician",
    permissions: [] as string[],
  })

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("team_members").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setTeamMembers(data || [])
    } catch (error) {
      console.error("Error fetching team members:", error)
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveMember = async () => {
    try {
      const supabase = getSupabaseClient()

      if (editingMember) {
        // Update existing member
        const { error } = await supabase
          .from("team_members")
          .update({
            name: formData.name,
            email: formData.email,
            role: formData.role,
            permissions: formData.permissions,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingMember.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Team member updated successfully",
        })
      } else {
        // Create new member
        const { error } = await supabase.from("team_members").insert({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          permissions: formData.permissions,
          status: "invited",
          created_at: new Date().toISOString(),
        })

        if (error) throw error

        toast({
          title: "Success",
          description: "Team member invited successfully",
        })
      }

      setIsDialogOpen(false)
      setEditingMember(null)
      setFormData({ name: "", email: "", role: "Technician", permissions: [] })
      fetchTeamMembers()
    } catch (error) {
      console.error("Error saving team member:", error)
      toast({
        title: "Error",
        description: "Failed to save team member",
        variant: "destructive",
      })
    }
  }

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) return

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("team_members").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Team member removed successfully",
      })
      fetchTeamMembers()
    } catch (error) {
      console.error("Error deleting team member:", error)
      toast({
        title: "Error",
        description: "Failed to remove team member",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (id: string, status: "active" | "suspended") => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from("team_members")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: `Team member ${status === "active" ? "activated" : "suspended"} successfully`,
      })
      fetchTeamMembers()
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update team member status",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member)
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role,
        permissions: member.permissions,
      })
    } else {
      setEditingMember(null)
      setFormData({ name: "", email: "", role: "Technician", permissions: [] })
    }
    setIsDialogOpen(true)
  }

  const handleRoleChange = (role: string) => {
    const selectedRole = roles.find((r) => r.name === role)
    if (selectedRole) {
      setFormData({
        ...formData,
        role,
        permissions: selectedRole.permissions.includes("*") ? ["*"] : selectedRole.permissions,
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "invited":
        return <Badge className="bg-blue-100 text-blue-800">Invited</Badge>
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading team members...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">Manage your team members and their permissions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openEditDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingMember ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
              <DialogDescription>
                {editingMember
                  ? "Update team member information and permissions"
                  : "Invite a new team member to your organization"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Team member name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  className="w-full p-2 border rounded"
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                >
                  {roles.map((role) => (
                    <option key={role.name} value={role.name}>
                      {role.name} - {role.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Permissions</Label>
                <div className="mt-2 space-y-4">
                  {Object.entries(
                    allPermissions.reduce(
                      (acc, perm) => {
                        if (!acc[perm.category]) acc[perm.category] = []
                        acc[perm.category].push(perm)
                        return acc
                      },
                      {} as Record<string, typeof allPermissions>,
                    ),
                  ).map(([category, perms]) => (
                    <div key={category}>
                      <h4 className="font-medium mb-2">{category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {perms.map((perm) => (
                          <label key={perm.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(perm.id) || formData.permissions.includes("*")}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({
                                    ...formData,
                                    permissions: [...formData.permissions.filter((p) => p !== "*"), perm.id],
                                  })
                                } else {
                                  setFormData({
                                    ...formData,
                                    permissions: formData.permissions.filter((p) => p !== perm.id),
                                  })
                                }
                              }}
                              disabled={formData.permissions.includes("*")}
                            />
                            <span className="text-sm">{perm.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveMember}>{editingMember ? "Update" : "Invite"} Team Member</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {teamMembers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No team members yet</h3>
              <p className="text-muted-foreground mb-4">Start by adding your first team member</p>
              <Button onClick={() => openEditDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Team Member
              </Button>
            </CardContent>
          </Card>
        ) : (
          teamMembers.map((member) => (
            <Card key={member.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{member.role}</Badge>
                        {getStatusBadge(member.status)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {member.status === "active" ? (
                      <Button variant="outline" size="sm" onClick={() => handleStatusChange(member.id, "suspended")}>
                        <UserX className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleStatusChange(member.id, "active")}>
                        <UserCheck className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(member)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteMember(member.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Permissions</h4>
                  <div className="flex flex-wrap gap-1">
                    {member.permissions.includes("*") ? (
                      <Badge className="bg-red-100 text-red-800">Full Access</Badge>
                    ) : (
                      member.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {allPermissions.find((p) => p.id === permission)?.name || permission}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
