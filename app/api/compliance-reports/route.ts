import { type NextRequest, NextResponse } from "next/server"

// Mock compliance reports data
const complianceReports = [
  {
    id: "RPT001",
    report: "Monthly Energy Usage Report",
    status: "Submitted",
    dueDate: "2024-01-31",
    authority: "PUCSL",
    submittedDate: "2024-01-28",
    reportType: "Energy Usage",
    description: "Monthly energy consumption and generation report",
    attachments: ["energy-usage-jan-2024.pdf"],
    nextDueDate: "2024-02-29",
  },
  {
    id: "RPT002",
    report: "Environmental Impact Assessment",
    status: "In Review",
    dueDate: "2024-02-15",
    authority: "CEA",
    submittedDate: "2024-02-10",
    reportType: "Environmental",
    description: "Environmental impact assessment for new installations",
    attachments: ["eia-report-2024.pdf", "environmental-data.xlsx"],
    nextDueDate: "2024-08-15",
  },
  {
    id: "RPT003",
    report: "Grid Integration Compliance",
    status: "Approved",
    dueDate: "2024-02-28",
    authority: "CEB",
    submittedDate: "2024-02-25",
    reportType: "Grid Integration",
    description: "Grid integration and load balancing compliance report",
    attachments: ["grid-compliance-2024.pdf"],
    nextDueDate: "2024-05-28",
  },
  {
    id: "RPT004",
    report: "Safety Standards Audit",
    status: "Pending",
    dueDate: "2024-03-15",
    authority: "SLSI",
    submittedDate: null,
    reportType: "Safety",
    description: "Annual safety standards compliance audit",
    attachments: [],
    nextDueDate: "2025-03-15",
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: complianceReports,
      total: complianceReports.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch compliance reports" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const reportData = await request.json()

    const newReport = {
      id: `RPT${String(complianceReports.length + 1).padStart(3, "0")}`,
      report: reportData.report,
      status: "Pending",
      dueDate: reportData.dueDate,
      authority: reportData.authority,
      submittedDate: null,
      reportType: reportData.reportType,
      description: reportData.description,
      attachments: [],
      nextDueDate: reportData.nextDueDate,
    }

    complianceReports.push(newReport)

    return NextResponse.json({
      success: true,
      data: newReport,
      message: "Compliance report created successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create compliance report" }, { status: 500 })
  }
}
