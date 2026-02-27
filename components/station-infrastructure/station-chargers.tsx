"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Clock, AlertTriangle } from "lucide-react"

interface Charger {
  id: string
  status: string
  chargerType: string
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

interface StationChargersProps {
  station: station
}

export function StationChargers({ station }: StationChargersProps) {
  const [bookedChargers, setBookedChargers] = useState<Set<string>>(new Set())

  const chargers = station.chargers.map((charger) => ({
    ...charger,
    estimatedTime: charger.status === "In Use" ? Math.floor(Math.random() * 120) + 30 : null,
  }))

  const handleBookCharger = (chargerId: string) => {
    setBookedChargers((prev) => new Set([...prev, chargerId]))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "In Use":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Faulty":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case "Direct Solar":
        return "text-green-400"
      case "Storage Solar Power":
        return "text-orange-400"
      case "Grid":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Chargers</h2>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-400">In Use</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-400">Faulty</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {chargers.map((charger, index) => (
          <motion.div
            key={charger.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-gray-900/50 border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{charger.id}</h3>
                  <Badge className={getStatusColor(charger.status)}>{charger.status}</Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Charger</span>
                    <span className={getSourceColor(charger.chargerType)}>{charger. chargerType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Power</span>
                    <span className="text-cyan-400">{charger.power} kW</span>
                  </div>
                  {charger.estimatedTime && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Est. Available</span>
                      <span className="text-yellow-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {charger.estimatedTime}m
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {charger.status === "Available" && !bookedChargers.has(charger.id) && (
                    <Button
                      onClick={() => handleBookCharger(charger.id)}
                      className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Book Charger
                    </Button>
                  )}

                  {bookedChargers.has(charger.id) && (
                    <Button disabled className="w-full bg-green-500/20 text-green-400 border border-green-500/30">
                      Booked
                    </Button>
                  )}

                  {charger.status === "In Use" && (
                    <Button disabled className="w-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      In Use
                    </Button>
                  )}

                  {charger.status === "Faulty" && (
                    <Button disabled className="w-full bg-red-500/20 text-red-400 border border-red-500/30">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Faulty
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
