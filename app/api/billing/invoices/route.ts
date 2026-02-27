import { type NextRequest, NextResponse } from "next/server"

interface Invoice {
  id: string
  userId: string
  bookingIds: string[]
  amount: number
  currency: string
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  dueDate: string
  issuedDate: string
  paidDate?: string
  items: InvoiceItem[]
  taxAmount: number
  totalAmount: number
  notes?: string
}

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

// Mock invoices data
const invoices: Invoice[] = [
  {
    id: "INV001",
    userId: "USR001",
    bookingIds: ["BK001", "BK004"],
    amount: 2050,
    currency: "LKR",
    status: "paid",
    dueDate: "2024-02-01",
    issuedDate: "2024-01-21",
    paidDate: "2024-01-22",
    items: [
      { description: "Fast Charging Session - Colombo", quantity: 1, unitPrice: 1150, totalPrice: 1150 },
      { description: "Standard Charging Session - Kandy", quantity: 1, unitPrice: 900, totalPrice: 900 },
    ],
    taxAmount: 205,
    totalAmount: 2255,
    notes: "Monthly charging sessions",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")

    let filteredInvoices = [...invoices]

    if (userId) {
      filteredInvoices = filteredInvoices.filter((invoice) => invoice.userId === userId)
    }

    if (status) {
      filteredInvoices = filteredInvoices.filter((invoice) => invoice.status === status)
    }

    return NextResponse.json({
      success: true,
      data: filteredInvoices,
      total: filteredInvoices.length,
    })
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch invoices" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newInvoice: Invoice = {
      id: `INV${String(invoices.length + 1).padStart(3, "0")}`,
      userId: body.userId,
      bookingIds: body.bookingIds || [],
      amount: body.amount,
      currency: body.currency || "LKR",
      status: "draft",
      dueDate: body.dueDate,
      issuedDate: new Date().toISOString().split("T")[0],
      items: body.items || [],
      taxAmount: body.taxAmount || 0,
      totalAmount: body.amount + (body.taxAmount || 0),
      notes: body.notes,
    }

    invoices.push(newInvoice)

    return NextResponse.json({
      success: true,
      data: newInvoice,
      message: "Invoice created successfully",
    })
  } catch (error) {
    console.error("Error creating invoice:", error)
    return NextResponse.json({ success: false, error: "Failed to create invoice" }, { status: 500 })
  }
}
