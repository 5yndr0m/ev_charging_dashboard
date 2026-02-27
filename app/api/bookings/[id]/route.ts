import { type NextRequest, NextResponse } from "next/server"
import { bookings } from "@/lib/data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const booking = bookings.find((b) => b.id === params.id)

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: booking,
    })
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch booking" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const bookingIndex = bookings.findIndex((b) => b.id === params.id)

    if (bookingIndex === -1) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 })
    }

    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: bookings[bookingIndex],
      message: "Booking updated successfully",
    })
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json({ success: false, error: "Failed to update booking" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookingIndex = bookings.findIndex((b) => b.id === params.id)

    if (bookingIndex === -1) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 })
    }

    const deletedBooking = bookings.splice(bookingIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedBooking,
      message: "Booking deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting booking:", error)
    return NextResponse.json({ success: false, error: "Failed to delete booking" }, { status: 500 })
  }
}
