"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Settings, TrendingUp, Clock, Zap } from "lucide-react"
import { stationCategories, vehicleCategories, discountRules } from "@/lib/pricing-data"

export function SmartPricingSystem() {
  const [activeTab, setActiveTab] = useState("time-based")

  // Time-based pricing
  const [timePricing, setTimePricing] = useState({
    directSolar: { peak: 25.5, normal: 30, offPeak: 22 },
    storageSolar: { peak: 32.75, normal: 38, offPeak: 28 },
    grid: { peak: 45.2, normal: 35, offPeak: 40 },
  })

  // Vehicle-based pricing multipliers
  const [vehiclePricing, setVehiclePricing] = useState({
    electricCar: 1.0,
    electricVan: 1.2,
    electricBus: 1.5,
    electricTuk: 0.7,
    electricBike: 0.5,
  })

  // Demand-based surge settings
  const [surgePricing, setSurgePricing] = useState({
    utilization50to80: 1.1,
    utilizationAbove80: 1.25,
    solarHigh: 0.85,
    solarLow: 1.15,
  })

  // Solar discount settings
  const [solarDiscounts, setSolarDiscounts] = useState({
    highSolar: 20,
    mediumSolar: 12,
    lowSolar: 5,
  })

  const handleTimePricingChange = (source: keyof typeof timePricing, period: "peak" | "normal" | "offPeak", value: number) => {
    setTimePricing((prev) => ({
      ...prev,
      [source]: {
        ...prev[source],
        [period]: value,
      },
    }))
  }

  const handleVehiclePricingChange = (category: string, value: number) => {
    setVehiclePricing((prev) => ({
      ...prev,
      [category]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Smart Pricing System</h2>
        <Button className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30">
          <Settings className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-900/50 border border-cyan-500/20">
          <TabsTrigger value="time-based" className="text-xs sm:text-sm">
            <Clock className="w-4 h-4 mr-1" />
            Time-Based
          </TabsTrigger>
          <TabsTrigger value="vehicle-based" className="text-xs sm:text-sm">
            <Zap className="w-4 h-4 mr-1" />
            Vehicle-Based
          </TabsTrigger>
          <TabsTrigger value="demand-surge" className="text-xs sm:text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            Surge Pricing
          </TabsTrigger>
          <TabsTrigger value="solar-discount" className="text-xs sm:text-sm">
            Solar Discount
          </TabsTrigger>
          <TabsTrigger value="station-categories" className="text-xs sm:text-sm">
            Categories
          </TabsTrigger>
        </TabsList>

        {/* Time-Based Pricing */}
        <TabsContent value="time-based" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Direct Solar */}
            <Card className="bg-gray-900/50 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-400">Direct Solar PV Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Peak Hours (10:30 - 14:30)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={timePricing.directSolar.peak}
                    onChange={(e) => handleTimePricingChange("directSolar", "peak", Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-800 border border-green-500/30 rounded text-green-400"
                  />
                  <span className="text-xs text-gray-500">LKR/kWh</span>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Normal Hours (07:00 - 10:30 / 14:30 - 17:00)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={timePricing.directSolar.normal}
                    onChange={(e) => handleTimePricingChange("directSolar", "normal", Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-800 border border-green-500/30 rounded text-green-400"
                  />
                  <span className="text-xs text-gray-500">LKR/kWh</span>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Off-Peak Hours (17:00 - 07:00)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={timePricing.directSolar.offPeak}
                    onChange={(e) => handleTimePricingChange("directSolar", "offPeak", Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-800 border border-green-500/30 rounded text-green-400"
                  />
                  <span className="text-xs text-gray-500">LKR/kWh</span>
                </div>
              </CardContent>
            </Card>

            {/* Storage Solar */}
            <Card className="bg-gray-900/50 border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-orange-400">Storage Solar Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Peak Hours (09:00 - 17:00)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={timePricing.storageSolar.peak}
                    onChange={(e) => handleTimePricingChange("storageSolar", "peak", Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-800 border border-orange-500/30 rounded text-orange-400"
                  />
                  <span className="text-xs text-gray-500">LKR/kWh</span>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Normal Hours (22:00 - 09:00)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={timePricing.storageSolar.normal}
                    onChange={(e) => handleTimePricingChange("storageSolar", "normal", Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-800 border border-orange-500/30 rounded text-orange-400"
                  />
                  <span className="text-xs text-gray-500">LKR/kWh</span>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Off-Peak Hours (17:00 - 22:00)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={timePricing.storageSolar.offPeak}
                    onChange={(e) => handleTimePricingChange("storageSolar", "offPeak", Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-800 border border-orange-500/30 rounded text-orange-400"
                  />
                  <span className="text-xs text-gray-500">LKR/kWh</span>
                </div>
              </CardContent>
            </Card>

            {/* Grid */}
            <Card className="bg-gray-900/50 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-400">Grid Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Peak Hours (18:00 - 22:00)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={timePricing.grid.peak}
                    onChange={(e) => handleTimePricingChange("grid", "peak", Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-800 border border-red-500/30 rounded text-red-400"
                  />
                  <span className="text-xs text-gray-500">LKR/kWh</span>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Normal Hours (05:00 - 18:00)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={timePricing.grid.normal}
                    onChange={(e) => handleTimePricingChange("grid", "normal", Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-800 border border-red-500/30 rounded text-red-400"
                  />
                  <span className="text-xs text-gray-500">LKR/kWh</span>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Off-Peak Hours (22:00 - 05:00)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={timePricing.grid.offPeak}
                    onChange={(e) => handleTimePricingChange("grid", "offPeak", Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-800 border border-red-500/30 rounded text-red-400"
                  />
                  <span className="text-xs text-gray-500">LKR/kWh</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time Windows Reference */}
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">Time Windows Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-800/50 rounded border border-green-500/20">
                  <h4 className="text-green-400 font-semibold mb-2">Direct Solar PV</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>Peak: 10:30 - 14:30</li>
                    <li>Normal: 07:00 - 10:30, 14:30 - 17:00</li>
                    <li>Off-Peak: 17:00 - 07:00</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-800/50 rounded border border-orange-500/20">
                  <h4 className="text-orange-400 font-semibold mb-2">Storage Solar Power</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>Peak: 09:00 - 17:00</li>
                    <li>Normal: 22:00 - 09:00</li>
                    <li>Off-Peak: 17:00 - 22:00</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-800/50 rounded border border-red-500/20">
                  <h4 className="text-red-400 font-semibold mb-2">Grid</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>Peak: 18:00 - 22:00</li>
                    <li>Normal: 05:00 - 18:00</li>
                    <li>Off-Peak: 22:00 - 05:00</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vehicle-Based Pricing */}
        <TabsContent value="vehicle-based" className="space-y-6">
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white">Vehicle Category Pricing Multipliers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {vehicleCategories.map((category) => {
                const key = category.id.toLowerCase() as keyof typeof vehiclePricing
                const rawValue = vehiclePricing[key]
                const value = typeof rawValue === "number" ? rawValue : 1.0

                return (
                  <div key={category.id} className="p-4 bg-gray-800/50 rounded border border-cyan-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-white font-semibold">{category.name}</h4>
                        <p className="text-xs text-gray-400">
                          Battery: {category.batteryCapacity} kWh | Max Power: {category.maxChargingPower} kW
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="text-sm text-gray-400 flex-1">Price Multiplier</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="5"
                        value={value}
                        onChange={(e) => {
                          const num = parseFloat(e.target.value)
                          handleVehiclePricingChange(key, isNaN(num) ? 1.0 : num)
                        }}
                        className="w-24 px-3 py-2 bg-gray-700 border border-cyan-500/30 rounded text-cyan-400 text-right"
                      />
                      <span className="text-sm text-gray-400 w-12">
                        x {value.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Discount Rules */}
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white">Discount Rules</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(discountRules).map(([key, value]) => (
                <div key={key} className="p-4 bg-gray-800/50 rounded">
                  <p className="text-sm text-gray-400 mb-2">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                  <p className="text-2xl font-bold text-green-400">{value}%</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Demand-Based Surge Pricing */}
        <TabsContent value="demand-surge" className="space-y-6">
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white">Dynamic Surge Pricing Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-gray-800/50 rounded border border-yellow-500/20">
                <h4 className="text-yellow-400 font-semibold mb-4">Station Utilization</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Below 50% Utilization</span>
                    <span className="text-yellow-400 font-medium">x1.0 (Base)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">50-80% Utilization</span>
                    <input
                      type="number"
                      step="0.05"
                      value={surgePricing.utilization50to80}
                      onChange={(e) =>
                        setSurgePricing({ ...surgePricing, utilization50to80: Number(e.target.value) || 1 })
                      }
                      className="w-20 px-2 py-1 bg-gray-700 border border-yellow-500/30 rounded text-yellow-400 text-right"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Above 80% Utilization</span>
                    <input
                      type="number"
                      step="0.05"
                      value={surgePricing.utilizationAbove80}
                      onChange={(e) =>
                        setSurgePricing({ ...surgePricing, utilizationAbove80: Number(e.target.value) || 1 })
                      }
                      className="w-20 px-2 py-1 bg-gray-700 border border-yellow-500/30 rounded text-yellow-400 text-right"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded border border-orange-500/20">
                <h4 className="text-orange-400 font-semibold mb-4">Solar Output</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">High Output (&gt; 10kW)</span>
                    <input
                      type="number"
                      step="0.05"
                      value={surgePricing.solarHigh}
                      onChange={(e) =>
                        setSurgePricing({ ...surgePricing, solarHigh: Number(e.target.value) || 1 })
                      }
                      className="w-20 px-2 py-1 bg-gray-700 border border-orange-500/30 rounded text-orange-400 text-right"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Medium Output (5-10kW)</span>
                    <span className="text-orange-400 font-medium">x1.0 (Base)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Low Output (&lt; 5kW)</span>
                    <input
                      type="number"
                      step="0.05"
                      value={surgePricing.solarLow}
                      onChange={(e) =>
                        setSurgePricing({ ...surgePricing, solarLow: Number(e.target.value) || 1 })
                      }
                      className="w-20 px-2 py-1 bg-gray-700 border border-orange-500/30 rounded text-orange-400 text-right"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Solar-Based Discounts */}
        <TabsContent value="solar-discount" className="space-y-6">
          <Card className="bg-gray-900/50 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400">Solar Generation Discounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded">
                <h4 className="text-green-400 font-semibold mb-3">Automatic Discount Tiers</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">High Solar Generation</p>
                      <p className="text-xs text-gray-400">&gt; 10 kW output</p>
                    </div>
                    <input
                      type="number"
                      step="1"
                      value={solarDiscounts.highSolar}
                      onChange={(e) =>
                        setSolarDiscounts({ ...solarDiscounts, highSolar: Number(e.target.value) || 0 })
                      }
                      className="w-16 px-3 py-2 bg-gray-700 border border-green-500/30 rounded text-green-400 text-right"
                    />
                    <span className="text-green-400 font-medium w-8">%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Medium Solar Generation</p>
                      <p className="text-xs text-gray-400">5-10 kW output</p>
                    </div>
                    <input
                      type="number"
                      step="1"
                      value={solarDiscounts.mediumSolar}
                      onChange={(e) =>
                        setSolarDiscounts({ ...solarDiscounts, mediumSolar: Number(e.target.value) || 0 })
                      }
                      className="w-16 px-3 py-2 bg-gray-700 border border-green-500/30 rounded text-green-400 text-right"
                    />
                    <span className="text-green-400 font-medium w-8">%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Low Solar Generation</p>
                      <p className="text-xs text-gray-400">&gt; 0 kW output</p>
                    </div>
                    <input
                      type="number"
                      step="1"
                      value={solarDiscounts.lowSolar}
                      onChange={(e) =>
                        setSolarDiscounts({ ...solarDiscounts, lowSolar: Number(e.target.value) || 0 })
                      }
                      className="w-16 px-3 py-2 bg-gray-700 border border-green-500/30 rounded text-green-400 text-right"
                    />
                    <span className="text-green-400 font-medium w-8">%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Station Categories */}
        <TabsContent value="station-categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(stationCategories).map(([key, category]) => (
              <Card key={key} className="bg-gray-900/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-sm">{category.category}</CardTitle>
                  <p className="text-xs text-gray-400 mt-1">Locations: {category.locations.join(", ")}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h5 className="text-green-400 text-xs font-semibold mb-2">Direct Solar PV</h5>
                    <p className="text-xs text-gray-400">Peak: {category.directSolarPeak}% cheaper</p>
                    <p className="text-xs text-gray-400">Off-Peak: {Math.abs(category.directSolarOffPeak)}% higher</p>
                  </div>
                  <div>
                    <h5 className="text-orange-400 text-xs font-semibold mb-2">Storage Solar</h5>
                    <p className="text-xs text-gray-400">Peak: {category.storageSolarPeak}% cheaper</p>
                    <p className="text-xs text-gray-400">Off-Peak: {Math.abs(category.storageSolarOffPeak)}% higher</p>
                  </div>
                  <div>
                    <h5 className="text-red-400 text-xs font-semibold mb-2">Grid</h5>
                    <p className="text-xs text-gray-400">Peak: {category.gridPeak}% higher</p>
                    <p className="text-xs text-gray-400">Off-Peak: {Math.abs(category.gridOffPeak)}% higher</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Alert */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-400 font-semibold">Changes are not saved yet</p>
          <p className="text-xs text-blue-300">
            All pricing changes will take effect immediately after saving and will be applied to new bookings.
          </p>
        </div>
      </div>
    </div>
  )
}
