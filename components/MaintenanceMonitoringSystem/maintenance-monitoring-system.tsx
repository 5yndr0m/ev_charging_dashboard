"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { AlertTriangle, CheckCircle, Clock, Zap, Thermometer, AlertCircle, Plus } from "lucide-react"

// Types
interface ChargerHealth {
  id: string
  station: string
  temperature: number
  voltage: number
  current: number
  cableCondition: "good" | "fair" | "poor"
  lastFault?: string
  status: "healthy" | "warning" | "critical"
  uptime: number
}

interface MaintenanceSchedule {
  id: string
  chargerId: string
  station: string
  type: "routine" | "preventive" | "repair"
  scheduledDate: string
  lastCompleted?: string
  interval: number
  estimatedDuration: number
  priority: "low" | "medium" | "high" | "critical"
  status: "pending" | "scheduled" | "in-progress" | "completed"
  notes?: string
}

interface FaultRecord {
  id: string
  timestamp: string
  chargerId: string
  station: string
  errorType: "overcurrent" | "communication_loss" | "power_supply" | "thermal" | "cable"
  severity: "warning" | "critical"
  resolved: boolean
  resolution?: string
}
interface MaintenanceMonitoringSystemProps {
  stations: any[];
}

// Main Component
export function MaintenanceMonitoringSystem({ stations }: MaintenanceMonitoringSystemProps) {
  const [activeTab, setActiveTab] = useState("health-monitoring")

  // Dynamic Data Generation
  const chargerHealth: ChargerHealth[] = stations.flatMap(station =>
    (station.chargers || []).map((charger: any) => ({
      id: charger.id,
      station: station.location,
      temperature: Math.floor(Math.random() * (75 - 30) + 30),
      voltage: Math.floor(Math.random() * (400 - 360) + 360),
      current: Math.floor(Math.random() * (150 - 100) + 100),
      cableCondition: Math.random() > 0.9 ? "poor" : Math.random() > 0.7 ? "fair" : "good",
      lastFault: Math.random() > 0.8 ? "2024-01-15" : undefined,
      status: charger.status === "In Use" ? "healthy" : (Math.random() > 0.9 ? "warning" : "healthy"),
      uptime: parseFloat((95 + Math.random() * 5).toFixed(1)),
    }))
  ).slice(0, 10); // Limit to 10 for display


  const maintenanceSchedule: MaintenanceSchedule[] = [
    {
      id: "MS001",
      chargerId: "C01",
      station: "Colombo",
      type: "routine",
      scheduledDate: "2024-02-10",
      lastCompleted: "2024-01-10",
      interval: 30,
      estimatedDuration: 2,
      priority: "medium",
      status: "scheduled",
      notes: "Monthly inspection and cable check",
    },
    {
      id: "MS002",
      chargerId: "C02",
      station: "Colombo",
      type: "preventive",
      scheduledDate: "2024-02-01",
      lastCompleted: "2024-01-15",
      interval: 14,
      estimatedDuration: 4,
      priority: "high",
      status: "pending",
      notes: "Cable replacement due to wear",
    },
    {
      id: "MS003",
      chargerId: "C03",
      station: "Kandy",
      type: "repair",
      scheduledDate: "2024-01-25",
      interval: 0,
      estimatedDuration: 6,
      priority: "critical",
      status: "in-progress",
      notes: "Thermal runaway risk - urgent replacement needed",
    },
  ]

  const faultRecords: FaultRecord[] = [
    {
      id: "FLT001",
      timestamp: "2024-01-20 14:32",
      chargerId: "C03",
      station: "Kandy",
      errorType: "thermal",
      severity: "critical",
      resolved: false,
      resolution: "Pending - equipment replacement ordered",
    },
    {
      id: "FLT002",
      timestamp: "2024-01-18 11:15",
      chargerId: "C02",
      station: "Colombo",
      errorType: "cable",
      severity: "warning",
      resolved: true,
      resolution: "Cable connectors cleaned and secured",
    },
    {
      id: "FLT003",
      timestamp: "2024-01-15 09:45",
      chargerId: "C05",
      station: "Galle",
      errorType: "communication_loss",
      severity: "warning",
      resolved: true,
      resolution: "Network connection restored",
    },
    {
      id: "FLT004",
      timestamp: "2024-01-10 16:20",
      chargerId: "C01",
      station: "Colombo",
      errorType: "power_supply",
      severity: "critical",
      resolved: true,
      resolution: "Power supply unit replaced",
    },
  ]

  const temperatureTrend = [
    { time: "00:00", avg: 32, max: 38, min: 28 },
    { time: "04:00", avg: 28, max: 32, min: 24 },
    { time: "08:00", avg: 42, max: 58, min: 38 },
    { time: "12:00", avg: 52, max: 68, min: 45 },
    { time: "16:00", avg: 58, max: 75, min: 52 },
    { time: "20:00", avg: 48, max: 62, min: 42 },
    { time: "23:59", avg: 35, max: 40, min: 30 },
  ]

  const faultFrequency = [
    { type: "Overcurrent", count: 12, resolved: 10 },
    { type: "Communication Loss", count: 8, resolved: 8 },
    { type: "Power Supply", count: 5, resolved: 5 },
    { type: "Thermal", count: 3, resolved: 1 },
    { type: "Cable Issues", count: 15, resolved: 14 },
  ]

  // Helper Functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "warning": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getCableConditionColor = (condition: string) => {
    switch (condition) {
      case "good": return "text-green-400"
      case "fair": return "text-yellow-400"
      case "poor": return "text-red-400"
      default: return "text-gray-400"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Maintenance & Monitoring System</h2>
      </div>

      {/* Health Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Chargers</p>
                <p className="text-3xl font-bold text-cyan-400">{chargerHealth.length}</p>
              </div>
              <Zap className="w-8 h-8 text-cyan-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Healthy</p>
                <p className="text-3xl font-bold text-green-400">
                  {chargerHealth.filter(c => c.status === "healthy").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-yellow-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Warning</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {chargerHealth.filter(c => c.status === "warning").length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Critical</p>
                <p className="text-3xl font-bold text-red-400">
                  {chargerHealth.filter(c => c.status === "critical").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-cyan-500/20">
          <TabsTrigger value="health-monitoring" className="data-[state=active]:bg-[#00ffff]/20 data-[state=active]:text-[#00ffff] data-[state=active]:border-[#00ffff]/50 text-[#00ffff]">Health Monitoring</TabsTrigger>
          <TabsTrigger value="maintenance-schedule" className="data-[state=active]:bg-[#00ffff]/20 data-[state=active]:text-[#00ffff] data-[state=active]:border-[#00ffff]/50 text-[#00ffff]">Maintenance Schedule</TabsTrigger>
          <TabsTrigger value="fault-history" className="data-[state=active]:bg-[#00ffff]/20 data-[state=active]:text-[#00ffff] data-[state=active]:border-[#00ffff]/50 text-[#00ffff]">Fault History</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-[#00ffff]/20 data-[state=active]:text-[#00ffff] data-[state=active]:border-[#00ffff]/50 text-[#00ffff]">Analytics</TabsTrigger>
        </TabsList>

        {/* Health Monitoring */}
        <TabsContent value="health-monitoring" className="space-y-6">
          <div className="space-y-4">
            {chargerHealth.map((charger) => (
              <Card key={charger.id} className="bg-gray-900/50 border-cyan-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">
                        {charger.id} - {charger.station}
                      </CardTitle>
                      <p className="text-xs text-gray-400 mt-1">Last Fault: {charger.lastFault || "None"}</p>
                    </div>
                    <Badge className={getStatusColor(charger.status)}>
                      {charger.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-gray-800/50 rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Thermometer className="w-4 h-4 text-orange-400" />
                        <p className="text-xs text-gray-400">Temperature</p>
                      </div>
                      <p className="text-lg font-semibold text-white">{charger.temperature}°C</p>
                      <p className={`text-xs mt-1 ${charger.temperature > 65 ? "text-red-400" : charger.temperature > 55 ? "text-yellow-400" : "text-green-400"}`}>
                        {charger.temperature > 65 ? "High" : charger.temperature > 55 ? "Elevated" : "Normal"}
                      </p>
                    </div>
                    <div className="bg-gray-800/50 rounded p-3">
                      <p className="text-xs text-gray-400 mb-1">Voltage</p>
                      <p className="text-lg font-semibold text-cyan-400">{charger.voltage}V</p>
                      <p className="text-xs text-green-400 mt-1">Normal</p>
                    </div>
                    <div className="bg-gray-800/50 rounded p-3">
                      <p className="text-xs text-gray-400 mb-1">Current</p>
                      <p className="text-lg font-semibold text-cyan-400">{charger.current}A</p>
                      <p className="text-xs text-green-400 mt-1">Optimal</p>
                    </div>
                    <div className="bg-gray-800/50 rounded p-3">
                      <p className="text-xs text-gray-400 mb-1">Cable Condition</p>
                      <p className={`text-lg font-semibold ${getCableConditionColor(charger.cableCondition)}`}>
                        {charger.cableCondition.toUpperCase()}
                      </p>
                      {charger.cableCondition !== "good" && (
                        <p className="text-xs text-yellow-400 mt-1">Needs attention</p>
                      )}
                    </div>
                    <div className="bg-gray-800/50 rounded p-3">
                      <p className="text-xs text-gray-400 mb-1">Uptime</p>
                      <p className="text-lg font-semibold text-green-400">{charger.uptime}%</p>
                      <p className="text-xs text-gray-400 mt-1">This month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Maintenance Schedule */}
        <TabsContent value="maintenance-schedule" className="space-y-6">
          <div className="space-y-4">
            {maintenanceSchedule.map((schedule) => (
              <Card key={schedule.id} className="bg-gray-900/50 border-cyan-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        {schedule.chargerId} - {schedule.station}
                      </CardTitle>
                      <p className="text-xs text-gray-400 mt-1">Scheduled: {schedule.scheduledDate}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(schedule.priority)}>
                        {schedule.priority.toUpperCase()}
                      </Badge>
                      <Badge className={
                        schedule.status === "completed" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                          schedule.status === "in-progress" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                            schedule.status === "pending" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                              "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      }>
                        {schedule.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><p className="text-gray-400 mb-1">Type</p><p className="text-white font-semibold capitalize">{schedule.type}</p></div>
                    <div><p className="text-gray-400 mb-1">Est. Duration</p><p className="text-white font-semibold">{schedule.estimatedDuration}h</p></div>
                    <div><p className="text-gray-400 mb-1">Interval</p><p className="text-white font-semibold">{schedule.interval} days</p></div>
                    <div><p className="text-gray-400 mb-1">Last Completed</p><p className="text-white font-semibold">{schedule.lastCompleted || "N/A"}</p></div>
                  </div>
                  {schedule.notes && (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                      <p className="text-xs text-yellow-400">Notes: {schedule.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <Button className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30">
            <Plus className="w-4 h-4 mr-2" />
            Schedule New Maintenance
          </Button>
        </TabsContent>

        {/* Fault History */}
        <TabsContent value="fault-history" className="space-y-6">
          <div className="space-y-3">
            {faultRecords.map((fault) => (
              <div key={fault.id} className={`p-4 rounded border flex items-start justify-between ${fault.resolved ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-white font-semibold">{fault.chargerId} - {fault.station}</p>
                    <Badge className={fault.severity === "critical" ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}>
                      {fault.severity.toUpperCase()}
                    </Badge>
                    {fault.resolved && <Badge className="bg-green-500/20 text-green-400 border-green-500/30">RESOLVED</Badge>}
                  </div>
                  <p className="text-sm text-gray-400 mb-2">Error: {fault.errorType.replace(/_/g, " ").toUpperCase()}</p>
                  <p className="text-xs text-gray-400 mb-1">{fault.timestamp}</p>
                  {fault.resolution && <p className="text-xs text-gray-300">Resolution: {fault.resolution}</p>}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader><CardTitle className="text-white">Temperature Trend (24h)</CardTitle></CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={temperatureTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px", color: "#fff" }} />
                    <Legend />
                    <Line type="monotone" dataKey="avg" stroke="#f59e0b" name="Average" strokeWidth={2} />
                    <Line type="monotone" dataKey="max" stroke="#ef4444" name="Maximum" strokeWidth={1} strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="min" stroke="#10b981" name="Minimum" strokeWidth={1} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader><CardTitle className="text-white">Fault Frequency Analysis</CardTitle></CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={faultFrequency}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="type" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px", color: "#fff" }} />
                    <Legend />
                    <Bar dataKey="count" fill="#ef4444" name="Total Faults" />
                    <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}