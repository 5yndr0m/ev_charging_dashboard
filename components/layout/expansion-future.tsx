"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TrendingUp, MapPin, Zap, FileText, Plus, Download } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

export function ExpansionFuture() {
  const [expansionPlans, setExpansionPlans] = useState([])
  const [complianceReports, setComplianceReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [exportFormat, setExportFormat] = useState("csv")
  const [showAddSiteModal, setShowAddSiteModal] = useState(false)
  const [newSiteForm, setNewSiteForm] = useState({
    location: "",
    capacity: "",
    timeline: "",
    phase: "",
    estimatedCost: "",
    description: "",
  })

  const fetchExpansionPlans = async () => {
    try {
      const response = await fetch("/api/expansion-plans")
      const result = await response.json()
      if (result.success) {
        setExpansionPlans(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch expansion plans:", error)
    }
  }

  const fetchComplianceReports = async () => {
    try {
      const response = await fetch("/api/compliance-reports")
      const result = await response.json()
      if (result.success) {
        setComplianceReports(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch compliance reports:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportPlans = async () => {
    try {
      const response = await fetch(`/api/export/plans?format=${exportFormat}&type=expansion`)

      if (exportFormat === "csv" || exportFormat === "json") {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `expansion-plans-${new Date().toISOString().split("T")[0]}.${exportFormat}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const result = await response.json()
        console.log("Export completed:", result)
      }
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  const handleSubmitNewSite = async () => {
    try {
      const response = await fetch("/api/expansion-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newSiteForm,
          status: "Planning",
          id: `SITE${Date.now()}`,
        }),
      })

      if (response.ok) {
        setShowAddSiteModal(false)
        setNewSiteForm({
          location: "",
          capacity: "",
          timeline: "",
          phase: "",
          estimatedCost: "",
          description: "",
        })
        fetchExpansionPlans() // Refresh the list
      }
    } catch (error) {
      console.error("Failed to add new site:", error)
    }
  }

  useEffect(() => {
    fetchExpansionPlans()
    fetchComplianceReports()
  }, [])

  const expansionStats = [
    { label: "Planned Stations", value: expansionPlans.length.toString(), icon: MapPin, color: "text-cyan-400" },
    { label: "Load Balancing Efficiency", value: "94.2%", icon: Zap, color: "text-green-400" },
    { label: "Renewable Capacity", value: "2.5 MW", icon: TrendingUp, color: "text-orange-400" },
    {
      label: "Compliance Reports",
      value: complianceReports.length.toString(),
      icon: FileText,
      color: "text-purple-400",
    },
  ]

  const loadBalancingData = [
    { hour: "00:00", demand: 45, supply: 50, efficiency: 90 },
    { hour: "06:00", demand: 120, supply: 125, efficiency: 96 },
    { hour: "12:00", demand: 200, supply: 195, efficiency: 97.5 },
    { hour: "18:00", demand: 180, supply: 185, efficiency: 97 },
    { hour: "24:00", demand: 60, supply: 65, efficiency: 92 },
  ]

  const renewableTracking = [
    { month: "Jan", solar: 450, wind: 120, total: 570 },
    { month: "Feb", solar: 520, wind: 140, total: 660 },
    { month: "Mar", solar: 480, wind: 110, total: 590 },
    { month: "Apr", solar: 610, wind: 160, total: 770 },
    { month: "May", solar: 580, wind: 150, total: 730 },
    { month: "Jun", solar: 670, wind: 180, total: 850 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">Expansion & Future Planning</h1>
          <p className="text-gray-400">Manage network expansion, load balancing, and regulatory compliance</p>
        </div>
        <div className="flex gap-3">
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className="w-24 bg-gray-800/50 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
            onClick={handleExportPlans}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Plans
          </Button>
          <Dialog open={showAddSiteModal} onOpenChange={setShowAddSiteModal}>
            <DialogTrigger asChild>
              <Button className="bg-cyan-500 text-black hover:bg-cyan-400">
                <Plus className="w-4 h-4 mr-2" />
                Add New Site
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-cyan-500/20 text-white">
              <DialogHeader>
                <DialogTitle className="text-cyan-400">Add New Expansion Site</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="location" className="text-gray-300">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={newSiteForm.location}
                    onChange={(e) => setNewSiteForm({ ...newSiteForm, location: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="e.g., Matara Station"
                  />
                </div>
                <div>
                  <Label htmlFor="capacity" className="text-gray-300">
                    Capacity
                  </Label>
                  <Input
                    id="capacity"
                    value={newSiteForm.capacity}
                    onChange={(e) => setNewSiteForm({ ...newSiteForm, capacity: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="e.g., 8 x 50kW DC"
                  />
                </div>
                <div>
                  <Label htmlFor="timeline" className="text-gray-300">
                    Timeline
                  </Label>
                  <Input
                    id="timeline"
                    value={newSiteForm.timeline}
                    onChange={(e) => setNewSiteForm({ ...newSiteForm, timeline: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="e.g., Q2 2024"
                  />
                </div>
                <div>
                  <Label htmlFor="phase" className="text-gray-300">
                    Phase
                  </Label>
                  <Input
                    id="phase"
                    value={newSiteForm.phase}
                    onChange={(e) => setNewSiteForm({ ...newSiteForm, phase: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="e.g., Phase 2 Expansion"
                  />
                </div>
                <div>
                  <Label htmlFor="cost" className="text-gray-300">
                    Estimated Cost
                  </Label>
                  <Input
                    id="cost"
                    value={newSiteForm.estimatedCost}
                    onChange={(e) => setNewSiteForm({ ...newSiteForm, estimatedCost: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="e.g., LKR 15M"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-gray-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newSiteForm.description}
                    onChange={(e) => setNewSiteForm({ ...newSiteForm, description: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Additional details about the expansion site..."
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSubmitNewSite} className="flex-1 bg-cyan-500 text-black hover:bg-cyan-400">
                    Add Site
                  </Button>
                  <Button
                    onClick={() => setShowAddSiteModal(false)}
                    variant="outline"
                    className="flex-1 bg-transparent border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {expansionStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                    </div>
                    <div className="p-3 bg-cyan-500/20 rounded-lg">
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Load Balancing Chart */}
        <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-cyan-400">Load Balancing Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={loadBalancingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #06b6d4",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="demand" stroke="#f59e0b" strokeWidth={2} name="Demand" />
                <Line type="monotone" dataKey="supply" stroke="#06b6d4" strokeWidth={2} name="Supply" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Renewable Energy Tracking */}
        <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-cyan-400">Renewable Energy Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={renewableTracking}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #06b6d4",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="solar" stackId="a" fill="#f59e0b" name="Solar" />
                <Bar dataKey="wind" stackId="a" fill="#10b981" name="Wind" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expansion Plan */}
        <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-cyan-400">Network Expansion Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-400">Loading expansion plans...</div>
              </div>
            ) : (
              <div className="space-y-4">
                {expansionPlans.map((site) => (
                  <div
                    key={site.id}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
                  >
                    <div>
                      <p className="font-medium text-white">{site.location}</p>
                      <p className="text-sm text-gray-400">
                        {site.capacity} • <span className="text-cyan-400">{site.timeline}</span>
                      </p>
                      <p className="text-sm text-gray-400">{site.phase}</p>
                      <p className="text-xs text-gray-500">{site.estimatedCost}</p>
                    </div>
                    <Badge
                      variant={site.status === "Active" ? "default" : "outline"}
                      className={
                        site.status === "Active"
                          ? "bg-green-500/20 text-green-400 border-green-500/50"
                          : site.status === "Approved"
                            ? "text-cyan-400 border-cyan-400 bg-cyan-500/10"
                            : site.status === "In Progress"
                              ? "text-yellow-400 border-yellow-400 bg-yellow-500/10"
                              : "text-red-400 border-red-400 bg-red-500/10"
                      }
                    >
                      {site.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Compliance Reports */}
        <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-cyan-400">Government Compliance Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-400">Loading compliance reports...</div>
              </div>
            ) : (
              <div className="space-y-4">
                {complianceReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
                  >
                    <div>
                      <p className="font-medium text-white">{report.report}</p>
                      <p className="text-sm text-gray-400">
                        Due: <span className="text-cyan-400">{report.dueDate}</span> • {report.authority}
                      </p>
                      <p className="text-xs text-gray-500">{report.reportType}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        report.status === "Approved"
                          ? "text-green-400 border-green-400 bg-green-500/10"
                          : report.status === "Submitted"
                            ? "text-blue-400 border-blue-400 bg-blue-500/10"
                            : report.status === "In Review"
                              ? "text-yellow-400 border-yellow-400 bg-yellow-500/10"
                              : "text-red-400 border-red-400 bg-red-500/10"
                      }
                    >
                      {report.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
