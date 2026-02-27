"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  FileText,
} from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts"

export function BillingPayments() {
  const [activeTab, setActiveTab] = useState("sessions")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showManualBillingModal, setShowManualBillingModal] = useState(false)
  const [showAddGatewayModal, setShowAddGatewayModal] = useState(false)
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false)
  const [billingSessions, setBillingSessions] = useState([])
  const [paymentGateways, setPaymentGateways] = useState([])
  const [discountPlans, setDiscountPlans] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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
      // Mock data for now - in real app would fetch from API
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

  const handleManualBilling = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/billing/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualBillingForm),
      })

      const result = await response.json()
      if (result.success) {
        setShowManualBillingModal(false)
        setManualBillingForm({
          userId: "",
          userName: "",
          amount: "",
          description: "",
          category: "custom",
          notes: "",
        })
        // Refresh data
        fetchBillingSessions()
      }
    } catch (error) {
      console.error("Error creating manual billing:", error)
    }
  }

  const handleAddGateway = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/gateways", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gatewayForm),
      })

      const result = await response.json()
      if (result.success) {
        setShowAddGatewayModal(false)
        setGatewayForm({
          name: "",
          provider: "",
          fees: "",
          apiKey: "",
          secretKey: "",
          webhookUrl: "",
          testMode: true,
        })
        fetchPaymentGateways()
      }
    } catch (error) {
      console.error("Error adding gateway:", error)
    }
  }

  const handleCreatePlan = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planForm),
      })

      const result = await response.json()
      if (result.success) {
        setShowCreatePlanModal(false)
        setPlanForm({
          name: "",
          type: "Time-based",
          discount: "",
          conditions: "",
          validFrom: "",
          validTo: "",
        })
        fetchDiscountPlans()
      }
    } catch (error) {
      console.error("Error creating discount plan:", error)
    }
  }

  const handleGenerateReport = async () => {
    try {
      const reportData = {
        monthlyRevenue: monthlyRevenueData,
        revenueByStation,
        revenueByEnergySource,
        exportDate: new Date().toISOString(),
        totalRevenue: monthlyRevenueData.reduce((sum, month) => sum + month.total, 0),
      }

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `revenue-report-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error generating report:", error)
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setPaymentMethodFilter("all")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">Billing & Payments</h1>
          <p className="text-gray-400">Manage billing, payments, discounts, and revenue analytics</p>
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
          {(searchTerm || statusFilter !== "all" || paymentMethodFilter !== "all") && (
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
                <label className="text-sm text-gray-400">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Payment Method</label>
                <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="All Methods" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Mobile Pay">Mobile Pay</SelectItem>
                    <SelectItem value="Fleet Account">Fleet Account</SelectItem>
                    <SelectItem value="E-Wallet">E-Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
          <TabsTrigger
            value="sessions"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
          >
            Session Billing
          </TabsTrigger>
          <TabsTrigger
            value="gateways"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
          >
            Payment Gateways
          </TabsTrigger>
          <TabsTrigger
            value="discounts"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
          >
            Discounts & Plans
          </TabsTrigger>
          <TabsTrigger value="revenue" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            Revenue Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-cyan-400">Session Billing Management</h2>
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

        <TabsContent value="gateways" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-cyan-400">Payment Gateway Management</h2>
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
                      <h3 className="font-medium text-white">{gateway.name}</h3>
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
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Configure
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      View Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discounts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-cyan-400">Discounts & Subscription Plans</h2>
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
                      <h3 className="font-medium text-white">{plan.name}</h3>
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
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Edit Plan
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      View Users
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-cyan-400">Revenue Reports & Analytics</h2>
            <Button className="bg-cyan-500 text-black hover:bg-cyan-400" onClick={handleGenerateReport}>
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>

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
      </Tabs>

      <Dialog open={showManualBillingModal} onOpenChange={setShowManualBillingModal}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">Create Manual Billing</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleManualBilling} className="space-y-4">
            <div className="space-y-2">
              <Label>User ID</Label>
              <Input
                value={manualBillingForm.userId}
                onChange={(e) => setManualBillingForm((prev) => ({ ...prev, userId: e.target.value }))}
                className="bg-gray-800 border-gray-700"
                placeholder="USR001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>User Name</Label>
              <Input
                value={manualBillingForm.userName}
                onChange={(e) => setManualBillingForm((prev) => ({ ...prev, userName: e.target.value }))}
                className="bg-gray-800 border-gray-700"
                placeholder="John Silva"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Amount (LKR)</Label>
              <Input
                type="number"
                value={manualBillingForm.amount}
                onChange={(e) => setManualBillingForm((prev) => ({ ...prev, amount: e.target.value }))}
                className="bg-gray-800 border-gray-700"
                placeholder="1000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={manualBillingForm.category}
                onValueChange={(value) => setManualBillingForm((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                  <SelectItem value="penalty">Penalty</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={manualBillingForm.description}
                onChange={(e) => setManualBillingForm((prev) => ({ ...prev, description: e.target.value }))}
                className="bg-gray-800 border-gray-700"
                placeholder="Manual billing description"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                value={manualBillingForm.notes}
                onChange={(e) => setManualBillingForm((prev) => ({ ...prev, notes: e.target.value }))}
                className="bg-gray-800 border-gray-700"
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowManualBillingModal(false)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                Create Billing
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddGatewayModal} onOpenChange={setShowAddGatewayModal}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">Add Payment Gateway</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddGateway} className="space-y-4">
            <div className="space-y-2">
              <Label>Gateway Name</Label>
              <Input
                value={gatewayForm.name}
                onChange={(e) => setGatewayForm((prev) => ({ ...prev, name: e.target.value }))}
                className="bg-gray-800 border-gray-700"
                placeholder="Stripe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Provider</Label>
              <Input
                value={gatewayForm.provider}
                onChange={(e) => setGatewayForm((prev) => ({ ...prev, provider: e.target.value }))}
                className="bg-gray-800 border-gray-700"
                placeholder="Stripe Inc."
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Fees (%)</Label>
              <Input
                value={gatewayForm.fees}
                onChange={(e) => setGatewayForm((prev) => ({ ...prev, fees: e.target.value }))}
                className="bg-gray-800 border-gray-700"
                placeholder="2.9%"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input
                type="password"
                value={gatewayForm.apiKey}
                onChange={(e) => setGatewayForm((prev) => ({ ...prev, apiKey: e.target.value }))}
                className="bg-gray-800 border-gray-700"
                placeholder="pk_test_..."
              />
            </div>
            <div className="space-y-2">
              <Label>Secret Key</Label>
              <Input
                type="password"
                value={gatewayForm.secretKey}
                onChange={(e) => setGatewayForm((prev) => ({ ...prev, secretKey: e.target.value }))}
                className="bg-gray-800 border-gray-700"
                placeholder="sk_test_..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddGatewayModal(false)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                Add Gateway
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreatePlanModal} onOpenChange={setShowCreatePlanModal}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">Create Discount Plan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePlan} className="space-y-4">
            <div className="space-y-2">
              <Label>Plan Name</Label>
              <Input
                value={planForm.name}
                onChange={(e) => setPlanForm((prev) => ({ ...prev, name: e.target.value }))}
                className="bg-gray-800 border-gray-700"
                placeholder="Weekend Special"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={planForm.type}
                onValueChange={(value) => setPlanForm((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="Time-based">Time-based</SelectItem>
                  <SelectItem value="Volume-based">Volume-based</SelectItem>
                  <SelectItem value="Energy-based">Energy-based</SelectItem>
                  <SelectItem value="Membership">Membership</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Discount (%)</Label>
              <Input
                value={planForm.discount}
                onChange={(e) => setPlanForm((prev) => ({ ...prev, discount: e.target.value }))}
                className="bg-gray-800 border-gray-700"
                placeholder="15%"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Conditions</Label>
              <Input
                value={planForm.conditions}
                onChange={(e) => setPlanForm((prev) => ({ ...prev, conditions: e.target.value }))}
                className="bg-gray-800 border-gray-700"
                placeholder="Weekends only"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Valid From</Label>
              <Input
                type="date"
                value={planForm.validFrom}
                onChange={(e) => setPlanForm((prev) => ({ ...prev, validFrom: e.target.value }))}
                className="bg-gray-800 border-gray-700"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Valid To (Optional)</Label>
              <Input
                type="date"
                value={planForm.validTo}
                onChange={(e) => setPlanForm((prev) => ({ ...prev, validTo: e.target.value }))}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreatePlanModal(false)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                Create Plan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
