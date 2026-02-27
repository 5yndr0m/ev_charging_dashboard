"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Bell, Shield, Zap, Database } from "lucide-react"

export function Settings() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [autoBackup, setAutoBackup] = useState(true)
  const [alertThreshold, setAlertThreshold] = useState([75])

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">System Settings</h2>

      {/* General Settings */}
      <Card className="bg-gray-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Dark Mode</div>
              <div className="text-sm text-gray-400">Enable dark theme interface</div>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Push Notifications</div>
              <div className="text-sm text-gray-400">Receive system alerts and updates</div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Auto Backup</div>
              <div className="text-sm text-gray-400">Automatically backup system data</div>
            </div>
            <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
          </div>

          <div className="space-y-3">
            <div className="text-white font-medium">Alert Threshold</div>
            <div className="text-sm text-gray-400">Trigger alerts when usage exceeds {alertThreshold[0]}%</div>
            <Slider
              value={alertThreshold}
              onValueChange={setAlertThreshold}
              max={100}
              min={50}
              step={5}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="bg-gray-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="w-5 h-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Database Status</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">API Status</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Network Status</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Connected</Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Last Backup</span>
                <span className="text-cyan-400">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">System Version</span>
                <span className="text-cyan-400">v2.1.3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Uptime</span>
                <span className="text-green-400">99.8%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Station Management */}
      <Card className="bg-gray-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Station Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30">
              Add New Station
            </Button>
            <Button className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30">
              Bulk Configuration
            </Button>
            <Button className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30">
              Export Data
            </Button>
            <Button className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30">
              System Diagnostics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alert Configuration */}
      <Card className="bg-gray-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Alert Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <div className="text-red-400 font-medium mb-2">Critical Alerts</div>
              <div className="text-sm text-gray-400 mb-3">System failures, power outages</div>
              <Switch defaultChecked />
            </div>
            <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <div className="text-yellow-400 font-medium mb-2">Warning Alerts</div>
              <div className="text-sm text-gray-400 mb-3">High usage, maintenance due</div>
              <Switch defaultChecked />
            </div>
            <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <div className="text-blue-400 font-medium mb-2">Info Alerts</div>
              <div className="text-sm text-gray-400 mb-3">Updates, scheduled events</div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" className="border-gray-600 text-gray-400 hover:text-white bg-transparent">
          Reset to Default
        </Button>
        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">Save Settings</Button>
      </div>
    </div>
  )
}
