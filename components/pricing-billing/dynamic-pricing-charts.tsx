"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type PowerSource = "direct-solar" | "storage-solar" | "grid"
type VehicleType = "electric-car" | "electric-motorbike" | "electric-three-wheeler" | "other-evs"

interface PricingData {
  category: string
  locations: string[]
  vehicleTypes: {
    "electric-car": string
    "electric-motorbike": string
    "electric-three-wheeler": string
    "other-evs": string
  }
}

interface TimePeriod {
  name: string
  hours: string
  data: PricingData[]
}

const pricingData: Record<PowerSource, TimePeriod[]> = {
  "direct-solar": [
    {
      name: "Peak Hours",
      hours: "10:30 – 14:30",
      data: [
        {
          category: "A – Major Hub",
          locations: ["Colombo", "Galle"],
          vehicleTypes: {
            "electric-car": "28% cheaper",
            "electric-motorbike": "25% cheaper",
            "electric-three-wheeler": "27% cheaper",
            "other-evs": "20% cheaper",
          },
        },
        {
          category: "B – Regional Hub",
          locations: ["Negombo", "Kandy", "Matara"],
          vehicleTypes: {
            "electric-car": "30% cheaper",
            "electric-motorbike": "26% cheaper",
            "electric-three-wheeler": "28% cheaper",
            "other-evs": "22% cheaper",
          },
        },
        {
          category: "C – City Network",
          locations: ["Anuradhapura", "Jaffna"],
          vehicleTypes: {
            "electric-car": "32% cheaper",
            "electric-motorbike": "28% cheaper",
            "electric-three-wheeler": "30% cheaper",
            "other-evs": "25% cheaper",
          },
        },
        {
          category: "D – Small Network",
          locations: ["Kurunegala"],
          vehicleTypes: {
            "electric-car": "35% cheaper",
            "electric-motorbike": "30% cheaper",
            "electric-three-wheeler": "32% cheaper",
            "other-evs": "28% cheaper",
          },
        },
        {
          category: "E – Micro Station",
          locations: ["Rathnapura", "Badulla"],
          vehicleTypes: {
            "electric-car": "38% cheaper",
            "electric-motorbike": "33% cheaper",
            "electric-three-wheeler": "35% cheaper",
            "other-evs": "30% cheaper",
          },
        },
      ],
    },
    {
      name: "Normal Hours",
      hours: "07:00 – 10:30 / 14:30 – 17:00",
      data: [
        {
          category: "All Categories",
          locations: ["All Locations"],
          vehicleTypes: {
            "electric-car": "Base",
            "electric-motorbike": "Base",
            "electric-three-wheeler": "Base",
            "other-evs": "Base",
          },
        },
      ],
    },
    {
      name: "Off Peak Hours",
      hours: "17:00 – 07:00",
      data: [
        {
          category: "A – Major Hub",
          locations: ["Colombo", "Galle"],
          vehicleTypes: {
            "electric-car": "10% higher",
            "electric-motorbike": "8% higher",
            "electric-three-wheeler": "9% higher",
            "other-evs": "5% higher",
          },
        },
        {
          category: "B – Regional Hub",
          locations: ["Negombo", "Kandy", "Matara"],
          vehicleTypes: {
            "electric-car": "12% higher",
            "electric-motorbike": "10% higher",
            "electric-three-wheeler": "11% higher",
            "other-evs": "6% higher",
          },
        },
        {
          category: "C – City Network",
          locations: ["Anuradhapura", "Jaffna"],
          vehicleTypes: {
            "electric-car": "14% higher",
            "electric-motorbike": "12% higher",
            "electric-three-wheeler": "13% higher",
            "other-evs": "8% higher",
          },
        },
        {
          category: "D – Small Network",
          locations: ["Kurunegala"],
          vehicleTypes: {
            "electric-car": "15% higher",
            "electric-motorbike": "13% higher",
            "electric-three-wheeler": "14% higher",
            "other-evs": "10% higher",
          },
        },
        {
          category: "E – Micro Station",
          locations: ["Rathnapura", "Badulla"],
          vehicleTypes: {
            "electric-car": "18% higher",
            "electric-motorbike": "15% higher",
            "electric-three-wheeler": "16% higher",
            "other-evs": "12% higher",
          },
        },
      ],
    },
  ],
  "storage-solar": [
    {
      name: "Peak Hours",
      hours: "09:00 – 17:00",
      data: [
        {
          category: "A – Major Hub",
          locations: ["Colombo", "Galle"],
          vehicleTypes: {
            "electric-car": "18% cheaper",
            "electric-motorbike": "15% cheaper",
            "electric-three-wheeler": "16% cheaper",
            "other-evs": "12% cheaper",
          },
        },
        {
          category: "B – Regional Hub",
          locations: ["Negombo", "Kandy", "Matara"],
          vehicleTypes: {
            "electric-car": "20% cheaper",
            "electric-motorbike": "17% cheaper",
            "electric-three-wheeler": "18% cheaper",
            "other-evs": "14% cheaper",
          },
        },
        {
          category: "C – City Network",
          locations: ["Anuradhapura", "Jaffna"],
          vehicleTypes: {
            "electric-car": "22% cheaper",
            "electric-motorbike": "19% cheaper",
            "electric-three-wheeler": "20% cheaper",
            "other-evs": "16% cheaper",
          },
        },
        {
          category: "D – Small Network",
          locations: ["Kurunegala"],
          vehicleTypes: {
            "electric-car": "25% cheaper",
            "electric-motorbike": "22% cheaper",
            "electric-three-wheeler": "23% cheaper",
            "other-evs": "18% cheaper",
          },
        },
        {
          category: "E – Micro Station",
          locations: ["Rathnapura", "Badulla"],
          vehicleTypes: {
            "electric-car": "28% cheaper",
            "electric-motorbike": "25% cheaper",
            "electric-three-wheeler": "26% cheaper",
            "other-evs": "20% cheaper",
          },
        },
      ],
    },
    {
      name: "Off Peak Hours",
      hours: "17:00 – 22:00",
      data: [
        {
          category: "A – Major Hub",
          locations: ["Colombo", "Galle"],
          vehicleTypes: {
            "electric-car": "10% higher",
            "electric-motorbike": "8% higher",
            "electric-three-wheeler": "9% higher",
            "other-evs": "5% higher",
          },
        },
        {
          category: "B – Regional Hub",
          locations: ["Negombo", "Kandy", "Matara"],
          vehicleTypes: {
            "electric-car": "12% higher",
            "electric-motorbike": "10% higher",
            "electric-three-wheeler": "11% higher",
            "other-evs": "6% higher",
          },
        },
        {
          category: "C – City Network",
          locations: ["Anuradhapura", "Jaffna"],
          vehicleTypes: {
            "electric-car": "14% higher",
            "electric-motorbike": "12% higher",
            "electric-three-wheeler": "13% higher",
            "other-evs": "8% higher",
          },
        },
        {
          category: "D – Small Network",
          locations: ["Kurunegala"],
          vehicleTypes: {
            "electric-car": "15% higher",
            "electric-motorbike": "13% higher",
            "electric-three-wheeler": "14% higher",
            "other-evs": "10% higher",
          },
        },
        {
          category: "E – Micro Station",
          locations: ["Rathnapura", "Badulla"],
          vehicleTypes: {
            "electric-car": "18% higher",
            "electric-motorbike": "15% higher",
            "electric-three-wheeler": "16% higher",
            "other-evs": "12% higher",
          },
        },
      ],
    },
    {
      name: "Normal Hours",
      hours: "22:00 – 09:00",
      data: [
        {
          category: "All Categories",
          locations: ["All Locations"],
          vehicleTypes: {
            "electric-car": "Base",
            "electric-motorbike": "Base",
            "electric-three-wheeler": "Base",
            "other-evs": "Base",
          },
        },
      ],
    },
  ],
  grid: [
    {
      name: "Peak Hours",
      hours: "18:00 – 22:00",
      data: [
        {
          category: "A – Major Hub",
          locations: ["Colombo", "Galle"],
          vehicleTypes: {
            "electric-car": "22% higher",
            "electric-motorbike": "18% higher",
            "electric-three-wheeler": "20% higher",
            "other-evs": "12% higher",
          },
        },
        {
          category: "B – Regional Hub",
          locations: ["Negombo", "Kandy", "Matara"],
          vehicleTypes: {
            "electric-car": "25% higher",
            "electric-motorbike": "20% higher",
            "electric-three-wheeler": "22% higher",
            "other-evs": "15% higher",
          },
        },
        {
          category: "C – City Network",
          locations: ["Anuradhapura", "Jaffna"],
          vehicleTypes: {
            "electric-car": "28% higher",
            "electric-motorbike": "22% higher",
            "electric-three-wheeler": "25% higher",
            "other-evs": "18% higher",
          },
        },
        {
          category: "D – Small Network",
          locations: ["Kurunegala"],
          vehicleTypes: {
            "electric-car": "30% higher",
            "electric-motorbike": "25% higher",
            "electric-three-wheeler": "27% higher",
            "other-evs": "20% higher",
          },
        },
        {
          category: "E – Micro Station",
          locations: ["Rathnapura", "Badulla"],
          vehicleTypes: {
            "electric-car": "35% higher",
            "electric-motorbike": "28% higher",
            "electric-three-wheeler": "30% higher",
            "other-evs": "25% higher",
          },
        },
      ],
    },
    {
      name: "Off Peak Hours",
      hours: "22:00 – 05:00",
      data: [
        {
          category: "A – Major Hub",
          locations: ["Colombo", "Galle"],
          vehicleTypes: {
            "electric-car": "8% higher",
            "electric-motorbike": "6% higher",
            "electric-three-wheeler": "7% higher",
            "other-evs": "5% higher",
          },
        },
        {
          category: "B – Regional Hub",
          locations: ["Negombo", "Kandy", "Matara"],
          vehicleTypes: {
            "electric-car": "10% higher",
            "electric-motorbike": "8% higher",
            "electric-three-wheeler": "9% higher",
            "other-evs": "6% higher",
          },
        },
        {
          category: "C – City Network",
          locations: ["Anuradhapura", "Jaffna"],
          vehicleTypes: {
            "electric-car": "12% higher",
            "electric-motorbike": "10% higher",
            "electric-three-wheeler": "11% higher",
            "other-evs": "8% higher",
          },
        },
        {
          category: "D – Small Network",
          locations: ["Kurunegala"],
          vehicleTypes: {
            "electric-car": "15% higher",
            "electric-motorbike": "12% higher",
            "electric-three-wheeler": "13% higher",
            "other-evs": "10% higher",
          },
        },
        {
          category: "E – Micro Station",
          locations: ["Rathnapura", "Badulla"],
          vehicleTypes: {
            "electric-car": "18% higher",
            "electric-motorbike": "15% higher",
            "electric-three-wheeler": "16% higher",
            "other-evs": "12% higher",
          },
        },
      ],
    },
    {
      name: "Normal Hours",
      hours: "05:00 – 18:00",
      data: [
        {
          category: "All Categories",
          locations: ["All Locations"],
          vehicleTypes: {
            "electric-car": "Base",
            "electric-motorbike": "Base",
            "electric-three-wheeler": "Base",
            "other-evs": "Base",
          },
        },
      ],
    },
  ],
}

const vehicleTypeLabels: Record<VehicleType, string> = {
  "electric-car": "Electric Car",
  "electric-motorbike": "Electric Motorbike",
  "electric-three-wheeler": "Electric Three Wheeler",
  "other-evs": "Other EVs",
}

export default function DynamicPricingCharts() {
  const [activePowerSource, setActivePowerSource] = useState<PowerSource>("direct-solar")
  const [activeTimePeriod, setActiveTimePeriod] = useState(0)

  const currentTimePeriods = pricingData[activePowerSource]
  const currentData = currentTimePeriods[activeTimePeriod]

  return (
    <section className="py-6 bg-gray-900/50 border border-cyan-500/20 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="text-cyan-400">Dynamic Pricing Charts</span>
          </h2>
          <p className="text-center text-gray-400 text-lg">
            Explore our dynamic pricing based on power source, time period, and vehicle type
          </p>
        </div>

        {/* Power Source Tabs */}
        <Tabs
          defaultValue="direct-solar"
          className="mb-8"
          onValueChange={(value) => {
            setActivePowerSource(value as PowerSource)
            setActiveTimePeriod(0)
          }}
        >
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-800/50 border border-cyan-500/20">
            <TabsTrigger
              value="direct-solar"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400"
            >
              Direct Solar Power
            </TabsTrigger>
            <TabsTrigger
              value="storage-solar"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400"
            >
              Storage Solar Power
            </TabsTrigger>
            <TabsTrigger
              value="grid"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400"
            >
              Grid Power
            </TabsTrigger>
          </TabsList>

          {/* Time Period Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 mb-6">
              {currentTimePeriods.map((period, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTimePeriod(index)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTimePeriod === index
                      ? "bg-cyan-500 text-black hover:bg-cyan-400"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                >
                  {period.name}
                </button>
              ))}
            </div>

            {/* Time Period Hours Display */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-cyan-500/20">
              <p className="text-gray-300">
                <span className="font-semibold text-cyan-400">Hours:</span> {currentData.hours}
              </p>
            </div>

            {/* Pricing Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-cyan-500/30">
                    <th className="px-4 py-3 text-left text-cyan-400 font-semibold bg-gray-800/30">Station Category</th>
                    <th className="px-4 py-3 text-left text-cyan-400 font-semibold bg-gray-800/30">Locations</th>
                    {Object.entries(vehicleTypeLabels).map(([key, label]) => (
                      <th
                        key={key}
                        className="px-4 py-3 text-left text-cyan-400 font-semibold bg-gray-800/30 whitespace-nowrap"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentData.data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-cyan-500/10 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3 text-gray-200 font-medium">{row.category}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {row.locations.map((location) => (
                            <Link
                              key={location}
                              href={`/stations?city=${location}`}
                              className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition-colors text-sm font-medium cursor-pointer"
                            >
                              {location}
                            </Link>
                          ))}
                        </div>
                      </td>
                      {Object.entries(vehicleTypeLabels).map(([key]) => (
                        <td key={key} className="px-4 py-3 text-gray-400">
                          {row.vehicleTypes[key as VehicleType]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Tabs>

        {/* Key Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="border-green-500/20 bg-green-500/10">
            <CardHeader>
              <CardTitle className="text-green-400">Direct Solar Power</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Cheapest rates during peak solar hours (10:30-14:30). Base pricing during normal hours. Higher rates
                during off-peak.
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-500/20 bg-orange-500/10">
            <CardHeader>
              <CardTitle className="text-orange-400">Storage Solar Power</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Extended savings from 09:00-17:00. Best for daytime charging. Moderate premium during evening and night
                hours.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-500/20 bg-red-500/10">
            <CardHeader>
              <CardTitle className="text-red-400">Grid Power</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Premium pricing during peak demand (18:00-22:00). Moderate pricing during off-peak. Base rates during
                normal hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
