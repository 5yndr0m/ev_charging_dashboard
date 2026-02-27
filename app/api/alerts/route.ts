import { type NextRequest, NextResponse } from "next/server"

// Mock alerts data
const alerts = [
  {
    id: "ALT001",
    type: "Critical",
    severity: "High",
    message: "Grid Overload at Colombo Station",
    station: "Colombo",
    charger: "Multiple",
    timestamp: new Date().toISOString(),
    duration: "2 minutes ago",
    status: "Active",
    assignedTo: "John Silva",
    description: "Grid load exceeding 95% capacity, switching to battery backup",
    impact: "Service degradation possible",
    actions: ["Switch to Battery", "Reduce Load", "Contact CEB"],
  },
  {
    id: "ALT002",
    type: "Warning",
    severity: "Medium",
    message: "Battery Storage Low (15%)",
    station: "Kandy",
    charger: "Battery System",
    timestamp: new Date().toISOString(),
    duration: "15 minutes ago",
    status: "Active",
    assignedTo: "Maria Fernando",
    description: "Battery storage level below minimum threshold",
    impact: "Reduced backup capacity",
    actions: ["Monitor Charging", "Check Solar", "Schedule Maintenance"],
  },
]

const alertRules = [
  {
    id: "RULE001",
    name: "Grid Overload",
    condition: "Grid Load > 90%",
    severity: "Critical",
    channels: ["SMS", "Email", "Push"],
    enabled: true,
    escalation: "5 minutes",
    recipients: ["Operations Team", "Station Manager"],
  },
  {
    id: "RULE002",
    name: "Battery Low",
    condition: "Battery Level < 20%",
    severity: "Warning",
    channels: ["Email", "Push"],
    enabled: true,
    escalation: "15 minutes",
    recipients: ["Maintenance Team"],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const status = searchParams.get("status")

    let filteredAlerts = alerts

    if (type && type !== "all") {
      filteredAlerts = filteredAlerts.filter((alert) => alert.type.toLowerCase() === type.toLowerCase())
    }

    if (status && status !== "all") {
      filteredAlerts = filteredAlerts.filter((alert) => alert.status.toLowerCase() === status.toLowerCase())
    }

    return NextResponse.json({
      success: true,
      data: filteredAlerts,
      total: filteredAlerts.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch alerts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const alertData = await request.json()

    const newAlert = {
      id: `ALT${String(alerts.length + 1).padStart(3, "0")}`,
      type: alertData.type,
      severity: alertData.severity,
      message: alertData.message,
      station: alertData.station,
      charger: alertData.charger || "System",
      timestamp: new Date().toISOString(),
      duration: "Just now",
      status: "Active",
      assignedTo: alertData.assignedTo || "System Auto",
      description: alertData.description,
      impact: alertData.impact || "Unknown impact",
      actions: alertData.actions || [],
    }

    alerts.push(newAlert)

    return NextResponse.json({
      success: true,
      data: newAlert,
      message: "Alert created successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create alert" }, { status: 500 })
  }
}
