import { type NextRequest, NextResponse } from "next/server"
import type { ExportOptions, ExportData } from "@/lib/export-utils"

export async function POST(request: NextRequest) {
  try {
    const options: ExportOptions = await request.json()

    // Simulate fetching financial data
    const financialData = [
      ["2024-01-01", "Revenue", "$12,500", "Charging fees"],
      ["2024-01-01", "Expense", "$3,200", "Electricity costs"],
      ["2024-01-02", "Revenue", "$15,800", "Charging fees"],
      ["2024-01-02", "Expense", "$4,100", "Maintenance"],
      ["2024-01-03", "Revenue", "$18,200", "Charging fees"],
    ]

    const exportData: ExportData = {
      title: "Financial Summary Report",
      headers: ["Date", "Type", "Amount", "Description"],
      rows: financialData,
      summary: {
        totalRevenue: "$46,500",
        totalExpenses: "$7,300",
        netProfit: "$39,200",
        period: options.dateRange ? `${options.dateRange.start} to ${options.dateRange.end}` : "All time",
      },
    }

    return NextResponse.json(exportData)
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate financial export" }, { status: 500 })
  }
}
