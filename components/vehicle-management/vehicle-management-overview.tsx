"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Users, Building, CreditCard, TrendingUp, Battery, Zap } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

export function VehicleManagementOverview() {
  const vehicleStats = [
    { label: "Registered Vehicles", value: "1000", icon: Car, color: "text-cyan-400", bgColor: "bg-cyan-500/20" },
    { label: "Active Users", value: "850", icon: Users, color: "text-green-400", bgColor: "bg-green-500/20" },
    { label: "Fleet Accounts", value: "100", icon: Building, color: "text-orange-400", bgColor: "bg-orange-500/20" },
    { label: "Payments", value: "3000", icon: CreditCard, color: "text-purple-400", bgColor: "bg-purple-500/20" },
  ]

  const vehicleCategoryData = [
    { name: "Electric Cars", value: 450, color: "#06b6d4", percentage: 45 },
    { name: "Vans/Bikes", value: 250, color: "#8b5cf6", percentage: 25 },
    { name: "Three Wheels", value: 200, color: "#f59e0b", percentage: 20 },
    { name: "Other Vehicles", value: 100, color: "#10b981", percentage: 10 },
  ]

  const monthlyTrend = [
    { month: "Jan", vehicles: 850, users: 720, fleets: 85 },
    { month: "Feb", vehicles: 880, users: 750, fleets: 88 },
    { month: "Mar", vehicles: 920, users: 780, fleets: 92 },
    { month: "Apr", vehicles: 950, users: 810, fleets: 95 },
    { month: "May", vehicles: 980, users: 830, fleets: 98 },
    { month: "Jun", vehicles: 1000, users: 850, fleets: 100 },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vehicleStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Category Distribution */}
        <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-cyan-400">Vehicle Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vehicleCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
            <div className="grid grid-cols-2 gap-3 mt-4">
              {vehicleCategoryData.map((category) => (
                <div key={category.name} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">{category.name}</p>
                    <p className="text-sm font-semibold text-white">{category.value} vehicles</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Growth Trend */}
        <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-cyan-400">6-Month Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrend}>
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
                <Bar dataKey="vehicles" fill="#06b6d4" name="Vehicles" />
                <Bar dataKey="users" fill="#10b981" name="Users" />
                <Bar dataKey="fleets" fill="#f59e0b" name="Fleets" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-cyan-500/20 border-cyan-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-white font-semibold">Monthly Growth</h3>
            </div>
            <p className="text-3xl font-bold text-cyan-400 mb-1">+2.5%</p>
            <p className="text-sm text-gray-400">New vehicle registrations this month</p>
          </CardContent>
        </Card>

        <Card className="bg-green-500/20 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Battery className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-white font-semibold">Active Sessions</h3>
            </div>
            <p className="text-3xl font-bold text-green-400 mb-1">234</p>
            <p className="text-sm text-gray-400">Vehicles currently charging</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-500/20 border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-white font-semibold">Energy Delivered</h3>
            </div>
            <p className="text-3xl font-bold text-orange-400 mb-1">45.2k</p>
            <p className="text-sm text-gray-400">kWh delivered this month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
