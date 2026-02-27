"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Building, Mail, Phone, User, Percent } from "lucide-react"

interface FleetRegistrationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFleetRegistered: () => void
}

export function FleetRegistrationModal({ open, onOpenChange, onFleetRegistered }: FleetRegistrationModalProps) {
  const [formData, setFormData] = useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    vehicles: "",
    contractType: "",
    discount: "",
    billingCycle: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("[v0] Submitting fleet registration:", formData)

      const response = await fetch("/api/fleets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          vehicles: Number.parseInt(formData.vehicles) || 0,
          discount: Number.parseInt(formData.discount) || 0,
          status: "Active",
          activeVehicles: 0,
          monthlySpend: "$0",
        }),
      })

      const result = await response.json()
      console.log("[v0] Fleet registration response:", result)

      if (result.success) {
        onFleetRegistered()
        onOpenChange(false)
        setFormData({
          company: "",
          contact: "",
          email: "",
          phone: "",
          address: "",
          vehicles: "",
          contractType: "",
          discount: "",
          billingCycle: "",
          notes: "",
        })
      } else {
        console.error("[v0] Fleet registration failed:", result.error)
      }
    } catch (error) {
      console.error("[v0] Error registering fleet:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-cyan-500/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-cyan-400 flex items-center gap-2">
            <Building className="w-5 h-5" />
            Register New Fleet
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-cyan-400">
                Company Name *
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="company"
                  placeholder="Enter company name"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact" className="text-cyan-400">
                Contact Person *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="contact"
                  placeholder="Enter contact person name"
                  value={formData.contact}
                  onChange={(e) => handleInputChange("contact", e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-cyan-400">
                Email *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-cyan-400">
                Phone *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicles" className="text-cyan-400">
                Number of Vehicles *
              </Label>
              <Input
                id="vehicles"
                type="number"
                placeholder="Enter number of vehicles"
                value={formData.vehicles}
                onChange={(e) => handleInputChange("vehicles", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractType" className="text-cyan-400">
                Contract Type *
              </Label>
              <Select value={formData.contractType} onValueChange={(value) => handleInputChange("contractType", value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select contract type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount" className="text-cyan-400">
                Discount (%)
              </Label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="discount"
                  type="number"
                  placeholder="Enter discount percentage"
                  value={formData.discount}
                  onChange={(e) => handleInputChange("discount", e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingCycle" className="text-cyan-400">
                Billing Cycle
              </Label>
              <Select value={formData.billingCycle} onValueChange={(value) => handleInputChange("billingCycle", value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select billing cycle" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-cyan-400">
              Address
            </Label>
            <Textarea
              id="address"
              placeholder="Enter company address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-cyan-400">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Additional notes or requirements"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-cyan-500 text-black hover:bg-cyan-400 disabled:opacity-50"
            >
              {isSubmitting ? "Registering..." : "Register Fleet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
