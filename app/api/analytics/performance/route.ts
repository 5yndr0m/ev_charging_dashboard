import { type NextRequest, NextResponse } from "next/server"

interface PerformanceMetrics {
  systemUptime: number
  averageUtilization: number
  sessionSuccessRate: number
  averageSessionDuration: number
  chargerEfficiency: number
  customerSatisfaction: number
}

interface ChargerPerformance {
  chargerId: string
  stationId: string
  location: string
  uptime: number
  utilization: number
  sessions: number
  revenue: number
  efficiency: number
  lastMaintenance: string
  nextMaintenance: string
  status: "operational" | "maintenance" | "offline"
}

interface StationUtilization {
  stationId: string
  location: string
  totalChargers: number
  activeChargers: number
  utilization: number
  peakHours: string[]
  averageWaitTime: number
  customerRating: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30d"
    const stationId = searchParams.get("stationId")
    const metric = searchParams.get("metric") // uptime, utilization, efficiency

    const metrics: PerformanceMetrics = {
      systemUptime: 98.7,
      averageUtilization: 73.2,
      sessionSuccessRate: 96.8,
      averageSessionDuration: 45,
      chargerEfficiency: 94.2,
      customerSatisfaction: 4.6,
    }

    // Mock charger performance data
    const chargerPerformance: ChargerPerformance[] = [
      {
        chargerId: "C01",
        stationId: "S1",
        location: "Colombo City",
        uptime: 98.5,
        utilization: 89,
        sessions: 156,
        revenue: 45670,
        efficiency: 94,
        lastMaintenance: "2024-01-15",
        nextMaintenance: "2024-02-15",
        status: "operational",
      },
      {
        chargerId: "C02",
        stationId: "S1",
        location: "Colombo City",
        uptime: 97.2,
        utilization: 85,
        sessions: 142,
        revenue: 42340,
        efficiency: 92,
        lastMaintenance: "2024-01-10",
        nextMaintenance: "2024-02-10",
        status: "operational",
      },
      {
        chargerId: "C03",
        stationId: "S2",
        location: "Kandy",
        uptime: 95.8,
        utilization: 78,
        sessions: 128,
        revenue: 38450,
        efficiency: 89,
        lastMaintenance: "2024-01-20",
        nextMaintenance: "2024-02-20",
        status: "maintenance",
      },
    ]

    // Mock station utilization data
    const stationUtilization: StationUtilization[] = [
      {
        stationId: "S1",
        location: "Colombo City",
        totalChargers: 20,
        activeChargers: 18,
        utilization: 89,
        peakHours: ["08:00-10:00", "17:00-19:00"],
        averageWaitTime: 5.2,
        customerRating: 4.7,
      },
      {
        stationId: "S2",
        location: "Kandy",
        totalChargers: 15,
        activeChargers: 14,
        utilization: 85,
        peakHours: ["07:00-09:00", "18:00-20:00"],
        averageWaitTime: 3.8,
        customerRating: 4.5,
      },
    ]

    // Filter data if stationId is provided
    let filteredChargers = chargerPerformance
    let filteredStations = stationUtilization

    if (stationId) {
      filteredChargers = chargerPerformance.filter((c) => c.stationId === stationId)
      filteredStations = stationUtilization.filter((s) => s.stationId === stationId)
    }

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        chargerPerformance: filteredChargers,
        stationUtilization: filteredStations,
        period,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error fetching performance analytics:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch performance analytics" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { stationIds, dateRange, alertThresholds } = body

    // Generate performance alerts and recommendations
    const alerts = [
      {
        id: "ALERT001",
        type: "warning",
        message: "Charger C03 utilization below 80% for 3 consecutive days",
        stationId: "S2",
        chargerId: "C03",
        severity: "medium",
        createdAt: new Date().toISOString(),
      },
      {
        id: "ALERT002",
        type: "maintenance",
        message: "Scheduled maintenance due for Station S1 Charger C05",
        stationId: "S1",
        chargerId: "C05",
        severity: "low",
        createdAt: new Date().toISOString(),
      },
    ]

    const recommendations = [
      {
        id: "REC001",
        category: "efficiency",
        title: "Optimize charging schedules during peak hours",
        description: "Implement dynamic pricing to distribute load more evenly",
        impact: "15% improvement in utilization",
        priority: "high",
      },
      {
        id: "REC002",
        category: "maintenance",
        title: "Preventive maintenance scheduling",
        description: "Schedule maintenance during low-demand periods",
        impact: "2% improvement in uptime",
        priority: "medium",
      },
    ]

    return NextResponse.json({
      success: true,
      data: {
        alerts,
        recommendations,
        thresholds: alertThresholds || {
          minUtilization: 70,
          minUptime: 95,
          maxWaitTime: 10,
        },
        dateRange,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error generating performance analysis:", error)
    return NextResponse.json({ success: false, error: "Failed to generate performance analysis" }, { status: 500 })
  }
}
