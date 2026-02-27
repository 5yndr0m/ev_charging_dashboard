import { type NextRequest, NextResponse } from "next/server"

interface ManualBilling {
  id: string
  userId: string
  userName: string
  amount: number
  currency: string
  description: string
  category: "adjustment" | "penalty" | "refund" | "custom"
  status: "pending" | "processed" | "cancelled"
  createdBy: string
  createdAt: string
  processedAt?: string
  notes?: string
}

// Mock manual billing data
const manualBillings: ManualBilling[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")
    const category = searchParams.get("category")

    let filteredBillings = [...manualBillings]

    if (userId) {
      filteredBillings = filteredBillings.filter((billing) => billing.userId === userId)
    }

    if (status) {
      filteredBillings = filteredBillings.filter((billing) => billing.status === status)
    }

    if (category) {
      filteredBillings = filteredBillings.filter((billing) => billing.category === category)
    }

    return NextResponse.json({
      success: true,
      data: filteredBillings,
      total: filteredBillings.length,
    })
  } catch (error) {
    console.error("Error fetching manual billings:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch manual billings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newBilling: ManualBilling = {
      id: `MB${String(manualBillings.length + 1).padStart(3, "0")}`,
      userId: body.userId,
      userName: body.userName,
      amount: body.amount,
      currency: body.currency || "LKR",
      description: body.description,
      category: body.category || "custom",
      status: "pending",
      createdBy: body.createdBy || "Admin",
      createdAt: new Date().toISOString(),
      notes: body.notes,
    }

    manualBillings.push(newBilling)

    return NextResponse.json({
      success: true,
      data: newBilling,
      message: "Manual billing created successfully",
    })
  } catch (error) {
    console.error("Error creating manual billing:", error)
    return NextResponse.json({ success: false, error: "Failed to create manual billing" }, { status: 500 })
  }
}
