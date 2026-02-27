import { type NextRequest, NextResponse } from "next/server"
import { users } from "@/lib/data"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const configData = await request.json()
    const userIndex = users.findIndex((u) => u.id === params.id)

    if (userIndex === -1) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Update user configuration and role-based permissions
    const updatedPermissions = configData.role ? getUserPermissions(configData.role) : users[userIndex].permissions

    users[userIndex] = {
      ...users[userIndex],
      ...configData,
      permissions: updatedPermissions,
      configuration: {
        ...users[userIndex].configuration,
        ...configData,
        lastUpdated: new Date().toISOString(),
      },
    }

    return NextResponse.json({
      success: true,
      data: users[userIndex],
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update user configuration" }, { status: 500 })
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
