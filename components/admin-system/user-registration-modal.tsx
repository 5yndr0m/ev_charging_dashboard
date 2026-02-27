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
import { Loader2, UserPlus } from "lucide-react"

interface UserRegistrationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserRegistered: () => void
}

export function UserRegistrationModal({ open, onOpenChange, onUserRegistered }: UserRegistrationModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Operator",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "User Registered",
          description: `${formData.name} has been successfully registered as ${formData.role}`,
        })

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          role: "Operator",
        })

        onUserRegistered()
        onOpenChange(false)
      } else {
        toast({
          title: "Registration Failed",
          description: result.error || "Failed to register user",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-cyan-500/20">
        <DialogHeader>
          <DialogTitle className="text-cyan-400 flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Register New User
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new user to the system with appropriate role and permissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Full Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white"
              placeholder="John Silva"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white"
              placeholder="john.silva@ems.lk"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">
              Phone Number
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

          <div className="space-y-2">
            <Label htmlFor="role" className="text-white">
              User Role
            </Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
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
              Register User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
