import { type NextRequest, NextResponse } from "next/server"
import { vehiclesData } from "@/lib/data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const vehicle = vehiclesData.vehicles.find((v) => v.id === params.id)

    if (!vehicle) {
      return NextResponse.json({ success: false, error: "Vehicle not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: vehicle,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch vehicle" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const vehicleIndex = vehiclesData.vehicles.findIndex((v) => v.id === params.id)

    if (vehicleIndex === -1) {
      return NextResponse.json({ success: false, error: "Vehicle not found" }, { status: 404 })
    }

    // Update vehicle data
    vehiclesData.vehicles[vehicleIndex] = {
      ...vehiclesData.vehicles[vehicleIndex],
      ...body,
      id: params.id, // Ensure ID doesn't change
    }

    return NextResponse.json({
      success: true,
      data: vehiclesData.vehicles[vehicleIndex],
      message: "Vehicle updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update vehicle" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const vehicleIndex = vehiclesData.vehicles.findIndex((v) => v.id === params.id)

    if (vehicleIndex === -1) {
      return NextResponse.json({ success: false, error: "Vehicle not found" }, { status: 404 })
    }

    // Remove vehicle from array
    const deletedVehicle = vehiclesData.vehicles.splice(vehicleIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedVehicle,
      message: "Vehicle deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete vehicle" }, { status: 500 })
  }
}
