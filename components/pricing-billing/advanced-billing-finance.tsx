"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Download, Settings, Edit2, FileText, TrendingUp, DollarSign } from "lucide-react"

interface BillingSettings {
  vatRate: number
  serviceChargeRate: number
  minimumSessionFee: number
  idleFeePerMinute: number
  earlyBirdDiscount: number
  nightChargingDiscount: number
}

interface SessionRevenue {
  id: string
  date: string
  userId: string
  vehicleType: string
  energyConsumed: number
  duration: number
  baseRate: number
  surge: number
  discount: number
  tax: number
  totalCost: number
  paymentMethod: string
  status: "completed" | "pending" | "failed"
}

interface RevenueBreakdown {
  month: string
  directSolar: number
  storageSolar: number
  grid: number
  totalRevenue: number
  avgSessionCost: number
}

export function AdvancedBillingFinance() {
  const [activeTab, setActiveTab] = useState("settings")
  const [billingSettings, setBillingSettings] = useState<BillingSettings>({
    vatRate: 8,
    serviceChargeRate: 2.5,
    minimumSessionFee: 50,
    idleFeePerMinute: 2,
    earlyBirdDiscount: 10,
    nightChargingDiscount: 20,
  })

  const [editingSettings, setEditingSettings] = useState(false)
  const [tempSettings, setTempSettings] = useState(billingSettings)

  // Session-level revenue data
  const [sessionRevenue] = useState<SessionRevenue[]>([
    {
      id: "TRX001",
      date: "2024-01-21 09:15",
      userId: "USR001",
      vehicleType: "Tesla Model 3",
      energyConsumed: 15.5,
      duration: 42,
      baseRate: 25.5,
      surge: 1.1,
      discount: 0,
      tax: 35.48,
      totalCost: 421.23,
      paymentMethod: "Visa *1234",
      status: "completed",
    },
    {
      id: "TRX002",
      date: "2024-01-21 11:30",
      userId: "USR002",
      vehicleType: "Nissan Leaf",
      energyConsumed: 22.3,
      duration: 58,
      baseRate: 32.75,
      surge: 1.0,
      discount: 1.05,
      tax: 51.23,
      totalCost: 683.45,
      paymentMethod: "MasterCard *5678",
      status: "completed",
    },
    {
      id: "TRX003",
      date: "2024-01-21 14:45",
      userId: "USR003",
      vehicleType: "BYD Dolphin",
      energyConsumed: 18.2,
      duration: 50,
      baseRate: 28.5,
      surge: 1.15,
      discount: 1.2,
      tax: 42.15,
      totalCost: 525.87,
      paymentMethod: "PayPal",
      status: "completed",
    },
  ])

  // Revenue breakdown by source
  const [revenueData] = useState<RevenueBreakdown[]>([
    {
      month: "Jan",
      directSolar: 45000,
      storageSolar: 28000,
      grid: 32000,
      totalRevenue: 105000,
      avgSessionCost: 425,
    },
    {
      month: "Feb",
      directSolar: 48000,
      storageSolar: 31000,
      grid: 35000,
      totalRevenue: 114000,
      avgSessionCost: 435,
    },
    {
      month: "Mar",
      directSolar: 52000,
      storageSolar: 35000,
      grid: 38000,
      totalRevenue: 125000,
      avgSessionCost: 450,
    },
    {
      month: "Apr",
      directSolar: 50000,
      storageSolar: 33000,
      grid: 36000,
      totalRevenue: 119000,
      avgSessionCost: 440,
    },
    {
      month: "May",
      directSolar: 55000,
      storageSolar: 38000,
      grid: 42000,
      totalRevenue: 135000,
      avgSessionCost: 465,
    },
    {
      month: "Jun",
      directSolar: 62000,
      storageSolar: 42000,
      grid: 48000,
      totalRevenue: 152000,
      avgSessionCost: 485,
    },
  ])

  const handleSaveSettings = () => {
    setBillingSettings(tempSettings)
    setEditingSettings(false)
  }

  const totalRevenue = revenueData.reduce((sum, month) => sum + month.totalRevenue, 0)
  const averageMonthlyRevenue = totalRevenue / revenueData.length
  const totalSessions = sessionRevenue.length
  const averageSessionCost = sessionRevenue.reduce((sum, s) => sum + s.totalCost, 0) / totalSessions

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Advanced Billing & Finance</h2>
        <Button className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30">
          <Download className="w-4 h-4 mr-2" />
          Export All Reports
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total 6-Month Revenue</p>
                <p className="text-3xl font-bold text-green-400">₨{(totalRevenue / 100000).toFixed(1)}L</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Avg Monthly Revenue</p>
              <p className="text-3xl font-bold text-cyan-400">₨{(averageMonthlyRevenue / 1000).toFixed(0)}K</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Sessions</p>
              <p className="text-3xl font-bold text-blue-400">{(totalSessions * 250).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Avg Session Cost</p>
              <p className="text-3xl font-bold text-yellow-400">₨{averageSessionCost.toFixed(0)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-cyan-500/20">
          <TabsTrigger value="settings">Billing Settings</TabsTrigger>
          <TabsTrigger value="sessions">Session Revenue</TabsTrigger>
          <TabsTrigger value="breakdown">Revenue Breakdown</TabsTrigger>
          <TabsTrigger value="exports">Export Reports</TabsTrigger>
        </TabsList>

        {/* Billing Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-cyan-400" />
                  Configure Billing Rules
                </CardTitle>
                {!editingSettings && (
                  <Button
                    onClick={() => {
                      setEditingSettings(true)
                      setTempSettings(billingSettings)
                    }}
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Settings
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {editingSettings ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">VAT Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={tempSettings.vatRate}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, vatRate: Number.parseFloat(e.target.value) })
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">Tax applied to all transactions</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Service Charge Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={tempSettings.serviceChargeRate}
                        onChange={(e) =>
                          setTempSettings({
                            ...tempSettings,
                            serviceChargeRate: Number.parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">Service fee on each transaction</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Minimum Session Fee (₨)</label>
                      <input
                        type="number"
                        value={tempSettings.minimumSessionFee}
                        onChange={(e) =>
                          setTempSettings({
                            ...tempSettings,
                            minimumSessionFee: Number.parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">Minimum charge per session</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Idle Fee (₨/minute)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={tempSettings.idleFeePerMinute}
                        onChange={(e) =>
                          setTempSettings({
                            ...tempSettings,
                            idleFeePerMinute: Number.parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">Fee after vehicle stays post-charge</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Early Bird Discount (%)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={tempSettings.earlyBirdDiscount}
                        onChange={(e) =>
                          setTempSettings({
                            ...tempSettings,
                            earlyBirdDiscount: Number.parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">Discount for bookings before 7 AM</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Night Charging Discount (%)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={tempSettings.nightChargingDiscount}
                        onChange={(e) =>
                          setTempSettings({
                            ...tempSettings,
                            nightChargingDiscount: Number.parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-cyan-500/30 rounded text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">Discount for 22:00 - 05:00 charging</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-cyan-500/20">
                    <Button
                      onClick={handleSaveSettings}
                      className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => setEditingSettings(false)}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-800/50 rounded border border-cyan-500/20">
                    <p className="text-sm text-gray-400 mb-2">VAT Rate</p>
                    <p className="text-2xl font-bold text-cyan-400">{billingSettings.vatRate}%</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded border border-cyan-500/20">
                    <p className="text-sm text-gray-400 mb-2">Service Charge</p>
                    <p className="text-2xl font-bold text-cyan-400">{billingSettings.serviceChargeRate}%</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded border border-cyan-500/20">
                    <p className="text-sm text-gray-400 mb-2">Min Session Fee</p>
                    <p className="text-2xl font-bold text-cyan-400">₨{billingSettings.minimumSessionFee}</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded border border-cyan-500/20">
                    <p className="text-sm text-gray-400 mb-2">Idle Fee</p>
                    <p className="text-2xl font-bold text-cyan-400">₨{billingSettings.idleFeePerMinute}/min</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded border border-cyan-500/20">
                    <p className="text-sm text-gray-400 mb-2">Early Bird Discount</p>
                    <p className="text-2xl font-bold text-green-400">{billingSettings.earlyBirdDiscount}%</p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded border border-cyan-500/20">
                    <p className="text-sm text-gray-400 mb-2">Night Charging Discount</p>
                    <p className="text-2xl font-bold text-green-400">{billingSettings.nightChargingDiscount}%</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Session Revenue */}
        <TabsContent value="sessions" className="space-y-6">
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white">Recent Charging Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessionRevenue.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 bg-gray-800/50 rounded border border-cyan-500/20 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-white font-semibold">{session.id}</p>
                        <Badge
                          className={
                            session.status === "completed"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          }
                        >
                          {session.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        {session.vehicleType} • {session.date}
                      </p>
                      <div className="grid grid-cols-4 gap-4 text-xs">
                        <div>
                          <p className="text-gray-400">Energy</p>
                          <p className="text-white font-semibold">{session.energyConsumed} kWh</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Duration</p>
                          <p className="text-white font-semibold">{session.duration} min</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Base Rate</p>
                          <p className="text-white font-semibold">₨{session.baseRate}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Multiplier</p>
                          <p className="text-white font-semibold">x{session.surge.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400 mb-2">Total Cost</p>
                      <p className="text-2xl font-bold text-cyan-400">₨{session.totalCost.toFixed(0)}</p>
                      <p className="text-xs text-gray-400 mt-1">{session.paymentMethod}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Breakdown */}
        <TabsContent value="breakdown" className="space-y-6">
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white">Revenue by Energy Source (6 months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="directSolar" fill="#10b981" name="Direct Solar" />
                    <Bar dataKey="storageSolar" fill="#f59e0b" name="Storage Solar" />
                    <Bar dataKey="grid" fill="#ef4444" name="Grid" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white">Total Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="totalRevenue"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      name="Total Revenue"
                    />
                    <Line
                      type="monotone"
                      dataKey="avgSessionCost"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Avg Session Cost"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Reports */}
        <TabsContent value="exports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Daily Revenue Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-400">Export detailed daily revenue summary with session breakdown</p>
                <Button className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30">
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Monthly Revenue Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-400">Export monthly revenue trends and forecasts</p>
                <Button className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-cyan-400" />
                  Session-Level Invoice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-400">Export detailed session invoices with cost breakdown</p>
                <Button className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30">
                  <Download className="w-4 h-4 mr-2" />
                  Download Excel
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Tax & Compliance Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-400">Export tax summary for regulatory compliance</p>
                <Button className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
