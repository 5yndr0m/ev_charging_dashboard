import { type NextRequest, NextResponse } from "next/server"

// Mock AI models configuration
const aiModels = [
  {
    id: "MODEL001",
    name: "Predictive Maintenance Model",
    type: "Machine Learning",
    status: "Active",
    accuracy: 94.2,
    lastTrained: "2024-01-15",
    dataPoints: 50000,
    predictions: 1234,
    description: "Predicts equipment failures before they occur",
    parameters: {
      algorithm: "Random Forest",
      features: ["temperature", "voltage", "current", "usage_hours"],
      threshold: 0.85,
      retrainInterval: "weekly",
    },
  },
  {
    id: "MODEL002",
    name: "Load Forecasting Model",
    type: "Time Series",
    status: "Active",
    accuracy: 89.7,
    lastTrained: "2024-01-18",
    dataPoints: 75000,
    predictions: 2456,
    description: "Forecasts charging demand patterns",
    parameters: {
      algorithm: "LSTM Neural Network",
      features: ["historical_load", "weather", "time_of_day", "day_of_week"],
      threshold: 0.8,
      retrainInterval: "daily",
    },
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: aiModels,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch AI models" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const modelData = await request.json()

    const newModel = {
      id: `MODEL${String(aiModels.length + 1).padStart(3, "0")}`,
      name: modelData.name,
      type: modelData.type,
      status: "Training",
      accuracy: 0,
      lastTrained: new Date().toISOString().split("T")[0],
      dataPoints: 0,
      predictions: 0,
      description: modelData.description,
      parameters: modelData.parameters || {},
    }

    aiModels.push(newModel)

    return NextResponse.json({
      success: true,
      data: newModel,
      message: "AI model configuration created successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create AI model" }, { status: 500 })
  }
}
