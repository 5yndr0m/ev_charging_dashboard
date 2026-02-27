"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, MapPin, Car, User, CreditCard } from "lucide-react"
import { users, vehiclesData, stationsData } from "@/lib/data"

interface BookingAddModalProps {
  isOpen: boolean
  onClose: () => void
  onBookingAdded: () => void
}

export default function BookingAddModal({ isOpen, onClose, onBookingAdded }: BookingAddModalProps) {
  const [formData, setFormData] = useState({
    userId: "",
    vehicleId: "",
    stationId: "",
    chargerId: "",
    bookingDate: "",
    startTime: "",
    endTime: "",
    powerRequested: "",
    paymentMethod: "",
    bookingSource: "Admin Panel",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [selectedStation, setSelectedStation] = useState<any>(null)

  useEffect(() => {
    if (formData.stationId) {
      const station = stationsData.stations.find((s) => s.id === formData.stationId)
      setSelectedStation(station)
      setFormData((prev) => ({ ...prev, chargerId: "" }))
    }
  }, [formData.stationId])

  const calculateDuration = () => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2024-01-01T${formData.startTime}:00`)
      const end = new Date(`2024-01-01T${formData.endTime}:00`)
      const diffMs = end.getTime() - start.getTime()
      return Math.max(0, diffMs / (1000 * 60)) // minutes
    }
    return 0
  }

  const calculateEstimatedCost = () => {
    const duration = calculateDuration()
    const power = Number.parseFloat(formData.powerRequested) || 0
    const ratePerKwh = 24 // LKR per kWh
    const energyUsed = (power * duration) / 60 // kWh
    return Math.round(energyUsed * ratePerKwh)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const selectedUser = users.find((u) => u.id === formData.userId)
      const selectedVehicle = vehiclesData.vehicles.find((v) => v.id === formData.vehicleId)
      const selectedStation = stationsData.stations.find((s) => s.id === formData.stationId)

      const duration = calculateDuration()
      const estimatedCost = calculateEstimatedCost()

      const bookingData = {
        userId: formData.userId,
        userName: selectedUser?.name || "",
        vehicleId: formData.vehicleId,
        vehiclePlate: selectedVehicle?.licensePlate || "",
        stationId: formData.stationId,
        stationLocation: selectedStation?.location || "",
        chargerId: formData.chargerId,
        bookingDate: formData.bookingDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        duration,
        powerRequested: Number.parseFloat(formData.powerRequested),
        estimatedCost: `LKR ${estimatedCost.toLocaleString()}`,
        paymentMethod: formData.paymentMethod,
        bookingSource: formData.bookingSource,
        paymentStatus: "Pending",
        status: "Scheduled",
        notes: formData.notes,
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      })

      const result = await response.json()

      if (result.success) {
        onBookingAdded()
        onClose()
        // Reset form
        setFormData({
          userId: "",
          vehicleId: "",
          stationId: "",
          chargerId: "",
          bookingDate: "",
          startTime: "",
          endTime: "",
          powerRequested: "",
          paymentMethod: "",
          bookingSource: "Admin Panel",
          notes: "",
        })
      }
    } catch (error) {
      console.error("Error creating booking:", error)
    } finally {
      setLoading(false)
    }
  }

  const userVehicles = vehiclesData.vehicles.filter(
    (v) => users.find((u) => u.id === formData.userId)?.name === v.owner,
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            Add New Booking
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4 text-green-400" />
                User
              </Label>
              <Select
                value={formData.userId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, userId: value, vehicleId: "" }))}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} - {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Car className="h-4 w-4 text-purple-400" />
                Vehicle
              </Label>
              <Select
                value={formData.vehicleId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, vehicleId: value }))}
                disabled={!formData.userId}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {userVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Station & Charger Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-400" />
                Station
              </Label>
              <Select
                value={formData.stationId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, stationId: value }))}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select station" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {stationsData.stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.location} ({station.totalChargers} chargers)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Charger</Label>
              <Select
                value={formData.chargerId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, chargerId: value }))}
                disabled={!selectedStation}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select charger" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {selectedStation?.chargers.map((charger: any) => (
                    <SelectItem key={charger.id} value={charger.id}>
                      {charger.id} - {charger.power}kW ({charger.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Booking Date</Label>
              <Input
                type="date"
                value={formData.bookingDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, bookingDate: e.target.value }))}
                className="bg-gray-800 border-gray-700"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-400" />
                Start Time
              </Label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                className="bg-gray-800 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>

          {/* Power & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Power Required (kW)</Label>
              <Input
                type="number"
                value={formData.powerRequested}
                onChange={(e) => setFormData((prev) => ({ ...prev, powerRequested: e.target.value }))}
                className="bg-gray-800 border-gray-700"
                placeholder="50"
                min="1"
                max="150"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-green-400" />
                Payment Method
              </Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select payment" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="Visa *1234">Visa *1234</SelectItem>
                  <SelectItem value="MasterCard *5678">MasterCard *5678</SelectItem>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Booking Source</Label>
              <Select
                value={formData.bookingSource}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, bookingSource: value }))}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="Admin Panel">Admin Panel</SelectItem>
                  <SelectItem value="Mobile App">Mobile App</SelectItem>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="RFID">RFID</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estimated Cost Display */}
          {formData.startTime && formData.endTime && formData.powerRequested && (
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Duration</p>
                  <p className="text-white font-medium">{calculateDuration()} minutes</p>
                </div>
                <div>
                  <p className="text-gray-400">Power</p>
                  <p className="text-white font-medium">{formData.powerRequested} kW</p>
                </div>
                <div>
                  <p className="text-gray-400">Energy</p>
                  <p className="text-white font-medium">
                    {(((Number.parseFloat(formData.powerRequested) || 0) * calculateDuration()) / 60).toFixed(2)} kWh
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Estimated Cost</p>
                  <p className="text-green-400 font-medium">LKR {calculateEstimatedCost().toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              className="bg-gray-800 border-gray-700"
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                !formData.userId ||
                !formData.vehicleId ||
                !formData.stationId ||
                !formData.chargerId ||
                !formData.bookingDate ||
                !formData.startTime ||
                !formData.endTime
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Creating..." : "Create Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
