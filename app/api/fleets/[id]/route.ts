import { type NextRequest, NextResponse } from "next/server"
import { fleets } from "@/lib/data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const fleet = fleets.find((f) => f.id === params.id)

    if (!fleet) {
      return NextResponse.json({ success: false, error: "Fleet not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: fleet,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch fleet" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const fleetData = await request.json()
    const fleetIndex = fleets.findIndex((f) => f.id === params.id)

    if (fleetIndex === -1) {
      return NextResponse.json({ success: false, error: "Fleet not found" }, { status: 404 })
    }

    // Update fleet data
    fleets[fleetIndex] = {
      ...fleets[fleetIndex],
      ...fleetData,
    }

    return NextResponse.json({
      success: true,
      data: fleets[fleetIndex],
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update fleet" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const fleetIndex = fleets.findIndex((f) => f.id === params.id)

    if (fleetIndex === -1) {
      return NextResponse.json({ success: false, error: "Fleet not found" }, { status: 404 })
    }

    // Remove fleet from array
    const deletedFleet = fleets.splice(fleetIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedFleet,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete fleet" }, { status: 500 })
  }
}
