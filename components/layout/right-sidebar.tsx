"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Bell, ChevronDown, Search, Filter, X, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface RightSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function RightSidebar({ isOpen, onToggle }: RightSidebarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedLocation, setSelectedLocation] = useState("Colombo, Sri Lanka")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const locations = ["Colombo, Sri Lanka", "Kandy, Sri Lanka", "Galle, Sri Lanka", "Negombo, Sri Lanka"]

  const alerts = [
    { type: "success", message: "Battery Charging", detail: "Solar panels active" },
    { type: "warning", message: "High Demand", detail: "Peak usage detected" },
    { type: "error", message: "Grid Overload", detail: "Switching to battery" },
  ]

  const filterOptions = ["All Stations", "Active Only", "Maintenance", "Offline", "High Usage", "Low Usage"]

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={onToggle}
        variant="ghost"
        size="sm"
        className="fixed top-4 right-4 z-50 bg-gray-800/80 hover:bg-gray-700/80 text-cyan-400 border border-cyan-500/20"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </Button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            {/* Sidebar Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-sm border-l border-cyan-500/20 z-40 overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Control Panel</h2>
                  <Button onClick={onToggle} variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Location Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cyan-400">Location</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-gray-800 border-cyan-500/20 text-white hover:bg-gray-700"
                      >
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
                          {selectedLocation}
                        </div>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full bg-gray-800 border-cyan-500/20">
                      {locations.map((location) => (
                        <DropdownMenuItem
                          key={location}
                          onClick={() => setSelectedLocation(location)}
                          className="text-white hover:bg-cyan-500/20"
                        >
                          {location}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Digital Clock */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cyan-400">Current Time</label>
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-mono text-cyan-400 font-bold">
                      {currentTime.toLocaleTimeString("en-US", {
                        hour12: true,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </div>
                    <div className="text-sm text-gray-400">{currentTime.toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cyan-400">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search stations, vehicles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-gray-800 border-cyan-500/20 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Filter Options */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cyan-400">Filter</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-gray-800 border-cyan-500/20 text-white hover:bg-gray-700"
                      >
                        <div className="flex items-center">
                          <Filter className="w-4 h-4 mr-2 text-cyan-400" />
                          All Stations
                        </div>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full bg-gray-800 border-cyan-500/20">
                      {filterOptions.map((option) => (
                        <DropdownMenuItem key={option} className="text-white hover:bg-cyan-500/20">
                          {option}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* System Alerts */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-400" />
                    <label className="text-sm font-medium text-cyan-400">System Alerts</label>
                  </div>
                  <div className="space-y-2">
                    {alerts.map((alert, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "p-3 rounded-lg text-sm",
                          alert.type === "success" && "bg-green-500/20 text-green-400 border border-green-500/20",
                          alert.type === "warning" && "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20",
                          alert.type === "error" && "bg-red-500/20 text-red-400 border border-red-500/20",
                        )}
                      >
                        <div className="font-medium">{alert.message}</div>
                        <div className="text-xs opacity-80">{alert.detail}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}
