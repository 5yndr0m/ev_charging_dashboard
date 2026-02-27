import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "csv"
    const type = searchParams.get("type") || "expansion"

    // Mock data for export
    const expansionData = [
      {
        location: "Matale",
        phase: "Planning",
        capacity: "500kW",
        timeline: "Q2 2024",
        status: "In Progress",
        estimatedCost: "LKR 15M",
        projectManager: "John Silva",
      },
      {
        location: "Trincomalee",
        phase: "Site Survey",
        capacity: "750kW",
        timeline: "Q3 2024",
        status: "Pending",
        estimatedCost: "LKR 22M",
        projectManager: "Maria Fernando",
      },
    ]

    if (format === "csv") {
      // Generate CSV content
      const headers = Object.keys(expansionData[0]).join(",")
      const rows = expansionData.map((row) => Object.values(row).join(",")).join("\n")
      const csvContent = `${headers}\n${rows}`

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="expansion-plans-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      })
    } else if (format === "json") {
      return new NextResponse(JSON.stringify(expansionData, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="expansion-plans-${new Date().toISOString().split("T")[0]}.json"`,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: expansionData,
      message: "Export completed successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Export failed" }, { status: 500 })
  }
}
