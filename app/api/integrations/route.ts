import { type NextRequest, NextResponse } from "next/server"

// Mock integrations data
const integrations = [
  {
    id: "INT001",
    name: "Ceylon Electricity Board (CEB)",
    type: "Utility Grid",
    status: "Connected",
    lastSync: new Date().toISOString(),
    endpoint: "https://api.ceb.lk/grid-data",
    health: 98.5,
    description: "Real-time grid data and load balancing",
    apiKey: "ceb_api_key_123",
    config: {
      syncInterval: 30,
      retryAttempts: 3,
      timeout: 5000,
    },
  },
  {
    id: "INT002",
    name: "Smart Grid Management",
    type: "Grid Control",
    status: "Connected",
    lastSync: new Date().toISOString(),
    endpoint: "https://smartgrid.lk/api/v2",
    health: 97.2,
    description: "Automated load distribution and optimization",
    apiKey: "smartgrid_api_key_456",
    config: {
      syncInterval: 60,
      retryAttempts: 5,
      timeout: 10000,
    },
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: integrations,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch integrations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const integrationData = await request.json()

    // Generate new integration ID
    const newId = `INT${String(integrations.length + 1).padStart(3, "0")}`

    // Create new integration
    const newIntegration = {
      id: newId,
      name: integrationData.name,
      type: integrationData.type,
      status: "Inactive",
      lastSync: new Date().toISOString(),
      endpoint: integrationData.endpoint,
      health: 0,
      description: integrationData.description,
      apiKey: integrationData.apiKey,
      config: integrationData.config || {
        syncInterval: 60,
        retryAttempts: 3,
        timeout: 5000,
      },
    }

    // Add to integrations array
    integrations.push(newIntegration)

    return NextResponse.json({
      success: true,
      data: newIntegration,
      message: "Integration added successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to add integration" }, { status: 500 })
  }
}
