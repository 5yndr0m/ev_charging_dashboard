import { type NextRequest, NextResponse } from "next/server"
import { bookings, type Booking } from "@/lib/data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const source = searchParams.get("source")
    const userId = searchParams.get("userId")
    const stationId = searchParams.get("stationId")

    let filteredBookings = [...bookings]

    if (status) {
      filteredBookings = filteredBookings.filter((booking) => booking.status === status)
    }

    if (source) {
      filteredBookings = filteredBookings.filter((booking) => booking.bookingSource === source)
    }

    if (userId) {
      filteredBookings = filteredBookings.filter((booking) => booking.userId === userId)
    }

    if (stationId) {
      filteredBookings = filteredBookings.filter((booking) => booking.stationId === stationId)
    }

    return NextResponse.json({
      success: true,
      data: filteredBookings,
      total: filteredBookings.length,
    })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newBooking: Booking = {
      id: `BK${String(bookings.length + 1).padStart(3, "0")}`,
      userId: body.userId,
      userName: body.userName,
      vehicleId: body.vehicleId,
      vehiclePlate: body.vehiclePlate,
      stationId: body.stationId,
      stationLocation: body.stationLocation,
      chargerId: body.chargerId,
      bookingDate: body.bookingDate,
      startTime: body.startTime,
      endTime: body.endTime,
      duration: body.duration,
      status: body.status || "Scheduled",
      bookingSource: body.bookingSource || "Admin Panel",
      powerRequested: body.powerRequested,
      estimatedCost: body.estimatedCost,
      paymentMethod: body.paymentMethod,
      paymentStatus: body.paymentStatus || "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: body.notes || "",
    }

    bookings.push(newBooking)

    return NextResponse.json({
      success: true,
      data: newBooking,
      message: "Booking created successfully",
    })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ success: false, error: "Failed to create booking" }, { status: 500 })
  }
}
