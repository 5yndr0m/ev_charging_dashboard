// API client utilities for backend integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

const getHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}


// User APIs
export async function fetchUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/users`, { headers: getHeaders() })
    return await response.json()
  } catch (error) {
    console.error("Error fetching users:", error)
    return { success: false, data: [] }
  }
}

export async function fetchUserStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/users/stats`, { headers: getHeaders() })
    return await response.json()
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return { success: false, data: {} }
  }
}

// Vehicle APIs
export async function fetchVehicles() {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles`, { headers: getHeaders() })
    return await response.json()
  } catch (error) {
    console.error("Error fetching vehicles:", error)
    return { success: false, data: [] }
  }
}

export async function fetchVehicleStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/stats`, { headers: getHeaders() })
    return await response.json()
  } catch (error) {
    console.error("Error fetching vehicle stats:", error)
    return { success: false, data: {} }
  }
}

// Charger APIs - PRIORITY
export async function fetchChargers(stationId?: string) {
  try {
    const url = stationId ? `${API_BASE_URL}/chargers?stationId=${stationId}` : `${API_BASE_URL}/chargers`
    const response = await fetch(url, { headers: getHeaders() })
    return await response.json()
  } catch (error) {
    console.error("Error fetching chargers:", error)
    return { success: false, data: [] }
  }
}

export async function fetchChargerStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/chargers/stats`, { headers: getHeaders() })
    return await response.json()
  } catch (error) {
    console.error("Error fetching charger stats:", error)
    return { success: false, data: {} }
  }
}

export async function updateChargerStatus(chargerId: string, status: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/chargers/${chargerId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    })
    return await response.json()
  } catch (error) {
    console.error("Error updating charger status:", error)
    return { success: false }
  }
}

// Booking APIs
export async function fetchBookings(filters?: Record<string, string>) {
  try {
    const params = new URLSearchParams(filters || {})
    const response = await fetch(`${API_BASE_URL}/bookings?${params}`, { headers: getHeaders() })
    return await response.json()
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return { success: false, data: [] }
  }
}

export async function fetchBookingStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/stats`, { headers: getHeaders() })
    return await response.json()
  } catch (error) {
    console.error("Error fetching booking stats:", error)
    return { success: false, data: {} }
  }
}

export async function createBooking(bookingData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(bookingData),
    })
    return await response.json()
  } catch (error) {
    console.error("Error creating booking:", error)
    return { success: false }
  }
}

// Station APIs
export async function fetchStations() {
  try {
    const response = await fetch(`${API_BASE_URL}/stations`, { headers: getHeaders() })
    return await response.json()
  } catch (error) {
    console.error("Error fetching stations:", error)
    return { success: false, data: [] }
  }
}

export async function fetchStationDetail(stationId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/stations/${stationId}`, { headers: getHeaders() })
    return await response.json()
  } catch (error) {
    console.error("Error fetching station detail:", error)
    return { success: false, data: null }
  }
}

export async function fetchSystemStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/stations/stats`, { headers: getHeaders() })
    console.log(`fetchSystemStats: status=${response.status}`)
    const text = await response.text()
    console.log(`fetchSystemStats: body=${text}`)
    if (!response.ok) {
      console.error(`fetchSystemStats failed: ${response.status} ${text}`)
      return null
    }
    return JSON.parse(text)
  } catch (error) {
    console.error("Error fetching system stats:", error)
    return null
  }
}

// Analytics APIs
export async function fetchAnalytics(resource: string, filters?: Record<string, string>) {
  try {
    const params = new URLSearchParams(filters || {})
    const response = await fetch(`${API_BASE_URL}/analytics/${resource}?${params}`, { headers: getHeaders() })
    return await response.json()
  } catch (error) {
    console.error(`Error fetching analytics for ${resource}:`, error)
    return { success: false, data: [] }
  }
}

// Fleet APIs
export async function fetchFleets() {
  try {
    const response = await fetch(`${API_BASE_URL}/fleets`, { headers: getHeaders() })
    return await response.json()
  } catch (error) {
    console.error("Error fetching fleets:", error)
    return { success: false, data: [] }
  }
}

export async function createFleet(data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/fleets`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return await response.json()
  } catch (error) {
    console.error("Error creating fleet:", error)
    return { success: false }
  }
}

// Auth Stats API
export async function fetchAuthStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/stats`, { headers: getHeaders() })
    return await response.json()
  } catch (error) {
    console.error("Error fetching auth stats:", error)
    return { stats: [], recentEvents: [] }
  }
}
