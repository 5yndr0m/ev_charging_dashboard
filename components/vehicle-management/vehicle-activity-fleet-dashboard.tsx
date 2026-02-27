"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, Zap, Clock, TrendingUp, Download, MoreVertical } from "lucide-react"

interface VehicleQueue {
  position: number
  vehicleId: string
  ownerName: string
  estimatedWaitTime: number
  batteryLevel: number
  chargingNeeded: number
}

interface FleetMetrics {
  id: string
  fleetName: string
  totalVehicles: number
  activeNow: number
  chargingSessions: number
  monthlyConsumption: number
  monthlySpend: number
  costPerKm: number
  averageEfficiency: number
}

interface VehicleUsageData {
  modelName: string
  sessions: number
  averageChargingTime: number
  consumptionRate: number
  monthlyUsage: number
}

export function VehicleActivityFleetDashboard() {
  const [activeTab, setActiveTab] = useState("realtime-queue")

  // Real-time Vehicle Queue
  const [vehicleQueue] = useState<VehicleQueue[]>([
    {
      position: 1,
      vehicleId: "EV-2845",
      ownerName: "Samantha Perera",
      estimatedWaitTime: 0,
      batteryLevel: 85,
      chargingNeeded: 15,
    },
    {
      position: 2,
      vehicleId: "EV-3101",
      ownerName: "Kumara Silva",
      estimatedWaitTime: 35,
      batteryLevel: 30,
      chargingNeeded: 70,
    },
    {
      position: 3,
      vehicleId: "EV-2923",
      ownerName: "Priyanka Mendis",
      estimatedWaitTime: 98,
      batteryLevel: 15,
      chargingNeeded: 85,
    },
    {
      position: 4,
      vehicleId: "EV-3456",
      ownerName: "Aravind Nair",
      estimatedWaitTime: 165,
      batteryLevel: 22,
      chargingNeeded: 78,
    },
    {
      position: 5,
      vehicleId: "EV-2567",
      ownerName: "Maria Gunasekara",
      estimatedWaitTime: 220,
      batteryLevel: 10,
      chargingNeeded: 90,
    },
  ])

  // Fleet Metrics
  const [fleetMetrics] = useState<FleetMetrics[]>([
    {
      id: "FLT001",
      fleetName: "Colombo Taxi Services",
      totalVehicles: 25,
      activeNow: 18,
      chargingSessions: 7,
      monthlyConsumption: 4500,
      monthlySpend: 125000,
      costPerKm: 8.5,
      averageEfficiency: 4.2,
    },
    {
      id: "FLT002",
      fleetName: "Green Delivery Ltd",
      totalVehicles: 12,
      activeNow: 9,
      chargingSessions: 3,
      monthlyConsumption: 1200,
      monthlySpend: 32500,
      costPerKm: 7.8,
      averageEfficiency: 4.5,
    },
    {
      id: "FLT003",
      fleetName: "Express Logistics",
      totalVehicles: 8,
      activeNow: 5,
      chargingSessions: 2,
      monthlyConsumption: 950,
      monthlySpend: 28000,
      costPerKm: 8.1,
      averageEfficiency: 4.1,
    },
  ])

  // Vehicle Model Usage Data
  const [vehicleUsageData] = useState<VehicleUsageData[]>([
    {
      modelName: "Tesla Model 3",
      sessions: 145,
      averageChargingTime: 35,
      consumptionRate: 145,
      monthlyUsage: 2850,
    },
    {
      modelName: "Nissan Leaf",
      sessions: 98,
      averageChargingTime: 42,
      consumptionRate: 160,
      monthlyUsage: 1920,
    },
    {
      modelName: "BYD Dolphin",
      sessions: 87,
      averageChargingTime: 38,
      consumptionRate: 150,
      monthlyUsage: 1650,
    },
    {
      modelName: "MG ZS EV",
      sessions: 76,
      averageChargingTime: 40,
      consumptionRate: 130,
      monthlyUsage: 1520,
    },
  ])

  // Charging Pattern Data
  const chargingPatternData = [
    { time: "00:00", count: 8, avgChargingTime: 120 },
    { time: "04:00", count: 12, avgChargingTime: 140 },
    { time: "08:00", count: 28, avgChargingTime: 45 },
    { time: "12:00", count: 15, avgChargingTime: 35 },
    { time: "16:00", count: 22, avgChargingTime: 40 },
    { time: "20:00", count: 32, avgChargingTime: 50 },
    { time: "23:59", count: 18, avgChargingTime: 130 },
  ]

  // Fleet Performance Data
  const fleetPerformanceData = [
    { month: "Jan", consumption: 3200, spend: 89000, sessions: 245 },
    { month: "Feb", consumption: 3450, spend: 96000, sessions: 268 },
    { month: "Mar", consumption: 3800, spend: 105000, sessions: 295 },
    { month: "Apr", consumption: 3650, spend: 101000, sessions: 280 },
    { month: "May", consumption: 4100, spend: 112000, sessions: 310 },
    { month: "Jun", consumption: 4500, spend: 125000, sessions: 340 },
  ]

  const vehicleCategoryDistribution = [
    { name: "Cars", value: 58, color: "#3b82f6" },
    { name: "Vans", value: 22, color: "#8b5cf6" },
    { name: "Tuks", value: 12, color: "#f59e0b" },
    { name: "Bikes", value: 8, color: "#10b981" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Vehicle Activity & Fleet Management</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-cyan-500/20">
          <TabsTrigger value="realtime-queue" className="text-xs sm:text-sm flex items-center gap-1 text-white data-[state=active]:text-black">
            <Clock className="w-4 h-4" />
            Real-time Queue
          </TabsTrigger>
          <TabsTrigger value="fleet-metrics" className="text-xs sm:text-sm flex items-center gap-1 text-white data-[state=active]:text-black">
            <Users className="w-4 h-4" />
            Fleet Metrics
          </TabsTrigger>
          <TabsTrigger value="vehicle-usage" className="text-xs sm:text-sm flex items-center gap-1 text-white data-[state=active]:text-black">
            <Zap className="w-4 h-4" />
            Vehicle Usage
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm flex items-center gap-1 text-white data-[state=active]:text-black">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Real-time Vehicle Queue */}
        <TabsContent value="realtime-queue" className="space-y-6">
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Live Charging Queue - Colombo Station</CardTitle>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  {vehicleQueue.length} vehicles waiting
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {vehicleQueue.map((vehicle, index) => (
                <div
                  key={vehicle.vehicleId}
                  className={`p-4 rounded border flex items-center justify-between ${index === 0 ? "bg-green-500/10 border-green-500/30" : "bg-gray-800/50 border-cyan-500/20"
                    }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">{vehicle.position}</div>
                      <div className="text-xs text-gray-400">Position</div>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{vehicle.ownerName}</p>
                      <p className="text-sm text-gray-400">{vehicle.vehicleId}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-400 mb-1">Battery Level</p>
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${vehicle.batteryLevel > 50
                            ? "bg-green-400"
                            : vehicle.batteryLevel > 25
                              ? "bg-yellow-400"
                              : "bg-red-400"
                            }`}
                          style={{ width: `${vehicle.batteryLevel}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{vehicle.batteryLevel}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-400 mb-1">Charge Needed</p>
                      <p className="text-lg font-semibold text-cyan-400">{vehicle.chargingNeeded}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {index === 0 ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Charging Now</Badge>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Wait Time</p>
                        <p className="text-lg font-semibold text-yellow-400">{vehicle.estimatedWaitTime} min</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fleet Metrics */}
        <TabsContent value="fleet-metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fleetMetrics.map((fleet) => (
              <Card key={fleet.id} className="bg-gray-900/50 border-cyan-500/20">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{fleet.fleetName}</CardTitle>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-500/10 rounded p-2 border border-blue-500/30">
                      <p className="text-xs text-blue-400 mb-1">Total Vehicles</p>
                      <p className="text-xl font-bold text-blue-400">{fleet.totalVehicles}</p>
                    </div>
                    <div className="bg-green-500/10 rounded p-2 border border-green-500/30">
                      <p className="text-xs text-green-400 mb-1">Active Now</p>
                      <p className="text-xl font-bold text-green-400">{fleet.activeNow}</p>
                    </div>
                    <div className="bg-orange-500/10 rounded p-2 border border-orange-500/30">
                      <p className="text-xs text-orange-400 mb-1">Charging</p>
                      <p className="text-xl font-bold text-orange-400">{fleet.chargingSessions}</p>
                    </div>
                    <div className="bg-cyan-500/10 rounded p-2 border border-cyan-500/30">
                      <p className="text-xs text-cyan-400 mb-1">Monthly Spend</p>
                      <p className="text-lg font-bold text-cyan-400">₨{(fleet.monthlySpend / 1000).toFixed(0)}K</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-cyan-500/20 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Monthly Consumption</span>
                      <span className="text-cyan-400 font-semibold">{fleet.monthlyConsumption} kWh</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Cost per KM</span>
                      <span className="text-cyan-400 font-semibold">₨{fleet.costPerKm}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Avg Efficiency</span>
                      <span className="text-cyan-400 font-semibold">{fleet.averageEfficiency} km/kWh</span>
                    </div>
                  </div>

                  <Button className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 text-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Vehicle Usage Analytics */}
        <TabsContent value="vehicle-usage" className="space-y-6">
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white">Vehicle Model Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vehicleUsageData.map((vehicle) => (
                  <div key={vehicle.modelName} className="p-4 bg-gray-800/50 rounded border border-cyan-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">{vehicle.modelName}</h4>
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                        {vehicle.sessions} sessions
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Avg Charge Time</p>
                        <p className="text-white font-semibold">{vehicle.averageChargingTime} min</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Consumption</p>
                        <p className="text-white font-semibold">{vehicle.consumptionRate} Wh/km</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Monthly Usage</p>
                        <p className="text-white font-semibold">{vehicle.monthlyUsage} kWh</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Avg per Session</p>
                        <p className="text-cyan-400 font-semibold">
                          {(vehicle.monthlyUsage / vehicle.sessions).toFixed(1)} kWh
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Category Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Vehicle Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={vehicleCategoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {vehicleCategoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {vehicleCategoryDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-400">
                        {item.name} ({item.value})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white">Daily Charging Pattern (24-hour cycle)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chargingPatternData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="count" fill="#06b6d4" name="Active Sessions" />
                    <Bar dataKey="avgChargingTime" fill="#f59e0b" name="Avg Charge Time (min)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white">Fleet Performance Trend (6 months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={fleetPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="consumption" stroke="#10b981" name="Energy Consumption (kWh)" />
                    <Line type="monotone" dataKey="sessions" stroke="#06b6d4" name="Charging Sessions" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
