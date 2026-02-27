import { type NextRequest, NextResponse } from "next/server"
import { users } from "@/lib/data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase() || ""
    const type = searchParams.get("type") || "all"

    let results: any[] = []

    if (type === "users" || type === "all") {
      const userResults = users
        .filter(
          (user) =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.role.toLowerCase().includes(query),
        )
        .map((user) => ({
          ...user,
          resultType: "user",
        }))
      results = [...results, ...userResults]
    }

    if (type === "logs" || type === "all") {
      // Mock access logs search
      const logResults = [
        {
          id: "LOG001",
          user: "john.silva@ems.lk",
          action: "Updated station configuration",
          resource: "Colombo Station Settings",
          timestamp: "2024-01-20 14:30:15",
          resultType: "log",
        },
      ].filter(
        (log) =>
          log.user.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query) ||
          log.resource.toLowerCase().includes(query),
      )
      results = [...results, ...logResults]
    }

    return NextResponse.json({
      success: true,
      data: results,
      query,
      count: results.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Search failed" }, { status: 500 })
  }
}
