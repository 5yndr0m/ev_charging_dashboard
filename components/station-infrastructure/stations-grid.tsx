"use client"

import { motion, easeOut } from "framer-motion"
import { MapPin, Wifi, WifiOff, Bolt } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { stationsData } from "@/lib/data"

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

interface StationsGridProps {
  onStationSelect: (stationId: string) => void
}

function getDeterministicAvailableChargers(stationId: string, totalChargers: number): number {
  let hash = 0
  for (let i = 0; i < stationId.length; i++) {
    const char = stationId.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  const range = totalChargers - 5
  const available = Math.abs(hash % range) + 5
  return Math.min(available, totalChargers)
}

function getCategory(totalChargers: number) {
  if (totalChargers >= 35)
    return { label: "A – Major Hub", color: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300", iconColor: "text-green-400" }
  if (totalChargers >= 25)
    return { label: "B – Regional Hub", color: "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300", iconColor: "text-cyan-400" }
  if (totalChargers >= 15)
    return { label: "C – City Network", color: "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300", iconColor: "text-blue-400" }
  if (totalChargers >= 10)
    return { label: "D – Small Network", color: "bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300", iconColor: "text-orange-400" }
  return { label: "E – Micro Station", color: "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300", iconColor: "text-red-400" }
}

export function StationsGrid({ onStationSelect }: StationsGridProps) {
  // Group stations by category
  const groupedStations = stationsData.stations.reduce((acc, station) => {
    const { label } = getCategory(station.totalChargers)
    if (!acc[label]) {
      acc[label] = []
    }
    acc[label].push(station)
    return acc
  }, {} as Record<string, Station[]>)

  // Define category order
  const categoryOrder = [
    "A – Major Hub",
    "B – Regional Hub",
    "C – City Network",
    "D – Small Network",
    "E – Micro Station",
  ]

  // Animation variants for category sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
  }

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: easeOut },
    }),
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 20px rgba(0, 255, 255, 0.2)",
      transition: { ease: easeOut },
    },
  }

  return (
    <div className="space-y-10 px-4 py-8 bg-gray-950/90 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-extrabold text-white tracking-tight">
          Charging Stations
        </h2>
        <div className="text-lg font-semibold text-cyan-300 bg-cyan-500/10 px-4 py-2 rounded-full">
          {stationsData.stations.length} Stations Active
        </div>
      </div>

      {/* Category Sections */}
      {categoryOrder.map((categoryLabel) => {
        const stations = groupedStations[categoryLabel] || []
        if (stations.length === 0) return null

        return (
          <motion.div
            key={categoryLabel}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6"
          >
            {/* Category Header */}
            <div className="flex items-center gap-3">
              <Bolt className={`w-6 h-6 ${getCategory(stations[0].totalChargers).iconColor}`} />
              <h3 className={`text-2xl font-bold ${getCategory(stations[0].totalChargers).iconColor}`}>
                {categoryLabel}
              </h3>
            </div>

            {/* Stations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stations.map((station, index) => {
                const availableChargers = getDeterministicAvailableChargers(station.id, station.totalChargers)
                const category = getCategory(station.totalChargers)

                return (
                  <motion.div
                    key={station.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    whileHover="hover"
                    className="cursor-pointer"
                    onClick={() => onStationSelect(station.id)}
                  >
                    <Card className="bg-gradient-to-b from-gray-900/80 to-gray-800/80 border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 rounded-xl overflow-hidden">
                      <CardContent className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1 tracking-tight">
                              {station.location}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-300">
                              <MapPin className="w-4 h-4 text-cyan-300" />
                              <span className="text-sm">Station {station.id}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {station.internet === "Stable" ? (
                              <Wifi className="w-5 h-5 text-green-400 animate-pulse" />
                            ) : (
                              <WifiOff className="w-5 h-5 text-red-400" />
                            )}
                          </div>
                        </div>

                        {/* Category Badge */}
                        <div className="mb-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${category.color}`}>
                            {category.label}
                          </span>
                        </div>

                        {/* Charger Summary */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-cyan-300">{station.totalChargers}</div>
                            <div className="text-sm text-gray-400">Total Chargers</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-300">{availableChargers}</div>
                            <div className="text-sm text-gray-400">Available</div>
                          </div>
                        </div>

                        {/* Energy Info */}
                        <div className="space-y-3 bg-gray-800/50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Solar PV</span>
                            <span className="text-sm text-green-300 font-medium">{station.solarPV} kW</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Storage Solar PV</span>
                            <span className="text-sm text-orange-300 font-medium">{station.storagesolarpower} kWh</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Grid Capacity</span>
                            <span className="text-sm text-red-300 font-medium">{station.maxFeederCapacity} kW</span>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 pt-4 border-t border-gray-700/50">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-300">Status</span>
                            <span className={`font-medium ${station.internet === "Stable" ? "text-green-300" : "text-red-300"}`}>
                              {station.internet}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
