"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { SystemOverview } from "@/components/admin-system/system-overview"
import { StationsGrid } from "@/components/station-infrastructure/stations-grid"
import { StationDetail } from "@/components/station-infrastructure/station-detail"
import { Reports } from "@/components/analytics-reports/reports"
import { SystemAdmin } from "@/components/admin-system/system-admin"
import { NotificationsAlerts } from "@/components/monitoring/notifications-alerts"
import { ExpansionFuture } from "@/components/layout/expansion-future"
import BookingManagement from "@/components/bookings/booking-management"
import { PricingBillingMain } from "@/components/pricing-billing/pricing-billing-main"
import { StationChargerManagement } from "@/components/StationChargerManagement/station-charger-management"
import { MaintenanceMonitoringSystem } from "@/components/MaintenanceMonitoringSystem/maintenance-monitoring-system"
import { VehicleManagementMain } from "@/components/vehicle-management/vehicle-management-main"
import PeakHourLoadManagement from "@/components/peak hour/loadmanagment main"
import { fetchStations } from "@/lib/api-client"

export default function Dashboard() {
  const [activeView, setActiveView] = useState("overview")
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [stations, setStations] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchStations();
      // Only set stations if data is an array (API check)
      if (Array.isArray(data)) {
        setStations(data);
      }
    };
    loadData();
  }, []);

  const renderContent = () => {
    if (selectedStation) {
      const station = stations.find((s) => s.id === selectedStation || s._id === selectedStation)
      if (station) {
        return <StationDetail station={station} onBack={() => setSelectedStation(null)} />
      }
    }

    switch (activeView) {
      case "overview":
        return <SystemOverview />
      case "stations":
        return <StationsGrid stations={stations} onStationSelect={setSelectedStation} />
      case "pricing-billing":
        return <PricingBillingMain />
      case "vehicle-management":
        return <VehicleManagementMain />
      case "charger-management":
        return <StationChargerManagement stations={stations} />
      case "load-management":
        return <PeakHourLoadManagement stations={stations} />
      case "maintenance":
        return <MaintenanceMonitoringSystem stations={stations} />
      case "bookings":
        return <BookingManagement />
      case "reports":
        return <Reports />
      case "admin":
        return <SystemAdmin />
      case "notifications":
        return <NotificationsAlerts />
      case "expansion":
        return <ExpansionFuture />
      default:
        return <SystemOverview />
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            key={activeView + selectedStation}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>

      <RightSidebar isOpen={isRightSidebarOpen} onToggle={() => setIsRightSidebarOpen(!isRightSidebarOpen)} />
    </div>
  )
}
