"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Zap, DollarSign, Activity, RefreshCw, Download } from "lucide-react"

interface AnalyticsData {
  metrics: any
  energyUsageData: any[]
  stationPerformance: any[]
  period: string
  generatedAt: string
}

export function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [period, setPeriod] = useState("30d")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/analytics/dashboard?period=${period}`)
      const result = await response.json()

      if (result.success) {
        setAnalyticsData(result.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch analytics data",
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

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const generateReport = async (reportType: string) => {
    try {
      const response = await fetch("/api/analytics/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customParams: {
            title: `${reportType} Analytics Report`,
            period: period,
          },
          format: "pdf",
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Report Generated",
          description: "Your analytics report is being generated and will be available shortly.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      })
    }
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading analytics...</div>
      </div>
    )
  }

  const { metrics, energyUsageData, stationPerformance } = analyticsData

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Real-time system analytics and performance insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={() => generateReport("comprehensive")} className="bg-cyan-500 text-black hover:bg-cyan-400">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Energy</p>
                <p className="text-2xl font-bold text-cyan-400 mt-1">{metrics.totalEnergyConsumed} MWh</p>
                <p className="text-green-400 text-sm mt-1">+{metrics.trends.energyTrend}%</p>
              </div>
              <div className="p-3 bg-cyan-500/20 rounded-lg">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-green-500/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Revenue</p>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  LKR {(metrics.revenueGenerated / 1000000).toFixed(1)}M
                </p>
                <p className="text-green-400 text-sm mt-1">+{metrics.trends.revenueTrend}%</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-orange-500/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">CO₂ Saved</p>
                <p className="text-2xl font-bold text-orange-400 mt-1">{metrics.co2Saved} tons</p>
                <p className="text-green-400 text-sm mt-1">+{metrics.trends.co2Trend}%</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">System Efficiency</p>
                <p className="text-2xl font-bold text-purple-400 mt-1">{metrics.systemEfficiency}%</p>
                <p className="text-green-400 text-sm mt-1">+{metrics.trends.efficiencyTrend}%</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger value="energy" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            Energy Analysis
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
          >
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">Energy Usage Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={energyUsageData}>
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
                    <Line type="monotone" dataKey="total" stroke="#06b6d4" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">Station Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stationPerformance.map((station, index) => (
                    <div
                      key={station.station}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-cyan-400 font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{station.station}</p>
                          <p className="text-sm text-gray-400">{station.uptime}% uptime</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">
                          {station.efficiency}% efficient
                        </Badge>
                        <p className="text-sm text-gray-400 mt-1">{station.utilization}% utilized</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="energy" className="space-y-6">
          <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-cyan-400">Energy Source Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Solar", value: 58.6, color: "#f59e0b" },
                      { name: "Battery", value: 16.0, color: "#10b981" },
                      { name: "Grid", value: 25.4, color: "#ef4444" },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {[
                      { name: "Solar", value: 58.6, color: "#f59e0b" },
                      { name: "Battery", value: 16.0, color: "#10b981" },
                      { name: "Grid", value: 25.4, color: "#ef4444" },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-900/50 border-green-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">98.7%</div>
                <div className="text-sm text-gray-400">System Uptime</div>
                <div className="text-green-400 text-sm mt-1">+0.5% vs last month</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">73.2%</div>
                <div className="text-sm text-gray-400">Avg Utilization</div>
                <div className="text-green-400 text-sm mt-1">+2.1% vs last month</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">4.6</div>
                <div className="text-sm text-gray-400">Customer Rating</div>
                <div className="text-green-400 text-sm mt-1">+0.2 vs last month</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
