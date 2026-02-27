import { type NextRequest, NextResponse } from "next/server"

interface DashboardMetrics {
  totalEnergyConsumed: number
  revenueGenerated: number
  co2Saved: number
  systemEfficiency: number
  trends: {
    energyTrend: number
    revenueTrend: number
    co2Trend: number
    efficiencyTrend: number
  }
}

interface EnergyUsagePattern {
  hour: string
  solar: number
  battery: number
  grid: number
  total: number
}

interface StationPerformance {
  station: string
  efficiency: number
  utilization: number
  revenue: number
  satisfaction: number
  uptime: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30d"
    const stationId = searchParams.get("stationId")

    // Mock dashboard metrics
    const metrics: DashboardMetrics = {
      totalEnergyConsumed: 2847,
      revenueGenerated: 2400000,
      co2Saved: 1234,
      systemEfficiency: 94.2,
      trends: {
        energyTrend: 12.5,
        revenueTrend: 8.2,
        co2Trend: 15.3,
        efficiencyTrend: 2.1,
      },
    }

    // Mock energy usage patterns
    const energyUsageData: EnergyUsagePattern[] = [
      { hour: "00:00", solar: 0, battery: 45, grid: 120, total: 165 },
      { hour: "06:00", solar: 20, battery: 60, grid: 180, total: 260 },
      { hour: "12:00", solar: 180, battery: 40, grid: 80, total: 300 },
      { hour: "18:00", solar: 80, battery: 70, grid: 200, total: 350 },
      { hour: "24:00", solar: 0, battery: 50, grid: 140, total: 190 },
    ]

    // Mock station performance data
    const stationPerformance: StationPerformance[] = [
      { station: "Colombo", efficiency: 89, utilization: 92, revenue: 85, satisfaction: 88, uptime: 95 },
      { station: "Kandy", efficiency: 85, utilization: 88, revenue: 78, satisfaction: 85, uptime: 92 },
      { station: "Galle", efficiency: 92, utilization: 85, revenue: 72, satisfaction: 90, uptime: 98 },
      { station: "Negombo", efficiency: 87, utilization: 90, revenue: 80, satisfaction: 87, uptime: 94 },
    ]

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        energyUsageData,
        stationPerformance,
        period,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch dashboard analytics" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dateRange, filters, aggregation } = body

    // Mock real-time analytics calculation
    const analyticsData = {
      realTimeMetrics: {
        currentLoad: 1250,
        activeSessions: 45,
        availableChargers: 156,
        gridOffset: 23.5,
      },
      hourlyBreakdown: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        demand: Math.floor(Math.random() * 500) + 200,
        efficiency: Math.floor(Math.random() * 20) + 80,
        revenue: Math.floor(Math.random() * 50000) + 10000,
      })),
      stationComparison: [
        { station: "Colombo", sessions: 156, revenue: 45670, efficiency: 94 },
        { station: "Kandy", sessions: 142, revenue: 42340, efficiency: 92 },
        { station: "Galle", sessions: 134, revenue: 39870, efficiency: 96 },
      ],
    }

    return NextResponse.json({
      success: true,
      data: analyticsData,
      filters: filters || {},
      dateRange: dateRange || { start: new Date(), end: new Date() },
    })
  } catch (error) {
    console.error("Error generating analytics:", error)
    return NextResponse.json({ success: false, error: "Failed to generate analytics" }, { status: 500 })
  }
}
