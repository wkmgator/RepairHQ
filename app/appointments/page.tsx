"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { format, parseISO, isToday, isTomorrow, addDays, startOfDay, endOfDay } from "date-fns"
import { CalendarIcon, Clock, Plus, User, Smartphone, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function AppointmentsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [appointments, setAppointments] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchAppointments()
  }, [selectedDate, viewMode, statusFilter])

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      const supabase = getSupabaseClient()

      // Calculate date range based on view mode
      let startDate, endDate
      if (viewMode === "day") {
        startDate = startOfDay(selectedDate)
        endDate = endOfDay(selectedDate)
      } else if (viewMode === "week") {
        startDate = startOfDay(selectedDate)
        endDate = endOfDay(addDays(selectedDate, 6))
      } else {
        // Month view - simplified for this example
        startDate = startOfDay(selectedDate)
        endDate = endOfDay(addDays(selectedDate, 30))
      }

      let query = supabase
        .from("appointments")
        .select(
          `
          *,
          customer:customers(id, first_name, last_name, phone),
          ticket:tickets(id, ticket_number, status)
        `,
        )
        .gte("start_time", startDate.toISOString())
        .lte("start_time", endDate.toISOString())
        .order("start_time")

      // Apply status filter if not "all"
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error("Error fetching appointments:", error)
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      case "no_show":
        return <Badge className="bg-gray-100 text-gray-800">No Show</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getAppointmentsByTime = useMemo(() => {
    const timeSlots: Record<string, any[]> = {}

    // Create time slots from 8 AM to 6 PM
    for (let hour = 8; hour <= 18; hour++) {
      const timeKey = `${hour.toString().padStart(2, "0")}:00`
      timeSlots[timeKey] = []
    }

    // Group appointments by time
    appointments.forEach((appointment) => {
      const startTime = parseISO(appointment.start_time)
      const timeKey = `${startTime.getHours().toString().padStart(2, "0")}:00`

      if (timeSlots[timeKey]) {
        timeSlots[timeKey].push(appointment)
      } else {
        // For appointments outside regular hours
        timeSlots[timeKey] = [appointment]
      }
    })

    return timeSlots
  }, [appointments])

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from("appointments")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", appointmentId)

      if (error) throw error

      // Update local state
      setAppointments(
        appointments.map((appointment) =>
          appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment,
        ),
      )

      toast({
        title: "Status Updated",
        description: `Appointment status changed to ${newStatus}`,
      })
    } catch (error) {
      console.error("Error updating appointment status:", error)
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      })
    }
  }

  const getDateDisplay = () => {
    if (viewMode === "day") {
      if (isToday(selectedDate)) {
        return "Today"
      } else if (isTomorrow(selectedDate)) {
        return "Tomorrow"
      } else {
        return format(selectedDate, "EEEE, MMMM d, yyyy")
      }
    } else if (viewMode === "week") {
      const endDate = addDays(selectedDate, 6)
      return `${format(selectedDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`
    } else {
      return format(selectedDate, "MMMM yyyy")
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Button onClick={() => router.push("/appointments/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />

              <div className="mt-4 space-y-2">
                <div>
                  <label className="text-sm font-medium">View Mode</label>
                  <Select value={viewMode} onValueChange={(value: "day" | "week" | "month") => setViewMode(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Status Filter</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="no_show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Today's Appointments:</span>
                  <Badge variant="outline" className="font-mono">
                    {appointments.filter((a) => isToday(parseISO(a.start_time))).length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Upcoming (7 days):</span>
                  <Badge variant="outline" className="font-mono">
                    {
                      appointments.filter(
                        (a) => parseISO(a.start_time) > new Date() && parseISO(a.start_time) < addDays(new Date(), 7),
                      ).length
                    }
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completed:</span>
                  <Badge variant="outline" className="font-mono">
                    {appointments.filter((a) => a.status === "completed").length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cancelled:</span>
                  <Badge variant="outline" className="font-mono">
                    {appointments.filter((a) => a.status === "cancelled").length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>{getDateDisplay()}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : appointments.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center">
                  <p className="text-gray-500">No appointments scheduled for this period</p>
                  <Button variant="outline" className="mt-2" onClick={() => router.push("/appointments/new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Appointment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(getAppointmentsByTime).map(([timeSlot, appointmentsInSlot]) => (
                    <div key={timeSlot}>
                      {appointmentsInSlot.length > 0 && (
                        <>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-gray-500" />
                            <h3 className="font-medium">{timeSlot}</h3>
                          </div>
                          <div className="ml-6 mt-2 space-y-3">
                            {appointmentsInSlot.map((appointment) => (
                              <div
                                key={appointment.id}
                                className="rounded-lg border p-3 hover:bg-gray-50"
                                onClick={() => router.push(`/appointments/${appointment.id}`)}
                              >
                                <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-start sm:space-y-0">
                                  <div>
                                    <div className="flex items-center">
                                      <h4 className="font-medium">{appointment.title}</h4>
                                      <span className="ml-2">{getStatusBadge(appointment.status)}</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      {format(parseISO(appointment.start_time), "h:mm a")} -{" "}
                                      {format(parseISO(appointment.end_time), "h:mm a")}
                                    </p>
                                    <div className="mt-1 flex items-center text-sm text-gray-600">
                                      <User className="mr-1 h-3 w-3" />
                                      {appointment.customer ? (
                                        <span>
                                          {appointment.customer.first_name} {appointment.customer.last_name}
                                        </span>
                                      ) : (
                                        <span>No customer assigned</span>
                                      )}
                                    </div>
                                    {appointment.ticket && (
                                      <div className="mt-1 flex items-center text-sm text-gray-600">
                                        <Smartphone className="mr-1 h-3 w-3" />
                                        <span>Ticket #{appointment.ticket.ticket_number}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleStatusChange(appointment.id, "completed")
                                      }}
                                    >
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleStatusChange(appointment.id, "cancelled")
                                      }}
                                    >
                                      <XCircle className="h-4 w-4 text-red-500" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleStatusChange(appointment.id, "no_show")
                                      }}
                                    >
                                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
