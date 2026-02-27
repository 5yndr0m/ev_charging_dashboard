import { type NextRequest, NextResponse } from "next/server"

interface Payment {
  id: string
  bookingId: string
  userId: string
  amount: number
  currency: string
  paymentMethodId: string
  status: "pending" | "processing" | "completed" | "failed" | "refunded"
  transactionId?: string
  gatewayResponse?: any
  createdAt: string
  updatedAt: string
  completedAt?: string
  failureReason?: string
}

// Mock payments data
const payments: Payment[] = [
  {
    id: "PAY001",
    bookingId: "BK001",
    userId: "USR001",
    amount: 1150,
    currency: "LKR",
    paymentMethodId: "PM001",
    status: "completed",
    transactionId: "TXN_001_20240121",
    createdAt: "2024-01-21T09:00:00Z",
    updatedAt: "2024-01-21T09:02:00Z",
    completedAt: "2024-01-21T09:02:00Z",
  },
  {
    id: "PAY002",
    bookingId: "BK002",
    userId: "USR002",
    amount: 900,
    currency: "LKR",
    paymentMethodId: "PM002",
    status: "processing",
    transactionId: "TXN_002_20240121",
    createdAt: "2024-01-21T14:00:00Z",
    updatedAt: "2024-01-21T14:01:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")
    const bookingId = searchParams.get("bookingId")

    let filteredPayments = [...payments]

    if (userId) {
      filteredPayments = filteredPayments.filter((payment) => payment.userId === userId)
    }

    if (status) {
      filteredPayments = filteredPayments.filter((payment) => payment.status === status)
    }

    if (bookingId) {
      filteredPayments = filteredPayments.filter((payment) => payment.bookingId === bookingId)
    }

    return NextResponse.json({
      success: true,
      data: filteredPayments,
      total: filteredPayments.length,
    })
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch payments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Simulate payment processing
    const newPayment: Payment = {
      id: `PAY${String(payments.length + 1).padStart(3, "0")}`,
      bookingId: body.bookingId,
      userId: body.userId,
      amount: body.amount,
      currency: body.currency || "LKR",
      paymentMethodId: body.paymentMethodId,
      status: "processing",
      transactionId: `TXN_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Simulate payment gateway processing
    setTimeout(() => {
      const success = Math.random() > 0.1 // 90% success rate
      const paymentIndex = payments.findIndex((p) => p.id === newPayment.id)

      if (paymentIndex !== -1) {
        payments[paymentIndex].status = success ? "completed" : "failed"
        payments[paymentIndex].updatedAt = new Date().toISOString()

        if (success) {
          payments[paymentIndex].completedAt = new Date().toISOString()
        } else {
          payments[paymentIndex].failureReason = "Insufficient funds"
        }
      }
    }, 2000)

    payments.push(newPayment)

    return NextResponse.json({
      success: true,
      data: newPayment,
      message: "Payment initiated successfully",
    })
  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json({ success: false, error: "Failed to process payment" }, { status: 500 })
  }
}
