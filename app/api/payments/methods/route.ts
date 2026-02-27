import { type NextRequest, NextResponse } from "next/server"

interface PaymentMethod {
  id: string
  userId: string
  type: "credit_card" | "debit_card" | "mobile_payment" | "e_wallet" | "bank_transfer"
  provider: string
  maskedNumber: string
  isDefault: boolean
  isActive: boolean
  expiryDate?: string
  createdAt: string
  lastUsed?: string
}

// Mock payment methods data
const paymentMethods: PaymentMethod[] = [
  {
    id: "PM001",
    userId: "USR001",
    type: "credit_card",
    provider: "Visa",
    maskedNumber: "**** **** **** 1234",
    isDefault: true,
    isActive: true,
    expiryDate: "12/26",
    createdAt: "2023-12-01T00:00:00Z",
    lastUsed: "2024-01-20T11:05:00Z",
  },
  {
    id: "PM002",
    userId: "USR002",
    type: "mobile_payment",
    provider: "Dialog eZ Cash",
    maskedNumber: "**** 4568",
    isDefault: true,
    isActive: true,
    createdAt: "2023-11-15T00:00:00Z",
    lastUsed: "2024-01-19T16:30:00Z",
  },
  {
    id: "PM003",
    userId: "USR003",
    type: "e_wallet",
    provider: "PayPal",
    maskedNumber: "r****@email.com",
    isDefault: false,
    isActive: true,
    createdAt: "2023-10-20T00:00:00Z",
    lastUsed: "2024-01-18T14:20:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const type = searchParams.get("type")
    const isActive = searchParams.get("isActive")

    let filteredMethods = [...paymentMethods]

    if (userId) {
      filteredMethods = filteredMethods.filter((method) => method.userId === userId)
    }

    if (type) {
      filteredMethods = filteredMethods.filter((method) => method.type === type)
    }

    if (isActive !== null) {
      filteredMethods = filteredMethods.filter((method) => method.isActive === (isActive === "true"))
    }

    return NextResponse.json({
      success: true,
      data: filteredMethods,
      total: filteredMethods.length,
    })
  } catch (error) {
    console.error("Error fetching payment methods:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch payment methods" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newPaymentMethod: PaymentMethod = {
      id: `PM${String(paymentMethods.length + 1).padStart(3, "0")}`,
      userId: body.userId,
      type: body.type,
      provider: body.provider,
      maskedNumber: body.maskedNumber,
      isDefault: body.isDefault || false,
      isActive: true,
      expiryDate: body.expiryDate,
      createdAt: new Date().toISOString(),
    }

    // If this is set as default, unset other default methods for this user
    if (newPaymentMethod.isDefault) {
      paymentMethods.forEach((method) => {
        if (method.userId === newPaymentMethod.userId) {
          method.isDefault = false
        }
      })
    }

    paymentMethods.push(newPaymentMethod)

    return NextResponse.json({
      success: true,
      data: newPaymentMethod,
      message: "Payment method added successfully",
    })
  } catch (error) {
    console.error("Error adding payment method:", error)
    return NextResponse.json({ success: false, error: "Failed to add payment method" }, { status: 500 })
  }
}
