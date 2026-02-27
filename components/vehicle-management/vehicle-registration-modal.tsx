"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface VehicleRegistrationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVehicleRegistered: () => void
}

export function VehicleRegistrationModal({ open, onOpenChange, onVehicleRegistered }: VehicleRegistrationModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    owner: "",
    email: "",
    phone: "",
    licensePlate: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Vehicle Registered",
          description: `${formData.make} ${formData.model} has been successfully registered with RFID card ${result.data.rfidCard}`,
        })

        // Reset form
        setFormData({
          make: "",
          model: "",
          year: "",
          owner: "",
          email: "",
          phone: "",
          licensePlate: "",
        })

        onVehicleRegistered()
        onOpenChange(false)
      } else {
        toast({
          title: "Registration Failed",
          description: result.error || "Failed to register vehicle",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-cyan-500/20">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">Register New Vehicle</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new vehicle to the charging network. An RFID card will be automatically assigned.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make" className="text-white">
                Make
              </Label>
              <Select value={formData.make} onValueChange={(value) => handleInputChange("make", value)}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="Tesla">Tesla</SelectItem>
                  <SelectItem value="Nissan">Nissan</SelectItem>
                  <SelectItem value="BMW">BMW</SelectItem>
                  <SelectItem value="Audi">Audi</SelectItem>
                  <SelectItem value="Mercedes">Mercedes</SelectItem>
                  <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                  <SelectItem value="Hyundai">Hyundai</SelectItem>
                  <SelectItem value="Kia">Kia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="text-white">
                Model
              </Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white"
                placeholder="e.g., Model 3"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year" className="text-white">
              Year
            </Label>
            <Select value={formData.year} onValueChange={(value) => handleInputChange("year", value)}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner" className="text-white">
              Owner Name
            </Label>
            <Input
              id="owner"
              value={formData.owner}
              onChange={(e) => handleInputChange("owner", e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white"
              placeholder="Full name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white"
                placeholder="owner@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white"
                placeholder="+94771234567"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="licensePlate" className="text-white">
              License Plate
            </Label>
            <Input
              id="licensePlate"
              value={formData.licensePlate}
              onChange={(e) => handleInputChange("licensePlate", e.target.value.toUpperCase())}
              className="bg-gray-800/50 border-gray-700 text-white"
              placeholder="CAR-1234"
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-cyan-500 text-black hover:bg-cyan-400">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Register Vehicle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
