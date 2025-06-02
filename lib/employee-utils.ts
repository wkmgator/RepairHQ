export function getRoleColor(role: string): string {
  switch (role) {
    case "owner":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "manager":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "technician":
      return "bg-green-100 text-green-800 border-green-200"
    case "sales":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "admin":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function calculateHoursWorked(clockIn: Date, clockOut: Date): number {
  const diffMs = clockOut.getTime() - clockIn.getTime()
  return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100
}

export function calculateWeeklyPay(hourlyRate: number, hoursWorked: number, overtimeRate = 1.5): number {
  const regularHours = Math.min(hoursWorked, 40)
  const overtimeHours = Math.max(hoursWorked - 40, 0)
  return regularHours * hourlyRate + overtimeHours * hourlyRate * overtimeRate
}

export const employeeRoles = [
  { value: "owner", label: "Owner" },
  { value: "manager", label: "Manager" },
  { value: "technician", label: "Technician" },
  { value: "sales", label: "Sales Associate" },
  { value: "admin", label: "Administrator" },
]

export const employeePermissions = [
  { value: "view_customers", label: "View Customers" },
  { value: "edit_customers", label: "Edit Customers" },
  { value: "view_tickets", label: "View Tickets" },
  { value: "edit_tickets", label: "Edit Tickets" },
  { value: "view_invoices", label: "View Invoices" },
  { value: "edit_invoices", label: "Edit Invoices" },
  { value: "view_inventory", label: "View Inventory" },
  { value: "edit_inventory", label: "Edit Inventory" },
  { value: "view_employees", label: "View Employees" },
  { value: "edit_employees", label: "Edit Employees" },
  { value: "view_analytics", label: "View Analytics" },
  { value: "manage_settings", label: "Manage Settings" },
]
