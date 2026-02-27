import { type NextRequest, NextResponse } from "next/server"

interface DiscountPlan {
  id: string
  name: string
  type: "Time-based" | "Volume-based" | "Energy-based" | "Membership"
  discount: string
  conditions: string
  activeUsers: number
  monthlySavings: string
  status: "Active" | "Inactive" | "Draft"
  validFrom: string
  validTo?: string
  configuration: {
    minAmount?: number
    maxDiscount?: number
    applicableStations?: string[]
    timeSlots?: string[]
    energySources?: string[]
  }
  createdAt: string
  updatedAt: string
}

// Mock discount plans data
const discountPlans: DiscountPlan[] = [
  {
    id: "DP001",
    name: "Off-Peak Hours",
    type: "Time-based",
    discount: "20%",
    conditions: "10 PM - 6 AM",
    activeUsers: 456,
    monthlySavings: "LKR 125,000",
    status: "Active",
    validFrom: "2024-01-01",
    configuration: {
      timeSlots: ["22:00-06:00"],
      maxDiscount: 500,
    },
    createdAt: "2023-12-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "DP002",
    name: "Fleet Discount",
    type: "Volume-based",
    discount: "15%",
    conditions: "10+ vehicles",
    activeUsers: 23,
    monthlySavings: "LKR 89,000",
    status: "Active",
    validFrom: "2024-01-01",
    configuration: {
      minAmount: 10000,
      maxDiscount: 2000,
    },
    createdAt: "2023-11-15T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "DP003",
    name: "Solar Priority",
    type: "Energy-based",
    discount: "10%",
    conditions: "Solar charging only",
    activeUsers: 234,
    monthlySavings: "LKR 67,000",
    status: "Active",
    validFrom: "2024-01-01",
    configuration: {
      energySources: ["Solar"],
      maxDiscount: 300,
    },
    createdAt: "2023-10-20T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
  },
  {
    id: "DP004",
    name: "Monthly Subscription",
    type: "Membership",
    discount: "25%",
    conditions: "LKR 5,000/month",
    activeUsers: 89,
    monthlySavings: "LKR 156,000",
    status: "Active",
    validFrom: "2024-01-01",
    configuration: {
      minAmount: 5000,
      maxDiscount: 1000,
    },
    createdAt: "2023-09-10T00:00:00Z",
    updatedAt: "2023-12-20T00:00:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    let filteredPlans = [...discountPlans]

    if (status) {
      filteredPlans = filteredPlans.filter((plan) => plan.status === status)
    }

    if (type) {
      filteredPlans = filteredPlans.filter((plan) => plan.type === type)
    }

    return NextResponse.json({
      success: true,
      data: filteredPlans,
      total: filteredPlans.length,
    })
  } catch (error) {
    console.error("Error fetching discount plans:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch discount plans" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newPlan: DiscountPlan = {
      id: `DP${String(discountPlans.length + 1).padStart(3, "0")}`,
      name: body.name,
      type: body.type,
      discount: body.discount,
      conditions: body.conditions,
      activeUsers: 0,
      monthlySavings: "LKR 0",
      status: "Draft",
      validFrom: body.validFrom || new Date().toISOString().split("T")[0],
      validTo: body.validTo,
      configuration: body.configuration || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    discountPlans.push(newPlan)

    return NextResponse.json({
      success: true,
      data: newPlan,
      message: "Discount plan created successfully",
    })
  } catch (error) {
    console.error("Error creating discount plan:", error)
    return NextResponse.json({ success: false, error: "Failed to create discount plan" }, { status: 500 })
  }
}
