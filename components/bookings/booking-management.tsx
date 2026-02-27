"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  User,
  CreditCard,
  Download,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import type { Booking } from "@/lib/data"
import BookingAddModal from "./booking-add-modal"
import BookingDetailModal from "./booking-detail-modal"
import ExportReportModal from "@/components/analytics-reports/export-report-modal"

import { fetchBookings } from "@/lib/api-client"

const bookingStats = [
  { label: "Total Bookings", value: "1,247", icon: Calendar, color: "text-blue-400" },
  { label: "Active Sessions", value: "23", icon: Clock, color: "text-green-400" },
  { label: "Today's Revenue", value: "LKR 45,670", icon: CreditCard, color: "text-purple-400" },
  { label: "Completion Rate", value: "94.2%", icon: Car, color: "text-orange-400" },
]

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showAddBooking, setShowAddBooking] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  useEffect(() => {
    fetchBookingsData()
  }, [statusFilter, sourceFilter])

  const fetchBookingsData = async () => {
    try {
      setLoading(true)
      const filters: Record<string, string> = {}
      if (statusFilter !== "all") filters.status = statusFilter
      // sourceFilter not yet supported by backend API fully, ignoring for now or mapping if backend supports

      const data = await fetchBookings(filters)

      if (Array.isArray(data)) {
        const mappedBookings: Booking[] = data.map((b: any) => ({
          id: b._id,
          userId: b.userId?._id || "",
          userName: b.userId?.name || "Unknown",
          vehicleId: b.vehicleId?._id || "",
          vehiclePlate: b.vehicleId?.plateNumber || "N/A",
          stationId: b.chargerId?.stationId?._id || "",
          stationLocation: b.chargerId?.stationId?.location || "Unknown",
          chargerId: b.chargerId?._id || "",
          bookingDate: new Date(b.startTime).toLocaleDateString(),
          startTime: new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          endTime: new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          duration: (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / 60000,
          status: b.status,
          bookingSource: "Mobile App",
          powerRequested: 0,
          estimatedCost: `LKR ${b.totalCost?.toFixed(2) || "0.00"}`,
          actualCost: `LKR ${b.totalCost?.toFixed(2) || "0.00"}`,
          paymentMethod: "Visa",
          paymentStatus: "Paid",
          createdAt: b.createdAt || new Date().toISOString(),
          updatedAt: b.updatedAt || new Date().toISOString(),
          notes: ""
        }))
        setBookings(mappedBookings)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = async () => {
    setShowExportModal(true)
  }

  const handleStatusChange = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchBookingsData()
        setShowDetailModal(false)
      }
    } catch (error) {
      console.error("Error updating booking status:", error)
    }
  }

  const handleDeleteBooking = async (bookingId: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          fetchBookingsData()
          setShowDetailModal(false)
        }
      } catch (error) {
        console.error("Error deleting booking:", error)
      }
    }
  }

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowDetailModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Active":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Scheduled":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "No Show":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case "Mobile App":
        return "bg-purple-500/20 text-purple-400"
      case "Website":
        return "bg-blue-500/20 text-blue-400"
      case "Admin Panel":
        return "bg-orange-500/20 text-orange-400"
      case "RFID":
        return "bg-green-500/20 text-green-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.stationLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {bookingStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Controls */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-white">Booking Management</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setShowAddBooking(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Booking
              </Button>
              <Button
                onClick={handleExportReport}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="No Show">No Show</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Mobile App">Mobile App</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Admin Panel">Admin Panel</SelectItem>
                <SelectItem value="RFID">RFID</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {loading ? (
                <div className="text-center py-8 text-gray-400">Loading bookings...</div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No bookings found</div>
              ) : (
                <div className="space-y-3">
                  {filteredBookings.map((booking) => (
                    <Card
                      key={booking.id}
                      className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                          {/* Booking Info */}
                          <div className="lg:col-span-3">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-500/20 p-2 rounded-lg">
                                <Calendar className="h-4 w-4 text-blue-400" />
                              </div>
                              <div>
                                <p className="font-medium text-white">{booking.id}</p>
                                <p className="text-sm text-gray-400">{booking.bookingDate}</p>
                              </div>
                            </div>
                          </div>

                          {/* User & Vehicle */}
                          <div className="lg:col-span-3">
                            <div className="flex items-center gap-3">
                              <div className="bg-green-500/20 p-2 rounded-lg">
                                <User className="h-4 w-4 text-green-400" />
                              </div>
                              <div>
                                <p className="font-medium text-white">{booking.userName}</p>
                                <p className="text-sm text-gray-400">{booking.vehiclePlate}</p>
                              </div>
                            </div>
                          </div>

                          {/* Station & Time */}
                          <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <p className="text-sm text-white">{booking.stationLocation}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <p className="text-sm text-gray-400">
                                {booking.startTime} - {booking.endTime}
                              </p>
                            </div>
                          </div>

                          {/* Status & Source */}
                          <div className="lg:col-span-2">
                            <Badge className={`${getStatusColor(booking.status)} mb-1`}>{booking.status}</Badge>
                            <Badge className={`${getSourceColor(booking.bookingSource)} block w-fit`}>
                              {booking.bookingSource}
                            </Badge>
                          </div>

                          {/* Cost */}
                          <div className="lg:col-span-1">
                            <p className="font-medium text-white">{booking.actualCost || booking.estimatedCost}</p>
                            <p className="text-sm text-gray-400">{booking.paymentStatus}</p>
                          </div>

                          {/* Actions */}
                          <div className="lg:col-span-1">
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewBooking(booking)}
                                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteBooking(booking.id)}
                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-gray-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <BookingAddModal
        isOpen={showAddBooking}
        onClose={() => setShowAddBooking(false)}
        onBookingAdded={fetchBookingsData}
      />

      <BookingDetailModal
        booking={selectedBooking}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteBooking}
      />

      <ExportReportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />
    </div>
  )
}
