import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for auth configuration (replace with database in production)
let authConfiguration = {
  rfid: {
    enabled: true,
    cardFormat: "mifare",
    encryptionLevel: "aes256",
    timeout: "30",
    retryAttempts: "3",
    autoRegister: false,
    requirePin: false,
  },
  mobile: {
    enabled: true,
    biometricAuth: true,
    pinRequired: true,
    sessionTimeout: "60",
    pushNotifications: true,
    offlineMode: false,
    qrCodeAuth: true,
  },
  licensePlate: {
    enabled: true,
    cameraResolution: "1080p",
    recognitionEngine: "advanced",
    confidenceThreshold: "85",
    countryFormat: "sri_lanka",
    fallbackAuth: true,
    manualOverride: true,
  },
  updatedAt: new Date().toISOString(),
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: authConfiguration,
    })
  } catch (error) {
    console.error("Error fetching auth configuration:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch authentication configuration",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const configData = await request.json()

    // Validate required fields
    if (!configData.rfid || !configData.mobile || !configData.licensePlate) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required configuration sections",
        },
        { status: 400 },
      )
    }

    // Update configuration
    authConfiguration = {
      ...configData,
      updatedAt: new Date().toISOString(),
    }

    console.log("Auth configuration updated:", authConfiguration)

    return NextResponse.json({
      success: true,
      data: authConfiguration,
      message: "Authentication configuration updated successfully",
    })
  } catch (error) {
    console.error("Error updating auth configuration:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update authentication configuration",
      },
      { status: 500 },
    )
  }
}
