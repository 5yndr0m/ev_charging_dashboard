import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "csv"
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const type = searchParams.get("type") || "sessions"

    // Mock billing data for export
    const billingData = [
      {
        id: "SES001",
        user: "John Silva",
        vehicle: "Tesla Model 3",
        station: "Colombo",
        charger: "C05",
        startTime: "2024-01-20 14:30",
        endTime: "2024-01-20 16:15",
        duration: "1h 45m",
        energyConsumed: "45.2 kWh",
        energySource: "Solar",
        ratePerKwh: "LKR 25.50",
        totalAmount: "LKR 1,152.60",
        status: "Completed",
        paymentMethod: "Credit Card",
      },
      {
        id: "SES002",
        user: "Maria Fernando",
        vehicle: "Nissan Leaf",
        station: "Kandy",
        charger: "C12",
        startTime: "2024-01-20 09:15",
        endTime: "2024-01-20 10:45",
        duration: "1h 30m",
        energyConsumed: "32.8 kWh",
        energySource: "Grid",
        ratePerKwh: "LKR 35.00",
        totalAmount: "LKR 1,148.00",
        status: "Completed",
        paymentMethod: "Mobile Pay",
      },
    ]

    if (format === "csv") {
      const headers = [
        "Session ID",
        "User",
        "Vehicle",
        "Station",
        "Charger",
        "Start Time",
        "End Time",
        "Duration",
        "Energy Consumed",
        "Energy Source",
        "Rate per kWh",
        "Total Amount",
        "Status",
        "Payment Method",
      ]

      const csvContent = [
        headers.join(","),
        ...billingData.map((session) =>
          [
            session.id,
            `"${session.user}"`,
            `"${session.vehicle}"`,
            session.station,
            session.charger,
            session.startTime,
            session.endTime,
            session.duration,
            session.energyConsumed,
            session.energySource,
            `"${session.ratePerKwh}"`,
            `"${session.totalAmount}"`,
            session.status,
            `"${session.paymentMethod}"`,
          ].join(","),
        ),
      ].join("\n")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="billing-export-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      })
    }

    // Default JSON export
    return NextResponse.json({
      success: true,
      data: billingData,
      exportDate: new Date().toISOString(),
      totalRecords: billingData.length,
      filters: {
        startDate,
        endDate,
        type,
      },
    })
  } catch (error) {
    console.error("Error exporting billing data:", error)
    return NextResponse.json({ success: false, error: "Failed to export billing data" }, { status: 500 })
  }
}
