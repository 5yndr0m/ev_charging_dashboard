import { type NextRequest, NextResponse } from "next/server"
import { vehiclesData } from "@/lib/data"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const configData = await request.json()
    const vehicleIndex = vehiclesData.vehicles.findIndex((v) => v.id === params.id)

    if (vehicleIndex === -1) {
      return NextResponse.json({ success: false, error: "Vehicle not found" }, { status: 404 })
    }

    // Update vehicle configuration
    vehiclesData.vehicles[vehicleIndex] = {
      ...vehiclesData.vehicles[vehicleIndex],
      configuration: {
        ...vehiclesData.vehicles[vehicleIndex].configuration,
        ...configData,
        lastUpdated: new Date().toISOString(),
      },
    }

    return NextResponse.json({
      success: true,
      data: vehiclesData.vehicles[vehicleIndex],
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update vehicle configuration" }, { status: 500 })
  }
}
