import { type NextRequest, NextResponse } from "next/server"
import { users } from "@/lib/data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = users.find((u) => u.id === params.id)

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userData = await request.json()
    const userIndex = users.findIndex((u) => u.id === params.id)

    if (userIndex === -1) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      ...userData,
      permissions: userData.role ? getUserPermissions(userData.role) : users[userIndex].permissions,
    }

    return NextResponse.json({
      success: true,
      data: users[userIndex],
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userIndex = users.findIndex((u) => u.id === params.id)

    if (userIndex === -1) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Remove user from array
    const deletedUser = users.splice(userIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedUser,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete user" }, { status: 500 })
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
