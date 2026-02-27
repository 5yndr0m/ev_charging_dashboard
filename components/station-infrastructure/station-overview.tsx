"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Battery, Sun, Grid3X3 } from "lucide-react"

interface Charger {
  id: string
  status: string
  source: string
  power: number
}

interface station {
  id: string
  location: string
  chargers: Charger[]
  totalChargers: number
  powerRating: number
  solarPV: number
  storagesolarpower: number
  maxFeederCapacity: number
  internet: string
  peakDemand: number
  gridDraw: number
  gridOffsetPercent: number
}

interface StationOverviewProps {
  station: station
}

export function StationOverview({ station }: StationOverviewProps) {
  const availableChargers = station.chargers.filter((charger) => charger.status === "Available").length
  const inUseChargers = station.chargers.filter((charger) => charger.status === "In Use").length

  const metrics = [
    {
      title: "Total Chargers",
      value: station.totalChargers,
      color: "text-green-400",
      icon: Zap,
    },
    {
      title: "Available",
      value: availableChargers,
      color: "text-cyan-400",
      icon: Zap,
    },
    {
      title: "In Use",
      value: inUseChargers,
      color: "text-yellow-400",
      icon: Zap,
    },
  ]

  const energyMetrics = [
    {
      title: "Direct Solar PV",
      value: `${station.solarPV} kW`,
      color: "text-green-400",
      icon: Sun,
    },
    {
      title: "Storage Solar Power",
      value: `${station.storagesolarpower} kWh`,
      color: "text-orange-400",
      icon: Battery,
    },
    {
      title: "Grid Draw",
      value: `${station.gridDraw} kW`,
      color: "text-red-400",
      icon: Grid3X3,
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Station Overview</h2>

      {/* Charger Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-900/50 border-cyan-500/20">
                <CardContent className="p-6 text-center">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                  <div className="text-sm text-gray-400 mb-1">{metric.title}</div>
                  <div className={`text-4xl font-bold ${metric.color}`}>{metric.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Energy Allocation */}
      <Card className="bg-gray-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white">Energy Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {energyMetrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 bg-gray-800/50 rounded-lg"
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <div className="text-sm text-gray-400 mb-1">{metric.title}</div>
                  <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white">Capacity Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Peak Demand</span>
              <span className="text-cyan-400 font-medium">{station.peakDemand} kW</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Max Feeder Capacity</span>
              <span className="text-green-400 font-medium">{station.maxFeederCapacity} kW</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Grid Offset</span>
              <span className="text-orange-400 font-medium">{station.gridOffsetPercent}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Internet Connection</span>
              <span className="text-green-400 font-medium">{station.internet}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Power Rating</span>
              <span className="text-cyan-400 font-medium">{station.powerRating} kW</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Station ID</span>
              <span className="text-white font-medium">{station.id}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
