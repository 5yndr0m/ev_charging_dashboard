"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Settings, TrendingUp, Building2, DollarSign, BarChart3, Sun, Battery, Plug } from "lucide-react"
import PricingPlans from "./pricing-plans"
import DynamicPricingCharts from "./dynamic-pricing-charts"

interface BasePricing {
  electricCar: number
  electricThreeWheeler: number
  electricBike: number
  electricTruck: number
}

interface PowerSourcePricing {
  directSolar: BasePricing
  storedSolar: BasePricing
  grid: BasePricing
}

interface StationData {
  id: string
  name: string
  location: string
  category: "A" | "B" | "C" | "D" | "E"
  currentPricing: {
    directSolar: number
    storedSolar: number
    grid: number
  }
  status: "Active" | "Inactive" | "Maintenance"
}

export function SmartPricingSystemEnhanced() {
  const [activeTab, setActiveTab] = useState("overview")

  const [basePricing, setBasePricing] = useState<PowerSourcePricing>({
    directSolar: {
      electricCar: 65,
      electricThreeWheeler: 30,
      electricBike: 30,
      electricTruck: 85,
    },
    storedSolar: {
      electricCar: 85,
      electricThreeWheeler: 55,
      electricBike: 50,
      electricTruck: 100,
    },
    grid: {
      electricCar: 105,
      electricThreeWheeler: 90,
      electricBike: 70,
      electricTruck: 140,
    },
  })

  const [categoryAdjustments, setCategoryAdjustments] = useState({
    A: { peak: -28, offPeak: 10 }, // Major Hub (Colombo, Galle)
    B: { peak: -30, offPeak: 12 }, // Regional Hub (Negombo, Kandy, Matara)
    C: { peak: -32, offPeak: 14 }, // City Network (Anuradhapura, Jaffna)
    D: { peak: -35, offPeak: 15 }, // Small Network (Kurunegala)
    E: { peak: -38, offPeak: 18 }, // Micro Station (Rathnapura, Badulla)
  })

  const [stations] = useState<StationData[]>([
    {
      id: "ST001",
      name: "Colombo Central Hub",
      location: "Colombo",
      category: "A",
      currentPricing: { directSolar: 46.8, storedSolar: 61.2, grid: 115.5 },
      status: "Active",
    },
    {
      id: "ST002",
      name: "Galle Station",
      location: "Galle",
      category: "A",
      currentPricing: { directSolar: 46.8, storedSolar: 61.2, grid: 115.5 },
      status: "Active",
    },
    {
      id: "ST003",
      name: "Kandy Hub",
      location: "Kandy",
      category: "B",
      currentPricing: { directSolar: 45.5, storedSolar: 59.5, grid: 131.25 },
      status: "Active",
    },
    {
      id: "ST004",
      name: "Negombo Point",
      location: "Negombo",
      category: "B",
      currentPricing: { directSolar: 45.5, storedSolar: 59.5, grid: 131.25 },
      status: "Active",
    },
    {
      id: "ST005",
      name: "Matara Station",
      location: "Matara",
      category: "B",
      currentPricing: { directSolar: 45.5, storedSolar: 59.5, grid: 131.25 },
      status: "Active",
    },
    {
      id: "ST006",
      name: "Anuradhapura Center",
      location: "Anuradhapura",
      category: "C",
      currentPricing: { directSolar: 44.2, storedSolar: 57.8, grid: 134.4 },
      status: "Active",
    },
    {
      id: "ST007",
      name: "Jaffna Station",
      location: "Jaffna",
      category: "C",
      currentPricing: { directSolar: 44.2, storedSolar: 57.8, grid: 134.4 },
      status: "Active",
    },
    {
      id: "ST008",
      name: "Kurunegala Hub",
      location: "Kurunegala",
      category: "D",
      currentPricing: { directSolar: 42.25, storedSolar: 55.25, grid: 136.5 },
      status: "Active",
    },
    {
      id: "ST009",
      name: "Rathnapura Center",
      location: "Rathnapura",
      category: "E",
      currentPricing: { directSolar: 40.3, storedSolar: 52.7, grid: 141.75 },
      status: "Active",
    },
    {
      id: "ST010",
      name: "Badulla Station",
      location: "Badulla",
      category: "E",
      currentPricing: { directSolar: 40.3, storedSolar: 52.7, grid: 141.75 },
      status: "Active",
    },
  ])

  const [selectedStations, setSelectedStations] = useState<string[]>([])
  const [bulkPriceChange, setBulkPriceChange] = useState({
    powerSource: "all" as "all" | "directSolar" | "storedSolar" | "grid",
    changeType: "percentage" as "percentage" | "fixed",
    value: 0,
    timePeriod: "all" as "all" | "peak" | "normal" | "offPeak",
  })

  const handleBasePricingChange = (
    powerSource: keyof PowerSourcePricing,
    vehicleType: keyof BasePricing,
    value: number,
  ) => {
    setBasePricing((prev) => ({
      ...prev,
      [powerSource]: {
        ...prev[powerSource],
        [vehicleType]: value,
      },
    }))
  }

  const handleCategoryAdjustmentChange = (
    category: "A" | "B" | "C" | "D" | "E",
    period: "peak" | "offPeak",
    value: number,
  ) => {
    setCategoryAdjustments((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [period]: value,
      },
    }))
  }

  const handleStationSelection = (stationId: string) => {
    setSelectedStations((prev) =>
      prev.includes(stationId) ? prev.filter((id) => id !== stationId) : [...prev, stationId],
    )
  }

  const handleSelectAllStations = () => {
    if (selectedStations.length === stations.length) {
      setSelectedStations([])
    } else {
      setSelectedStations(stations.map((s) => s.id))
    }
  }

  const handleApplyBulkPricing = () => {
    console.log("[v0] Applying bulk pricing changes")
    console.log("[v0] Selected stations:", selectedStations)
    console.log("[v0] Power source:", bulkPriceChange.powerSource)
    console.log("[v0] Change type:", bulkPriceChange.changeType)
    console.log("[v0] Value:", bulkPriceChange.value)
    console.log("[v0] Time period:", bulkPriceChange.timePeriod)
    // In production, this would call an API to update station prices
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Smart Pricing System</h2>
          <p className="text-sm text-gray-400 mt-1">Manage dynamic pricing across all charging stations</p>
        </div>
        <Button className="bg-cyan-500 hover:bg-cyan-400 text-black">
          <Settings className="w-4 h-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-900/50 border border-cyan-500/20">
          <TabsTrigger value="overview" className="text-xs sm:text-sm text-white data-[state=active]:text-black">
            <BarChart3 className="w-4 h-4 mr-1" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="base-pricing" className="text-xs sm:text-sm text-white data-[state=active]:text-black">
            <DollarSign className="w-4 h-4 mr-1" />
            Base Pricing
          </TabsTrigger>
          <TabsTrigger value="dynamic-pricing" className="text-xs sm:text-sm text-white data-[state=active]:text-black">
            <TrendingUp className="w-4 h-4 mr-1" />
            Dynamic Pricing
          </TabsTrigger>
          <TabsTrigger value="station-categories" className="text-xs sm:text-sm text-white data-[state=active]:text-black">
            <Building2 className="w-4 h-4 mr-1" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="bulk-management" className="text-xs sm:text-sm text-white data-[state=active]:text-black">
            <Settings className="w-4 h-4 mr-1" />
            Bulk Management
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-green-500/20 border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-green-400">Direct Solar Pricing</CardTitle>
                <Sun className="w-5 h-5 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">LKR 30-85</div>
                <p className="text-xs text-gray-400 mt-1">per kWh (base rate)</p>
                <div className="mt-3 space-y-1">
                  <p className="text-xs text-green-300">Peak: 10:30 - 14:30 (cheapest)</p>
                  <p className="text-xs text-gray-400">Normal: 07:00 - 10:30, 14:30 - 17:00</p>
                  <p className="text-xs text-orange-300">Off-Peak: 17:00 - 07:00 (higher)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-500/20 border-orange-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-orange-400">Stored Solar Pricing</CardTitle>
                <Battery className="w-5 h-5 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">LKR 50-100</div>
                <p className="text-xs text-gray-400 mt-1">per kWh (base rate)</p>
                <div className="mt-3 space-y-1">
                  <p className="text-xs text-green-300">Peak: 09:00 - 17:00 (cheaper)</p>
                  <p className="text-xs text-gray-400">Normal: 22:00 - 09:00</p>
                  <p className="text-xs text-orange-300">Off-Peak: 17:00 - 22:00 (higher)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-500/20 border-red-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-red-400">Grid Power Pricing</CardTitle>
                <Plug className="w-5 h-5 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">LKR 70-140</div>
                <p className="text-xs text-gray-400 mt-1">per kWh (base rate)</p>
                <div className="mt-3 space-y-1">
                  <p className="text-xs text-red-300">Peak: 18:00 - 22:00 (highest)</p>
                  <p className="text-xs text-gray-400">Normal: 05:00 - 18:00 (base)</p>
                  <p className="text-xs text-orange-300">Off-Peak: 22:00 - 05:00 (moderate)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <PricingPlans />

          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">Pricing Strategy Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800/50 rounded border border-green-500/20">
                  <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Solar-First Strategy
                  </h4>
                  <p className="text-sm text-gray-400">
                    Incentivize charging during peak solar hours with up to 38% discounts for micro stations. Direct
                    solar offers the lowest rates when sun is strongest.
                  </p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded border border-orange-500/20">
                  <h4 className="text-orange-400 font-semibold mb-2 flex items-center gap-2">
                    <Battery className="w-4 h-4" />
                    Storage Optimization
                  </h4>
                  <p className="text-sm text-gray-400">
                    Extended savings from stored solar during daytime hours. Moderate pricing during evening as battery
                    depletes.
                  </p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded border border-red-500/20">
                  <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                    <Plug className="w-4 h-4" />
                    Grid Peak Management
                  </h4>
                  <p className="text-sm text-gray-400">
                    Higher rates during evening peak demand (18:00-22:00) to manage grid load. Encourages off-peak
                    charging.
                  </p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded border border-cyan-500/20">
                  <h4 className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Location-Based Tiers
                  </h4>
                  <p className="text-sm text-gray-400">
                    5 station categories (A-E) with varying adjustments. Major hubs have smaller discounts, micro
                    stations offer larger incentives.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Base Pricing Tab */}
        <TabsContent value="base-pricing" className="space-y-6">
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white">Base Pricing Configuration (LKR per kWh)</CardTitle>
              <p className="text-sm text-gray-400 mt-1">
                Set base rates for each vehicle type and power source. These are adjusted by time periods and station
                categories.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Direct Solar */}
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded">
                <div className="flex items-center gap-2 mb-4">
                  <Sun className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-green-400">Direct Solar PV</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400">Electric Car</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={basePricing.directSolar.electricCar}
                      onChange={(e) =>
                        handleBasePricingChange("directSolar", "electricCar", Number(e.target.value) || 0)
                      }
                      className="bg-gray-800 border-green-500/30 text-green-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Electric Three-Wheeler</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={basePricing.directSolar.electricThreeWheeler}
                      onChange={(e) =>
                        handleBasePricingChange("directSolar", "electricThreeWheeler", Number(e.target.value) || 0)
                      }
                      className="bg-gray-800 border-green-500/30 text-green-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Electric Bike/Scooter</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={basePricing.directSolar.electricBike}
                      onChange={(e) =>
                        handleBasePricingChange("directSolar", "electricBike", Number(e.target.value) || 0)
                      }
                      className="bg-gray-800 border-green-500/30 text-green-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Electric Truck/Van</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={basePricing.directSolar.electricTruck}
                      onChange={(e) =>
                        handleBasePricingChange("directSolar", "electricTruck", Number(e.target.value) || 0)
                      }
                      className="bg-gray-800 border-green-500/30 text-green-400"
                    />
                  </div>
                </div>
              </div>

              {/* Stored Solar */}
              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded">
                <div className="flex items-center gap-2 mb-4">
                  <Battery className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-semibold text-orange-400">Stored Solar (Battery)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400">Electric Car</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={basePricing.storedSolar.electricCar}
                      onChange={(e) =>
                        handleBasePricingChange("storedSolar", "electricCar", Number(e.target.value) || 0)
                      }
                      className="bg-gray-800 border-orange-500/30 text-orange-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Electric Three-Wheeler</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={basePricing.storedSolar.electricThreeWheeler}
                      onChange={(e) =>
                        handleBasePricingChange("storedSolar", "electricThreeWheeler", Number(e.target.value) || 0)
                      }
                      className="bg-gray-800 border-orange-500/30 text-orange-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Electric Bike/Scooter</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={basePricing.storedSolar.electricBike}
                      onChange={(e) =>
                        handleBasePricingChange("storedSolar", "electricBike", Number(e.target.value) || 0)
                      }
                      className="bg-gray-800 border-orange-500/30 text-orange-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Electric Truck/Van</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={basePricing.storedSolar.electricTruck}
                      onChange={(e) =>
                        handleBasePricingChange("storedSolar", "electricTruck", Number(e.target.value) || 0)
                      }
                      className="bg-gray-800 border-orange-500/30 text-orange-400"
                    />
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded">
                <div className="flex items-center gap-2 mb-4">
                  <Plug className="w-5 h-5 text-red-400" />
                  <h3 className="text-lg font-semibold text-red-400">Grid Power</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400">Electric Car</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={basePricing.grid.electricCar}
                      onChange={(e) => handleBasePricingChange("grid", "electricCar", Number(e.target.value) || 0)}
                      className="bg-gray-800 border-red-500/30 text-red-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Electric Three-Wheeler</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={basePricing.grid.electricThreeWheeler}
                      onChange={(e) =>
                        handleBasePricingChange("grid", "electricThreeWheeler", Number(e.target.value) || 0)
                      }
                      className="bg-gray-800 border-red-500/30 text-red-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Electric Bike/Scooter</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={basePricing.grid.electricBike}
                      onChange={(e) => handleBasePricingChange("grid", "electricBike", Number(e.target.value) || 0)}
                      className="bg-gray-800 border-red-500/30 text-red-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Electric Truck/Van</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={basePricing.grid.electricTruck}
                      onChange={(e) => handleBasePricingChange("grid", "electricTruck", Number(e.target.value) || 0)}
                      className="bg-gray-800 border-red-500/30 text-red-400"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dynamic Pricing Tab */}
        <TabsContent value="dynamic-pricing" className="space-y-6">
          <DynamicPricingCharts />
        </TabsContent>

        {/* Station Categories Tab */}
        <TabsContent value="station-categories" className="space-y-6">
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white">Station Category Adjustments</CardTitle>
              <p className="text-sm text-gray-400 mt-1">
                Configure percentage adjustments for each station category during peak and off-peak hours
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {(Object.keys(categoryAdjustments) as Array<"A" | "B" | "C" | "D" | "E">).map((category) => {
                const categoryNames = {
                  A: "Major Hub (Colombo, Galle)",
                  B: "Regional Hub (Negombo, Kandy, Matara)",
                  C: "City Network (Anuradhapura, Jaffna)",
                  D: "Small Network (Kurunegala)",
                  E: "Micro Station (Rathnapura, Badulla)",
                }

                return (
                  <div key={category} className="p-4 bg-gray-800/50 rounded border border-cyan-500/20">
                    <h4 className="text-white font-semibold mb-3">
                      Category {category} – {categoryNames[category]}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-400">Peak Hours Adjustment (%)</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="1"
                            value={categoryAdjustments[category].peak}
                            onChange={(e) =>
                              handleCategoryAdjustmentChange(category, "peak", Number(e.target.value) || 0)
                            }
                            className="bg-gray-700 border-green-500/30 text-green-400"
                          />
                          <span className="text-sm text-gray-400 whitespace-nowrap">
                            {categoryAdjustments[category].peak > 0 ? "higher" : "cheaper"}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-400">Off-Peak Hours Adjustment (%)</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="1"
                            value={categoryAdjustments[category].offPeak}
                            onChange={(e) =>
                              handleCategoryAdjustmentChange(category, "offPeak", Number(e.target.value) || 0)
                            }
                            className="bg-gray-700 border-orange-500/30 text-orange-400"
                          />
                          <span className="text-sm text-gray-400 whitespace-nowrap">
                            {categoryAdjustments[category].offPeak > 0 ? "higher" : "cheaper"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Management Tab */}
        <TabsContent value="bulk-management" className="space-y-6">
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-cyan-400">Bulk Station Pricing Management</CardTitle>
                  <p className="text-sm text-gray-400 mt-1">
                    Select up to 10 stations and apply pricing changes simultaneously
                  </p>
                </div>
                <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">
                  {selectedStations.length} / 10 Selected
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bulk Actions Panel */}
              <div className="p-4 bg-gray-800/50 rounded border border-cyan-500/20">
                <h4 className="text-white font-semibold mb-4">Bulk Pricing Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400">Power Source</Label>
                    <select
                      value={bulkPriceChange.powerSource}
                      onChange={(e) =>
                        setBulkPriceChange({
                          ...bulkPriceChange,
                          powerSource: e.target.value as typeof bulkPriceChange.powerSource,
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-cyan-500/30 rounded text-white"
                    >
                      <option value="all">All Power Sources</option>
                      <option value="directSolar">Direct Solar Only</option>
                      <option value="storedSolar">Stored Solar Only</option>
                      <option value="grid">Grid Power Only</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Change Type</Label>
                    <select
                      value={bulkPriceChange.changeType}
                      onChange={(e) =>
                        setBulkPriceChange({
                          ...bulkPriceChange,
                          changeType: e.target.value as "percentage" | "fixed",
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-cyan-500/30 rounded text-white"
                    >
                      <option value="percentage">Percentage Change</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">
                      {bulkPriceChange.changeType === "percentage" ? "Percentage (%)" : "Amount (LKR)"}
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={bulkPriceChange.value}
                      onChange={(e) => setBulkPriceChange({ ...bulkPriceChange, value: Number(e.target.value) || 0 })}
                      className="bg-gray-700 border-cyan-500/30 text-cyan-400"
                      placeholder={bulkPriceChange.changeType === "percentage" ? "+10 or -5" : "25.50"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Time Period</Label>
                    <select
                      value={bulkPriceChange.timePeriod}
                      onChange={(e) =>
                        setBulkPriceChange({
                          ...bulkPriceChange,
                          timePeriod: e.target.value as typeof bulkPriceChange.timePeriod,
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-cyan-500/30 rounded text-white"
                    >
                      <option value="all">All Time Periods</option>
                      <option value="peak">Peak Hours Only</option>
                      <option value="normal">Normal Hours Only</option>
                      <option value="offPeak">Off-Peak Hours Only</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={handleApplyBulkPricing}
                    disabled={selectedStations.length === 0 || selectedStations.length > 10}
                    className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply to {selectedStations.length} Station{selectedStations.length !== 1 ? "s" : ""}
                  </Button>
                  <Button
                    onClick={() => setSelectedStations([])}
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                  >
                    Clear Selection
                  </Button>
                </div>
                {selectedStations.length > 10 && (
                  <p className="text-sm text-red-400 mt-2">Maximum 10 stations can be selected at once</p>
                )}
              </div>

              {/* Station Selection Grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-semibold">Select Stations (Max 10)</h4>
                  <Button
                    onClick={handleSelectAllStations}
                    variant="outline"
                    size="sm"
                    className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
                    disabled={stations.length > 10}
                  >
                    {selectedStations.length === stations.length ? "Deselect All" : "Select All"}
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stations.map((station) => (
                    <div
                      key={station.id}
                      className={`p-4 rounded border transition-all cursor-pointer ${selectedStations.includes(station.id)
                        ? "bg-cyan-500/20 border-cyan-500/50"
                        : "bg-gray-800/50 border-gray-700/50 hover:border-cyan-500/30"
                        } ${selectedStations.length >= 10 && !selectedStations.includes(station.id) ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => {
                        if (selectedStations.length < 10 || selectedStations.includes(station.id)) {
                          handleStationSelection(station.id)
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Checkbox
                            checked={selectedStations.includes(station.id)}
                            onCheckedChange={() => {
                              if (selectedStations.length < 10 || selectedStations.includes(station.id)) {
                                handleStationSelection(station.id)
                              }
                            }}
                            disabled={selectedStations.length >= 10 && !selectedStations.includes(station.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h5 className="text-white font-medium">{station.name}</h5>
                              <Badge variant="outline" className="text-xs text-gray-400">
                                Cat {station.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400">{station.location}</p>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              <div>
                                <span className="text-xs text-green-400">Solar</span>
                                <p className="text-xs font-semibold text-white">
                                  {station.currentPricing.directSolar} LKR
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-orange-400">Storage</span>
                                <p className="text-xs font-semibold text-white">
                                  {station.currentPricing.storedSolar} LKR
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-red-400">Grid</span>
                                <p className="text-xs font-semibold text-white">{station.currentPricing.grid} LKR</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={station.status === "Active" ? "default" : "secondary"}
                          className="bg-green-500/20 text-green-400 border-green-500/30"
                        >
                          {station.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Alert */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-400 font-semibold">Pricing changes require confirmation</p>
          <p className="text-xs text-blue-300">
            All pricing modifications will take effect immediately after saving and will apply to new charging sessions.
            Existing sessions will continue at their original rates.
          </p>
        </div>
      </div>
    </div>
  )
}
