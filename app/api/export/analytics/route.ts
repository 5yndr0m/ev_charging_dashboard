import { type NextRequest, NextResponse } from "next/server"
import type { ExportOptions, ExportData } from "@/lib/export-utils"

export async function POST(request: NextRequest) {
  try {
    const options: ExportOptions = await request.json()

    const analyticsData = [
      ["Peak Hours", "6-9 AM, 5-8 PM", "85%", "1,250 kWh"],
      ["Off-Peak Hours", "10 PM - 5 AM", "45%", "680 kWh"],
      ["Weekend Usage", "Sat-Sun", "65%", "920 kWh"],
      ["Weekday Usage", "Mon-Fri", "78%", "1,180 kWh"],
    ]

    const exportData: ExportData = {
      title: "Detailed Analytics Report",
      headers: ["Period", "Time Range", "Utilization", "Energy Delivered"],
      rows: analyticsData,
      summary: {
        avgUtilization: "68%",
        totalSessions: "1,247",
        avgSessionDuration: "45 minutes",
        period: options.dateRange ? `${options.dateRange.start} to ${options.dateRange.end}` : "All time",
      },
    }

    return NextResponse.json(exportData)
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate analytics export" }, { status: 500 })
  }
}
