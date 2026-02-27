"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Eye, Zap, BarChart3, DollarSign, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StationOverview } from "@/components/station-infrastructure/station-overview"
import { StationChargers } from "@/components/station-infrastructure/station-chargers"
import { StationEnergy } from "@/components/station-infrastructure/station-energy"
import { StationPricing } from "@/components/station-infrastructure/station-pricing"
import { StationReports } from "@/components/station-infrastructure/station-reports"

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

interface StationDetailProps {
  station: Station
  onBack: () => void
}

export function StationDetail({ station, onBack }: StationDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "chargers", label: "Chargers", icon: Zap },
    { id: "energy", label: "Energy", icon: BarChart3 },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "reports", label: "Reports", icon: FileText },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <StationOverview station={station} />
      case "chargers":
        return <StationChargers station={station} />
      case "energy":
        return <StationEnergy station={station} />
      case "pricing":
        return <StationPricing station={station} />
      case "reports":
        return <StationReports station={station} />
      default:
        return <StationOverview station={station} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-cyan-400 hover:text-cyan-300">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Stations
        </Button>
      </div>

      {/* Station Header */}
      <Card className="bg-gray-900/50 border-cyan-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{station.location} Charging Center</h1>
              <p className="text-gray-400">Station ID: {station.id}</p>
            </div>
            <div className="text-right">
              <div className="text-cyan-400 font-medium">{station.location}, Sri Lanka</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-900/30 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/20"
                  : "text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  )
}
