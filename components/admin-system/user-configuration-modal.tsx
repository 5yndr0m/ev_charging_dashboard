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
import { Loader2, UserCog } from "lucide-react"

interface UserConfigurationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: any
  onConfigurationSaved: () => void
}

export function UserConfigurationModal({
  open,
  onOpenChange,
  user,
  onConfigurationSaved,
}: UserConfigurationModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [configData, setConfigData] = useState({
    role: user?.role || "Operator",
    status: user?.status || "Active",
    permissions: user?.permissions || [],
    emailNotifications: user?.emailNotifications || true,
    smsNotifications: user?.smsNotifications || false,
    dashboardTheme: user?.dashboardTheme || "dark",
    language: user?.language || "en",
    timezone: user?.timezone || "Asia/Colombo",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/users/${user.id}/configure`, {
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
          description: `User configuration for ${user.name} has been updated successfully.`,
        })

        onConfigurationSaved()
        onOpenChange(false)
      } else {
        toast({
          title: "Configuration Failed",
          description: result.error || "Failed to update user configuration",
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

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setConfigData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-cyan-500/20">
        <DialogHeader>
          <DialogTitle className="text-cyan-400 flex items-center gap-2">
            <UserCog className="w-5 h-5" />
            Configure User Settings
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure role, permissions, and preferences for {user?.name} ({user?.email})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">
                User Role
              </Label>
              <Select value={configData.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Station Manager">Station Manager</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Operator">Operator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-white">
                Account Status
              </Label>
              <Select value={configData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language" className="text-white">
                Language
              </Label>
              <Select value={configData.language} onValueChange={(value) => handleInputChange("language", value)}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="si">Sinhala</SelectItem>
                  <SelectItem value="ta">Tamil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-white">
                Timezone
              </Label>
              <Select value={configData.timezone} onValueChange={(value) => handleInputChange("timezone", value)}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="Asia/Colombo">Asia/Colombo (UTC+5:30)</SelectItem>
                  <SelectItem value="UTC">UTC (UTC+0:00)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dashboardTheme" className="text-white">
              Dashboard Theme
            </Label>
            <Select
              value={configData.dashboardTheme}
              onValueChange={(value) => handleInputChange("dashboardTheme", value)}
            >
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="dark">Dark Theme</SelectItem>
                <SelectItem value="light">Light Theme</SelectItem>
                <SelectItem value="auto">Auto (System)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div>
                <Label className="text-white font-medium">Email Notifications</Label>
                <p className="text-sm text-gray-400">Receive system notifications via email</p>
              </div>
              <Switch
                checked={configData.emailNotifications}
                onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div>
                <Label className="text-white font-medium">SMS Notifications</Label>
                <p className="text-sm text-gray-400">Receive critical alerts via SMS</p>
              </div>
              <Switch
                checked={configData.smsNotifications}
                onCheckedChange={(checked) => handleInputChange("smsNotifications", checked)}
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
