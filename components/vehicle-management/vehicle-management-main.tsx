"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, Users, Activity, LayoutGrid } from "lucide-react"
import { VehicleManagementOverview } from "@/components/vehicle-management/vehicle-management-overview"
import { VehicleCategorySection } from "@/components/vehicle-management/vehicle-category-section"
import { VehicleActivityFleetDashboard } from "@/components/vehicle-management/vehicle-activity-fleet-dashboard"
import { VehicleManagement } from "@/components/vehicle-management/vehicle-management"

export function VehicleManagementMain() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">Vehicle Management</h1>
          <p className="text-gray-400">Comprehensive vehicle and fleet management system</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 flex items-center gap-2 text-gray-400"
          >
            <LayoutGrid className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 flex items-center gap-2 text-gray-400"
          >
            <Car className="w-4 h-4" />
            Vehicle Categories
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 flex items-center gap-2 text-gray-400"
          >
            <Activity className="w-4 h-4" />
            Vehicle Activity & Fleet
          </TabsTrigger>
          <TabsTrigger
            value="user-management"
            className="text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 flex items-center gap-2 text-gray-400"
          >
            <Users className="w-4 h-4" />
            Vehicle & User Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <VehicleManagementOverview />
        </TabsContent>

        <TabsContent value="categories">
          <VehicleCategorySection />
        </TabsContent>

        <TabsContent value="activity">
          <VehicleActivityFleetDashboard />
        </TabsContent>

        <TabsContent value="user-management">
          <VehicleManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
