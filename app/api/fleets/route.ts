import { type NextRequest, NextResponse } from "next/server"
import { fleets } from "@/lib/data"

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: fleets,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch fleets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const fleetData = await request.json()

    // Generate new fleet ID
    const newId = `FLT${String(fleets.length + 1).padStart(3, "0")}`

    // Create new fleet with default values
    const newFleet = {
      id: newId,
      company: fleetData.company,
      contact: fleetData.contact,
      email: fleetData.email,
      vehicles: 0,
      activeVehicles: 0,
      monthlySpend: "LKR 0",
      discount: fleetData.discount || "0%",
      status: "Active",
      contract: fleetData.contract || "Monthly",
      createdDate: new Date().toISOString().split("T")[0],
      billingAddress: fleetData.billingAddress || "",
      taxId: fleetData.taxId || "",
    }

    // Add to fleets array
    fleets.push(newFleet)

    return NextResponse.json({
      success: true,
      data: newFleet,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create fleet" }, { status: 500 })
  }
}
