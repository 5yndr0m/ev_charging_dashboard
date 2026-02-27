"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Zap, DollarSign, Leaf, Download, Filter, Calendar, FileText, BarChart3, Activity, Search } from "lucide-react"

export function Reports() {
  const [activeTab, setActiveTab] = useState("energy")
  const [dateRange, setDateRange] = useState("30d")
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [reportTypeFilter, setReportTypeFilter] = useState("all")

  const reportStats = [
    { label: "Total Energy Consumed", value: "2,847 MWh", change: "+12.5%", icon: Zap, color: "text-cyan-400" },
    { label: "Revenue Generated", value: "LKR 2.4M", change: "+8.2%", icon: DollarSign, color: "text-green-400" },
    { label: "CO₂ Saved", value: "1,234 tons", change: "+15.3%", icon: Leaf, color: "text-orange-400" },
    { label: "System Efficiency", value: "94.2%", change: "+2.1%", icon: Activity, color: "text-purple-400" },
  ]

  const energyUsageData = [
    { hour: "00:00", solar: 0, battery: 45, grid: 120, total: 165 },
    { hour: "06:00", solar: 20, battery: 60, grid: 180, total: 260 },
    { hour: "12:00", solar: 180, battery: 40, grid: 80, total: 300 },
    { hour: "18:00", solar: 80, battery: 70, grid: 200, total: 350 },
    { hour: "24:00", solar: 0, battery: 50, grid: 140, total: 190 },
  ]

  const dayVsNightUsage = [
    { period: "Day (6AM-6PM)", solar: 75, battery: 25, grid: 40, total: 140 },
    { period: "Night (6PM-6AM)", solar: 5, battery: 60, grid: 85, total: 150 },
  ]

  const chargerUtilization = [
    { station: "Colombo", totalChargers: 20, activeChargers: 18, utilization: 89, downtime: 2.1, avgSession: 1.5 },
    { station: "Kandy", totalChargers: 15, activeChargers: 14, utilization: 85, downtime: 3.2, avgSession: 1.8 },
    { station: "Galle", totalChargers: 12, activeChargers: 11, utilization: 92, downtime: 1.5, avgSession: 2.1 },
    { station: "Negombo", totalChargers: 18, activeChargers: 16, utilization: 87, downtime: 2.8, avgSession: 1.7 },
    { station: "Ratnapura", totalChargers: 10, activeChargers: 9, utilization: 91, downtime: 1.8, avgSession: 2.0 },
  ]

  const chargerPerformance = [
    { charger: "C01-Colombo", sessions: 156, uptime: 98.5, revenue: 45670, efficiency: 94 },
    { charger: "C05-Kandy", sessions: 142, uptime: 97.2, revenue: 42340, efficiency: 92 },
    { charger: "C03-Galle", sessions: 134, uptime: 99.1, revenue: 39870, efficiency: 96 },
    { charger: "C12-Negombo", sessions: 128, uptime: 96.8, revenue: 38450, efficiency: 91 },
    { charger: "C07-Ratnapura", sessions: 119, uptime: 98.9, revenue: 35620, efficiency: 95 },
  ]

  const financialData = [
    { month: "Aug", revenue: 1800000, costs: 720000, profit: 1080000, solarSavings: 180000 },
    { month: "Sep", revenue: 2100000, costs: 840000, profit: 1260000, solarSavings: 210000 },
    { month: "Oct", revenue: 1950000, costs: 780000, profit: 1170000, solarSavings: 195000 },
    { month: "Nov", revenue: 2400000, costs: 960000, profit: 1440000, solarSavings: 240000 },
    { month: "Dec", revenue: 2200000, costs: 880000, profit: 1320000, solarSavings: 220000 },
    { month: "Jan", revenue: 2600000, costs: 1040000, profit: 1560000, solarSavings: 260000 },
  ]

  const costBreakdown = [
    { category: "Grid Electricity", amount: 520000, percentage: 50 },
    { category: "Maintenance", amount: 208000, percentage: 20 },
    { category: "Operations", amount: 156000, percentage: 15 },
    { category: "Infrastructure", amount: 104000, percentage: 10 },
    { category: "Other", amount: 52000, percentage: 5 },
  ]

  const environmentalData = [
    { month: "Aug", co2Saved: 890, solarGenerated: 1200, gridAvoided: 800 },
    { month: "Sep", co2Saved: 1020, solarGenerated: 1380, gridAvoided: 920 },
    { month: "Oct", co2Saved: 945, solarGenerated: 1280, gridAvoided: 850 },
    { month: "Nov", co2Saved: 1180, solarGenerated: 1590, gridAvoided: 1060 },
    { month: "Dec", co2Saved: 1090, solarGenerated: 1470, gridAvoided: 980 },
    { month: "Jan", co2Saved: 1234, solarGenerated: 1670, gridAvoided: 1120 },
  ]

  const carbonFootprint = [
    { source: "Solar Energy", impact: -1234, color: "#10b981" },
    { source: "Battery Storage", impact: -456, color: "#f59e0b" },
    { source: "Grid Electricity", impact: 789, color: "#ef4444" },
    { source: "Net Impact", impact: -901, color: "#06b6d4" },
  ]

  const stationComparison = [
    { station: "Colombo", efficiency: 89, utilization: 92, revenue: 85, satisfaction: 88, uptime: 95 },
    { station: "Kandy", efficiency: 85, utilization: 88, revenue: 78, satisfaction: 85, uptime: 92 },
    { station: "Galle", efficiency: 92, utilization: 85, revenue: 72, satisfaction: 90, uptime: 98 },
    { station: "Negombo", efficiency: 87, utilization: 90, revenue: 80, satisfaction: 87, uptime: 94 },
  ]

  const radarData = [
    { metric: "Efficiency", Colombo: 89, Kandy: 85, Galle: 92, Negombo: 87 },
    { metric: "Utilization", Colombo: 92, Kandy: 88, Galle: 85, Negombo: 90 },
    { metric: "Revenue", Colombo: 85, Kandy: 78, Galle: 72, Negombo: 80 },
    { metric: "Satisfaction", Colombo: 88, Kandy: 85, Galle: 90, Negombo: 87 },
    { metric: "Uptime", Colombo: 95, Kandy: 92, Galle: 98, Negombo: 94 },
  ]

  const monthlyRevenueByEnergySource = [
    { month: "Aug", solar: 18000, grid: 20000, battery: 7000, total: 45000 },
    { month: "Sep", solar: 22000, grid: 21000, battery: 9000, total: 52000 },
    { month: "Oct", solar: 20000, grid: 19000, battery: 9000, total: 48000 },
    { month: "Nov", solar: 26000, grid: 24000, battery: 11000, total: 61000 },
    { month: "Dec", solar: 23000, grid: 22000, battery: 10000, total: 55000 },
    { month: "Jan", solar: 28000, grid: 26000, battery: 13000, total: 67000 },
  ]

  const revenueByStation = [
    { station: "Colombo", revenue: 15420, sessions: 456, avgPerSession: 33.8, growth: 12.5 },
    { station: "Kandy", revenue: 12340, sessions: 378, avgPerSession: 32.6, growth: 8.2 },
    { station: "Galle", revenue: 9870, sessions: 298, avgPerSession: 33.1, growth: 15.3 },
    { station: "Negombo", revenue: 8760, sessions: 267, avgPerSession: 32.8, growth: 6.7 },
    { station: "Ratnapura", revenue: 7650, sessions: 234, avgPerSession: 32.7, growth: 9.1 },
    { station: "Kurunegala", revenue: 6890, sessions: 201, avgPerSession: 34.3, growth: 11.2 },
    { station: "Anuradhapura", revenue: 5430, sessions: 167, avgPerSession: 32.5, growth: 7.8 },
    { station: "Jaffna", revenue: 4920, sessions: 145, avgPerSession: 33.9, growth: 13.4 },
  ]

  const handleExportReport = async (reportType = "comprehensive") => {
    try {
      const reportData = {
        reportType,
        dateRange,
        generatedAt: new Date().toISOString(),
        summary: {
          totalEnergyConsumed: "2,847 MWh",
          totalRevenue: "LKR 2.4M",
          co2Saved: "1,234 tons",
          systemEfficiency: "94.2%",
        },
        monthlyRevenueByEnergySource,
        revenueByStation,
        energyUsageData,
        financialData,
        environmentalData,
        chargerUtilization,
        chargerPerformance,
      }

      if (reportType === "csv") {
        const headers = ["Station", "Revenue (LKR)", "Sessions", "Avg per Session", "Growth (%)"]
        const csvContent = [
          headers.join(","),
          ...revenueByStation.map((station) =>
            [station.station, station.revenue, station.sessions, station.avgPerSession, station.growth].join(","),
          ),
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `revenue-report-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `comprehensive-report-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Error exporting report:", error)
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setReportTypeFilter("all")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">Reports & Analytics</h1>
          <p className="text-gray-400">Comprehensive system analytics and performance reports</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 text-white w-64"
            />
          </div>
          <Button
            className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32 bg-gray-800/50 border-gray-700 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-cyan-500 text-black hover:bg-cyan-400" onClick={() => handleExportReport()}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {(searchTerm || reportTypeFilter !== "all") && (
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Report Type</label>
                <Select value={reportTypeFilter} onValueChange={setReportTypeFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="All Reports" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="energy">Energy Reports</SelectItem>
                    <SelectItem value="financial">Financial Reports</SelectItem>
                    <SelectItem value="environmental">Environmental Reports</SelectItem>
                    <SelectItem value="performance">Performance Reports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                      <p className="text-green-400 text-sm mt-1">{stat.change}</p>
                    </div>
                    <div className="p-3 bg-cyan-500/20 rounded-lg">
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
          <TabsTrigger value="energy" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-cyan-400">
            Energy Usage
          </TabsTrigger>
          <TabsTrigger
            value="chargers"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-cyan-400"
          >
            Charger Utilization
          </TabsTrigger>
          <TabsTrigger
            value="financial"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-cyan-400"
          >
            Financial Reports
          </TabsTrigger>
          <TabsTrigger
            value="environmental"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-cyan-400"
          >
            Environmental Impact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="energy" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-cyan-400">Energy Usage Analytics</h2>
            <Button className="bg-cyan-500 text-black hover:bg-cyan-400">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">24-Hour Energy Usage Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={energyUsageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="hour" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #06b6d4",
                        borderRadius: "8px",
                      }}
                    />
                    <Area type="monotone" dataKey="solar" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                    <Area type="monotone" dataKey="battery" stackId="1" stroke="#10b981" fill="#10b981" />
                    <Area type="monotone" dataKey="grid" stackId="1" stroke="#ef4444" fill="#ef4444" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">Day vs Night Energy Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dayVsNightUsage}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="period" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #06b6d4",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="solar" stackId="a" fill="#f59e0b" name="Solar" />
                    <Bar dataKey="battery" stackId="a" fill="#10b981" name="Battery" />
                    <Bar dataKey="grid" stackId="a" fill="#ef4444" name="Grid" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-cyan-400">Station Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                  <PolarRadiusAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
                  <Radar name="Colombo" dataKey="Colombo" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} />
                  <Radar name="Kandy" dataKey="Kandy" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                  <Radar name="Galle" dataKey="Galle" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
                  <Radar name="Negombo" dataKey="Negombo" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #06b6d4",
                      borderRadius: "8px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chargers" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-cyan-400">Charger Utilization & Performance</h2>
            <Button className="bg-cyan-500 text-black hover:bg-cyan-400">
              <BarChart3 className="w-4 h-4 mr-2" />
              Detailed Analysis
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">Station Utilization Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chargerUtilization.map((station) => (
                    <div
                      key={station.station}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
                    >
                      <div>
                        <p className="font-medium text-white">{station.station}</p>
                        <p className="text-sm text-gray-400">
                          {station.activeChargers}/{station.totalChargers} active • {station.avgSession}h avg session
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-cyan-400">{station.utilization}%</p>
                        <p className="text-sm text-gray-400">{station.downtime}% downtime</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">Top Performing Chargers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chargerPerformance.map((charger, index) => (
                    <div
                      key={charger.charger}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-cyan-400 font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{charger.charger}</p>
                          <p className="text-sm text-gray-400">
                            {charger.sessions} sessions • {charger.uptime}% uptime
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-400">LKR {charger.revenue.toLocaleString()}</p>
                        <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">
                          {charger.efficiency}% efficient
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-cyan-400">Financial Performance & Analysis</h2>
            <div className="flex gap-2">
              <Button className="bg-cyan-500 text-black hover:bg-cyan-400" onClick={() => handleExportReport("csv")}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button className="bg-cyan-500 text-black hover:bg-cyan-400" onClick={() => handleExportReport()}>
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">Monthly Revenue by Energy Source</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyRevenueByEnergySource}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #06b6d4",
                        borderRadius: "8px",
                      }}
                    />
                    <Area type="monotone" dataKey="solar" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Solar" />
                    <Area type="monotone" dataKey="grid" stackId="1" stroke="#ef4444" fill="#ef4444" name="Grid" />
                    <Area
                      type="monotone"
                      dataKey="battery"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      name="Battery"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">Revenue by Station</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueByStation}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="station" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #06b6d4",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="revenue" fill="#06b6d4" name="Revenue (LKR)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-cyan-400">Revenue & Profit Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #06b6d4",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2} name="Revenue" />
                  <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="Profit" />
                  <Line type="monotone" dataKey="solarSavings" stroke="#f59e0b" strokeWidth={2} name="Solar Savings" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-cyan-400">Station Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {revenueByStation.map((station, index) => (
                  <div
                    key={station.station}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-cyan-400 font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{station.station}</p>
                        <p className="text-sm text-gray-400">
                          {station.sessions} sessions • LKR {station.avgPerSession}/avg
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-cyan-400">LKR {station.revenue.toLocaleString()}</p>
                      <Badge
                        variant="outline"
                        className={`${station.growth > 10 ? "text-green-400 border-green-500/30" : "text-orange-400 border-orange-500/30"}`}
                      >
                        +{station.growth}% growth
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">Monthly Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={costBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      label={({ category, percentage }) => `${category}: ${percentage}%`}
                    >
                      {costBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={["#06b6d4", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"][index]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #06b6d4",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-gray-900/50 border-green-500/20 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">LKR 1.56M</div>
                  <div className="text-sm text-gray-400">Monthly Profit</div>
                  <div className="text-green-400 text-xs mt-1">+18.5% vs last month</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/50 border-orange-500/20 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400 mb-1">LKR 260K</div>
                  <div className="text-sm text-gray-400">Solar Savings</div>
                  <div className="text-green-400 text-xs mt-1">+12.3% vs last month</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">60%</div>
                  <div className="text-sm text-gray-400">Profit Margin</div>
                  <div className="text-green-400 text-xs mt-1">+2.1% vs last month</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="environmental" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-cyan-400">Environmental Impact & Sustainability</h2>
            <Button className="bg-cyan-500 text-black hover:bg-cyan-400">
              <Leaf className="w-4 h-4 mr-2" />
              Sustainability Report
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">CO₂ Emissions Saved Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={environmentalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #06b6d4",
                        borderRadius: "8px",
                      }}
                    />
                    <Area type="monotone" dataKey="co2Saved" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">Carbon Footprint Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {carbonFootprint.map((item) => (
                    <div
                      key={item.source}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                        <span className="text-white">{item.source}</span>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${item.impact < 0 ? "text-green-400" : "text-red-400"}`}>
                          {item.impact > 0 ? "+" : ""}
                          {item.impact} tons CO₂
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gray-900/50 border-green-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">1,234</div>
                <div className="text-sm text-gray-400">Tons CO₂ Saved</div>
                <div className="text-green-400 text-sm mt-1">This Month</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-orange-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">1,670</div>
                <div className="text-sm text-gray-400">MWh Solar Generated</div>
                <div className="text-green-400 text-sm mt-1">This Month</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">67%</div>
                <div className="text-sm text-gray-400">Renewable Energy %</div>
                <div className="text-green-400 text-sm mt-1">+5.2% vs last month</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">2,847</div>
                <div className="text-sm text-gray-400">Trees Equivalent</div>
                <div className="text-green-400 text-sm mt-1">CO₂ Impact</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
