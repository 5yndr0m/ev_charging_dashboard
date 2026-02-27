import { type NextRequest, NextResponse } from "next/server"

interface Gateway {
  id: string
  name: string
  provider: string
  status: "Active" | "Inactive" | "Maintenance"
  transactions: number
  successRate: string
  fees: string
  monthlyVolume: string
  configuration: {
    apiKey?: string
    secretKey?: string
    webhookUrl?: string
    testMode: boolean
  }
  createdAt: string
  updatedAt: string
}

// Mock gateways data
const gateways: Gateway[] = [
  {
    id: "GW001",
    name: "Visa/MasterCard",
    provider: "Commercial Bank",
    status: "Active",
    transactions: 1456,
    successRate: "99.2%",
    fees: "2.5%",
    monthlyVolume: "LKR 2,450,000",
    configuration: {
      testMode: false,
    },
    createdAt: "2023-12-01T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "GW002",
    name: "Mobile Payments",
    provider: "Dialog eZ Cash",
    status: "Active",
    transactions: 892,
    successRate: "97.8%",
    fees: "1.8%",
    monthlyVolume: "LKR 1,230,000",
    configuration: {
      testMode: false,
    },
    createdAt: "2023-11-15T00:00:00Z",
    updatedAt: "2024-01-19T00:00:00Z",
  },
  {
    id: "GW003",
    name: "E-Wallet",
    provider: "PayPal",
    status: "Active",
    transactions: 234,
    successRate: "98.5%",
    fees: "3.2%",
    monthlyVolume: "LKR 567,000",
    configuration: {
      testMode: false,
    },
    createdAt: "2023-10-20T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z",
  },
  {
    id: "GW004",
    name: "Bank Transfer",
    provider: "Sampath Bank",
    status: "Maintenance",
    transactions: 156,
    successRate: "94.5%",
    fees: "1.5%",
    monthlyVolume: "LKR 234,000",
    configuration: {
      testMode: true,
    },
    createdAt: "2023-09-10T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const provider = searchParams.get("provider")

    let filteredGateways = [...gateways]

    if (status) {
      filteredGateways = filteredGateways.filter((gateway) => gateway.status === status)
    }

    if (provider) {
      filteredGateways = filteredGateways.filter((gateway) =>
        gateway.provider.toLowerCase().includes(provider.toLowerCase()),
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredGateways,
      total: filteredGateways.length,
    })
  } catch (error) {
    console.error("Error fetching gateways:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch gateways" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newGateway: Gateway = {
      id: `GW${String(gateways.length + 1).padStart(3, "0")}`,
      name: body.name,
      provider: body.provider,
      status: "Inactive",
      transactions: 0,
      successRate: "0%",
      fees: body.fees || "0%",
      monthlyVolume: "LKR 0",
      configuration: {
        apiKey: body.apiKey,
        secretKey: body.secretKey,
        webhookUrl: body.webhookUrl,
        testMode: body.testMode || true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    gateways.push(newGateway)

    return NextResponse.json({
      success: true,
      data: newGateway,
      message: "Gateway added successfully",
    })
  } catch (error) {
    console.error("Error adding gateway:", error)
    return NextResponse.json({ success: false, error: "Failed to add gateway" }, { status: 500 })
  }
}
