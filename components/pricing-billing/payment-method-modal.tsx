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
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CreditCard } from "lucide-react"

interface PaymentMethodModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onPaymentMethodAdded: () => void
}

export function PaymentMethodModal({ open, onOpenChange, userId, onPaymentMethodAdded }: PaymentMethodModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    type: "credit_card",
    provider: "",
    maskedNumber: "",
    expiryDate: "",
    isDefault: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/payments/methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Payment Method Added",
          description: `${formData.provider} payment method has been added successfully.`,
        })

        setFormData({
          type: "credit_card",
          provider: "",
          maskedNumber: "",
          expiryDate: "",
          isDefault: false,
        })

        onPaymentMethodAdded()
        onOpenChange(false)
      } else {
        toast({
          title: "Failed to Add Payment Method",
          description: result.error || "An error occurred",
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
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-cyan-500/20">
        <DialogHeader>
          <DialogTitle className="text-cyan-400 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Add Payment Method
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new payment method for charging sessions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-white">
              Payment Type
            </Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="debit_card">Debit Card</SelectItem>
                <SelectItem value="mobile_payment">Mobile Payment</SelectItem>
                <SelectItem value="e_wallet">E-Wallet</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider" className="text-white">
              Provider
            </Label>
            <Input
              id="provider"
              value={formData.provider}
              onChange={(e) => handleInputChange("provider", e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white"
              placeholder="Visa, MasterCard, PayPal, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maskedNumber" className="text-white">
              Card/Account Number
            </Label>
            <Input
              id="maskedNumber"
              value={formData.maskedNumber}
              onChange={(e) => handleInputChange("maskedNumber", e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white"
              placeholder="**** **** **** 1234"
              required
            />
          </div>

          {(formData.type === "credit_card" || formData.type === "debit_card") && (
            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="text-white">
                Expiry Date
              </Label>
              <Input
                id="expiryDate"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white"
                placeholder="MM/YY"
              />
            </div>
          )}

          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div>
              <Label className="text-white font-medium">Set as Default</Label>
              <p className="text-sm text-gray-400">Use this as the primary payment method</p>
            </div>
            <Switch
              checked={formData.isDefault}
              onCheckedChange={(checked) => handleInputChange("isDefault", checked)}
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
              Add Payment Method
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
