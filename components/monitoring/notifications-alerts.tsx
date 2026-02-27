"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Settings,
  Plus,
  Search,
  Filter,
  MessageSquare,
  Mail,
  Smartphone,
  Clock,
  TrendingUp,
  Eye,
  X,
} from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar } from "recharts"

interface Alert {
  id: string
  type: string
  severity: string
  message: string
  station: string
  charger: string
  timestamp: string
  duration: string
  status: string
  assignedTo: string
  description: string
  impact: string
  actions: string[]
}

interface AlertRule {
  name: string
  condition: string
  severity: string
  channels: string[]
  recipients: string[]
  enabled: boolean
  escalation: string
}

export function NotificationsAlerts() {
  const [activeTab, setActiveTab] = useState("alerts")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [alertRules, setAlertRules] = useState<AlertRule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewAlertModal, setShowNewAlertModal] = useState(false)
  const [showAIConfigModal, setShowAIConfigModal] = useState(false)
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false)
  const [showCreateRuleModal, setShowCreateRuleModal] = useState(false)
  const [newAlertForm, setNewAlertForm] = useState({
    type: "Warning",
    severity: "Medium",
    message: "",
    station: "",
    charger: "",
    description: "",
  })
  const [newRuleForm, setNewRuleForm] = useState({
    name: "",
    condition: "",
    severity: "Medium",
    channels: [],
    recipients: [],
  })

  const fetchAlerts = async () => {
    try {
      const response = await fetch(`/api/alerts?type=${filterType}&status=${filterStatus}`)
      const result = await response.json()
      if (result.success) {
        setAlerts(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch alerts:", error)
    }
  }

  const fetchAlertRules = async () => {
    try {
      const response = await fetch("/api/alert-rules")
      const result = await response.json()
      if (result.success) {
        setAlertRules(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch alert rules:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAlertRule = () => {
    setShowCreateRuleModal(true)
  }

  const handleConfigureAI = () => {
    setShowAIConfigModal(true)
  }

  const handleCreatePlan = () => {
    setShowCreatePlanModal(true)
  }

  const handleNewAlert = () => {
    setShowNewAlertModal(true)
  }

  const handleSubmitNewAlert = async () => {
    try {
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newAlertForm,
          id: `ALT${Date.now()}`,
          timestamp: new Date().toISOString(),
          status: "Active",
          assignedTo: "System Auto",
        }),
      })

      if (response.ok) {
        setShowNewAlertModal(false)
        setNewAlertForm({
          type: "Warning",
          severity: "Medium",
          message: "",
          station: "",
          charger: "",
          description: "",
        })
        fetchAlerts()
      }
    } catch (error) {
      console.error("Failed to create alert:", error)
    }
  }

  const handleSubmitNewRule = async () => {
    try {
      const response = await fetch("/api/alert-rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newRuleForm,
          enabled: true,
          escalation: "15 minutes",
        }),
      })

      if (response.ok) {
        setShowCreateRuleModal(false)
        setNewRuleForm({
          name: "",
          condition: "",
          severity: "Medium",
          channels: [],
          recipients: [],
        })
        fetchAlertRules()
      }
    } catch (error) {
      console.error("Failed to create rule:", error)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [filterType, filterStatus])

  useEffect(() => {
    fetchAlertRules()
  }, [])

  const alertStats = [
    {
      label: "Active Alerts",
      value: alerts.filter((a) => a.status === "Active").length.toString(),
      icon: AlertTriangle,
      color: "text-red-400",
    },
    { label: "Resolved Today", value: "23", icon: CheckCircle, color: "text-green-400" },
    { label: "Notification Channels", value: "5", icon: Bell, color: "text-cyan-400" },
    { label: "Subscribers", value: "89", icon: Settings, color: "text-orange-400" },
  ]

  const activeAlerts = [
    {
      id: "ALT001",
      type: "Critical",
      severity: "High",
      message: "Grid Overload at Colombo Station",
      station: "Colombo",
      charger: "Multiple",
      timestamp: "2024-01-20 14:28:00",
      duration: "2 minutes ago",
      status: "Active",
      assignedTo: "John Silva",
      description: "Grid load exceeding 95% capacity, switching to battery backup",
      impact: "Service degradation possible",
      actions: ["Switch to Battery", "Reduce Load", "Contact CEB"],
    },
    {
      id: "ALT002",
      type: "Warning",
      severity: "Medium",
      message: "Battery Storage Low (15%)",
      station: "Kandy",
      charger: "Battery System",
      timestamp: "2024-01-20 14:15:00",
      duration: "15 minutes ago",
      status: "Active",
      assignedTo: "Maria Fernando",
      description: "Battery storage level below minimum threshold",
      impact: "Reduced backup capacity",
      actions: ["Monitor Charging", "Check Solar", "Schedule Maintenance"],
    },
    {
      id: "ALT003",
      type: "Info",
      severity: "Low",
      message: "High Demand Period Started",
      station: "Galle",
      charger: "All Chargers",
      timestamp: "2024-01-20 13:00:00",
      duration: "1 hour ago",
      status: "Active",
      assignedTo: "System Auto",
      description: "Peak usage period detected, dynamic pricing activated",
      impact: "Increased pricing in effect",
      actions: ["Monitor Usage", "Adjust Pricing", "Load Balance"],
    },
    {
      id: "ALT004",
      type: "Critical",
      severity: "High",
      message: "Charger C05 Offline",
      station: "Negombo",
      charger: "C05",
      timestamp: "2024-01-20 12:45:00",
      duration: "2 hours ago",
      status: "Acknowledged",
      assignedTo: "Maintenance Team",
      description: "Charger communication lost, possible hardware failure",
      impact: "Reduced station capacity",
      actions: ["Dispatch Technician", "Run Diagnostics", "Isolate Unit"],
    },
  ]

  const notificationChannels = [
    {
      name: "SMS Alerts",
      type: "SMS",
      subscribers: 45,
      status: "Active",
      lastSent: "5 min ago",
      successRate: 98.5,
      monthlyVolume: 1234,
      cost: "LKR 2.50/SMS",
      provider: "Dialog",
    },
    {
      name: "Email Notifications",
      type: "Email",
      subscribers: 89,
      status: "Active",
      lastSent: "2 min ago",
      successRate: 99.2,
      monthlyVolume: 2456,
      cost: "LKR 0.50/Email",
      provider: "SendGrid",
    },
    {
      name: "Mobile Push",
      type: "Push",
      subscribers: 67,
      status: "Active",
      lastSent: "1 min ago",
      successRate: 96.8,
      monthlyVolume: 3421,
      cost: "Free",
      provider: "Firebase",
    },
    {
      name: "Slack Integration",
      type: "Chat",
      subscribers: 12,
      status: "Active",
      lastSent: "30 sec ago",
      successRate: 99.8,
      monthlyVolume: 567,
      cost: "Free",
      provider: "Slack API",
    },
    {
      name: "WhatsApp Business",
      type: "Messaging",
      subscribers: 23,
      status: "Inactive",
      lastSent: "2 hours ago",
      successRate: 94.2,
      monthlyVolume: 189,
      cost: "LKR 1.20/Message",
      provider: "WhatsApp API",
    },
  ]

  const predictiveWarnings = [
    {
      id: "PRED001",
      message: "Battery at Ratnapura will reach low capacity in 4 hours",
      confidence: "85%",
      timeframe: "4 hours",
      action: "Schedule maintenance",
      station: "Ratnapura",
      metric: "Battery Level",
      currentValue: "45%",
      predictedValue: "15%",
      trend: "Declining",
      severity: "Medium",
    },
    {
      id: "PRED002",
      message: "Peak demand expected at Colombo in 2 hours",
      confidence: "92%",
      timeframe: "2 hours",
      action: "Prepare load balancing",
      station: "Colombo",
      metric: "Demand Load",
      currentValue: "67%",
      predictedValue: "95%",
      trend: "Increasing",
      severity: "High",
    },
    {
      id: "PRED003",
      message: "Solar generation will drop 40% due to weather",
      confidence: "78%",
      timeframe: "6 hours",
      action: "Switch to grid backup",
      station: "All Stations",
      metric: "Solar Output",
      currentValue: "85%",
      predictedValue: "45%",
      trend: "Declining",
      severity: "Medium",
    },
    {
      id: "PRED004",
      message: "Charger C12 showing early failure signs",
      confidence: "67%",
      timeframe: "3 days",
      action: "Preventive maintenance",
      station: "Kandy",
      metric: "Performance",
      currentValue: "92%",
      predictedValue: "75%",
      trend: "Declining",
      severity: "Low",
    },
  ]

  const alertHistory = [
    { date: "2024-01-20", critical: 3, warning: 8, info: 12, resolved: 20 },
    { date: "2024-01-19", critical: 2, warning: 6, info: 15, resolved: 18 },
    { date: "2024-01-18", critical: 1, warning: 9, info: 10, resolved: 16 },
    { date: "2024-01-17", critical: 4, warning: 7, info: 14, resolved: 22 },
    { date: "2024-01-16", critical: 2, warning: 5, info: 11, resolved: 15 },
  ]

  const notificationVolume = [
    { hour: "00:00", sms: 2, email: 5, push: 8 },
    { hour: "06:00", sms: 8, email: 15, push: 25 },
    { hour: "12:00", sms: 12, email: 28, push: 45 },
    { hour: "18:00", sms: 15, email: 32, push: 52 },
    { hour: "24:00", sms: 5, email: 12, push: 18 },
  ]

  const getAlertColor = (type: string) => {
    switch (type) {
      case "Critical":
        return "text-red-400 border-red-500/30 bg-red-500/10"
      case "Warning":
        return "text-orange-400 border-orange-500/30 bg-orange-500/10"
      case "Info":
        return "text-cyan-400 border-cyan-500/30 bg-cyan-500/10"
      default:
        return "text-gray-400 border-gray-500/30 bg-gray-500/10"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "text-red-400"
      case "Medium":
        return "text-orange-400"
      case "Low":
        return "text-cyan-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">Notifications & Alerts</h1>
          <p className="text-gray-400">Monitor system alerts and manage notification channels</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 text-white w-64"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32 bg-gray-800/50 border-gray-700 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={showNewAlertModal} onOpenChange={setShowNewAlertModal}>
            <DialogTrigger asChild>
              <Button className="bg-cyan-500 text-black hover:bg-cyan-400">
                <Plus className="w-4 h-4 mr-2" />
                New Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-cyan-500/20 text-white">
              <DialogHeader>
                <DialogTitle className="text-cyan-400">Create New Alert</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="alert-type" className="text-gray-300">
                    Alert Type
                  </Label>
                  <Select
                    value={newAlertForm.type}
                    onValueChange={(value) => setNewAlertForm({ ...newAlertForm, type: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="Warning">Warning</SelectItem>
                      <SelectItem value="Info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="severity" className="text-gray-300">
                    Severity
                  </Label>
                  <Select
                    value={newAlertForm.severity}
                    onValueChange={(value) => setNewAlertForm({ ...newAlertForm, severity: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message" className="text-gray-300">
                    Alert Message
                  </Label>
                  <Input
                    id="message"
                    value={newAlertForm.message}
                    onChange={(e) => setNewAlertForm({ ...newAlertForm, message: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Brief alert message"
                  />
                </div>
                <div>
                  <Label htmlFor="station" className="text-gray-300">
                    Station
                  </Label>
                  <Input
                    id="station"
                    value={newAlertForm.station}
                    onChange={(e) => setNewAlertForm({ ...newAlertForm, station: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="e.g., Colombo"
                  />
                </div>
                <div>
                  <Label htmlFor="charger" className="text-gray-300">
                    Charger
                  </Label>
                  <Input
                    id="charger"
                    value={newAlertForm.charger}
                    onChange={(e) => setNewAlertForm({ ...newAlertForm, charger: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="e.g., C05 or Multiple"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-gray-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newAlertForm.description}
                    onChange={(e) => setNewAlertForm({ ...newAlertForm, description: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Detailed description of the alert..."
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSubmitNewAlert} className="flex-1 bg-cyan-500 text-black hover:bg-cyan-400">
                    Create Alert
                  </Button>
                  <Button
                    onClick={() => setShowNewAlertModal(false)}
                    variant="outline"
                    className="flex-1 bg-transparent border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {alertStats.map((stat, index) => {
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
            value="alerts"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400"
          >
            Active Alerts
          </TabsTrigger>
          <TabsTrigger
            value="channels"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400"
          >
            Notification Channels
          </TabsTrigger>
          <TabsTrigger
            value="predictive"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400"
          >
            Predictive Warnings
          </TabsTrigger>
          <TabsTrigger
            value="rules"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400"
          >
            Alert Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Active System Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-gray-400">Loading alerts...</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {alerts.map((alert) => (
                        <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge variant="outline" className={getAlertColor(alert.type)}>
                                  {alert.type}
                                </Badge>
                                <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                                  {alert.severity}
                                </Badge>
                                <span className="text-sm text-gray-400">{alert.station}</span>
                              </div>
                              <p className="font-medium text-white mb-1">{alert.message}</p>
                              <p className="text-sm text-gray-400 mb-2">{alert.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>Charger: {alert.charger}</span>
                                <span>Assigned: {alert.assignedTo}</span>
                                <span>{alert.duration}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button size="sm" variant="outline" className="bg-transparent">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-transparent text-green-400 hover:bg-green-500/20"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-transparent text-red-400 hover:bg-red-500/20"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {alert.actions?.map((action, idx) => (
                              <Button key={idx} size="sm" variant="outline" className="text-xs bg-transparent">
                                {action}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">Alert History (5 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={alertHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} />
                    <YAxis stroke="#9ca3af" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #06b6d4",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="critical" stackId="a" fill="#ef4444" name="Critical" />
                    <Bar dataKey="warning" stackId="a" fill="#f59e0b" name="Warning" />
                    <Bar dataKey="info" stackId="a" fill="#06b6d4" name="Info" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {notificationChannels.map((channel) => (
              <Card key={channel.name} className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-500/20 rounded-lg">
                        {channel.type === "SMS" && <MessageSquare className="w-5 h-5 text-cyan-400" />}
                        {channel.type === "Email" && <Mail className="w-5 h-5 text-cyan-400" />}
                        {channel.type === "Push" && <Smartphone className="w-5 h-5 text-cyan-400" />}
                        {(channel.type === "Chat" || channel.type === "Messaging") && (
                          <MessageSquare className="w-5 h-5 text-cyan-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{channel.name}</h3>
                        <p className="text-sm text-gray-400">{channel.provider}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={channel.status === "Active" ? "outline" : "secondary"}
                        className={
                          channel.status === "Active"
                            ? "bg-green-500/20 text-green-400 border-green-500/50"
                            : "text-gray-400"
                        }
                      >
                        {channel.status}
                      </Badge>
                      <Switch checked={channel.status === "Active"} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subscribers:</span>
                      <span className="text-cyan-400 font-medium">{channel.subscribers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Success Rate:</span>
                      <span className="text-green-400 font-medium">{channel.successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Monthly Volume:</span>
                      <span className="text-purple-400 font-medium">{channel.monthlyVolume}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cost:</span>
                      <span className="text-orange-400 font-medium">{channel.cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Sent:</span>
                      <span className="text-gray-300 font-medium">{channel.lastSent}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent text-gray-300 hover:text-cyan-400 hover:border-cyan-400"
                    >
                      Configure
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent text-gray-300 hover:text-cyan-400 hover:border-cyan-400"
                    >
                      Test Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-cyan-400">Notification Volume (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={notificationVolume}>
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
                  <Line type="monotone" dataKey="sms" stroke="#f59e0b" strokeWidth={2} name="SMS" />
                  <Line type="monotone" dataKey="email" stroke="#10b981" strokeWidth={2} name="Email" />
                  <Line type="monotone" dataKey="push" stroke="#06b6d4" strokeWidth={2} name="Push" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-cyan-400">AI-Powered Predictive Warnings</h2>
            <Dialog open={showAIConfigModal} onOpenChange={setShowAIConfigModal}>
              <DialogTrigger asChild>
                <Button className="bg-cyan-500 text-black hover:bg-cyan-400">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Configure AI Models
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-cyan-500/20 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-cyan-400">AI Model Configuration</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Prediction Accuracy Threshold</Label>
                      <Select defaultValue="75">
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="60">60%</SelectItem>
                          <SelectItem value="70">70%</SelectItem>
                          <SelectItem value="75">75%</SelectItem>
                          <SelectItem value="80">80%</SelectItem>
                          <SelectItem value="85">85%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Prediction Window</Label>
                      <Select defaultValue="24h">
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1h">1 Hour</SelectItem>
                          <SelectItem value="6h">6 Hours</SelectItem>
                          <SelectItem value="12h">12 Hours</SelectItem>
                          <SelectItem value="24h">24 Hours</SelectItem>
                          <SelectItem value="48h">48 Hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-gray-300">Enabled Prediction Models</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <span className="text-white">Battery Level Prediction</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <span className="text-white">Demand Forecasting</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <span className="text-white">Weather Impact Analysis</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <span className="text-white">Equipment Failure Prediction</span>
                        <Switch />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => setShowAIConfigModal(false)}
                      className="flex-1 bg-cyan-500 text-black hover:bg-cyan-400"
                    >
                      Save Configuration
                    </Button>
                    <Button
                      onClick={() => setShowAIConfigModal(false)}
                      variant="outline"
                      className="flex-1 bg-transparent border-gray-600 text-gray-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {predictiveWarnings.map((warning) => (
              <Card key={warning.id} className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/20 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <Badge variant="outline" className={getSeverityColor(warning.severity)}>
                          {warning.severity}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Confidence</p>
                      <p className="font-bold text-cyan-400">{warning.confidence}</p>
                    </div>
                  </div>
                  <p className="font-medium text-white mb-3">{warning.message}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Station:</span>
                      <span className="text-white">{warning.station}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Metric:</span>
                      <span className="text-white">{warning.metric}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current:</span>
                      <span className="text-cyan-400">{warning.currentValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Predicted:</span>
                      <span className="text-orange-400">{warning.predictedValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Timeframe:</span>
                      <span className="text-white">{warning.timeframe}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {warning.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Dialog open={showCreatePlanModal} onOpenChange={setShowCreatePlanModal}>
              <DialogTrigger asChild>
                <Button className="bg-cyan-500 text-black hover:bg-cyan-400">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-cyan-500/20 text-white">
                <DialogHeader>
                  <DialogTitle className="text-cyan-400">Create Action Plan</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Plan Name</Label>
                    <Input
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="e.g., Battery Maintenance Plan"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Priority</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Target Date</Label>
                    <Input type="date" className="bg-gray-800 border-gray-700 text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300">Description</Label>
                    <Textarea
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Describe the action plan..."
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => setShowCreatePlanModal(false)}
                      className="flex-1 bg-cyan-500 text-black hover:bg-cyan-400"
                    >
                      Create Plan
                    </Button>
                    <Button
                      onClick={() => setShowCreatePlanModal(false)}
                      variant="outline"
                      className="flex-1 bg-transparent border-gray-600 text-gray-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-cyan-400">Alert Rules & Configuration</h2>
            <Dialog open={showCreateRuleModal} onOpenChange={setShowCreateRuleModal}>
              <DialogTrigger asChild>
                <Button className="bg-cyan-500 text-black hover:bg-cyan-400">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-cyan-500/20 text-white">
                <DialogHeader>
                  <DialogTitle className="text-cyan-400">Create Alert Rule</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Rule Name</Label>
                    <Input
                      value={newRuleForm.name}
                      onChange={(e) => setNewRuleForm({ ...newRuleForm, name: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="e.g., High Temperature Alert"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Condition</Label>
                    <Input
                      value={newRuleForm.condition}
                      onChange={(e) => setNewRuleForm({ ...newRuleForm, condition: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="e.g., Temperature > 45°C"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Severity</Label>
                    <Select
                      value={newRuleForm.severity}
                      onValueChange={(value) => setNewRuleForm({ ...newRuleForm, severity: value })}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="Warning">Warning</SelectItem>
                        <SelectItem value="Info">Info</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Notification Channels</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {["SMS", "Email", "Push", "Slack"].map((channel) => (
                        <div key={channel} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={channel}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewRuleForm({ ...newRuleForm, channels: [...newRuleForm.channels, channel] })
                              } else {
                                setNewRuleForm({
                                  ...newRuleForm,
                                  channels: newRuleForm.channels.filter((c) => c !== channel),
                                })
                              }
                            }}
                            className="rounded"
                          />
                          <Label htmlFor={channel} className="text-sm text-gray-300">
                            {channel}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Recipients</Label>
                    <Input
                      onChange={(e) =>
                        setNewRuleForm({ ...newRuleForm, recipients: e.target.value.split(",").map((r) => r.trim()) })
                      }
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="admin@ems.lk, manager@ems.lk"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSubmitNewRule} className="flex-1 bg-cyan-500 text-black hover:bg-cyan-400">
                      Create Rule
                    </Button>
                    <Button
                      onClick={() => setShowCreateRuleModal(false)}
                      variant="outline"
                      className="flex-1 bg-transparent border-gray-600 text-gray-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {alertRules.map((rule) => (
              <Card key={rule.name} className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-white">{rule.name}</h3>
                      <p className="text-sm text-gray-400">{rule.condition}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          rule.severity === "Critical"
                            ? "bg-red-500/20 text-red-400 border-red-500/50"
                            : rule.severity === "Warning"
                              ? "bg-orange-500/20 text-orange-400 border-orange-500/50"
                              : "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                        }
                      >
                        {rule.severity}
                      </Badge>
                      <Switch checked={rule.enabled} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Notification Channels:</p>
                      <div className="flex gap-1">
                        {rule.channels.map((channel, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs text-gray-300 border-gray-600 bg-gray-800/50"
                          >
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Recipients:</p>
                      <div className="flex gap-1">
                        {rule.recipients.map((recipient, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs text-cyan-400 border-cyan-500/30 bg-cyan-500/10"
                          >
                            {recipient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Escalation:</span>
                      <span className="text-cyan-400 font-medium">{rule.escalation}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent text-gray-300 hover:text-cyan-400 hover:border-cyan-400"
                    >
                      Edit Rule
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent text-gray-300 hover:text-cyan-400 hover:border-cyan-400"
                    >
                      Test Alert
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
