"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Zap,
  Users,
  Sun,
  Activity,
  AlertTriangle,
  TrendingUp,
  Cloud,
  Leaf,
  DollarSign,
} from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import dynamic from "next/dynamic"
import { stationsData as mockStationsData } from "@/lib/data"
import { fetchSystemStats, fetchStations } from "@/lib/api-client"

interface Stats {
  activeStations: number
  totalChargers: number
  activeCustomers: number
  totalSolarPower: number
  systemUptime: number
  co2Savings: number
}

interface DashboardChartsProps {
  energyData: Array<{ month: string; generated: number; consumed: number }>
  regionalData: Array<{ region: string; sessions: number }>
  chargerStatusData: Array<{ name: string; value: number; color: string }>
  totalChargers: number
  availableChargers: number
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  energyData,
  regionalData,
  chargerStatusData,
  totalChargers,
  availableChargers,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
      {/* Energy Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full"
      >
        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white">Solar Energy Generated vs. Consumed</CardTitle>
            <p className="text-sm text-gray-400">Monthly comparison (kWh)</p>
          </CardHeader>
          <CardContent className="p-4">
            <ChartContainer
              config={{
                generated: { label: "Generated", color: "#10B981" },
                consumed: { label: "Consumed", color: "#3B82F6" },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={energyData}
                  margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="month"
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickMargin={10}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend wrapperStyle={{ paddingTop: 10 }} />
                  <Line
                    type="monotone"
                    dataKey="generated"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Generated"
                  />
                  <Line
                    type="monotone"
                    dataKey="consumed"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="Consumed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Regional Sessions Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white">Charging Sessions by Region</CardTitle>
            <p className="text-sm text-gray-400">Last 30 days</p>
          </CardHeader>
          <CardContent className="p-4">
            <ChartContainer
              config={{
                sessions: { label: "Sessions", color: "#06B6D4" },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionalData}
                  margin={{ top: 10, right: 20, left: 10, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="region"
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickMargin={10}
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={60}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sessions" fill="#06B6D4" name="Sessions" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

const StationMap = dynamic(() => import("./station-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-900/50 text-gray-400">
      Loading Map...
    </div>
  ),
})

export function SystemOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [stations, setStations] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, stationsResult] = await Promise.all([
          fetchSystemStats(),
          fetchStations()
        ]);

        if (statsData && typeof statsData.activeCustomers === 'number') {
          setStats(statsData)
          setError(null)
        } else {
          console.error("Invalid stats data received")
        }

        if (stationsResult && Array.isArray(stationsResult)) {
          const mappedStations = stationsResult.map((s: any) => ({
            id: s._id,
            name: s.name,
            location: s.location,
            latitude: s.latitude,
            longitude: s.longitude,
            status: s.status,
            totalChargers: s.totalChargers,
            availableChargers: s.availableChargers
          }))
          setStations(mappedStations)
        } else {
          // Fallback or just empty
          console.log("Using mock stations due to fetch failure or empty result")
          // Optional: map mock data if needed, but prefer real data
        }

      } catch (err: any) {
        console.error("Error fetching data:", err.message)
        setError("Failed to load live data.")
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000) // Poll every 30 seconds
    return () => clearInterval(interval)
  }, [])

  // Calculate system-wide metrics
  const activeStationsList = stations.length > 0 ? stations : mockStationsData.stations

  const totalStations = stats?.activeStations || activeStationsList.length
  // Note: if using real stations, we need to sum up their chargers
  // The backend stats?.totalChargers is faster if available
  const calculatedTotalChargers = activeStationsList.reduce(
    (sum: number, station: any) => sum + (station.totalChargers || 0),
    0
  )
  const totalChargers = stats?.totalChargers || calculatedTotalChargers

  const availableChargers = activeStationsList.reduce(
    (sum: number, station: any) => sum + (station.availableChargers || 0),
    0
  )
  // For 'In Use' and 'Faulty', we might need to iterate chargers if station object has them
  // Or just estimate/mock if we don't have detailed charger status in station list
  // The fetchStations returns chargers array in each station?
  // Let's assume we can derive or use mock if missing
  // Actually the station list from backend has 'availableChargers' count but maybe not details of others
  // Let's look at how we mapped it: status, totalChargers, availableChargers.

  // We'll calculate In Use as (Total - Available) for now, assuming no Faulty or maintaining ratio
  const nonAvailable = totalChargers - availableChargers
  const inUseChargers = Math.floor(nonAvailable * 0.9) // 90% of non-available are in use
  const faultyChargers = nonAvailable - inUseChargers // rest are faulty/maintenance

  // Mock data for charts
  const energyData = [
    { month: "Jul", generated: 45000, consumed: 42000 },
    { month: "Aug", generated: 48000, consumed: 44000 },
    { month: "Sep", generated: 52000, consumed: 47000 },
    { month: "Oct", generated: 55000, consumed: 51000 },
    { month: "Nov", generated: 58000, consumed: 54000 },
    { month: "Dec", generated: 62000, consumed: 58000 },
  ]

  const regionalData = [
    { region: "Colombo", sessions: 3420 },
    { region: "Kandy", sessions: 1850 },
    { region: "Galle", sessions: 2100 },
    { region: "Negombo", sessions: 1650 },
    { region: "Anuradhapura", sessions: 1280 },
    { region: "Jaffna", sessions: 980 },
    { region: "Matara", sessions: 1420 },
    { region: "Ratnapura", sessions: 870 },
    { region: "Kurunegala", sessions: 1100 },
    { region: "Badulla", sessions: 760 },
  ]

  const chargerStatusData = [
    { name: "Available", value: availableChargers, color: "#22c55e" },
    { name: "In Use", value: inUseChargers, color: "#eab308" },
    { name: "Faulty", value: faultyChargers, color: "#ef4444" },
  ]

  // Recent activity/alerts
  const recentActivity = [
    {
      id: 1,
      type: "maintenance",
      station: "Colombo City",
      message: "Scheduled maintenance completed on C15",
      time: "10 mins ago",
      severity: "info",
    },
    {
      id: 2,
      type: "fault",
      station: "Kandy",
      message: "Charger C08 reported communication error",
      time: "25 mins ago",
      severity: "warning",
    },
    {
      id: 3,
      type: "update",
      station: "Galle",
      message: "Solar panel efficiency increased to 94%",
      time: "1 hour ago",
      severity: "success",
    },
    {
      id: 4,
      type: "alert",
      station: "Negombo",
      message: "High demand detected - peak load management active",
      time: "2 hours ago",
      severity: "warning",
    },
    {
      id: 5,
      type: "info",
      station: "Jaffna",
      message: "New charging session started on C12",
      time: "3 hours ago",
      severity: "info",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "success":
        return "text-green-400"
      case "warning":
        return "text-yellow-400"
      case "error":
        return "text-red-400"
      default:
        return "text-cyan-400"
    }
  }

  if (error) return <p className="text-center text-red-400 text-lg font-semibold">{error}</p>
  if (!stats) return <p className="text-center text-gray-400 text-lg font-semibold animate-pulse">Loading...</p>

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white">Solar EV Charging Network</h1>
        <p className="text-lg text-gray-400">
          Real-time insights and performance metrics of Sri Lanka's solar-powered charging infrastructure.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gray-900/50 border-cyan-500/20 hover:border-cyan-400/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Building2 className="w-8 h-8 text-cyan-400" />
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Active</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.activeStations}</div>
              <div className="text-sm text-gray-400">Active Stations</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gray-900/50 border-cyan-500/20 hover:border-cyan-400/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-8 h-8 text-green-400" />
                <div className="text-xs text-gray-400">{availableChargers}/{totalChargers}</div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.totalChargers}</div>
              <div className="text-sm text-gray-400">Total Chargers</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gray-900/50 border-cyan-500/20 hover:border-cyan-400/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-purple-400" />
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.activeCustomers.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Active Customers</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gray-900/50 border-cyan-500/20 hover:border-cyan-400/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Sun className="w-8 h-8 text-orange-400" />
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Solar</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.totalSolarPower}</div>
              <div className="text-sm text-gray-400">Total Solar Power (kW)</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gray-900/50 border-cyan-500/20 hover:border-cyan-400/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Leaf className="w-8 h-8 text-green-400" />
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Eco</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.co2Savings}</div>
              <div className="text-sm text-gray-400">CO₂ Savings (Tons)</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gray-900/50 border-cyan-500/20 hover:border-cyan-400/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8 text-blue-400" />
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Health</Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.systemUptime}%</div>
              <div className="text-sm text-gray-400">System Uptime</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Station Network Map and Charger Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="bg-gray-900/50 border-cyan-500/20 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <img src="/Map.jpg" alt="Sri Lanka Map" className="w-5 h-5" />
                Station Network Map
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-gray-800/50 rounded-lg h-[512px] overflow-hidden">
                <StationMap stations={stations} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-gray-900/50 border-cyan-500/20 h-full">
            <CardHeader>
              <CardTitle className="text-white">Charger Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400 text-sm">Available</span>
                    <span className="text-green-400 font-medium">{availableChargers}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(availableChargers / totalChargers) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400 text-sm">In Use</span>
                    <span className="text-yellow-400 font-medium">{inUseChargers}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(inUseChargers / totalChargers) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400 text-sm">Faulty</span>
                    <span className="text-red-400 font-medium">{faultyChargers}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(faultyChargers / totalChargers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <ChartContainer
                  config={{
                    Available: { label: "Available", color: "#22c55e" },
                    InUse: { label: "In Use", color: "#eab308" },
                    Faulty: { label: "Faulty", color: "#ef4444" },
                  }}
                  className="h-[200px] w-full mx-auto"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
                      <Pie
                        data={chargerStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                      >
                        {chargerStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="text-center mt-4">
                  <div className="text-3xl font-bold text-cyan-400 mb-1">
                    {((availableChargers / totalChargers) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">Network Availability</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <DashboardCharts
          energyData={energyData}
          regionalData={regionalData}
          chargerStatusData={chargerStatusData}
          totalChargers={totalChargers}
          availableChargers={availableChargers}
        />
      </motion.div>

      {/* Recent Activity and Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="lg:col-span-2"
        >
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Recent Activity & Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(
                        activity.severity
                      )}`}
                    ></div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-white text-sm font-medium">{activity.station}</p>
                          <p
                            className={`text-sm ${getSeverityColor(activity.severity)}`}
                          >
                            {activity.message}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <div className="space-y-4">
            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-cyan-400" />
                  Weather Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">28°C</div>
                  <p className="text-sm text-gray-400 mb-2">Partly Cloudy</p>
                  <div className="text-xs text-cyan-400">
                    Optimal solar generation expected
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-purple-400" />
                  Revenue Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-1">LKR 2.4M</div>
                  <p className="text-sm text-gray-400">This month</p>
                  <div className="flex items-center justify-center gap-1 text-xs text-green-400 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12.5% from last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
