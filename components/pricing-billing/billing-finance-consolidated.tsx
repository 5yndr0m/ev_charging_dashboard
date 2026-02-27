"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Users,
  Download,
  Filter,
  Plus,
  Search,
  Clock,
  Settings,
  Edit2,
} from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts"

interface BillingSettings {
  vatRate: number
  serviceChargeRate: number
  minimumSessionFee: number
  idleFeePerMinute: number
  earlyBirdDiscount: number
  nightChargingDiscount: number
}

interface SessionRevenue {
  id: string
  date: string
  userId: string
  vehicleType: string
  energyConsumed: number
  duration: number
  baseRate: number
  surge: number
  discount: number
  tax: number
  totalCost: number
  paymentMethod: string
  status: "completed" | "pending" | "failed"
}

export function BillingFinanceConsolidated() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showManualBillingModal, setShowManualBillingModal] = useState(false)
  const [showAddGatewayModal, setShowAddGatewayModal] = useState(false)
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false)
  const [billingSessions, setBillingSessions] = useState<any[]>([])
  const [paymentGateways, setPaymentGateways] = useState<any[]>([])
  const [discountPlans, setDiscountPlans] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [editingSettings, setEditingSettings] = useState(false)
  const [billingSettings, setBillingSettings] = useState<BillingSettings>({
    vatRate: 8,
    serviceChargeRate: 2.5,
    minimumSessionFee: 50,
    idleFeePerMinute: 2,
    earlyBirdDiscount: 10,
    nightChargingDiscount: 20,
  })
  const [tempSettings, setTempSettings] = useState(billingSettings)

  const [manualBillingForm, setManualBillingForm] = useState({
    userId: "",
    userName: "",
    amount: "",
    description: "",
    category: "custom",
    notes: "",
  })

  const [gatewayForm, setGatewayForm] = useState({
    name: "",
    provider: "",
    fees: "",
    apiKey: "",
    secretKey: "",
    webhookUrl: "",
    testMode: true,
  })

  const [planForm, setPlanForm] = useState({
    name: "",
    type: "Time-based",
    discount: "",
    conditions: "",
    validFrom: "",
    validTo: "",
  })

  const revenueData = [
    { month: "Jan", revenue: 45000, sessions: 1200 },
    { month: "Feb", revenue: 52000, sessions: 1350 },
    { month: "Mar", revenue: 48000, sessions: 1280 },
    { month: "Apr", revenue: 61000, sessions: 1520 },
    { month: "May", revenue: 55000, sessions: 1400 },
    { month: "Jun", revenue: 67000, sessions: 1680 },
  ]

  const billingStats = [
    { label: "Monthly Revenue", value: "LKR 67,000", change: "+12.5%", icon: DollarSign, color: "text-green-400" },
    { label: "Total Sessions", value: "1,680", change: "+8.2%", icon: TrendingUp, color: "text-cyan-400" },
    { label: "Active Subscriptions", value: "234", change: "+15.3%", icon: Users, color: "text-orange-400" },
    { label: "Payment Success Rate", value: "98.7%", change: "+0.5%", icon: CreditCard, color: "text-purple-400" },
  ]

  const revenueByStation = [
    { station: "Colombo", revenue: 15420, sessions: 456, avgPerSession: 33.8 },
    { station: "Kandy", revenue: 12340, sessions: 378, avgPerSession: 32.6 },
    { station: "Galle", revenue: 9870, sessions: 298, avgPerSession: 33.1 },
    { station: "Negombo", revenue: 8760, sessions: 267, avgPerSession: 32.8 },
    { station: "Ratnapura", revenue: 7650, sessions: 234, avgPerSession: 32.7 },
  ]

  const revenueByEnergySource = [
    { source: "Solar", revenue: 28450, percentage: 42.5, color: "#f59e0b" },
    { source: "Grid", revenue: 25670, percentage: 38.3, color: "#ef4444" },
    { source: "Battery", revenue: 12880, percentage: 19.2, color: "#10b981" },
  ]

  const monthlyRevenueData = [
    { month: "Aug", total: 45000, solar: 18000, grid: 20000, battery: 7000 },
    { month: "Sep", total: 52000, solar: 22000, grid: 21000, battery: 9000 },
    { month: "Oct", total: 48000, solar: 20000, grid: 19000, battery: 9000 },
    { month: "Nov", total: 61000, solar: 26000, grid: 24000, battery: 11000 },
    { month: "Dec", total: 55000, solar: 23000, grid: 22000, battery: 10000 },
    { month: "Jan", total: 67000, solar: 28000, grid: 26000, battery: 13000 },
  ]

  const fetchBillingSessions = async () => {
    try {
      setBillingSessions([
        {
          id: "SES001",
          user: "John Silva",
          vehicle: "Tesla Model 3",
          station: "Colombo",
          charger: "C05",
          startTime: "2024-01-20 14:30",
          endTime: "2024-01-20 16:15",
          duration: "1h 45m",
          energyConsumed: "45.2 kWh",
          energySource: "Solar",
          ratePerKwh: "LKR 25.50",
          totalAmount: "LKR 1,152.60",
          status: "Completed",
          paymentMethod: "Credit Card",
        },
        {
          id: "SES002",
          user: "Maria Fernando",
          vehicle: "Nissan Leaf",
          station: "Kandy",
          charger: "C12",
          startTime: "2024-01-20 09:15",
          endTime: "2024-01-20 10:45",
          duration: "1h 30m",
          energyConsumed: "32.8 kWh",
          energySource: "Grid",
          ratePerKwh: "LKR 35.00",
          totalAmount: "LKR 1,148.00",
          status: "Completed",
          paymentMethod: "Mobile Pay",
        },
        {
          id: "SES003",
          user: "Fleet Vehicle #23",
          vehicle: "BMW i3",
          station: "Galle",
          charger: "C08",
          startTime: "2024-01-20 11:00",
          endTime: "2024-01-20 12:30",
          duration: "1h 30m",
          energyConsumed: "28.5 kWh",
          energySource: "Battery",
          ratePerKwh: "LKR 30.00",
          totalAmount: "LKR 855.00",
          status: "Pending",
          paymentMethod: "Fleet Account",
        },
      ])
    } catch (error) {
      console.error("Error fetching billing sessions:", error)
    }
  }

  const fetchPaymentGateways = async () => {
    try {
      const response = await fetch("/api/gateways")
      const result = await response.json()
      if (result.success) {
        setPaymentGateways(result.data)
      }
    } catch (error) {
      console.error("Error fetching payment gateways:", error)
    }
  }

  const fetchDiscountPlans = async () => {
    try {
      const response = await fetch("/api/discounts")
      const result = await response.json()
      if (result.success) {
        setDiscountPlans(result.data)
      }
    } catch (error) {
      console.error("Error fetching discount plans:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBillingSessions()
    fetchPaymentGateways()
    fetchDiscountPlans()
  }, [])

  const filteredBillingSessions = billingSessions.filter((session) => {
    const matchesSearch =
      session.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || session.status === statusFilter
    const matchesPaymentMethod = paymentMethodFilter === "all" || session.paymentMethod === paymentMethodFilter

    return matchesSearch && matchesStatus && matchesPaymentMethod
  })

  const handleExport = async () => {
    try {
      const response = await fetch("/api/billing/export?format=csv")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `billing-export-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error exporting data:", error)
    }
  }

  const handleSaveSettings = () => {
    setBillingSettings(tempSettings)
    setEditingSettings(false)
  }

  const totalRevenue = revenueData.reduce((sum, month) => sum + month.totalRevenue, 0)
  const averageMonthlyRevenue = totalRevenue / revenueData.length
  const totalSessions = billingSessions.length
  const averageSessionCost =
    billingSessions.reduce((sum, s) => sum + Number.parseFloat(s.totalAmount.replace(/[^0-9.]/g, "")), 0) /
    (totalSessions || 1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Billing & Finance</h2>
          <p className="text-gray-400">Comprehensive billing, payments, and financial management</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search transactions..."
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
          <Button className="bg-cyan-500 text-black hover:bg-cyan-400" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {billingStats.map((stat, index) => {
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
        <TabsList className="grid w-full grid-cols-5 bg-gray-800/50">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="sessions"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400"
          >
            Sessions
          </TabsTrigger>
          <TabsTrigger
            value="gateways"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400"
          >
            Gateways
          </TabsTrigger>
          <TabsTrigger
            value="discounts"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400"
          >
            Discounts
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Revenue Trend */}
            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">Monthly Revenue by Energy Source</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyRevenueData}>
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
                    <Area type="monotone" dataKey="solar" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                    <Area type="monotone" dataKey="grid" stackId="1" stroke="#ef4444" fill="#ef4444" />
                    <Area type="monotone" dataKey="battery" stackId="1" stroke="#10b981" fill="#10b981" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue by Station */}
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
                    <Bar dataKey="revenue" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">Revenue by Energy Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueByEnergySource.map((source) => (
                    <div key={source.source} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: source.color }}></div>
                        <span className="text-white">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-white">LKR {source.revenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-400">{source.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-cyan-400">Top Performing Stations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {revenueByStation.map((station, index) => (
                    <div
                      key={station.station}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-cyan-400 font-bold">{index + 1}</span>
                        </div>
                        <span className="text-white font-medium">{station.station}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-cyan-400">LKR {station.revenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-400">
                          {station.sessions} sessions • LKR {station.avgPerSession}/avg
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-cyan-400">Session Billing Management</h3>
            <Button
              className="bg-cyan-500 text-black hover:bg-cyan-400"
              onClick={() => setShowManualBillingModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Manual Billing
            </Button>
          </div>

          <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-cyan-400">Recent Billing Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredBillingSessions.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    {searchTerm || statusFilter !== "all" || paymentMethodFilter !== "all"
                      ? "No sessions match your filters"
                      : "No billing sessions found"}
                  </div>
                ) : (
                  filteredBillingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                          <Clock className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {session.user} • {session.vehicle}
                          </p>
                          <p className="text-sm text-gray-400">
                            {session.station} {session.charger} • {session.duration} • {session.energyConsumed}
                          </p>
                          <p className="text-xs text-gray-500">
                            {session.energySource} @ {session.ratePerKwh}/kWh
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-cyan-400 text-lg">{session.totalAmount}</p>
                        <Badge
                          variant={
                            session.status === "Completed"
                              ? "default"
                              : session.status === "Pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {session.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{session.paymentMethod}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gateways Tab */}
        <TabsContent value="gateways" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-cyan-400">Payment Gateway Management</h3>
            <Button className="bg-cyan-500 text-black hover:bg-cyan-400" onClick={() => setShowAddGatewayModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Gateway
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {paymentGateways.map((gateway) => (
              <Card key={gateway.id} className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-white">{gateway.name}</h4>
                      <p className="text-sm text-gray-400">{gateway.provider}</p>
                    </div>
                    <Badge variant={gateway.status === "Active" ? "default" : "secondary"}>{gateway.status}</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Transactions:</span>
                      <span className="text-cyan-400 font-medium">{gateway.transactions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Success Rate:</span>
                      <span className="text-green-400 font-medium">{gateway.successRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fees:</span>
                      <span className="text-orange-400 font-medium">{gateway.fees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Monthly Volume:</span>
                      <span className="text-purple-400 font-medium">{gateway.monthlyVolume}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent text-gray-400">
                      Configure
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent text-gray-400">
                      View Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Discounts Tab */}
        <TabsContent value="discounts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-cyan-400">Discounts & Subscription Plans</h3>
            <Button className="bg-cyan-500 text-black hover:bg-cyan-400" onClick={() => setShowCreatePlanModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Plan
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {discountPlans.map((plan) => (
              <Card key={plan.id} className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-white">{plan.name}</h4>
                      <p className="text-sm text-gray-400">{plan.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-cyan-400">{plan.discount}</p>
                      <Badge variant="default">{plan.status}</Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Conditions:</span>
                      <span className="text-white font-medium">{plan.conditions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Active Users:</span>
                      <span className="text-cyan-400 font-medium">{plan.activeUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Monthly Savings:</span>
                      <span className="text-green-400 font-medium">{plan.monthlySavings}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent text-gray-400">
                      Edit Plan
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent text-gray-400">
                      View Users
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-cyan-400" />
                  Configure Billing Rules
                </CardTitle>
                {!editingSettings && (
                  <Button
                    onClick={() => {
                      setEditingSettings(true)
                      setTempSettings(billingSettings)
                    }}
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Settings
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {editingSettings ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">VAT Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={tempSettings.vatRate}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, vatRate: Number.parseFloat(e.target.value) })
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">Tax applied to all transactions</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Service Charge Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={tempSettings.serviceChargeRate}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, serviceChargeRate: Number.parseFloat(e.target.value) })
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">Service fee on each transaction</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Minimum Session Fee (₨)</label>
                      <input
                        type="number"
                        value={tempSettings.minimumSessionFee}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, minimumSessionFee: Number.parseFloat(e.target.value) })
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">Minimum charge per session</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Idle Fee (₨/minute)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={tempSettings.idleFeePerMinute}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, idleFeePerMinute: Number.parseFloat(e.target.value) })
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">Fee after vehicle stays post-charge</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Early Bird Discount (%)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={tempSettings.earlyBirdDiscount}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, earlyBirdDiscount: Number.parseFloat(e.target.value) })
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">Discount for bookings before 7 AM</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Night Charging Discount (%)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={tempSettings.nightChargingDiscount}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, nightChargingDiscount: Number.parseFloat(e.target.value) })
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">Discount for 22:00 - 05:00 charging</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-cyan-500/20">
                    <Button
                      onClick={handleSaveSettings}
                      className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => setEditingSettings(false)}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-800/50 rounded border border-cyan-500/20">
                    <p className="text-sm text-gray-400 mb-2">VAT Rate</p>
                    <p className="text-2xl font-bold text-cyan-400">{billingSettings.vatRate}%</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded border border-cyan-500/20">
                    <p className="text-sm text-gray-400 mb-2">Service Charge</p>
                    <p className="text-2xl font-bold text-cyan-400">{billingSettings.serviceChargeRate}%</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded border border-cyan-500/20">
                    <p className="text-sm text-gray-400 mb-2">Min Session Fee</p>
                    <p className="text-2xl font-bold text-cyan-400">₨{billingSettings.minimumSessionFee}</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded border border-cyan-500/20">
                    <p className="text-sm text-gray-400 mb-2">Idle Fee</p>
                    <p className="text-2xl font-bold text-cyan-400">₨{billingSettings.idleFeePerMinute}/min</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded border border-cyan-500/20">
                    <p className="text-sm text-gray-400 mb-2">Early Bird Discount</p>
                    <p className="text-2xl font-bold text-green-400">{billingSettings.earlyBirdDiscount}%</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded border border-cyan-500/20">
                    <p className="text-sm text-gray-400 mb-2">Night Charging Discount</p>
                    <p className="text-2xl font-bold text-green-400">{billingSettings.nightChargingDiscount}%</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
