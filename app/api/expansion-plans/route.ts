import { type NextRequest, NextResponse } from "next/server"

// Mock expansion plans data
const expansionPlans = [
  {
    id: "EXP001",
    location: "Matale",
    phase: "Planning",
    capacity: "500kW",
    timeline: "Q2 2024",
    status: "In Progress",
    coordinates: { lat: 7.4675, lng: 80.6234 },
    estimatedCost: "LKR 15M",
    expectedCompletion: "2024-06-30",
    projectManager: "John Silva",
    description: "New charging station in Matale city center",
    milestones: [
      { name: "Site Survey", status: "Completed", date: "2024-01-15" },
      { name: "Environmental Approval", status: "In Progress", date: "2024-02-15" },
      { name: "Construction", status: "Pending", date: "2024-04-01" },
    ],
  },
  {
    id: "EXP002",
    location: "Trincomalee",
    phase: "Site Survey",
    capacity: "750kW",
    timeline: "Q3 2024",
    status: "Pending",
    coordinates: { lat: 8.5874, lng: 81.2152 },
    estimatedCost: "LKR 22M",
    expectedCompletion: "2024-09-30",
    projectManager: "Maria Fernando",
    description: "Coastal charging hub for tourism sector",
    milestones: [
      { name: "Site Survey", status: "In Progress", date: "2024-02-01" },
      { name: "Environmental Approval", status: "Pending", date: "2024-03-15" },
      { name: "Construction", status: "Pending", date: "2024-06-01" },
    ],
  },
  {
    id: "EXP003",
    location: "Batticaloa",
    phase: "Approved",
    capacity: "600kW",
    timeline: "Q4 2024",
    status: "Approved",
    coordinates: { lat: 7.7102, lng: 81.6924 },
    estimatedCost: "LKR 18M",
    expectedCompletion: "2024-12-31",
    projectManager: "Rajesh Kumar",
    description: "Eastern province expansion project",
    milestones: [
      { name: "Site Survey", status: "Completed", date: "2024-01-10" },
      { name: "Environmental Approval", status: "Completed", date: "2024-01-25" },
      { name: "Construction", status: "Pending", date: "2024-08-01" },
    ],
  },
  {
    id: "EXP004",
    location: "Hambantota",
    phase: "Construction",
    capacity: "1MW",
    timeline: "Q1 2025",
    status: "Active",
    coordinates: { lat: 6.124, lng: 81.1185 },
    estimatedCost: "LKR 35M",
    expectedCompletion: "2025-03-31",
    projectManager: "Priya Wickramasinghe",
    description: "Major hub for southern province",
    milestones: [
      { name: "Site Survey", status: "Completed", date: "2023-11-15" },
      { name: "Environmental Approval", status: "Completed", date: "2023-12-20" },
      { name: "Construction", status: "In Progress", date: "2024-01-15" },
    ],
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: expansionPlans,
      total: expansionPlans.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch expansion plans" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const planData = await request.json()

    const newPlan = {
      id: `EXP${String(expansionPlans.length + 1).padStart(3, "0")}`,
      location: planData.location,
      phase: "Planning",
      capacity: planData.capacity,
      timeline: planData.timeline,
      status: "Pending",
      coordinates: planData.coordinates || { lat: 0, lng: 0 },
      estimatedCost: planData.estimatedCost,
      expectedCompletion: planData.expectedCompletion,
      projectManager: planData.projectManager,
      description: planData.description,
      milestones: [
        { name: "Site Survey", status: "Pending", date: "" },
        { name: "Environmental Approval", status: "Pending", date: "" },
        { name: "Construction", status: "Pending", date: "" },
      ],
    }

    expansionPlans.push(newPlan)

    return NextResponse.json({
      success: true,
      data: newPlan,
      message: "Expansion plan created successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create expansion plan" }, { status: 500 })
  }
}
