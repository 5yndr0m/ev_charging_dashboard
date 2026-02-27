"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

interface station {
  id: string
  location: string
  totalChargers: number
  powerRating: number
  solarPV: number
  battery: number
  maxFeederCapacity: number
  internet: string
  peakDemand: number
  gridDraw: number
  gridOffsetPercent: number
}

interface StationReportsProps {
  station: station
}

export function StationReports({ station }: StationReportsProps) {
  // Generate demand data
  const demandData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, "0")}:00`,
    demand: Math.floor(Math.random() * 500) + 200,
    capacity: station.maxFeederCapacity,
  }))

  // Generate weekly usage data
  const weeklyData = [
    { day: "Mon", usage: 850, efficiency: 85 },
    { day: "Tue", usage: 920, efficiency: 88 },
    { day: "Wed", usage: 780, efficiency: 82 },
    { day: "Thu", usage: 1100, efficiency: 91 },
    { day: "Fri", usage: 1250, efficiency: 89 },
    { day: "Sat", usage: 1400, efficiency: 93 },
    { day: "Sun", usage: 1200, efficiency: 87 },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400 mb-1">{Math.floor(Math.random() * 500) + 1200}</div>
            <div className="text-sm text-gray-400">Total Sessions</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-green-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{Math.floor(Math.random() * 20) + 85}%</div>
            <div className="text-sm text-gray-400">Uptime</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-orange-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">
              ₨{(Math.floor(Math.random() * 50000) + 150000).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Revenue</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">{Math.floor(Math.random() * 10) + 25}</div>
            <div className="text-sm text-gray-400">Avg Session (min)</div>
          </CardContent>
        </Card>
      </div>

      {/* Demand Hours Chart */}
      <Card className="bg-gray-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white">24-Hour Demand Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="demand" fill="#06b6d4" name="Demand (kW)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Performance */}
      <Card className="bg-gray-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white">Weekly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="usage"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  name="Usage (kWh)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Efficiency (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white">Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Peak Demand Hour</span>
              <span className="text-cyan-400 font-medium">19:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Average Utilization</span>
              <span className="text-green-400 font-medium">73%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Energy Delivered</span>
              <span className="text-orange-400 font-medium">12,450 kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">CO₂ Saved</span>
              <span className="text-green-400 font-medium">4.2 tons</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white">Maintenance Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <div className="text-yellow-400 font-medium">Scheduled Maintenance</div>
              <div className="text-sm text-gray-400">Charger C03 - Next week</div>
            </div>
            <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
              <div className="text-green-400 font-medium">System Healthy</div>
              <div className="text-sm text-gray-400">All systems operational</div>
            </div>
            <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <div className="text-blue-400 font-medium">Software Update</div>
              <div className="text-sm text-gray-400">Available - v2.1.3</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
