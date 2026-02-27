"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserConfigurationModal } from "@/components/admin-system/user-configuration-modal"
import { UserRegistrationModal } from "@/components/admin-system/user-registration-modal"
import {
  Shield,
  Users,
  Settings,
  Activity,
  Plus,
  Search,
  Edit,
  Eye,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

export function SystemAdmin() {
  const [activeTab, setActiveTab] = useState("users")
  const [searchTerm, setSearchTerm] = useState("")
  const [showUserConfigModal, setShowUserConfigModal] = useState(false)
  const [showUserRegistrationModal, setShowUserRegistrationModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userAccounts, setUserAccounts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showAddIntegrationModal, setShowAddIntegrationModal] = useState(false)
  const [newIntegrationForm, setNewIntegrationForm] = useState({
    name: "",
    type: "",
    endpoint: "",
    description: "",
  })

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      const result = await response.json()
      if (result.success) {
        setUserAccounts(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=all`)
      const result = await response.json()
      if (result.success) {
        setSearchResults(result.data)
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleUserConfigure = (user: any) => {
    setSelectedUser(user)
    setShowUserConfigModal(true)
  }

  const handleAddUser = () => {
    setShowUserRegistrationModal(true)
  }

  const handleAddIntegration = () => {
    setShowAddIntegrationModal(true)
  }

  const handleSubmitNewIntegration = async () => {
    try {
      const response = await fetch("/api/integrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newIntegrationForm,
          status: "Pending",
          health: 0,
          lastSync: "Never",
        }),
      })

      if (response.ok) {
        setShowAddIntegrationModal(false)
        setNewIntegrationForm({
          name: "",
          type: "",
          endpoint: "",
          description: "",
        })
        // Refresh integrations list if needed
      }
    } catch (error) {
      console.error("Failed to add integration:", error)
    }
  }

  const adminStats = [
    {
      label: "Active Users",
      value: userAccounts.filter((u) => u.status === "Active").length.toString(),
      icon: Users,
      color: "text-cyan-400",
    },
    { label: "User Roles", value: "5", icon: Shield, color: "text-green-400" },
    { label: "System Integrations", value: "12", icon: Settings, color: "text-orange-400" },
    { label: "Access Logs (24h)", value: "1,234", icon: Activity, color: "text-purple-400" },
  ]

  const userRoles = [
    {
      role: "Super Admin",
      users: userAccounts.filter((u) => u.role === "Super Admin").length,
      permissions: [
        "Full System Access",
        "User Management",
        "System Configuration",
        "Security Settings",
        "Integration Management",
      ],
      color: "text-red-400",
      description: "Complete system control and administration",
    },
    {
      role: "Station Manager",
      users: userAccounts.filter((u) => u.role === "Station Manager").length,
      permissions: ["Station Management", "Charger Control", "Local Reports", "Maintenance Scheduling"],
      color: "text-cyan-400",
      description: "Manage individual charging stations",
    },
    {
      role: "Finance",
      users: userAccounts.filter((u) => u.role === "Finance").length,
      permissions: ["Billing Management", "Revenue Reports", "Payment Processing", "Financial Analytics"],
      color: "text-green-400",
      description: "Financial operations and reporting",
    },
    {
      role: "Maintenance",
      users: userAccounts.filter((u) => u.role === "Maintenance").length,
      permissions: ["Equipment Access", "Maintenance Logs", "Fault Reporting", "Technical Reports"],
      color: "text-orange-400",
      description: "Equipment maintenance and technical support",
    },
    {
      role: "Operator",
      users: userAccounts.filter((u) => u.role === "Operator").length,
      permissions: ["Monitoring Dashboard", "Basic Reports", "Alert Acknowledgment"],
      color: "text-gray-400",
      description: "System monitoring and basic operations",
    },
  ]

  const accessLogs = [
    {
      id: "LOG001",
      user: "john.silva@ems.lk",
      action: "Updated station configuration",
      resource: "Colombo Station Settings",
      timestamp: "2024-01-20 14:30:15",
      ipAddress: "192.168.1.100",
      status: "Success",
      details: "Modified solar priority threshold to 80%",
    },
    {
      id: "LOG002",
      user: "maria.fernando@ems.lk",
      action: "Added new charger",
      resource: "Kandy Station - Charger C21",
      timestamp: "2024-01-20 09:15:42",
      ipAddress: "192.168.1.105",
      status: "Success",
      details: "Installed 50kW DC fast charger",
    },
    {
      id: "LOG003",
      user: "rajesh.kumar@ems.lk",
      action: "Generated financial report",
      resource: "Monthly Revenue Report",
      timestamp: "2024-01-19 16:45:23",
      ipAddress: "192.168.1.110",
      status: "Success",
      details: "Exported December 2023 financial summary",
    },
    {
      id: "LOG004",
      user: "unknown.user@external.com",
      action: "Failed login attempt",
      resource: "Admin Panel",
      timestamp: "2024-01-20 02:15:33",
      ipAddress: "203.94.15.67",
      status: "Failed",
      details: "Multiple failed authentication attempts",
    },
  ]

  const systemSettings = [
    {
      category: "Energy Management",
      settings: [
        {
          name: "Solar Priority Threshold",
          value: "75%",
          type: "percentage",
          description: "Minimum solar availability before switching to grid",
        },
        {
          name: "Battery Reserve Level",
          value: "20%",
          type: "percentage",
          description: "Minimum battery level to maintain",
        },
        {
          name: "Grid Fallback Delay",
          value: "30s",
          type: "time",
          description: "Delay before switching to grid power",
        },
        { name: "Peak Hours", value: "18:00-22:00", type: "timerange", description: "High demand period definition" },
      ],
    },
    {
      category: "Charging Operations",
      settings: [
        { name: "Max Session Duration", value: "4h", type: "time", description: "Maximum charging session length" },
        { name: "Idle Timeout", value: "15min", type: "time", description: "Timeout for idle connections" },
        { name: "Queue Management", value: "Enabled", type: "boolean", description: "Enable charging queue system" },
        { name: "Dynamic Pricing", value: "Enabled", type: "boolean", description: "Enable time-based pricing" },
      ],
    },
    {
      category: "System Monitoring",
      settings: [
        {
          name: "Alert Threshold - Temperature",
          value: "45°C",
          type: "temperature",
          description: "Equipment temperature alert level",
        },
        {
          name: "Alert Threshold - Load",
          value: "90%",
          type: "percentage",
          description: "System load alert threshold",
        },
        {
          name: "Maintenance Interval",
          value: "30 days",
          type: "duration",
          description: "Scheduled maintenance frequency",
        },
        { name: "Log Retention", value: "90 days", type: "duration", description: "System log retention period" },
      ],
    },
  ]

  const integrations = [
    {
      name: "Ceylon Electricity Board (CEB)",
      type: "Utility Grid",
      status: "Connected",
      lastSync: "2024-01-20 14:25:00",
      endpoint: "https://api.ceb.lk/grid-data",
      health: 98.5,
      description: "Real-time grid data and load balancing",
    },
    {
      name: "Smart Grid Management",
      type: "Grid Control",
      status: "Connected",
      lastSync: "2024-01-20 14:24:30",
      endpoint: "https://smartgrid.lk/api/v2",
      health: 97.2,
      description: "Automated load distribution and optimization",
    },
    {
      name: "EV Charge Mobile App",
      type: "Mobile Application",
      status: "Connected",
      lastSync: "2024-01-20 14:24:45",
      endpoint: "https://api.evcharge.lk/mobile",
      health: 99.1,
      description: "User mobile application integration",
    },
    {
      name: "Weather Service API",
      type: "External Data",
      status: "Connected",
      lastSync: "2024-01-20 14:20:00",
      endpoint: "https://weather.gov.lk/api",
      health: 94.8,
      description: "Weather data for solar prediction",
    },
    {
      name: "Payment Gateway - Commercial Bank",
      type: "Financial",
      status: "Connected",
      lastSync: "2024-01-20 14:24:55",
      endpoint: "https://gateway.combank.lk/payments",
      health: 99.8,
      description: "Credit card and online payment processing",
    },
    {
      name: "Fleet Management System",
      type: "Enterprise",
      status: "Maintenance",
      lastSync: "2024-01-20 12:15:00",
      endpoint: "https://fleet.enterprise.lk/api",
      health: 85.2,
      description: "Corporate fleet vehicle management",
    },
  ]

  const systemHealth = [
    { metric: "CPU Usage", value: 45, threshold: 80, status: "Good" },
    { metric: "Memory Usage", value: 62, threshold: 85, status: "Good" },
    { metric: "Disk Usage", value: 78, threshold: 90, status: "Warning" },
    { metric: "Network Latency", value: 23, threshold: 100, status: "Good" },
    { metric: "Database Performance", value: 91, threshold: 95, status: "Good" },
  ]

  const loginActivity = [
    { hour: "00:00", logins: 2, failed: 1 },
    { hour: "06:00", logins: 8, failed: 0 },
    { hour: "09:00", logins: 15, failed: 2 },
    { hour: "12:00", logins: 12, failed: 1 },
    { hour: "15:00", logins: 18, failed: 3 },
    { hour: "18:00", logins: 10, failed: 1 },
    { hour: "21:00", logins: 5, failed: 0 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">System Administration</h1>
          <p className="text-gray-400">Manage users, roles, settings, and system integrations</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users, logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 text-white w-64"
            />
            {searchTerm && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {isSearching ? (
                  <div className="p-3 text-gray-400 text-center">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((result: any, index) => (
                    <div key={index} className="p-3 hover:bg-gray-700 border-b border-gray-700 last:border-b-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {result.resultType}
                        </Badge>
                        <span className="text-white text-sm">
                          {result.resultType === "user" ? result.name : result.action}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {result.resultType === "user" ? result.email : result.resource}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-400 text-center">No results found</div>
                )}
              </div>
            )}
          </div>
          <Button className="bg-cyan-500 text-black hover:bg-cyan-400" onClick={handleAddUser}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => {
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
          <TabsTrigger value="users" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-cyan-400">
            User Management
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-cyan-400">
            Access Logs
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-cyan-400"
          >
            System Settings
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-cyan-400"
          >
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-cyan-400">User Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-gray-400">Loading users...</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userAccounts.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-start justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
                        >
                          <div className="flex items-center gap-1">
                            <div className="p-2 bg-cyan-500/20 rounded-lg">
                              <Users className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{user.name}</p>
                              <p className="text-sm text-gray-400">{user.email}</p>
                              <p className="text-xs text-gray-500">
                                {user.role} • Last login: {user.lastActivity}
                              </p>
                              <div className="flex gap-1 mt-1">
                                {user.permissions?.slice(0, 2).map((perm, idx) => (
                                  <Badge key={idx} variant="default" className="text-xs bg-cyan-700">
                                    {perm}
                                  </Badge>
                                ))}
                                {user.permissions?.length > 2 && (
                                  <Badge variant="default" className="text-xs bg-cyan-700">
                                    +{user.permissions.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" className="text-cyan-400 hover:bg-cyan-500/20">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-orange-400 hover:bg-orange-500/20">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-purple-400 hover:bg-purple-500/20"
                                onClick={() => handleUserConfigure(user)}
                              >
                                <Settings className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className={
                                  user.status === "Active"
                                    ? "text-red-400 hover:bg-red-500/20"
                                    : "text-green-400 hover:bg-green-500/20"
                                }
                              >
                                {user.status === "Active" ? (
                                  <Lock className="w-4 h-4" />
                                ) : (
                                  <Unlock className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
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
                <CardTitle className="text-cyan-400">User Roles & Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userRoles.map((role) => (
                    <div key={role.role} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <p className={`font-medium ${role.color}`}>{role.role}</p>
                        <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">
                          {role.users} users
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{role.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 2).map((perm, idx) => (
                          <Badge key={idx} variant="default" className="text-xs bg-cyan-600 ">{perm}
                          </Badge>
                        ))}
                        {role.permissions.length > 2 && (
                          <Badge variant="default" className="text-xs">
                            +{role.permissions.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Recent Access Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {accessLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-cyan-500/20 rounded-lg">
                            <Activity className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{log.action}</p>
                            <p className="text-sm text-gray-400">{log.user}</p>
                            <p className="text-xs text-gray-500">
                              {log.resource} • {log.ipAddress}
                            </p>
                            <p className="text-xs text-gray-500">{log.details}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={log.status === "Success" ? "default" : "destructive"}>{log.status}</Badge>
                          <p className="text-xs text-gray-500 mt-1">{log.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">Login Activity (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={loginActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="hour" stroke="#9ca3af" fontSize={10} />
                    <YAxis stroke="#9ca3af" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #06b6d4",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="logins" fill="#06b6d4" name="Successful" />
                    <Bar dataKey="failed" fill="#ef4444" name="Failed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {systemSettings.map((category) => (
                  <Card key={category.category} className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-cyan-400">{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {category.settings.map((setting) => (
                          <div
                            key={setting.name}
                            className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-white">{setting.name}</p>
                              <p className="text-sm text-gray-400">{setting.description}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              {setting.type === "boolean" ? (
                                <Switch checked={setting.value === "Enabled"} />
                              ) : (
                                <div className="text-right">
                                  <p className="font-medium text-cyan-400">{setting.value}</p>
                                </div>
                              )}
                              <Button size="sm" variant="ghost" className="text-orange-400 hover:bg-orange-500/20">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemHealth.map((metric) => (
                    <div key={metric.metric} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">{metric.metric}</span>
                        <span
                          className={`text-sm font-medium ${metric.status === "Good"
                            ? "text-green-400"
                            : metric.status === "Warning"
                              ? "text-orange-400"
                              : "text-red-400"
                            }`}
                        >
                          {metric.value}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${metric.status === "Good"
                            ? "bg-green-400"
                            : metric.status === "Warning"
                              ? "bg-orange-400"
                              : "bg-red-400"
                            }`}
                          style={{ width: `${metric.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-cyan-400">System Integrations</h2>
            <Dialog open={showAddIntegrationModal} onOpenChange={setShowAddIntegrationModal}>
              <DialogTrigger asChild>
                <Button className="bg-cyan-500 text-black hover:bg-cyan-400">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Integration
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-cyan-500/20 text-white">
                <DialogHeader>
                  <DialogTitle className="text-cyan-400">Add New Integration</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="integration-name" className="text-gray-300">
                      Integration Name
                    </Label>
                    <Input
                      id="integration-name"
                      value={newIntegrationForm.name}
                      onChange={(e) => setNewIntegrationForm({ ...newIntegrationForm, name: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="e.g., New Payment Gateway"
                    />
                  </div>
                  <div>
                    <Label htmlFor="integration-type" className="text-gray-300">
                      Integration Type
                    </Label>
                    <Select
                      value={newIntegrationForm.type}
                      onValueChange={(value) => setNewIntegrationForm({ ...newIntegrationForm, type: value })}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Financial">Financial</SelectItem>
                        <SelectItem value="Utility Grid">Utility Grid</SelectItem>
                        <SelectItem value="Mobile Application">Mobile Application</SelectItem>
                        <SelectItem value="External Data">External Data</SelectItem>
                        <SelectItem value="Enterprise">Enterprise</SelectItem>
                        <SelectItem value="Grid Control">Grid Control</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="endpoint" className="text-gray-300">
                      API Endpoint
                    </Label>
                    <Input
                      id="endpoint"
                      value={newIntegrationForm.endpoint}
                      onChange={(e) => setNewIntegrationForm({ ...newIntegrationForm, endpoint: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="https://api.example.com/v1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-gray-300">
                      Description
                    </Label>
                    <Input
                      id="description"
                      value={newIntegrationForm.description}
                      onChange={(e) => setNewIntegrationForm({ ...newIntegrationForm, description: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Brief description of the integration"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleSubmitNewIntegration}
                      className="flex-1 bg-cyan-500 text-black hover:bg-cyan-400"
                    >
                      Add Integration
                    </Button>
                    <Button
                      onClick={() => setShowAddIntegrationModal(false)}
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
            {integrations.map((integration) => (
              <Card key={integration.name} className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-white">{integration.name}</h3>
                      <p className="text-sm text-gray-400">{integration.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          integration.status === "Connected"
                            ? "default"
                            : integration.status === "Maintenance"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {integration.status}
                      </Badge>
                      {integration.status === "Connected" ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : integration.status === "Maintenance" ? (
                        <Clock className="w-4 h-4 text-orange-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{integration.description}</p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Health:</span>
                      <span
                        className={`font-medium ${integration.health > 95 ? "text-green-400" : integration.health > 90 ? "text-orange-400" : "text-red-400"}`}
                      >
                        {integration.health}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Sync:</span>
                      <span className="text-cyan-400 font-medium">{integration.lastSync}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Endpoint:</span>
                      <span className="text-gray-300 text-xs font-mono">{integration.endpoint}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Configure
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Test Connection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <UserConfigurationModal
        open={showUserConfigModal}
        onOpenChange={setShowUserConfigModal}
        user={selectedUser}
        onConfigurationSaved={() => {
          fetchUsers()
          setSelectedUser(null)
        }}
      />

      <UserRegistrationModal
        open={showUserRegistrationModal}
        onOpenChange={setShowUserRegistrationModal}
        onUserRegistered={() => {
          fetchUsers()
        }}
      />
    </div>
  )
}
