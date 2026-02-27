import { type NextRequest, NextResponse } from "next/server"

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: "operational" | "financial" | "environmental" | "custom"
  frequency: "daily" | "weekly" | "monthly" | "quarterly"
  format: "pdf" | "excel" | "csv" | "json"
  recipients: string[]
  isActive: boolean
  lastGenerated?: string
  nextScheduled?: string
}

interface ReportData {
  id: string
  templateId: string
  title: string
  generatedAt: string
  period: string
  format: string
  size: string
  downloadUrl: string
  status: "generating" | "completed" | "failed"
}

// Mock report templates
const reportTemplates: ReportTemplate[] = [
  {
    id: "RPT001",
    name: "Daily Operations Summary",
    description: "Daily overview of system performance and key metrics",
    category: "operational",
    frequency: "daily",
    format: "pdf",
    recipients: ["admin@ems.lk", "operations@ems.lk"],
    isActive: true,
    lastGenerated: "2024-01-21T06:00:00Z",
    nextScheduled: "2024-01-22T06:00:00Z",
  },
  {
    id: "RPT002",
    name: "Weekly Financial Report",
    description: "Comprehensive financial analysis and revenue breakdown",
    category: "financial",
    frequency: "weekly",
    format: "excel",
    recipients: ["finance@ems.lk", "management@ems.lk"],
    isActive: true,
    lastGenerated: "2024-01-15T09:00:00Z",
    nextScheduled: "2024-01-22T09:00:00Z",
  },
  {
    id: "RPT003",
    name: "Monthly Environmental Impact",
    description: "CO₂ savings, renewable energy usage, and sustainability metrics",
    category: "environmental",
    frequency: "monthly",
    format: "pdf",
    recipients: ["sustainability@ems.lk"],
    isActive: true,
    lastGenerated: "2024-01-01T10:00:00Z",
    nextScheduled: "2024-02-01T10:00:00Z",
  },
]

// Mock generated reports
const generatedReports: ReportData[] = [
  {
    id: "GEN001",
    templateId: "RPT001",
    title: "Daily Operations Summary - Jan 21, 2024",
    generatedAt: "2024-01-21T06:00:00Z",
    period: "2024-01-21",
    format: "pdf",
    size: "2.3 MB",
    downloadUrl: "/api/reports/download/GEN001",
    status: "completed",
  },
  {
    id: "GEN002",
    templateId: "RPT002",
    title: "Weekly Financial Report - Week 3, 2024",
    generatedAt: "2024-01-15T09:00:00Z",
    period: "2024-01-15 to 2024-01-21",
    format: "excel",
    size: "1.8 MB",
    downloadUrl: "/api/reports/download/GEN002",
    status: "completed",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // templates, generated
    const category = searchParams.get("category")
    const status = searchParams.get("status")

    if (type === "templates") {
      let filteredTemplates = reportTemplates

      if (category) {
        filteredTemplates = filteredTemplates.filter((t) => t.category === category)
      }

      return NextResponse.json({
        success: true,
        data: filteredTemplates,
        total: filteredTemplates.length,
      })
    }

    if (type === "generated") {
      let filteredReports = generatedReports

      if (status) {
        filteredReports = filteredReports.filter((r) => r.status === status)
      }

      return NextResponse.json({
        success: true,
        data: filteredReports,
        total: filteredReports.length,
      })
    }

    // Return both templates and recent reports
    return NextResponse.json({
      success: true,
      data: {
        templates: reportTemplates,
        recentReports: generatedReports.slice(0, 5),
        summary: {
          totalTemplates: reportTemplates.length,
          activeTemplates: reportTemplates.filter((t) => t.isActive).length,
          reportsGenerated: generatedReports.length,
          lastGenerated: generatedReports[0]?.generatedAt,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch reports" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { templateId, customParams, format, recipients } = body

    // Generate a new report
    const newReport: ReportData = {
      id: `GEN${String(generatedReports.length + 1).padStart(3, "0")}`,
      templateId: templateId || "CUSTOM",
      title: customParams?.title || `Custom Report - ${new Date().toLocaleDateString()}`,
      generatedAt: new Date().toISOString(),
      period: customParams?.period || "custom",
      format: format || "pdf",
      size: "0 MB",
      downloadUrl: "",
      status: "generating",
    }

    // Simulate report generation
    setTimeout(() => {
      const reportIndex = generatedReports.findIndex((r) => r.id === newReport.id)
      if (reportIndex !== -1) {
        generatedReports[reportIndex].status = "completed"
        generatedReports[reportIndex].size = `${(Math.random() * 5 + 1).toFixed(1)} MB`
        generatedReports[reportIndex].downloadUrl = `/api/reports/download/${newReport.id}`
      }
    }, 3000)

    generatedReports.unshift(newReport)

    return NextResponse.json({
      success: true,
      data: newReport,
      message: "Report generation started",
    })
  } catch (error) {
    console.error("Error generating report:", error)
    return NextResponse.json({ success: false, error: "Failed to generate report" }, { status: 500 })
  }
}
