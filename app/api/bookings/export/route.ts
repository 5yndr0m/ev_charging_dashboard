import { type NextRequest, NextResponse } from "next/server"
import { bookings } from "@/lib/data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "csv"
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const status = searchParams.get("status")
    const source = searchParams.get("source")
    const stationId = searchParams.get("stationId")
    const userId = searchParams.get("userId")
    const paymentStatus = searchParams.get("paymentStatus")

    let filteredBookings = [...bookings]

    // Apply filters
    if (startDate) {
      filteredBookings = filteredBookings.filter((booking) => new Date(booking.bookingDate) >= new Date(startDate))
    }

    if (endDate) {
      filteredBookings = filteredBookings.filter((booking) => new Date(booking.bookingDate) <= new Date(endDate))
    }

    if (status) {
      filteredBookings = filteredBookings.filter((booking) => booking.status === status)
    }

    if (source) {
      filteredBookings = filteredBookings.filter((booking) => booking.bookingSource === source)
    }

    if (stationId) {
      filteredBookings = filteredBookings.filter((booking) => booking.stationId === stationId)
    }

    if (userId) {
      filteredBookings = filteredBookings.filter((booking) => booking.userId === userId)
    }

    if (paymentStatus) {
      filteredBookings = filteredBookings.filter((booking) => booking.paymentStatus === paymentStatus)
    }

    if (format === "csv") {
      // Generate CSV content
      const headers = [
        "Booking ID",
        "User Name",
        "Vehicle Plate",
        "Station",
        "Charger",
        "Date",
        "Start Time",
        "End Time",
        "Duration (min)",
        "Status",
        "Source",
        "Power (kW)",
        "Estimated Cost",
        "Actual Cost",
        "Payment Method",
        "Payment Status",
        "Notes",
      ]

      const csvContent = [
        headers.join(","),
        ...filteredBookings.map((booking) =>
          [
            booking.id,
            `"${booking.userName}"`,
            booking.vehiclePlate,
            `"${booking.stationLocation}"`,
            booking.chargerId,
            booking.bookingDate,
            booking.startTime,
            booking.endTime,
            booking.duration,
            booking.status,
            booking.bookingSource,
            booking.powerRequested,
            `"${booking.estimatedCost}"`,
            `"${booking.actualCost || "N/A"}"`,
            `"${booking.paymentMethod}"`,
            booking.paymentStatus,
            `"${booking.notes || ""}"`,
          ].join(","),
        ),
      ].join("\n")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="bookings-export-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      })
    }

    if (format === "excel") {
      // Generate Excel-compatible CSV with UTF-8 BOM
      const headers = [
        "Booking ID",
        "User Name",
        "Vehicle Plate",
        "Station",
        "Charger",
        "Date",
        "Start Time",
        "End Time",
        "Duration (min)",
        "Status",
        "Source",
        "Power (kW)",
        "Estimated Cost",
        "Actual Cost",
        "Payment Method",
        "Payment Status",
        "Created Date",
        "Updated Date",
        "Notes",
      ]

      const csvContent = [
        headers.join(","),
        ...filteredBookings.map((booking) =>
          [
            booking.id,
            `"${booking.userName}"`,
            booking.vehiclePlate,
            `"${booking.stationLocation}"`,
            booking.chargerId,
            booking.bookingDate,
            booking.startTime,
            booking.endTime,
            booking.duration,
            booking.status,
            booking.bookingSource,
            booking.powerRequested,
            `"${booking.estimatedCost}"`,
            `"${booking.actualCost || "N/A"}"`,
            `"${booking.paymentMethod}"`,
            booking.paymentStatus,
            new Date(booking.createdAt).toLocaleDateString(),
            new Date(booking.updatedAt).toLocaleDateString(),
            `"${booking.notes || ""}"`,
          ].join(","),
        ),
      ].join("\n")

      // Add UTF-8 BOM for Excel compatibility
      const bom = "\uFEFF"
      const content = bom + csvContent

      return new NextResponse(content, {
        headers: {
          "Content-Type": "application/vnd.ms-excel",
          "Content-Disposition": `attachment; filename="bookings-export-${new Date().toISOString().split("T")[0]}.xlsx"`,
        },
      })
    }

    if (format === "pdf") {
      // Generate PDF report data (would typically use a PDF library)
      const summary = {
        totalBookings: filteredBookings.length,
        completedBookings: filteredBookings.filter((b) => b.status === "Completed").length,
        activeBookings: filteredBookings.filter((b) => b.status === "Active").length,
        cancelledBookings: filteredBookings.filter((b) => b.status === "Cancelled").length,
        totalRevenue: filteredBookings
          .filter((b) => b.actualCost)
          .reduce((sum, b) => {
            const cost = Number.parseFloat(b.actualCost?.replace(/[^\d.]/g, "") || "0")
            return sum + cost
          }, 0),
        averageSessionDuration:
          filteredBookings.length > 0
            ? Math.round(filteredBookings.reduce((sum, b) => sum + b.duration, 0) / filteredBookings.length)
            : 0,
      }

      return NextResponse.json({
        success: true,
        format: "pdf",
        summary,
        data: filteredBookings,
        exportDate: new Date().toISOString(),
        totalRecords: filteredBookings.length,
        message: "PDF generation would be implemented with a PDF library like jsPDF or Puppeteer",
      })
    }

    const summary = {
      totalBookings: filteredBookings.length,
      statusBreakdown: {
        completed: filteredBookings.filter((b) => b.status === "Completed").length,
        active: filteredBookings.filter((b) => b.status === "Active").length,
        scheduled: filteredBookings.filter((b) => b.status === "Scheduled").length,
        cancelled: filteredBookings.filter((b) => b.status === "Cancelled").length,
        noShow: filteredBookings.filter((b) => b.status === "No Show").length,
      },
      sourceBreakdown: {
        mobileApp: filteredBookings.filter((b) => b.bookingSource === "Mobile App").length,
        website: filteredBookings.filter((b) => b.bookingSource === "Website").length,
        adminPanel: filteredBookings.filter((b) => b.bookingSource === "Admin Panel").length,
        rfid: filteredBookings.filter((b) => b.bookingSource === "RFID").length,
      },
      paymentBreakdown: {
        paid: filteredBookings.filter((b) => b.paymentStatus === "Paid").length,
        pending: filteredBookings.filter((b) => b.paymentStatus === "Pending").length,
        failed: filteredBookings.filter((b) => b.paymentStatus === "Failed").length,
        refunded: filteredBookings.filter((b) => b.paymentStatus === "Refunded").length,
      },
      totalRevenue: filteredBookings
        .filter((b) => b.actualCost)
        .reduce((sum, b) => {
          const cost = Number.parseFloat(b.actualCost?.replace(/[^\d.]/g, "") || "0")
          return sum + cost
        }, 0),
      averageSessionDuration:
        filteredBookings.length > 0
          ? Math.round(filteredBookings.reduce((sum, b) => sum + b.duration, 0) / filteredBookings.length)
          : 0,
      totalEnergyConsumed: filteredBookings.reduce((sum, b) => sum + (b.powerRequested * b.duration) / 60, 0),
    }

    // Default JSON export
    return NextResponse.json({
      success: true,
      data: filteredBookings,
      summary,
      filters: {
        startDate,
        endDate,
        status,
        source,
        stationId,
        userId,
        paymentStatus,
      },
      exportDate: new Date().toISOString(),
      totalRecords: filteredBookings.length,
    })
  } catch (error) {
    console.error("Error exporting bookings:", error)
    return NextResponse.json({ success: false, error: "Failed to export bookings" }, { status: 500 })
  }
}
