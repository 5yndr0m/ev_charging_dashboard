"use client"

import { motion } from "framer-motion"
import {
  Building2,
  BarChart3,
  Zap,
  CreditCard,
  Shield,
  Bell,
  TrendingUp,
  Calendar,
  LayoutDashboard,
  Car,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { logout } = useAuth()
  const menuItems = [
    {
      id: "overview",
      label: "System Overview",
      icon: LayoutDashboard,
      subItems: ["Dashboard", "KPIs", "Network Map", "Analytics"],
    },
    {
      id: "stations",
      label: "Stations & Infrastructure",
      icon: Building2,
      subItems: ["Stations", "Maintenance"],
    },
    {
      id: "pricing-billing",
      label: "Pricing & Billing",
      icon: CreditCard,
      subItems: ["Smart Pricing System", "Billing & Finance"],
    },
    {
      id: "vehicle-management",
      label: "Vehicle Management",
      icon: Car,
      subItems: ["Overview", "Vehicle Categories", "Vehicle Activity & Fleet", "Vehicle & User Management"],
    },
    {
      id: "charger-management",
      label: "Charger Management",
      icon: Zap,
      subItems: ["Edit Chargers", "Status", "Pricing Options"],
    },
    {
      id: "load-management",
      label: "Peak-Hour & Load Management",
      icon: TrendingUp,
      subItems: ["Peak Scheduling", "Load Shifting", "Real-time Status"],
    },
    {
      id: "maintenance",
      label: "Maintenance & Monitoring",
      icon: Shield,
      subItems: ["Health Monitoring", "Maintenance Schedule", "Fault History", "Analytics"],
    },
    {
      id: "bookings",
      label: "Booking Management",
      icon: Calendar,
      subItems: ["All Bookings", "Active Sessions", "Scheduling", "Reports"],
    },
    {
      id: "reports",
      label: "Reports & Analytics",
      icon: BarChart3,
      subItems: ["Energy Usage", "Charger Utilization", "Financial Reports", "Environmental Reports"],
    },
    {
      id: "admin",
      label: "System Administration",
      icon: Shield,
      subItems: ["User Roles", "Access Logs", "Settings", "Integrations"],
    },
    {
      id: "notifications",
      label: "Notifications & Alerts",
      icon: Bell,
      subItems: ["Real-time Alerts", "Communication", "Predictive Warnings"],
    },
    {
      id: "expansion",
      label: "Expansion & Future",
      icon: TrendingUp,
      subItems: ["Multi-Station Management", "Load Balancing", "Renewable Tracking", "Government Reporting"],
    },
  ]

  return (
    <div className="w-80 shrink-0 bg-gray-900/50 border-r border-cyan-500/20 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Zap className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-cyan-400">Central EMS</h1>
            <p className="text-sm text-gray-400">Dashboard</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id

            return (
              <motion.button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                  isActive
                    ? "bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/20"
                    : "text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10",
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </motion.button>
            )
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-cyan-500/20">
        <motion.button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-400 hover:bg-red-500/10 transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Log Out</span>
        </motion.button>
      </div>
    </div>
  )
}
