"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sun, Battery, Zap, ArrowRight } from "lucide-react"

interface Station {
  id: string
  location: string
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

interface StationEnergyProps {
  station: Station
}

export function StationEnergy({ station }: StationEnergyProps) {
  // --- Smart energy balancing (Grid only 5–10%) ---
  const totalBase = station.solarPV + station.storagesolarpower + station.gridDraw

  // Cap grid between 5–10% for emergency supply
  const gridTarget = Math.min(totalBase * 0.10, station.gridDraw)
  const renewableAvailable = totalBase - gridTarget

  // Recommended energy split (Direct Solar 65%, Storage 25%)
  const solarGeneration = Math.min(station.solarPV, station.solarPV * 0.9); // 90–100% of capacity
  const storageUsage = +(renewableAvailable * 0.25).toFixed(1)
  const totalConsumption = +(solarGeneration + storageUsage + gridTarget).toFixed(1)

  // Percentages for UI
  const solarShare = Math.round((solarGeneration / totalConsumption) * 100)
  const storageShare = Math.round((storageUsage / totalConsumption) * 100)
  const gridShare = Math.round((gridTarget / totalConsumption) * 100)
  const renewableShare = Math.round(((solarGeneration + storageUsage) / totalConsumption) * 100)

  // Energy flow visualization
  const energyFlows = [
    {
      source: "Direct Solar PV",
      target: "Chargers",
      value: solarGeneration,
      color: "from-green-500 to-cyan-500",
      icon: Sun,
    },
    {
      source: "Storage Solar Power",
      target: "Chargers",
      value: storageUsage,
      color: "from-orange-500 to-yellow-500",
      icon: Battery,
    },
    {
      source: "Grid (Emergency)",
      target: "Chargers",
      value: gridTarget,
      color: "from-red-500 to-pink-500",
      icon: Zap,
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Energy Management</h2>

      {/* --- Energy Overview --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Direct Solar PV */}
        <Card className="bg-gray-900/50 border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Sun className="w-5 h-5" />
              Direct Solar PV Generation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400 mb-2">{solarGeneration} kW</div>
            <div className="text-sm text-gray-400">
              {(solarGeneration / station.solarPV * 100).toFixed(0)}% of capacity
            </div>
            <Progress value={(solarGeneration / station.solarPV) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        {/* Storage Solar Power */}
        <Card className="bg-gray-900/50 border-orange-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-orange-400 flex items-center gap-2">
              <Battery className="w-5 h-5" />
              Storage Solar Power
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400 mb-2">{storageUsage} kW</div>
            <div className="text-sm text-gray-400">
              {(storageUsage / station.storagesolarpower * 100).toFixed(0)}% of capacity
            </div>
            <Progress value={(storageUsage / station.storagesolarpower) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        {/* Grid (Emergency Use) */}
        <Card className="bg-gray-900/50 border-red-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-400 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Grid Draw (Emergency)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400 mb-2">{gridTarget} kW</div>
            <div className="text-sm text-gray-400">
              {(gridTarget / station.maxFeederCapacity * 100).toFixed(0)}% of capacity
            </div>
            <Progress value={(gridTarget / station.maxFeederCapacity) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* --- Energy Flow --- */}
      <Card className="bg-gray-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white">Energy Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {energyFlows.map((flow, index) => {
              const Icon = flow.icon
              return (
                <motion.div
                  key={flow.source}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex items-center gap-3 min-w-[120px]">
                    <Icon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-400">{flow.source}</span>
                  </div>

                  <div className="flex-1 relative">
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${flow.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(flow.value / totalConsumption) * 100}%` }}
                        transition={{ delay: index * 0.3, duration: 1 }}
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-cyan-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 min-w-[120px] justify-end">
                    <span className="text-sm text-gray-400">Chargers</span>
                    <span className="text-sm font-bold text-cyan-400">{flow.value} kW</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* --- Energy Distribution and Efficiency --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribution */}
        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white">Energy Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Direct Solar Contribution</span>
              <span className="text-green-400 font-medium">{solarShare}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Storage Solar Power Contribution</span>
              <span className="text-orange-400 font-medium">{storageShare}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Grid Contribution</span>
              <span className="text-red-400 font-medium">{gridShare}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Efficiency */}
        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white">Efficiency Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Grid Offset</span>
              <span className="text-cyan-400 font-medium">{station.gridOffsetPercent}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Consumption</span>
              <span className="text-white font-medium">{totalConsumption} kW</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Renewable Share</span>
              <span className="text-green-400 font-medium">{renewableShare}%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
