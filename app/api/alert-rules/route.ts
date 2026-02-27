import { type NextRequest, NextResponse } from "next/server"

// Mock alert rules data
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
  {
    id: "RULE003",
    name: "Charger Offline",
    condition: "Charger Status = Offline",
    severity: "Critical",
    channels: ["SMS", "Email", "Slack"],
    enabled: true,
    escalation: "2 minutes",
    recipients: ["Technical Support", "Station Manager"],
  },
  {
    id: "RULE004",
    name: "High Temperature",
    condition: "Equipment Temp > 45°C",
    severity: "Warning",
    channels: ["Email", "Push"],
    enabled: true,
    escalation: "10 minutes",
    recipients: ["Maintenance Team"],
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: alertRules,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch alert rules" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const ruleData = await request.json()

    const newRule = {
      id: `RULE${String(alertRules.length + 1).padStart(3, "0")}`,
      name: ruleData.name,
      condition: ruleData.condition,
      severity: ruleData.severity,
      channels: ruleData.channels || ["Email"],
      enabled: ruleData.enabled !== false,
      escalation: ruleData.escalation || "10 minutes",
      recipients: ruleData.recipients || [],
    }

    alertRules.push(newRule)

    return NextResponse.json({
      success: true,
      data: newRule,
      message: "Alert rule created successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create alert rule" }, { status: 500 })
  }
}
