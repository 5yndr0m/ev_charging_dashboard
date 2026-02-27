import { type NextRequest, NextResponse } from "next/server"
import { vehiclesData } from "@/lib/data"

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: vehiclesData.vehicles,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch vehicles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["make", "model", "year", "owner", "email", "phone", "licensePlate"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Generate new vehicle ID
    const newId = `EV${String(vehiclesData.vehicles.length + 1).padStart(3, "0")}`

    // Generate RFID card number
    const rfidCard = `RF${String(Math.floor(Math.random() * 900000) + 100000)}`

    const newVehicle = {
      id: newId,
      make: body.make,
      model: body.model,
      year: body.year,
      owner: body.owner,
      email: body.email,
      phone: body.phone,
      status: "Active",
      registered: new Date().toISOString().split("T")[0],
      lastCharge: null,
      totalSessions: 0,
      rfidCard,
      licensePlate: body.licensePlate,
    }

    // Add to vehicles array
    vehiclesData.vehicles.push(newVehicle)

    return NextResponse.json({
      success: true,
      data: newVehicle,
      message: "Vehicle registered successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to register vehicle" }, { status: 500 })
  }
}
