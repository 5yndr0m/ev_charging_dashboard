"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Car, Bike, Bus, Eye, Edit, Plus } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

export function VehicleCategorySection() {
  const [activeCategory, setActiveCategory] = useState("overview")

  // Category overview data
  const categoryStats = [
    { name: "Electric Cars", count: 450, percentage: 45, color: "#06b6d4", icon: Car },
    { name: "Vans/Bikes", count: 250, percentage: 25, color: "#8b5cf6", icon: Bike },
    { name: "Three Wheels", count: 200, percentage: 20, color: "#f59e0b", icon: Bus },
    { name: "Other Vehicles", count: 100, percentage: 10, color: "#10b981", icon: Car },
  ]

  // Electric Cars data
  const electricCars = [
    {
      id: "EV001",
      make: "Tesla",
      model: "Model 3",
      plate: "CAA-1234",
      owner: "John Silva",
      status: "Active",
      sessions: 45,
    },
    {
      id: "EV002",
      make: "Nissan",
      model: "Leaf",
      plate: "CAB-5678",
      owner: "Maria Fernando",
      status: "Active",
      sessions: 38,
    },
    {
      id: "EV003",
      make: "BYD",
      model: "Dolphin",
      plate: "CAC-9012",
      owner: "Kumar Perera",
      status: "Active",
      sessions: 32,
    },
    {
      id: "EV004",
      make: "MG",
      model: "ZS EV",
      plate: "CAD-3456",
      owner: "Priya Mendis",
      status: "Active",
      sessions: 28,
    },
  ]

  // Vans/Bikes data
  const vansBikes = [
    {
      id: "VB001",
      make: "Nissan",
      model: "e-NV200",
      plate: "VAN-1234",
      owner: "Express Delivery",
      status: "Active",
      sessions: 52,
    },
    {
      id: "VB002",
      make: "Zero",
      model: "SR/F",
      plate: "BIK-5678",
      owner: "Courier Services",
      status: "Active",
      sessions: 41,
    },
    {
      id: "VB003",
      make: "Energica",
      model: "Eva",
      plate: "BIK-9012",
      owner: "Food Delivery Co",
      status: "Active",
      sessions: 35,
    },
  ]

  // Three Wheels data
  const threeWheels = [
    {
      id: "TW001",
      make: "Bajaj",
      model: "RE Electric",
      plate: "TUK-1234",
      owner: "City Taxi",
      status: "Active",
      sessions: 67,
    },
    {
      id: "TW002",
      make: "Mahindra",
      model: "Treo",
      plate: "TUK-5678",
      owner: "Green Transport",
      status: "Active",
      sessions: 58,
    },
    {
      id: "TW003",
      make: "Piaggio",
      model: "Ape E-City",
      plate: "TUK-9012",
      owner: "Local Rides",
      status: "Active",
      sessions: 49,
    },
  ]

  // Other Vehicles data
  const otherVehicles = [
    {
      id: "OT001",
      make: "BYD",
      model: "eBus",
      plate: "BUS-1234",
      owner: "City Transport",
      status: "Active",
      sessions: 23,
    },
    {
      id: "OT002",
      make: "Volvo",
      model: "7900 Electric",
      plate: "BUS-5678",
      owner: "Metro Services",
      status: "Active",
      sessions: 19,
    },
  ]

  const getCategoryVehicles = (category: string) => {
    switch (category) {
      case "electric-cars":
        return electricCars
      case "vans-bikes":
        return vansBikes
      case "three-wheels":
        return threeWheels
      case "other-vehicles":
        return otherVehicles
      default:
        return []
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800/50">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="electric-cars"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400"
          >
            Electric Cars
          </TabsTrigger>
          <TabsTrigger
            value="vans-bikes"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400"
          >
            Vans/Bikes
          </TabsTrigger>
          <TabsTrigger
            value="three-wheels"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400"
          >
            Three Wheels
          </TabsTrigger>
          <TabsTrigger
            value="other-vehicles"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400"
          >
            Other Vehicles
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryStats.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.name} className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${category.color}20` }}>
                        <Icon className="w-5 h-5" style={{ color: category.color }} />
                      </div>
                      <h3 className="text-white font-semibold text-sm">{category.name}</h3>
                    </div>
                    <p className="text-3xl font-bold mb-1" style={{ color: category.color }}>
                      {category.count}
                    </p>
                    <p className="text-sm text-gray-400">{category.percentage}% of total fleet</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {categoryStats.map((entry, index) => (
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
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400">Vehicles by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" angle={-15} textAnchor="end" height={80} />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #06b6d4",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Category Detail Tabs */}
        {["electric-cars", "vans-bikes", "three-wheels", "other-vehicles"].map((category) => (
          <TabsContent key={category} value={category} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-cyan-400">
                {category === "electric-cars" && "Electric Cars"}
                {category === "vans-bikes" && "Vans & Bikes"}
                {category === "three-wheels" && "Three Wheels"}
                {category === "other-vehicles" && "Other Vehicles"}
              </h2>
              <Button className="bg-cyan-500 text-black hover:bg-cyan-400">
                <Plus className="w-4 h-4 mr-2" />
                Register Vehicle
              </Button>
            </div>

            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {getCategoryVehicles(category).map((vehicle) => (
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
                            {vehicle.make} {vehicle.model}
                          </p>
                          <p className="text-sm text-gray-400">
                            {vehicle.owner} • {vehicle.plate}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {vehicle.id} • Sessions: {vehicle.sessions}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={vehicle.status === "Active" ? "default" : "secondary"}>{vehicle.status}</Badge>
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
