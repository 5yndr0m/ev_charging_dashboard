import { type NextRequest, NextResponse } from "next/server"

interface EnergyAnalytics {
  totalConsumption: number
  solarGeneration: number
  batteryUsage: number
  gridConsumption: number
  efficiency: number
  carbonFootprint: number
  renewablePercentage: number
}

interface EnergyBreakdown {
  source: string
  amount: number
  percentage: number
  cost: number
  co2Impact: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "24h"
    const stationId = searchParams.get("stationId")
    const source = searchParams.get("source") // solar, battery, grid

    let filteredData = generateEnergyData(period)

    if (stationId) {
      filteredData = filteredData.filter((data: any) => data.stationId === stationId)
    }

    if (source) {
      filteredData = filteredData.filter((data: any) => data.source === source)
    }

    const analytics: EnergyAnalytics = {
      totalConsumption: 2847,
      solarGeneration: 1670,
      batteryUsage: 456,
      gridConsumption: 721,
      efficiency: 94.2,
      carbonFootprint: -901, // negative means carbon saved
      renewablePercentage: 67,
    }

    const breakdown: EnergyBreakdown[] = [
      { source: "Solar", amount: 1670, percentage: 58.6, cost: 0, co2Impact: -1234 },
      { source: "Battery", amount: 456, percentage: 16.0, cost: 45600, co2Impact: -456 },
      { source: "Grid", amount: 721, percentage: 25.4, cost: 108150, co2Impact: 789 },
    ]

    return NextResponse.json({
      success: true,
      data: {
        analytics,
        breakdown,
        hourlyData: filteredData,
        period,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error fetching energy analytics:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch energy analytics" }, { status: 500 })
  }
}

function generateEnergyData(period: string) {
  const hours = period === "24h" ? 24 : period === "7d" ? 168 : 720 // 30d
  return Array.from({ length: hours }, (_, i) => ({
    timestamp: new Date(Date.now() - (hours - i) * 60 * 60 * 1000).toISOString(),
    hour: i % 24,
    solar: Math.max(0, Math.sin(((i % 24) / 24) * Math.PI * 2 - Math.PI / 2) * 200 + Math.random() * 50),
    battery: Math.random() * 100 + 20,
    grid: Math.random() * 150 + 50,
    stationId: `S${Math.floor(Math.random() * 10) + 1}`,
    source: ["solar", "battery", "grid"][Math.floor(Math.random() * 3)],
  }))
}
