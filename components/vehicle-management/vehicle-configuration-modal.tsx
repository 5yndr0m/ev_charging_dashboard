"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Settings } from "lucide-react"

interface VehicleConfigurationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicle?: any
  onConfigurationSaved: () => void
}

export function VehicleConfigurationModal({
  open,
  onOpenChange,
  vehicle,
  onConfigurationSaved,
}: VehicleConfigurationModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [configData, setConfigData] = useState({
    chargingLimit: vehicle?.chargingLimit || "80",
    maxChargingRate: vehicle?.maxChargingRate || "50",
    preferredStations: vehicle?.preferredStations || [],
    autoScheduling: vehicle?.autoScheduling || false,
    notifications: vehicle?.notifications || true,
    paymentMethod: vehicle?.paymentMethod || "default",
    chargingPriority: vehicle?.chargingPriority || "standard",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/vehicles/${vehicle.id}/configure`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(configData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Configuration Updated",
          description: `Vehicle configuration for ${vehicle.make} ${vehicle.model} has been updated successfully.`,
        })

        onConfigurationSaved()
        onOpenChange(false)
      } else {
        toast({
          title: "Configuration Failed",
          description: result.error || "Failed to update vehicle configuration",
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setConfigData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-cyan-500/20">
        <DialogHeader>
          <DialogTitle className="text-cyan-400 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configure Vehicle Settings
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure charging preferences and settings for {vehicle?.make} {vehicle?.model} ({vehicle?.licensePlate})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chargingLimit" className="text-white">
                Charging Limit (%)
              </Label>
              <Select
                value={configData.chargingLimit}
                onValueChange={(value) => handleInputChange("chargingLimit", value)}
              >
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Select limit" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="80">80%</SelectItem>
                  <SelectItem value="90">90%</SelectItem>
                  <SelectItem value="100">100%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxChargingRate" className="text-white">
                Max Charging Rate (kW)
              </Label>
              <Select
                value={configData.maxChargingRate}
                onValueChange={(value) => handleInputChange("maxChargingRate", value)}
              >
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Select rate" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="22">22 kW</SelectItem>
                  <SelectItem value="50">50 kW</SelectItem>
                  <SelectItem value="150">150 kW</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chargingPriority" className="text-white">
              Charging Priority
            </Label>
            <Select
              value={configData.chargingPriority}
              onValueChange={(value) => handleInputChange("chargingPriority", value)}
            >
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod" className="text-white">
              Default Payment Method
            </Label>
            <Select
              value={configData.paymentMethod}
              onValueChange={(value) => handleInputChange("paymentMethod", value)}
            >
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="default">Account Default</SelectItem>
                <SelectItem value="visa">Visa *1234</SelectItem>
                <SelectItem value="mastercard">MasterCard *5678</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div>
                <Label className="text-white font-medium">Auto Scheduling</Label>
                <p className="text-sm text-gray-400">Automatically schedule charging during off-peak hours</p>
              </div>
              <Switch
                checked={configData.autoScheduling}
                onCheckedChange={(checked) => handleInputChange("autoScheduling", checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div>
                <Label className="text-white font-medium">Push Notifications</Label>
                <p className="text-sm text-gray-400">Receive notifications about charging status</p>
              </div>
              <Switch
                checked={configData.notifications}
                onCheckedChange={(checked) => handleInputChange("notifications", checked)}
              />
            </div>
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
              Save Configuration
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
