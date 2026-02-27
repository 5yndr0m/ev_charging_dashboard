"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Smartphone, Camera, Settings, Clock } from "lucide-react"

interface AuthConfigurationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfigurationSaved: () => void
}

export function AuthConfigurationModal({ open, onOpenChange, onConfigurationSaved }: AuthConfigurationModalProps) {
  const [activeTab, setActiveTab] = useState("rfid")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // RFID Configuration
  const [rfidConfig, setRfidConfig] = useState({
    enabled: true,
    cardFormat: "mifare",
    encryptionLevel: "aes256",
    timeout: "30",
    retryAttempts: "3",
    autoRegister: false,
    requirePin: false,
  })

  // Mobile App Configuration
  const [mobileConfig, setMobileConfig] = useState({
    enabled: true,
    biometricAuth: true,
    pinRequired: true,
    sessionTimeout: "60",
    pushNotifications: true,
    offlineMode: false,
    qrCodeAuth: true,
  })

  // License Plate Configuration
  const [plateConfig, setPlateConfig] = useState({
    enabled: true,
    cameraResolution: "1080p",
    recognitionEngine: "advanced",
    confidenceThreshold: "85",
    countryFormat: "sri_lanka",
    fallbackAuth: true,
    manualOverride: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("[v0] Submitting authentication configuration...")

      const configData = {
        rfid: rfidConfig,
        mobile: mobileConfig,
        licensePlate: plateConfig,
        updatedAt: new Date().toISOString(),
      }

      const response = await fetch("/api/auth/configure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(configData),
      })

      const result = await response.json()
      console.log("[v0] Auth configuration response:", result)

      if (result.success) {
        onConfigurationSaved()
        onOpenChange(false)
      } else {
        console.error("[v0] Auth configuration failed:", result.error)
      }
    } catch (error) {
      console.error("[v0] Error configuring authentication:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-cyan-500/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-cyan-400 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Authentication Configuration
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
              <TabsTrigger
                value="rfid"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
              >
                <Shield className="w-4 h-4 mr-2" />
                RFID Cards
              </TabsTrigger>
              <TabsTrigger
                value="mobile"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile App
              </TabsTrigger>
              <TabsTrigger
                value="plate"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
              >
                <Camera className="w-4 h-4 mr-2" />
                License Plate
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rfid" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="rfid-enabled" className="text-cyan-400">
                      Enable RFID Authentication
                    </Label>
                    <Switch
                      id="rfid-enabled"
                      checked={rfidConfig.enabled}
                      onCheckedChange={(checked) => setRfidConfig({ ...rfidConfig, enabled: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-format" className="text-cyan-400">
                      Card Format
                    </Label>
                    <Select
                      value={rfidConfig.cardFormat}
                      onValueChange={(value) => setRfidConfig({ ...rfidConfig, cardFormat: value })}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="mifare">MIFARE Classic</SelectItem>
                        <SelectItem value="mifare_plus">MIFARE Plus</SelectItem>
                        <SelectItem value="desfire">DESFire</SelectItem>
                        <SelectItem value="ntag">NTAG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="encryption" className="text-cyan-400">
                      Encryption Level
                    </Label>
                    <Select
                      value={rfidConfig.encryptionLevel}
                      onValueChange={(value) => setRfidConfig({ ...rfidConfig, encryptionLevel: value })}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="basic">Basic (64-bit)</SelectItem>
                        <SelectItem value="aes128">AES-128</SelectItem>
                        <SelectItem value="aes256">AES-256</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeout" className="text-cyan-400">
                      Session Timeout (seconds)
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="timeout"
                        type="number"
                        placeholder="30"
                        value={rfidConfig.timeout}
                        onChange={(e) => setRfidConfig({ ...rfidConfig, timeout: e.target.value })}
                        className="pl-10 bg-gray-800 border-gray-700 text-white"
                        min="10"
                        max="300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="retry-attempts" className="text-cyan-400">
                      Retry Attempts
                    </Label>
                    <Input
                      id="retry-attempts"
                      type="number"
                      placeholder="3"
                      value={rfidConfig.retryAttempts}
                      onChange={(e) => setRfidConfig({ ...rfidConfig, retryAttempts: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                      min="1"
                      max="10"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-register" className="text-cyan-400">
                      Auto-register New Cards
                    </Label>
                    <Switch
                      id="auto-register"
                      checked={rfidConfig.autoRegister}
                      onCheckedChange={(checked) => setRfidConfig({ ...rfidConfig, autoRegister: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="require-pin" className="text-cyan-400">
                      Require PIN with Card
                    </Label>
                    <Switch
                      id="require-pin"
                      checked={rfidConfig.requirePin}
                      onCheckedChange={(checked) => setRfidConfig({ ...rfidConfig, requirePin: checked })}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mobile" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mobile-enabled" className="text-cyan-400">
                      Enable Mobile App Authentication
                    </Label>
                    <Switch
                      id="mobile-enabled"
                      checked={mobileConfig.enabled}
                      onCheckedChange={(checked) => setMobileConfig({ ...mobileConfig, enabled: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="biometric" className="text-cyan-400">
                      Biometric Authentication
                    </Label>
                    <Switch
                      id="biometric"
                      checked={mobileConfig.biometricAuth}
                      onCheckedChange={(checked) => setMobileConfig({ ...mobileConfig, biometricAuth: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="pin-required" className="text-cyan-400">
                      PIN Required
                    </Label>
                    <Switch
                      id="pin-required"
                      checked={mobileConfig.pinRequired}
                      onCheckedChange={(checked) => setMobileConfig({ ...mobileConfig, pinRequired: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="qr-auth" className="text-cyan-400">
                      QR Code Authentication
                    </Label>
                    <Switch
                      id="qr-auth"
                      checked={mobileConfig.qrCodeAuth}
                      onCheckedChange={(checked) => setMobileConfig({ ...mobileConfig, qrCodeAuth: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout" className="text-cyan-400">
                      Session Timeout (minutes)
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="session-timeout"
                        type="number"
                        placeholder="60"
                        value={mobileConfig.sessionTimeout}
                        onChange={(e) => setMobileConfig({ ...mobileConfig, sessionTimeout: e.target.value })}
                        className="pl-10 bg-gray-800 border-gray-700 text-white"
                        min="5"
                        max="480"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications" className="text-cyan-400">
                      Push Notifications
                    </Label>
                    <Switch
                      id="push-notifications"
                      checked={mobileConfig.pushNotifications}
                      onCheckedChange={(checked) => setMobileConfig({ ...mobileConfig, pushNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="offline-mode" className="text-cyan-400">
                      Offline Mode Support
                    </Label>
                    <Switch
                      id="offline-mode"
                      checked={mobileConfig.offlineMode}
                      onCheckedChange={(checked) => setMobileConfig({ ...mobileConfig, offlineMode: checked })}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="plate" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="plate-enabled" className="text-cyan-400">
                      Enable License Plate Recognition
                    </Label>
                    <Switch
                      id="plate-enabled"
                      checked={plateConfig.enabled}
                      onCheckedChange={(checked) => setPlateConfig({ ...plateConfig, enabled: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="camera-resolution" className="text-cyan-400">
                      Camera Resolution
                    </Label>
                    <Select
                      value={plateConfig.cameraResolution}
                      onValueChange={(value) => setPlateConfig({ ...plateConfig, cameraResolution: value })}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="720p">720p HD</SelectItem>
                        <SelectItem value="1080p">1080p Full HD</SelectItem>
                        <SelectItem value="4k">4K Ultra HD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recognition-engine" className="text-cyan-400">
                      Recognition Engine
                    </Label>
                    <Select
                      value={plateConfig.recognitionEngine}
                      onValueChange={(value) => setPlateConfig({ ...plateConfig, recognitionEngine: value })}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="basic">Basic OCR</SelectItem>
                        <SelectItem value="advanced">Advanced AI</SelectItem>
                        <SelectItem value="neural">Neural Network</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="confidence" className="text-cyan-400">
                      Confidence Threshold (%)
                    </Label>
                    <Input
                      id="confidence"
                      type="number"
                      placeholder="85"
                      value={plateConfig.confidenceThreshold}
                      onChange={(e) => setPlateConfig({ ...plateConfig, confidenceThreshold: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                      min="50"
                      max="99"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country-format" className="text-cyan-400">
                      Country Format
                    </Label>
                    <Select
                      value={plateConfig.countryFormat}
                      onValueChange={(value) => setPlateConfig({ ...plateConfig, countryFormat: value })}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="sri_lanka">Sri Lanka</SelectItem>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="international">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="fallback-auth" className="text-cyan-400">
                      Fallback Authentication
                    </Label>
                    <Switch
                      id="fallback-auth"
                      checked={plateConfig.fallbackAuth}
                      onCheckedChange={(checked) => setPlateConfig({ ...plateConfig, fallbackAuth: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="manual-override" className="text-cyan-400">
                      Manual Override
                    </Label>
                    <Switch
                      id="manual-override"
                      checked={plateConfig.manualOverride}
                      onCheckedChange={(checked) => setPlateConfig({ ...plateConfig, manualOverride: checked })}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 pt-4 border-t border-gray-700">
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
              {isSubmitting ? "Saving Configuration..." : "Save Configuration"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
