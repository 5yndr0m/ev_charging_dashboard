"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  User,
  CreditCard,
  Zap,
  FileText,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react"
import type { Booking } from "@/lib/data"

interface BookingDetailModalProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (booking: Booking) => void
  onDelete?: (bookingId: string) => void
  onStatusChange?: (bookingId: string, status: string) => void
}

export default function BookingDetailModal({
  booking,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}: BookingDetailModalProps) {
  if (!booking) return null

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

  const canComplete = booking.status === "Active"
  const canCancel = ["Scheduled", "Active"].includes(booking.status)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-400" />
              Booking Details - {booking.id}
            </DialogTitle>
            <div className="flex gap-2">
              <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
              <Badge className={getSourceColor(booking.bookingSource)}>{booking.bookingSource}</Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer & Vehicle Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <User className="h-4 w-4 text-green-400" />
                  </div>
                  <h3 className="font-medium text-white">Customer Information</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white">{booking.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">User ID:</span>
                    <span className="text-white">{booking.userId}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-500/20 p-2 rounded-lg">
                    <Car className="h-4 w-4 text-purple-400" />
                  </div>
                  <h3 className="font-medium text-white">Vehicle Information</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">License Plate:</span>
                    <span className="text-white">{booking.vehiclePlate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vehicle ID:</span>
                    <span className="text-white">{booking.vehicleId}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location & Charging Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-500/20 p-2 rounded-lg">
                    <MapPin className="h-4 w-4 text-orange-400" />
                  </div>
                  <h3 className="font-medium text-white">Location Details</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Station:</span>
                    <span className="text-white">{booking.stationLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Station ID:</span>
                    <span className="text-white">{booking.stationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Charger:</span>
                    <span className="text-white">{booking.chargerId}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <Zap className="h-4 w-4 text-blue-400" />
                  </div>
                  <h3 className="font-medium text-white">Charging Details</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Power Requested:</span>
                    <span className="text-white">{booking.powerRequested} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">{booking.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Energy:</span>
                    <span className="text-white">
                      {((booking.powerRequested * booking.duration) / 60).toFixed(2)} kWh
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule & Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-yellow-500/20 p-2 rounded-lg">
                    <Clock className="h-4 w-4 text-yellow-400" />
                  </div>
                  <h3 className="font-medium text-white">Schedule Information</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white">{booking.bookingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Start Time:</span>
                    <span className="text-white">{booking.startTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">End Time:</span>
                    <span className="text-white">{booking.endTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Created:</span>
                    <span className="text-white">{new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <CreditCard className="h-4 w-4 text-green-400" />
                  </div>
                  <h3 className="font-medium text-white">Payment Information</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Method:</span>
                    <span className="text-white">{booking.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <Badge
                      className={
                        booking.paymentStatus === "Paid"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }
                    >
                      {booking.paymentStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Estimated:</span>
                    <span className="text-white">{booking.estimatedCost}</span>
                  </div>
                  {booking.actualCost && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Actual:</span>
                      <span className="text-white">{booking.actualCost}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          {booking.notes && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-gray-500/20 p-2 rounded-lg">
                    <FileText className="h-4 w-4 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-white">Notes</h3>
                </div>
                <p className="text-gray-300 text-sm">{booking.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700">
            {canComplete && onStatusChange && (
              <Button
                onClick={() => onStatusChange(booking.id, "Completed")}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            )}

            {canCancel && onStatusChange && (
              <Button
                onClick={() => onStatusChange(booking.id, "Cancelled")}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500/10"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Booking
              </Button>
            )}

            {onEdit && (
              <Button
                onClick={() => onEdit(booking)}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}

            {onDelete && (
              <Button
                onClick={() => onDelete(booking.id)}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}

            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 ml-auto bg-transparent"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
