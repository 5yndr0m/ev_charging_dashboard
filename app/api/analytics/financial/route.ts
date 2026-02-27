import { type NextRequest, NextResponse } from "next/server"

interface FinancialMetrics {
  totalRevenue: number
  totalCosts: number
  netProfit: number
  profitMargin: number
  averageSessionValue: number
  revenuePerStation: number
  costPerKwh: number
}

interface RevenueBreakdown {
  category: string
  amount: number
  percentage: number
  trend: number
}

interface CostAnalysis {
  category: string
  amount: number
  percentage: number
  budgetVariance: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30d"
    const stationId = searchParams.get("stationId")
    const currency = searchParams.get("currency") || "LKR"

    const metrics: FinancialMetrics = {
      totalRevenue: 2600000,
      totalCosts: 1040000,
      netProfit: 1560000,
      profitMargin: 60,
      averageSessionValue: 1547,
      revenuePerStation: 260000,
      costPerKwh: 35.5,
    }

    const revenueBreakdown: RevenueBreakdown[] = [
      { category: "Fast Charging", amount: 1560000, percentage: 60, trend: 12.5 },
      { category: "Standard Charging", amount: 780000, percentage: 30, trend: 8.2 },
      { category: "Fleet Services", amount: 260000, percentage: 10, trend: 15.3 },
    ]

    const costAnalysis: CostAnalysis[] = [
      { category: "Grid Electricity", amount: 520000, percentage: 50, budgetVariance: -5.2 },
      { category: "Maintenance", amount: 208000, percentage: 20, budgetVariance: 2.1 },
      { category: "Operations", amount: 156000, percentage: 15, budgetVariance: -1.5 },
      { category: "Infrastructure", amount: 104000, percentage: 10, budgetVariance: 0.8 },
      { category: "Other", amount: 52000, percentage: 5, budgetVariance: -0.3 },
    ]

    // Generate monthly financial data
    const monthlyData = Array.from({ length: 6 }, (_, i) => ({
      month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short" }),
      revenue: Math.floor(Math.random() * 500000) + 1800000,
      costs: Math.floor(Math.random() * 200000) + 720000,
      profit: 0, // calculated below
      solarSavings: Math.floor(Math.random() * 50000) + 180000,
    })).map((item) => ({ ...item, profit: item.revenue - item.costs }))

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        revenueBreakdown,
        costAnalysis,
        monthlyData,
        currency,
        period,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error fetching financial analytics:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch financial analytics" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dateRange, stationIds, reportType } = body

    // Generate custom financial report
    const reportData = {
      summary: {
        totalRevenue: 2600000,
        totalExpenses: 1040000,
        netProfit: 1560000,
        profitMargin: 60,
      },
      stationBreakdown:
        stationIds?.map((id: string) => ({
          stationId: id,
          revenue: Math.floor(Math.random() * 300000) + 200000,
          costs: Math.floor(Math.random() * 120000) + 80000,
          sessions: Math.floor(Math.random() * 500) + 800,
          efficiency: Math.floor(Math.random() * 15) + 85,
        })) || [],
      trends: {
        revenueGrowth: 12.5,
        costOptimization: -8.3,
        profitImprovement: 18.7,
      },
    }

    return NextResponse.json({
      success: true,
      data: reportData,
      reportType: reportType || "comprehensive",
      dateRange,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error generating financial report:", error)
    return NextResponse.json({ success: false, error: "Failed to generate financial report" }, { status: 500 })
  }
}
