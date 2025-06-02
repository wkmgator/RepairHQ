"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Search, Edit, Users, Clock, DollarSign, UserCheck } from "lucide-react"
import Link from "next/link"
import { formatCurrency, getRoleColor, getInitials } from "@/lib/employee-utils"
import type { Employee } from "@/lib/firestore-types"

export default function EmployeesPage() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!user?.uid) return

    const employeesQuery = query(
      collection(db, "employees"),
      where("userId", "==", user.uid),
      orderBy("firstName", "asc"),
    )

    const unsubscribe = onSnapshot(employeesQuery, (snapshot) => {
      const employeesData = snapshot.docs.map((doc) => ({
        employeeId: doc.id,
        ...doc.data(),
      })) as Employee[]
      setEmployees(employeesData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user?.uid])

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch && employee.isActive
  })

  const stats = {
    totalEmployees: employees.filter((emp) => emp.isActive).length,
    totalPayroll: employees
      .filter((emp) => emp.isActive && emp.hourlyRate)
      .reduce((sum, emp) => sum + (emp.hourlyRate || 0) * 40, 0), // Assuming 40 hours/week
    technicians: employees.filter((emp) => emp.isActive && emp.role === "technician").length,
    managers: employees.filter((emp) => emp.isActive && emp.role === "manager").length,
  }

  const handleToggleStatus = async (employeeId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "employees", employeeId), {
        isActive: !currentStatus,
        updatedAt: new Date(),
      })
    } catch (error) {
      console.error("Error updating employee status:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <p className="text-gray-600">Manage your team and track performance</p>
        </div>
        <Link href="/employees/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active team members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalPayroll)}</div>
            <p className="text-xs text-muted-foreground">Estimated weekly cost</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Technicians</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.technicians}</div>
            <p className="text-xs text-muted-foreground">Repair specialists</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managers</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.managers}</div>
            <p className="text-xs text-muted-foreground">Management staff</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Employee List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No employees found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "Try adjusting your search." : "Get started by adding your first employee."}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Link href="/employees/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Employee
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((employee) => (
                <Card key={employee.employeeId} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {getInitials(employee.firstName, employee.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/employees/${employee.employeeId}`}
                          className="text-lg font-semibold text-blue-600 hover:underline"
                        >
                          {employee.firstName} {employee.lastName}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getRoleColor(employee.role)}>{employee.role.toUpperCase()}</Badge>
                          <Badge variant={employee.isActive ? "default" : "secondary"}>
                            {employee.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Email:</span>
                        <span className="ml-2">{employee.email}</span>
                      </div>
                      {employee.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Phone:</span>
                          <span className="ml-2">{employee.phone}</span>
                        </div>
                      )}
                      {employee.hourlyRate && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Rate:</span>
                          <span className="ml-2">{formatCurrency(employee.hourlyRate)}/hour</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Hired:</span>
                        <span className="ml-2">{new Date(employee.hireDate.seconds * 1000).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex gap-2">
                        <Link href={`/employees/${employee.employeeId}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                      <Button
                        variant={employee.isActive ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleToggleStatus(employee.employeeId, employee.isActive)}
                      >
                        {employee.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
