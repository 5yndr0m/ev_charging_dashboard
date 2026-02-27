"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Clock, Zap, Settings } from "lucide-react";

import PeakHourScheduling from "@/components/peak hour/PeakHourScheduling";
import LoadShavingAndShifting from "@/components/peak hour/LoadShavingAndShifting";
import SolarPriorityCharging from "@/components/peak hour/SolarPriorityCharging";

interface Props {
  stations: any[]   // ✅ MUST BE RECEIVED AS PROP
}

export default function LoadManagementMain({ stations }: Props) {   // ✅ FIX
  const [activeTab, setActiveTab] = useState("peak");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">
            Peak Hour & Load Management
          </h1>
          <p className="text-gray-400">
            Smart scheduling, power optimization, and grid-aware load control.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">

          {/* Tab 1 - Peak Hour Scheduling */}
          <TabsTrigger
            value="peak"
            className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400"
          >
            <Clock className="w-4 h-4" />
            Peak Hour Scheduling
          </TabsTrigger>

          {/* Tab 2 - Load Shaving & Shifting */}
          <TabsTrigger
            value="load-shift"
            className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400"
          >
            <Zap className="w-4 h-4" />
            Load Shaving & Shifting
          </TabsTrigger>

          {/* Tab 3 - Solar Priority Charging */}
          <TabsTrigger
            value="system-control"
            className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400"
          >
            <Settings className="w-4 h-4" />
            Solar Priority Charging
          </TabsTrigger>

        </TabsList>

        {/* Tab 1 - Peak Hour Scheduling */}
        <TabsContent value="peak">
          <PeakHourScheduling />
        </TabsContent>

        {/* Tab 2 - Load Shaving & Shifting */}
        <TabsContent value="load-shift">
          <LoadShavingAndShifting />
        </TabsContent>

        {/* Tab 3 - Solar Priority Charging */}
        <TabsContent value="system-control">
          <SolarPriorityCharging />
        </TabsContent>

      </Tabs>
    </div>
  );
}
