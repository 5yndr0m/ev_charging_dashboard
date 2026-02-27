import { type NextRequest, NextResponse } from "next/server"

// This would reference the same paymentMethods array from the main route
// In a real app, this would be in a shared data store or database
const paymentMethods = [
  // Mock data - same as in route.ts
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const method = paymentMethods.find((m) => m.id === params.id)

    if (!method) {
      return NextResponse.json({ success: false, error: "Payment method not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: method,
    })
  } catch (error) {
    console.error("Error fetching payment method:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch payment method" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const methodIndex = paymentMethods.findIndex((m) => m.id === params.id)

    if (methodIndex === -1) {
      return NextResponse.json({ success: false, error: "Payment method not found" }, { status: 404 })
    }

    // If setting as default, unset other defaults for this user
    if (body.isDefault) {
      const userId = paymentMethods[methodIndex].userId
      paymentMethods.forEach((method) => {
        if (method.userId === userId && method.id !== params.id) {
          method.isDefault = false
        }
      })
    }

    paymentMethods[methodIndex] = {
      ...paymentMethods[methodIndex],
      ...body,
      lastUsed: body.isActive ? new Date().toISOString() : paymentMethods[methodIndex].lastUsed,
    }

    return NextResponse.json({
      success: true,
      data: paymentMethods[methodIndex],
      message: "Payment method updated successfully",
    })
  } catch (error) {
    console.error("Error updating payment method:", error)
    return NextResponse.json({ success: false, error: "Failed to update payment method" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const methodIndex = paymentMethods.findIndex((m) => m.id === params.id)

    if (methodIndex === -1) {
      return NextResponse.json({ success: false, error: "Payment method not found" }, { status: 404 })
    }

    const deletedMethod = paymentMethods.splice(methodIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedMethod,
      message: "Payment method deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting payment method:", error)
    return NextResponse.json({ success: false, error: "Failed to delete payment method" }, { status: 500 })
  }
}
