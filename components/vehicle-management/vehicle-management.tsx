"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VehicleRegistrationModal } from "@/components/vehicle-management/vehicle-registration-modal"
import { VehicleConfigurationModal } from "@/components/vehicle-management/vehicle-configuration-modal"
import { UserConfigurationModal } from "@/components/admin-system/user-configuration-modal"
import { UserRegistrationModal } from "@/components/admin-system/user-registration-modal"
import { FleetRegistrationModal } from "@/components/vehicle-management/fleet-registration-modal"
import { AuthConfigurationModal } from "@/components/admin-system/auth-configuration-modal"
import {
  Car,
  Users,
  Building,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Shield,
  Smartphone,
  Camera,
  Settings,
  CreditCard,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

import { fetchVehicles, fetchUsers, fetchFleets, fetchAuthStats } from "@/lib/api-client"

export function VehicleManagement() {
  const [activeTab, setActiveTab] = useState("vehicles")
  const [searchTerm, setSearchTerm] = useState("")
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState("all")
  const [userRoleFilter, setUserRoleFilter] = useState("all")
  const [userStatusFilter, setUserStatusFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [showVehicleConfigModal, setShowVehicleConfigModal] = useState(false)
  const [showUserConfigModal, setShowUserConfigModal] = useState(false)
  const [showUserRegistrationModal, setShowUserRegistrationModal] = useState(false)
  const [showFleetRegistrationModal, setShowFleetRegistrationModal] = useState(false)
  const [showAuthConfigModal, setShowAuthConfigModal] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [registeredVehicles, setRegisteredVehicles] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [fleets, setFleets] = useState<any[]>([])
  const [authStats, setAuthStats] = useState<any[]>([])
  const [recentAuthEvents, setRecentAuthEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const vehicleStats = [
    { label: "Registered Vehicles", value: registeredVehicles.length.toString(), icon: Car, color: "text-cyan-400" },
    { label: "Active Users", value: users.length.toString(), icon: Users, color: "text-green-400" },
    { label: "Fleet Accounts", value: fleets.length.toString(), icon: Building, color: "text-orange-400" },
    { label: "Payments", value: "3000", icon: CreditCard, color: "text-purple-400" }, // Keep mock for now
  ]

  const fetchVehiclesData = async () => {
    try {
      setIsLoading(true)
      const result = await fetchVehicles()
      if (result && Array.isArray(result)) {
        const mapped = result.map((v: any) => ({
          id: v._id,
          make: v.make,
          model: v.model,
          owner: v.ownerName || "N/A",
          licensePlate: v.plateNumber || "N/A",
          rfidCard: "N/A",
          status: "Active",
          totalSessions: 0
        }))
        setRegisteredVehicles(mapped)
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUsersData = async () => {
    try {
      const result = await fetchUsers()
      if (result && Array.isArray(result)) {
        const mapped = result.map((u: any) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone || "N/A",
          role: u.role,
          status: "Active",
          vehicles: u.vehicles?.length || 0,
          chargingSessions: 0,
          totalSpent: "LKR 0",
          paymentMethods: []
        }))
        setUsers(mapped)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const fetchFleetsData = async () => {
    try {
      const result = await fetchFleets()
      if (result && Array.isArray(result)) {
        setFleets(result)
      }
    } catch (error) {
      console.error("Error fetching fleets:", error)
    }
  }

  const loadAuthStats = async () => {
    try {
      const data = await fetchAuthStats()
      if (data) {
        setAuthStats(data.stats || [])
        setRecentAuthEvents(data.recentEvents || [])
      }
    } catch (error) {
      console.error("Error loading auth stats:", error)
    }
  }

  useEffect(() => {
    fetchVehiclesData()
    fetchUsersData()
    fetchFleetsData()
    loadAuthStats()
  }, [])

  // ... (keep filters logic unchanged)

  const filteredVehicles = registeredVehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.rfidCard.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = vehicleStatusFilter === "all" || vehicle.status === vehicleStatusFilter

    return matchesSearch && matchesStatus
  })

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter
    const matchesStatus = userStatusFilter === "all" || user.status === userStatusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleVehicleConfigure = (vehicle: any) => {
    setSelectedVehicle(vehicle)
    setShowVehicleConfigModal(true)
  }

  const handleUserConfigure = (user: any) => {
    setSelectedUser(user)
    setShowUserConfigModal(true)
  }

  const handleAddUser = () => {
    setShowUserRegistrationModal(true)
  }

  const handleAddFleet = () => {
    setShowFleetRegistrationModal(true)
  }

  const handleConfigureAuth = () => {
    setShowAuthConfigModal(true)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setVehicleStatusFilter("all")
    setUserRoleFilter("all")
    setUserStatusFilter("all")
  }

  const chargingHistory = [
    { month: "Aug", sessions: 1200, revenue: 45000 },
    { month: "Sep", sessions: 1350, revenue: 52000 },
    { month: "Oct", sessions: 1280, revenue: 48000 },
    { month: "Nov", sessions: 1520, revenue: 61000 },
    { month: "Dec", sessions: 1400, revenue: 55000 },
    { month: "Jan", sessions: 1680, revenue: 67000 },
  ]

  const vehicleTypes = [
    { name: "Sedan", value: 45, color: "#06b6d4" },
    { name: "SUV", value: 25, color: "#10b981" },
    { name: "Hatchback", value: 20, color: "#f59e0b" },
    { name: "Commercial", value: 10, color: "#8b5cf6" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">Vehicle & User Management</h1>
          <p className="text-gray-400">Manage registered vehicles, users, fleet accounts, and authentication</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search vehicles, users..."
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
          {(searchTerm || vehicleStatusFilter !== "all" || userRoleFilter !== "all" || userStatusFilter !== "all") && (
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
              {activeTab === "vehicles" && (
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Vehicle Status</label>
                  <Select value={vehicleStatusFilter} onValueChange={setVehicleStatusFilter}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {activeTab === "users" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">User Role</label>
                    <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="All Roles" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                        <SelectItem value="Station Manager">Station Manager</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Operator">Operator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">User Status</label>
                    <Select value={userStatusFilter} onValueChange={setUserStatusFilter}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vehicleStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
          <TabsTrigger
            value="vehicles"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-cyan-400"
          >
            Vehicle Registration
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-cyan-400">
            User Profiles
          </TabsTrigger>
          <TabsTrigger value="fleet" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-cyan-400">
            Fleet Management
          </TabsTrigger>
          <TabsTrigger value="auth" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-cyan-400">
            Authentication
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-cyan-400">Registered Vehicles</h2>
            <Button className="bg-cyan-500 text-black hover:bg-cyan-400" onClick={() => setShowRegistrationModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Register Vehicle
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-gray-400">Loading vehicles...</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredVehicles.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          {searchTerm || vehicleStatusFilter !== "all"
                            ? "No vehicles match your filters"
                            : "No vehicles found"}
                        </div>
                      ) : (
                        filteredVehicles.map((vehicle) => (
                          <div
                            key={vehicle.id}
                            className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-cyan-500/20 rounded-lg">
                                <Car className="w-5 h-5 text-cyan-400" />
                              </div>
                              <div>
                                <p className="font-medium text-white">
                                  {vehicle.make} {vehicle.model} ({vehicle.year})
                                </p>
                                <p className="text-sm text-gray-400">
                                  {vehicle.owner} • {vehicle.licensePlate}
                                </p>
                                <p className="text-xs text-gray-500">
                                  RFID: {vehicle.rfidCard} • Sessions: {vehicle.totalSessions}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant={vehicle.status === "Active" ? "default" : "destructive"}>
                                {vehicle.status}
                              </Badge>
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
                                  onClick={() => handleVehicleConfigure(vehicle)}
                                >
                                  <Settings className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/20">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">Vehicle Types</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={vehicleTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {vehicleTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-cyan-400">User Profiles</h2>
            <Button className="bg-cyan-500 text-black hover:bg-cyan-400" onClick={handleAddUser}>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {filteredUsers.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        {searchTerm || userRoleFilter !== "all" || userStatusFilter !== "all"
                          ? "No users match your filters"
                          : "No users found"}
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-cyan-500/20 rounded-lg">
                              <Users className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{user.name}</p>
                              <p className="text-sm text-gray-400">
                                {user.email} • {user.phone}
                              </p>
                              <p className="text-xs text-gray-500">
                                {user.vehicles} vehicles • {user.chargingSessions} sessions • {user.totalSpent}
                              </p>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {user.role}
                                </Badge>
                                <Badge variant={user.status === "Active" ? "default" : "secondary"} className="text-xs">
                                  {user.status}
                                </Badge>
                                {user.paymentMethods?.slice(0, 1).map((method, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {method}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
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
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">Charging Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chargingHistory}>
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
                    <Line type="monotone" dataKey="sessions" stroke="#06b6d4" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fleet" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-cyan-400">Fleet Management</h2>
            <Button className="bg-cyan-500 text-black hover:bg-cyan-400" onClick={handleAddFleet}>
              <Plus className="w-4 h-4 mr-2" />
              Add Fleet
            </Button>
          </div>

          <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {fleets.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No fleets registered yet.</div>
                ) : (
                  fleets.map((fleet) => (
                    <div
                      key={fleet._id || fleet.id}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                          <Building className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{fleet.company}</p>
                          <p className="text-sm text-gray-400">
                            {fleet.contact} • {fleet.email}
                          </p>
                          <p className="text-xs text-gray-500">
                            {fleet.activeVehicles}/{fleet.vehicles} active • {fleet.monthlySpend}/month • {fleet.discount}{" "}
                            discount
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={fleet.status === "Active" ? "default" : "secondary"}>{fleet.status}</Badge>
                        <Badge variant="outline">{fleet.contract}</Badge>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="text-cyan-400 hover:bg-cyan-500/20">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-orange-400 hover:bg-orange-500/20">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-cyan-400">Authentication Methods</h2>
            <Button className="bg-cyan-500 text-black hover:bg-cyan-400" onClick={handleConfigureAuth}>
              <Plus className="w-4 h-4 mr-2" />
              Configure Method
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {authStats.map((method, index) => {
              const Icon = method.icon === "Shield" ? Shield : method.icon === "Camera" ? Camera : Smartphone
              return (
                <Card key={method.method} className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-cyan-500/20 rounded-lg">
                        <Icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <h3 className="font-medium text-white">{method.method}</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Users:</span>
                        <span className="text-cyan-400 font-medium">{method.users}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Success Rate:</span>
                        <span className="text-green-400 font-medium">{method.success}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-cyan-400">Recent Authentication Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAuthEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50"
                  >
                    <div>
                      <p className="font-medium text-white">{event.user}</p>
                      <p className="text-sm text-gray-400">
                        {event.method} • {event.station}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={event.status === "Success" ? "default" : "destructive"}>{event.status}</Badge>
                      <p className="text-xs text-gray-500 mt-1">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <VehicleRegistrationModal
        open={showRegistrationModal}
        onOpenChange={setShowRegistrationModal}
        onVehicleRegistered={fetchVehiclesData}
      />

      <VehicleConfigurationModal
        open={showVehicleConfigModal}
        onOpenChange={setShowVehicleConfigModal}
        vehicle={selectedVehicle}
        onConfigurationSaved={() => {
          fetchVehiclesData()
          setSelectedVehicle(null)
        }}
      />

      <UserConfigurationModal
        open={showUserConfigModal}
        onOpenChange={setShowUserConfigModal}
        user={selectedUser}
        onConfigurationSaved={() => {
          fetchUsersData()
          setSelectedUser(null)
        }}
      />

      <UserRegistrationModal
        open={showUserRegistrationModal}
        onOpenChange={setShowUserRegistrationModal}
        onUserRegistered={() => {
          fetchUsersData()
        }}
      />

      <FleetRegistrationModal
        open={showFleetRegistrationModal}
        onOpenChange={setShowFleetRegistrationModal}
        onFleetRegistered={() => {
          // fetchFleets()
        }}
      />

      <AuthConfigurationModal
        open={showAuthConfigModal}
        onOpenChange={setShowAuthConfigModal}
        onConfigurationSaved={() => {
          console.log("[v0] Authentication configuration saved")
        }}
      />
    </div>
  )
}
