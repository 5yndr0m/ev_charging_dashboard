import { type NextRequest, NextResponse } from "next/server"
import { users } from "@/lib/data"

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: users,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Generate new user ID
    const newId = `USR${String(users.length + 1).padStart(3, "0")}`

    // Create new user with default values
    const newUser = {
      id: newId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role || "Operator",
      status: "Active",
      vehicles: 0,
      paymentMethods: [],
      totalSpent: "LKR 0",
      joinDate: new Date().toISOString().split("T")[0],
      lastActivity: new Date().toISOString().split("T")[0],
      chargingSessions: 0,
      preferredStations: [],
      permissions: getUserPermissions(userData.role || "Operator"),
      createdDate: new Date().toISOString().split("T")[0],
      loginCount: 0,
    }

    // Add to users array
    users.push(newUser)

    return NextResponse.json({
      success: true,
      data: newUser,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 })
  }
}

function getUserPermissions(role: string): string[] {
  const rolePermissions = {
    "Super Admin": ["Full System Access", "User Management", "System Configuration", "Security Settings"],
    "Station Manager": ["Station Management", "Charger Control", "Local Reports", "Maintenance Scheduling"],
    Finance: ["Billing Management", "Revenue Reports", "Payment Processing", "Financial Analytics"],
    Maintenance: ["Equipment Access", "Maintenance Logs", "Fault Reporting", "Technical Reports"],
    Operator: ["Monitoring Dashboard", "Basic Reports", "Alert Acknowledgment"],
  }

  return rolePermissions[role as keyof typeof rolePermissions] || rolePermissions["Operator"]
}
