import { type NextRequest, NextResponse } from "next/server"
import type { ExportOptions, ExportData } from "@/lib/export-utils"

export async function POST(request: NextRequest) {
  try {
    const options: ExportOptions = await request.json()

    const sustainabilityData = [
      ["2024-01-01", "1,250 kWh", "625 kg", "85%", "Solar + Wind"],
      ["2024-01-02", "1,480 kWh", "740 kg", "92%", "Solar + Wind"],
      ["2024-01-03", "1,320 kWh", "660 kg", "88%", "Solar + Wind"],
      ["2024-01-04", "1,650 kWh", "825 kg", "95%", "Solar + Wind"],
    ]

    const exportData: ExportData = {
      title: "Sustainability Impact Report",
      headers: ["Date", "Energy Delivered", "CO2 Saved", "Renewable %", "Sources"],
      rows: sustainabilityData,
      summary: {
        totalEnergy: "5,700 kWh",
        totalCO2Saved: "2,850 kg",
        avgRenewable: "90%",
        period: options.dateRange ? `${options.dateRange.start} to ${options.dateRange.end}` : "All time",
      },
    }

    return NextResponse.json(exportData)
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate sustainability export" }, { status: 500 })
  }
}
