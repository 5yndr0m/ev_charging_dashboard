"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Sun, Battery, Grid3x3, Edit2 } from "lucide-react"
import { stationCategories, chargerPricing } from "@/lib/pricing-data"

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

interface StationPricingProps {
  station: Station
}

export function StationPricing({ station }: StationPricingProps) {
  const stationCategory = Object.values(stationCategories).find((cat) => cat.locations.includes(station.location))

  const currentRates = {
    directSolar: 25.5,
    storageSolar: 32.75,
    grid: 45.2,
  }

  const historicalData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, "0")}:00`,
    directSolar: 25.5 + Math.random() * 5 - 2.5,
    storageSolar: 32.75 + Math.random() * 8 - 4,
    grid: 45.2 + Math.random() * 10 - 5,
  }))

  const sourceDistribution = [
    { name: "Direct Solar", value: 35, color: "#10b981" },
    { name: "Storage Solar Power", value: 25, color: "#f59e0b" },
    { name: "Grid", value: 40, color: "#ef4444" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Pricing & Rates</h2>
        <Button
          className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30"
          onClick={() => {
            console.log("[v0] Navigate to Smart Pricing System for", station.location)
          }}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit Pricing
        </Button>
      </div>

      {stationCategory && (
        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Station Category</p>
                <p className="text-lg font-semibold text-cyan-400">{stationCategory.category}</p>
              </div>
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Pricing Tier Active</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Rates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900/50 border-green-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-green-400" />
              <CardTitle className="text-green-400">Direct Solar Rate</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400 mb-1">₨{currentRates.directSolar}</div>
            <div className="text-sm text-gray-400">per kWh</div>
            <div className="text-xs text-green-400 mt-2">Lowest Rate</div>
            {stationCategory && (
              <div className="mt-3 pt-3 border-t border-green-500/20 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Peak:</span>
                  <span className="text-green-400">+{stationCategory.directSolarPeak}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Off-Peak:</span>
                  <span className="text-cyan-400">{stationCategory.directSolarOffPeak}%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-orange-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Battery className="w-5 h-5 text-orange-400" />
              <CardTitle className="text-orange-400">Storage Solar Power Rate</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400 mb-1">₨{currentRates.storageSolar}</div>
            <div className="text-sm text-gray-400">per kWh</div>
            <div className="text-xs text-orange-400 mt-2">Medium Rate</div>
            {stationCategory && (
              <div className="mt-3 pt-3 border-t border-orange-500/20 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Peak:</span>
                  <span className="text-orange-400">+{stationCategory.storageSolarPeak}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Off-Peak:</span>
                  <span className="text-cyan-400">{stationCategory.storageSolarOffPeak}%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-red-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Grid3x3 className="w-5 h-5 text-red-400" />
              <CardTitle className="text-red-400">Grid Rate</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400 mb-1">₨{currentRates.grid}</div>
            <div className="text-sm text-gray-400">per kWh</div>
            <div className="text-xs text-red-400 mt-2">Peak Rate</div>
            {stationCategory && (
              <div className="mt-3 pt-3 border-t border-red-500/20 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Peak:</span>
                  <span className="text-red-400">+{stationCategory.gridPeak}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Off-Peak:</span>
                  <span className="text-cyan-400">{stationCategory.gridOffPeak}%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charger-Specific Pricing Section */}
      <Card className="bg-gray-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white">Charger Type Pricing</CardTitle>
          <p className="text-sm text-gray-400">Base rates by charger type at this station</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {chargerPricing.map((charger) => (
              <div key={charger.chargerId} className="p-4 bg-gray-800/50 rounded border border-cyan-500/20">
                <h4 className="text-white font-semibold mb-2">{charger.chargerId}</h4>
                <p className="text-xs text-gray-400 mb-3">{charger.type}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Base Rate:</span>
                    <span className="text-cyan-400">₨{charger.baseRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Peak:</span>
                    <span className="text-orange-400">{charger.peakMultiplier}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Off-Peak:</span>
                    <span className="text-green-400">{charger.offPeakMultiplier}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Min Fee:</span>
                    <span className="text-white">₨{charger.minimumSessionFee}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historical Pricing Chart */}
      <Card className="bg-gray-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white">24-Hour Pricing Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Line type="monotone" dataKey="directSolar" stroke="#10b981" strokeWidth={2} name="Direct Solar" />
                <Line
                  type="monotone"
                  dataKey="storageSolar"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Storage Solar Power"
                />
                <Line type="monotone" dataKey="grid" stroke="#ef4444" strokeWidth={2} name="Grid" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Energy Source Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white">Energy Source Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sourceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {sourceDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-400">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white">Cost Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Average Rate Today</span>
              <span className="text-cyan-400 font-medium">₨34.15/kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Peak Rate Time</span>
              <span className="text-yellow-400 font-medium">18:00 - 22:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Off-Peak Rate</span>
              <span className="text-green-400 font-medium">₨22.30/kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Monthly Savings</span>
              <span className="text-green-400 font-medium">₨45,230</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Carbon Offset</span>
              <span className="text-green-400 font-medium">2.3 tons CO₂</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
