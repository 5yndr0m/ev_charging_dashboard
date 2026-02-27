"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Zap, BarChart3, MapPin, Battery, Sun, DollarSign } from "lucide-react"
import ChargingTypesGrid from "./charging-types-grid"


const chargerTypes = {
  "FC-SP": {
    name: "Fast Charger – Single Port",
    powerRange: "30–75 kW",
    basePrice: "LKR 45/kWh",
    color: "from-orange-500 to-red-500",
  },
  "FC-DP": {
    name: "Fast Charger – Dual Port",
    powerRange: "60 kW",
    basePrice: "LKR 50/kWh",
    color: "from-green-500 to-emerald-500",
  },
  "L2-HC": {
    name: "Level 2 – Home/Commercial",
    powerRange: "6.6–22 kW",
    basePrice: "LKR 30/kWh",
    color: "from-blue-500 to-cyan-500",
  },
  "L2-3P": {
    name: "Level 2 – 3 Phase",
    powerRange: "Up to 22 kW",
    basePrice: "LKR 35/kWh",
    color: "from-purple-500 to-pink-500",
  },
}

interface Charger {
  id: string
  status: string
  chargerType: string
  power: number
}

import { fetchStations } from "@/lib/api-client"
import { useEffect } from "react"

export function StationChargerManagement() {
  const [activeTab, setActiveTab] = useState("overview")
  const [stations, setStations] = useState<any[]>([])

  useEffect(() => {
    const loadStations = async () => {
      const data = await fetchStations()
      if (Array.isArray(data)) {
        setStations(data)
      }
    }
    loadStations()
  }, [])


  const calculateChargerStats = () => {
    const stats = {
      "FC-SP": 0,
      "FC-DP": 0,
      "L2-HC": 0,
      "L2-3P": 0,
      total: 0,
    }

    stations.forEach((station) => {
      station.chargers.forEach((charger: Charger) => {
        const type = charger.chargerType as keyof typeof stats
        if (type in stats) stats[type]++
        stats.total++
      })
    })

    return stats
  }

  const getChargersByLocation = () => {
    return stations.map((station) => {
      const counts = {
        "FC-SP": 0,
        "FC-DP": 0,
        "L2-HC": 0,
        "L2-3P": 0,
      }

      station.chargers.forEach((charger: Charger) => {
        const type = charger.chargerType as keyof typeof counts
        if (type in counts) counts[type]++
      })

      return {
        location: station.location,
        ...counts,
        total: station.totalChargers,
        solarPV: station.solarPV,
        storagesolarpower: station.storagesolarpower,
        peakDemand: station.peakDemand,
        gridOffsetPercent: station.gridOffsetPercent,
      }
    })
  }

  const calculateNetworkStats = () => {
    let totalPower = 0
    let totalSolarPV = 0
    let totalStorage = 0
    let totalPeakDemand = 0
    let totalGridDraw = 0
    let totalRenewableSupplied = 0
    let inUse = 0
    let available = 0

    stations.forEach((station) => {
      totalPower += station.powerRating
      totalSolarPV += station.solarPV
      totalStorage += station.storagesolarpower
      totalPeakDemand += station.peakDemand
      totalGridDraw += station.gridDraw
      const renewableSupplied = (station.solarPV * station.gridOffsetPercent) / 100
      totalRenewableSupplied += renewableSupplied

      station.chargers.forEach((charger: Charger) => {
        if (charger.status === "In Use") inUse++
        if (charger.status === "Available") available++
      })
    })

    const avgGridOffset = stations.reduce((sum, s) => sum + s.gridOffsetPercent, 0) / stations.length

    return {
      totalPower,
      totalSolarPV,
      totalStorage,
      totalPeakDemand,
      totalGridDraw,
      totalRenewableSupplied,
      avgGridOffset,
      inUse,
      available,
    }
  }

  const chargerStats = calculateChargerStats()
  const networkStats = calculateNetworkStats()
  const locationBreakdown = getChargersByLocation()

  return (
    <div className="min-h-screen bg-black p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Charger Management</h2>
          <p className="text-sm text-gray-300 mt-1">Manage charging infrastructure across all stations</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-cyan-500/20">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-white text-gray-300"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>

          <TabsTrigger
            value="types"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-white text-gray-300"
          >
            <Zap className="w-4 h-4 mr-2" />
            Charging Types
          </TabsTrigger>

          <TabsTrigger
            value="locations"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-white text-gray-300"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Location Breakdown
          </TabsTrigger>

          <TabsTrigger
            value="management"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-white text-gray-300"
          >
            <Settings className="w-4 h-4 mr-2" />
            Charger Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400">Total Stations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stations.length}</div>
                <p className="text-xs text-gray-500 mt-1">Active locations</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400">Total Chargers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{chargerStats.total}</div>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 text-xs">
                    {networkStats.available} Available
                  </Badge>
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 text-xs">
                    {networkStats.inUse} In Use
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-emerald-400 flex items-center gap-1">
                  <Sun className="w-4 h-4" /> Total Solar PV
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{networkStats.totalSolarPV} kW</div>
                <p className="text-xs text-gray-500 mt-1">Renewable capacity</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-purple-400 flex items-center gap-1">
                  <Battery className="w-4 h-4" /> Total Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{networkStats.totalStorage} kWh</div>
                <p className="text-xs text-gray-500 mt-1">Battery capacity</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400">Total Grid Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-400">{networkStats.totalGridDraw} kW</div>
                <p className="text-xs text-gray-500 mt-1">Current draw from grid</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-emerald-400">Renewable Energy Supplied</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{networkStats.totalRenewableSupplied.toFixed(1)} kW</div>
                <p className="text-xs text-gray-500 mt-1">Supplied to grid</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400">Peak Demand</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-400">{networkStats.totalPeakDemand} kW</div>
                <p className="text-xs text-gray-500 mt-1">Maximum load</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-gray-900/50 border-cyan-500/20 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white">Power Types & Charging Ranges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(chargerTypes).map(([type, info]) => (
                    <div
                      key={type}
                      className="p-4 bg-black rounded-lg border-2 border-cyan-500/20 hover:border-cyan-400 transition-all"
                    >
                      <h4 className="font-semibold text-white mb-2">{type}</h4>
                      <p className="text-sm text-gray-300 mb-3">{info.name}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-cyan-400">Power Range:</span>
                          <span className="text-sm font-semibold text-emerald-400">{info.powerRange}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-purple-400">Total Units:</span>
                          <span className="text-lg font-bold text-white">
                            {chargerStats[type as keyof typeof chargerStats]}
                          </span>
                        </div>
                        <Badge
                          className={`w-full justify-center mt-2 bg-gradient-to-r ${info.color} text-white border-0`}
                        >
                          {info.basePrice}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Charger Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(chargerTypes).map(([type, info]) => {
                    const count = chargerStats[type as keyof typeof chargerStats]
                    const percentage = chargerStats.total > 0 ? ((count / chargerStats.total) * 100).toFixed(1) : "0.0"
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">{info.name}</span>
                          <span className="text-sm font-semibold text-white">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${info.color}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="types" className="space-y-6">
          <ChargingTypesGrid />

          <Card className="bg-black border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-cyan-400" />
                Pricing Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(chargerTypes).map(([type, info]) => (
                  <div
                    key={type}
                    className="p-4 bg-black rounded-lg border-2 border-cyan-500/20 hover:border-cyan-400 transition-all"
                  >
                    <h4 className="font-semibold text-white mb-2">{type}</h4>
                    <p className="text-sm text-gray-300 mb-3">{info.name}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-cyan-400">Power Range:</span>
                        <span className="text-sm font-semibold text-emerald-400">{info.powerRange}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-purple-400">Base Price:</span>
                        <span className="text-sm font-semibold text-pink-400">{info.basePrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Total Units:</span>
                        <span className="text-sm font-semibold text-white">
                          {chargerStats[type as keyof typeof chargerStats]}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {locationBreakdown.map((location) => (
              <Card key={location.location} className="bg-gray-900/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                    {location.location}
                  </CardTitle>
                  <p className="text-sm text-gray-300">
                    Total Chargers: <span className="text-cyan-400 font-bold">{location.total}</span>
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(location).map(([key, value]) => {
                      if (key === "location" || key === "total") return null
                      if (
                        key === "solarPV" ||
                        key === "storagesolarpower" ||
                        key === "peakDemand" ||
                        key === "gridOffsetPercent"
                      )
                        return null

                      return (
                        <div key={key} className="bg-black/50 p-3 rounded-lg border border-gray-800">
                          <p className="text-xs text-gray-400">{key}</p>
                          <p className="text-lg font-bold text-cyan-400">{value}</p>
                        </div>
                      )
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-800">
                    <div className="space-y-1">
                      <p className="text-xs text-emerald-400 flex items-center gap-1">
                        <Sun className="w-3 h-3" /> Solar PV
                      </p>
                      <p className="text-sm font-bold text-white">{location.solarPV} kW</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-purple-400 flex items-center gap-1">
                        <Battery className="w-3 h-3" /> Storage
                      </p>
                      <p className="text-sm font-bold text-white">{location.storagesolarpower} kWh</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-orange-400">Peak Demand</p>
                      <p className="text-sm font-bold text-white">{location.peakDemand} kW</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-cyan-400">Grid Offset</p>
                      <p className="text-sm font-bold text-white">{location.gridOffsetPercent}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <div className="space-y-6">
            {stations.map((station) => {
              const inUseChargers = station.chargers.filter((c: Charger) => c.status === "In Use").length
              const availableChargers = station.chargers.filter((c: Charger) => c.status === "Available").length

              return (
                <Card key={station._id || station.id} className="bg-gray-900/50 border-cyan-500/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white text-xl flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-cyan-400" />
                          {station.location}
                        </CardTitle>
                        <p className="text-sm text-gray-400 mt-1">Station ID: {station._id || station.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                          {availableChargers} Available
                        </Badge>
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50">
                          {inUseChargers} In Use
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                        <p className="text-xs text-gray-400">Total Chargers</p>
                        <p className="text-2xl font-bold text-cyan-400">{station.totalChargers}</p>
                      </div>
                      <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                        <p className="text-xs text-gray-400">Power Rating</p>
                        <p className="text-2xl font-bold text-purple-400">{station.powerRating} kW</p>
                      </div>
                      <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                        <p className="text-xs text-emerald-400 flex items-center gap-1">
                          <Sun className="w-3 h-3" /> Solar PV
                        </p>
                        <p className="text-2xl font-bold text-white">{station.solarPV} kW</p>
                      </div>
                      <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                        <p className="text-xs text-purple-400 flex items-center gap-1">
                          <Battery className="w-3 h-3" /> Storage
                        </p>
                        <p className="text-2xl font-bold text-white">{station.storagesolarpower} kWh</p>
                      </div>
                      <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                        <p className="text-xs text-orange-400">Peak Demand</p>
                        <p className="text-2xl font-bold text-white">{station.peakDemand} kW</p>
                      </div>
                      <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                        <p className="text-xs text-cyan-400">Grid Offset</p>
                        <p className="text-2xl font-bold text-emerald-400">{station.gridOffsetPercent}%</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <p className="text-sm text-gray-400 mb-2">Charger Distribution:</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(
                          station.chargers.reduce((acc: Record<string, number>, charger: Charger) => {
                            acc[charger.chargerType] = (acc[charger.chargerType] || 0) + 1
                            return acc
                          }, {}),
                        ).map(([type, count]) => (
                          <Badge key={type} className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                            {type}: {count as number}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
