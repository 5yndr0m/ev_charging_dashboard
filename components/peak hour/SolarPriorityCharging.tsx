"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Sun,
  Settings,
  TrendingUp,
  BarChart3,
  Battery,
  Zap,
  Activity,
  AlertCircle,
  CheckCircle,
  MapPin,
  Power,
  Cloud,
  CloudRain,
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts"
import { stationsData } from "@/lib/data"

interface Props {
  stations: any[]   // ✅ FIX: Accept stations as props
}

type ChargingMode = "Solar-Only" | "Storage-Only" | "Hybrid" | "Grid-Priority" | "Smart-Auto"

export default function SolarChargingDashboard() {
  const [stationModes, setStationModes] = useState<Record<string, ChargingMode>>(
    Object.fromEntries(stationsData.stations.map((s) => [s.id, "Smart-Auto" as ChargingMode])),
  )

  const [chargerModes, setChargerModes] = useState<Record<string, ChargingMode>>({})

  const metrics = useMemo(() => {
    const stations = stationsData.stations

    const totalSolarProduction = stations.reduce((sum, s) => sum + s.solarPV, 0)
    const totalSiteLoad = stations.reduce((sum, s) => sum + s.peakDemand * 0.6, 0)
    const totalGridImport = stations.reduce((sum, s) => sum + s.gridDraw * 0.7, 0)
    const totalStorageCapacity = stations.reduce((sum, s) => sum + s.storagesolarpower, 0)
    const currentStoredEnergy = totalStorageCapacity * 0.65

    const solarAvailableForCharging = totalSolarProduction * 0.8
    const solarUtilization = Math.round((totalSolarProduction / totalSiteLoad) * 100)
    const solarToChargingRatio = Math.round((solarAvailableForCharging / totalSiteLoad) * 100)

    return {
      totalSolarProduction,
      totalSiteLoad,
      totalGridImport,
      solarAvailableForCharging,
      solarUtilization,
      solarToChargingRatio,
      totalStorageCapacity,
      currentStoredEnergy,
      networkAverageSOC: 65,
      chargeRate: 85,
      dischargeRate: 120,
    }
  }, [])

  const solarLiveData = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 7 }, (_, i) => {
      const time = new Date(now.getTime() - (6 - i) * 10 * 60 * 1000)
      const hour = time.getHours() + time.getMinutes() / 60
      const solarMultiplier = Math.max(0, Math.sin(((hour - 6) * Math.PI) / 12))

      return {
        time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        solar: Math.round(metrics.totalSolarProduction * solarMultiplier * (0.8 + Math.random() * 0.2)),
      }
    })
  }, [metrics])

  const stationMetrics = useMemo(() => {
    return stationsData.stations.map((station) => {
      const solarAvailable = station.solarPV * (0.7 + Math.random() * 0.3)
      const currentLoad = station.peakDemand * (0.4 + Math.random() * 0.3)
      const solarUtilization = Math.min(100, Math.round((currentLoad / solarAvailable) * 100))

      let solarHealth: "Good" | "Moderate" | "Low"
      if (solarUtilization < 70) solarHealth = "Good"
      else if (solarUtilization < 90) solarHealth = "Moderate"
      else solarHealth = "Low"

      let status: "solar" | "hybrid" | "grid"
      if (solarAvailable >= currentLoad) status = "solar"
      else if (solarAvailable >= currentLoad * 0.5) status = "hybrid"
      else status = "grid"

      return {
        ...station,
        solarAvailable: Math.round(solarAvailable * 10) / 10,
        currentLoad: Math.round(currentLoad * 10) / 10,
        solarUtilization,
        solarHealth,
        status,
      }
    })
  }, [])

  const storageTimelineData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i
      const solarMultiplier = Math.max(0, Math.sin(((hour - 6) * Math.PI) / 12))
      const soc = 40 + solarMultiplier * 40 + Math.random() * 10

      return {
        time: `${hour.toString().padStart(2, "0")}:00`,
        soc: Math.round(soc),
      }
    })
  }, [])

  const gridLoadData = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 7 }, (_, i) => {
      const time = new Date(now.getTime() - (6 - i) * 10 * 60 * 1000)

      return {
        time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        gridLoad: Math.round(metrics.totalGridImport * (0.8 + Math.random() * 0.4)),
      }
    })
  }, [metrics])

  const hourlyForecast = [
    { time: "Now", solar: 28, condition: "Sunny", notes: "Peak ramp-up in progress" },
    { time: "+15 min", solar: 30, condition: "Sunny", notes: "High stability" },
    { time: "+30 min", solar: 27, condition: "Slight cloud", notes: "10% dip expected" },
    { time: "+45 min", solar: 32, condition: "Clear", notes: "Micro-fluctuations" },
    { time: "+60 min", solar: 29, condition: "Partly Cloudy", notes: "Expected smoothing" },
  ]

  const weeklyForecast = [
    { day: "Monday", kwh: 145, score: 82, weather: "Mostly Sunny" },
    { day: "Tuesday", kwh: 138, score: 78, weather: "Sunny w/ clouds" },
    { day: "Wednesday", kwh: 120, score: 69, weather: "High clouds" },
    { day: "Thursday", kwh: 160, score: 88, weather: "Excellent" },
    { day: "Friday", kwh: 152, score: 84, weather: "Clear" },
    { day: "Saturday", kwh: 110, score: 61, weather: "Rain patches" },
    { day: "Sunday", kwh: 130, score: 72, weather: "Partly cloudy" },
  ]

  const stationForecasts = [
    { station: "S1", location: "Colombo", peak: 27, quality: "Moderate", notes: "Cloudy mid-day" },
    { station: "S2", location: "Kandy", peak: 22, quality: "Medium", notes: "Foggy morning" },
    { station: "S3", location: "Galle", peak: 33, quality: "High", notes: "Stable" },
    { station: "S4", location: "Negombo", peak: 30, quality: "High", notes: "Good sunlight" },
    { station: "S5", location: "Ratnapura", peak: 28, quality: "Medium", notes: "Afternoon showers" },
    { station: "S6", location: "Kurunegala", peak: 31, quality: "High", notes: "Good irradiance" },
    { station: "S7", location: "Anuradhapura", peak: 36, quality: "Excellent", notes: "Peak solar" },
    { station: "S8", location: "Jaffna", peak: 35, quality: "Excellent", notes: "Best performer" },
    { station: "S9", location: "Matara", peak: 35, quality: "Excellent", notes: "Best performer" },
    { station: "S10", location: "Badulla", peak: 20, quality: "Low", notes: "Cloudy" },
  ]

  const getStatusColor = (status: "solar" | "hybrid" | "grid") => {
    switch (status) {
      case "solar":
        return "bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]/50"
      case "hybrid":
        return "bg-[#ffdd00]/20 text-[#ffdd00] border-[#ffdd00]/50"
      case "grid":
        return "bg-[#ff0080]/20 text-[#ff0080] border-[#ff0080]/50"
    }
  }

  const getHealthColor = (health: "Good" | "Moderate" | "Low") => {
    switch (health) {
      case "Good":
        return "text-[#00ff41]"
      case "Moderate":
        return "text-[#ffdd00]"
      case "Low":
        return "text-[#ff0080]"
    }
  }

  const getQualityColor = (quality: string) => {
    if (quality === "Excellent") return "text-[#00ff41]"
    if (quality === "High") return "text-[#00ffff]"
    if (quality === "Medium" || quality === "Moderate") return "text-[#ffdd00]"
    return "text-[#ff0080]"
  }

  return (


    <Tabs defaultValue="dashboard" className="space-y-6">
      <TabsList className="grid grid-cols-5 w-full bg-black border border-[#00ffff]/30">
        <TabsTrigger
          value="dashboard"
          className="data-[state=active]:bg-[#00ff41]/20 data-[state=active]:text-[#00ff41] data-[state=active]:border-[#00ff41]/50 text-[#00ff41]"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Direct Solar Power
        </TabsTrigger>
        <TabsTrigger
          value="storage"
          className="data-[state=active]:bg-[#ff6600]/20 data-[state=active]:text-[#ff6600] data-[state=active]:border-[#ff6600]/50 text-[#ff6600]"
        >
          <Battery className="w-4 h-4 mr-2" />
          Storage
        </TabsTrigger>
        <TabsTrigger
          value="grid"
          className="data-[state=active]:bg-[#0080ff]/20 data-[state=active]:text-[#0080ff] data-[state=active]:border-[#0080ff]/50 text-[#0080ff]"
        >
          <Zap className="w-4 h-4 mr-2" />
          Grid
        </TabsTrigger>
        <TabsTrigger
          value="forecast"
          className="data-[state=active]:bg-[#00ffff]/20 data-[state=active]:text-[#00ffff] data-[state=active]:border-[#00ffff]/50 text-[#00ffff]"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Forecast
        </TabsTrigger>
        <TabsTrigger
          value="settings"
          className="data-[state=active]:bg-[#ff00ff]/20 data-[state=active]:text-[#ff00ff] data-[state=active]:border-[#ff00ff]/50 text-[#ff00ff]"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </TabsTrigger>
      </TabsList>

      {/* ==================== TAB 1: Direct Solar Power ==================== */}
      <TabsContent value="dashboard" className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-black border-[#00ff41]/30 shadow-lg shadow-[#00ff41]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#00ff41]/70">Total Solar Production</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#00ff41]">{metrics.totalSolarProduction} kW</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-[#ffdd00]/30 shadow-lg shadow-[#ffdd00]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#ffdd00]/70">Solar Available for EV Charging</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#ffdd00]">
                {Math.round(metrics.solarAvailableForCharging)} kW
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border-[#0080ff]/30 shadow-lg shadow-[#0080ff]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#0080ff]/70">Combined Site Loads</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#0080ff]">{Math.round(metrics.totalSiteLoad)} kW</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-[#00ffff]/30 shadow-lg shadow-[#00ffff]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#00ffff]/70">Solar Utilization %</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#00ffff]">{metrics.solarUtilization}%</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-[#ff00ff]/30 shadow-lg shadow-[#ff00ff]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#ff00ff]/70">Solar → Charging Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#ff00ff]">{metrics.solarToChargingRatio}%</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-black border-[#00ff41]/30 shadow-lg shadow-[#00ff41]/10">
          <CardHeader>
            <CardTitle className="text-[#00ffff] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#00ff41]" />
              Real-Time Solar Production Curve (Network-Wide)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={solarLiveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00ffff20" />
                <XAxis dataKey="time" stroke="#00ffff" />
                <YAxis
                  stroke="#00ffff"
                  label={{ value: "kW", angle: -90, position: "insideLeft", fill: "#00ffff" }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#000", border: "1px solid #00ffff", color: "#00ffff" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="solar"
                  stroke="#00ff41"
                  strokeWidth={3}
                  name="Solar Output"
                  dot={{ fill: "#00ff41", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div>
          <h3 className="text-xl font-bold text-[#00ffff] mb-4">Station-Level Solar Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {stationMetrics.map((station) => (
              <Card
                key={station.id}
                className={`bg-black ${station.status === "solar"
                  ? "border-[#00ff41]/50 shadow-lg shadow-[#00ff41]/10"
                  : station.status === "hybrid"
                    ? "border-[#ffdd00]/50 shadow-lg shadow-[#ffdd00]/10"
                    : "border-[#ff0080]/50 shadow-lg shadow-[#ff0080]/10"
                  }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-[#00ffff] flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {station.id}
                    </CardTitle>
                    <Badge className={getStatusColor(station.status)}>
                      {station.status === "solar" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {station.status === "hybrid" && <Activity className="w-3 h-3 mr-1" />}
                      {station.status === "grid" && <AlertCircle className="w-3 h-3 mr-1" />}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#00ffff]/60">{station.location}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#00ffff]/60">Solar Available</span>
                    <span className="text-sm font-bold text-[#00ff41]">{station.solarAvailable} kW</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#00ffff]/60">Utilization</span>
                    <span className="text-sm font-bold text-[#ffdd00]">{station.solarUtilization}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#00ffff]/60">Solar Health</span>
                    <span className={`text-sm font-bold ${getHealthColor(station.solarHealth)}`}>
                      {station.solarHealth}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>

      {/* ==================== TAB 2: STORAGE ==================== */}
      <TabsContent value="storage" className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-black border-[#ff6600]/30 shadow-lg shadow-[#ff6600]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#ff6600]/70">Total Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#ff6600]">{metrics.totalStorageCapacity} kWh</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-[#00ff41]/30 shadow-lg shadow-[#00ff41]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#00ff41]/70">Current Stored Energy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#00ff41]">{Math.round(metrics.currentStoredEnergy)} kWh</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-[#00ffff]/30 shadow-lg shadow-[#00ffff]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#00ffff]/70">Network Avg SOC</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#00ffff]">{metrics.networkAverageSOC}%</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-[#0080ff]/30 shadow-lg shadow-[#0080ff]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#0080ff]/70">Charge Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#0080ff]">{metrics.chargeRate} kW</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-[#ff0080]/30 shadow-lg shadow-[#ff0080]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#ff0080]/70">Discharge Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#ff0080]">{metrics.dischargeRate} kW</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-black border-[#ff6600]/30 shadow-lg shadow-[#ff6600]/10">
          <CardHeader>
            <CardTitle className="text-[#00ffff]">Station-Level Storage Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#00ffff]/20 hover:bg-[#00ffff]/5">
                    <TableHead className="text-[#00ffff]">Station</TableHead>
                    <TableHead className="text-[#00ffff]">Location</TableHead>
                    <TableHead className="text-[#00ffff]">Capacity (kWh)</TableHead>
                    <TableHead className="text-[#00ffff]">SOC %</TableHead>
                    <TableHead className="text-[#00ffff]">Charge Rate (kW)</TableHead>
                    <TableHead className="text-[#00ffff]">Discharge Rate (kW)</TableHead>
                    <TableHead className="text-[#00ffff]">Reserve Level</TableHead>
                    <TableHead className="text-[#00ffff]">Backup Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stationsData.stations.map((station) => {
                    const soc = 50 + Math.random() * 40
                    const chargeRate = Math.random() * 20
                    const dischargeRate = Math.random() * 30
                    const backupHours = (station.storagesolarpower * (soc / 100)) / station.peakDemand

                    return (
                      <TableRow key={station.id} className="border-[#00ffff]/20 hover:bg-[#00ffff]/5">
                        <TableCell className="font-medium text-[#00ffff]">{station.id}</TableCell>
                        <TableCell className="text-[#00ffff]/70">{station.location}</TableCell>
                        <TableCell className="text-[#ff6600]">{station.storagesolarpower}</TableCell>
                        <TableCell className="text-[#00ff41]">{Math.round(soc)}%</TableCell>
                        <TableCell className="text-[#0080ff]">{chargeRate.toFixed(1)}</TableCell>
                        <TableCell className="text-[#ff0080]">{dischargeRate.toFixed(1)}</TableCell>
                        <TableCell className="text-[#ffdd00]">20%</TableCell>
                        <TableCell className="text-[#00ffff]">{backupHours.toFixed(1)}h</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-[#ff6600]/30 shadow-lg shadow-[#ff6600]/10">
          <CardHeader>
            <CardTitle className="text-[#00ffff] flex items-center gap-2">
              <Battery className="w-5 h-5 text-[#ff6600]" />
              Network Storage SOC Timeline (24 Hours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={storageTimelineData}>
                <defs>
                  <linearGradient id="storageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6600" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ff6600" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#00ffff20" />
                <XAxis dataKey="time" stroke="#00ffff" />
                <YAxis
                  stroke="#00ffff"
                  label={{ value: "SOC %", angle: -90, position: "insideLeft", fill: "#00ffff" }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#000", border: "1px solid #00ffff", color: "#00ffff" }}
                />
                <Area
                  type="monotone"
                  dataKey="soc"
                  stroke="#ff6600"
                  fill="url(#storageGradient)"
                  strokeWidth={3}
                  name="State of Charge"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ==================== TAB 3: GRID ==================== */}
      <TabsContent value="grid" className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-black border-[#ff0080]/30 shadow-lg shadow-[#ff0080]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#ff0080]/70">Total Grid Import</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#ff0080]">{Math.round(metrics.totalGridImport)} kW</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-[#ff6600]/30 shadow-lg shadow-[#ff6600]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#ff6600]/70">Peak Grid Usage Today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#ff6600]">{Math.round(metrics.totalGridImport * 1.3)} kW</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-[#ffdd00]/30 shadow-lg shadow-[#ffdd00]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#ffdd00]/70">Grid Usage %</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#ffdd00]">
                {Math.round((metrics.totalGridImport / metrics.totalSiteLoad) * 100)}%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black border-[#00ff41]/30 shadow-lg shadow-[#00ff41]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#00ff41]/70">Cost Estimation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#00ff41]">LKR {Math.round(metrics.totalGridImport * 25)}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-black border-[#0080ff]/30 shadow-lg shadow-[#0080ff]/10">
          <CardHeader>
            <CardTitle className="text-[#00ffff]">Per-Station Grid Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#00ffff]/20 hover:bg-[#00ffff]/5">
                    <TableHead className="text-[#00ffff]">Station</TableHead>
                    <TableHead className="text-[#00ffff]">Location</TableHead>
                    <TableHead className="text-[#00ffff]">Grid Power (kW)</TableHead>
                    <TableHead className="text-[#00ffff]">Frequency Stability</TableHead>
                    <TableHead className="text-[#00ffff]">Down-time / Alerts</TableHead>
                    <TableHead className="text-[#00ffff]">Grid → Charging %</TableHead>
                    <TableHead className="text-[#00ffff]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stationsData.stations.map((station) => {
                    const gridPower = station.gridDraw
                    const frequency = 49.8 + Math.random() * 0.4
                    const gridToChargingRatio = Math.round((gridPower / station.peakDemand) * 100)
                    const stable = frequency >= 49.9 && frequency <= 50.1

                    return (
                      <TableRow key={station.id} className="border-[#00ffff]/20 hover:bg-[#00ffff]/5">
                        <TableCell className="font-medium text-[#00ffff]">{station.id}</TableCell>
                        <TableCell className="text-[#00ffff]/70">{station.location}</TableCell>
                        <TableCell className="text-[#ff0080]">{gridPower.toFixed(1)}</TableCell>
                        <TableCell className={stable ? "text-[#00ff41]" : "text-[#ffdd00]"}>
                          {frequency.toFixed(2)} Hz {stable ? "✓" : "⚠"}
                        </TableCell>
                        <TableCell>
                          {Math.random() > 0.8 ? (
                            <Badge className="bg-[#ffdd00]/20 text-[#ffdd00] border-[#ffdd00]/50">
                              Minor Alert
                            </Badge>
                          ) : (
                            <Badge className="bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]/50">Normal</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-[#00ffff]">{gridToChargingRatio}%</TableCell>
                        <TableCell>
                          {station.internet === "Stable" ? (
                            <Badge className="bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]/50">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Online
                            </Badge>
                          ) : (
                            <Badge className="bg-[#ff0080]/20 text-[#ff0080] border-[#ff0080]/50">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Offline
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-[#0080ff]/30 shadow-lg shadow-[#0080ff]/10">
          <CardHeader>
            <CardTitle className="text-[#00ffff] flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#0080ff]" />
              Real-Time Grid Consumption Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={gridLoadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00ffff20" />
                <XAxis dataKey="time" stroke="#00ffff" />
                <YAxis
                  stroke="#00ffff"
                  label={{ value: "kW", angle: -90, position: "insideLeft", fill: "#00ffff" }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#000", border: "1px solid #00ffff", color: "#00ffff" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="gridLoad"
                  stroke="#ff0080"
                  strokeWidth={3}
                  name="Grid Import"
                  dot={{ fill: "#ff0080", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ==================== TAB 4: FORECAST ==================== */}
      <TabsContent value="forecast" className="space-y-6">
        {/* Hourly Forecast */}
        <Card className="bg-black border-[#00ffff]/30 shadow-lg shadow-[#00ffff]/10">
          <CardHeader>
            <CardTitle className="text-[#00ffff] flex items-center gap-2">
              <Sun className="w-5 h-5 text-[#ffdd00]" />
              Solar Availability Forecast - Next Hour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#00ffff]/20">
                    <TableHead className="text-[#00ffff]">Time</TableHead>
                    <TableHead className="text-[#00ffff]">Solar Output</TableHead>
                    <TableHead className="text-[#00ffff]">Condition</TableHead>
                    <TableHead className="text-[#00ffff]">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hourlyForecast.map((item, idx) => (
                    <TableRow key={idx} className="border-[#00ffff]/20 hover:bg-[#00ffff]/5">
                      <TableCell className="text-[#00ffff] font-medium">{item.time}</TableCell>
                      <TableCell className="text-[#00ff41] font-bold">{item.solar} kW</TableCell>
                      <TableCell className="text-[#ffdd00]">{item.condition}</TableCell>
                      <TableCell className="text-[#00ffff]/70">{item.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 24 Hours Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-black border-[#ffdd00]/30 shadow-lg shadow-[#ffdd00]/10">
            <CardHeader>
              <CardTitle className="text-[#ffdd00] text-sm flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Morning (6 AM - 10 AM)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-[#00ffff]/70 text-sm">Increasing solar ramp-up</p>
              <p className="text-[#00ff41] text-lg font-bold">8 AM: 12 kW</p>
              <p className="text-[#00ff41] text-lg font-bold">10 AM: 25 kW</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-[#00ff41]/30 shadow-lg shadow-[#00ff41]/10">
            <CardHeader>
              <CardTitle className="text-[#00ff41] text-sm flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Peak (10 AM - 2 PM)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-[#00ffff]/70 text-sm">Max Output: 32-38 kW</p>
              <p className="text-[#00ff41] text-lg font-bold">Solar Stability: Very High</p>
              <p className="text-[#ffdd00] text-sm">Cloud risk: Low (10-15%)</p>
            </CardContent>
          </Card>

          <Card className="bg-black border-[#ff6600]/30 shadow-lg shadow-[#ff6600]/10">
            <CardHeader>
              <CardTitle className="text-[#ff6600] text-sm flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                Afternoon (2 PM - 5 PM)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-[#00ffff]/70 text-sm">20 → 10 kW gradual decline</p>
              <p className="text-[#ffdd00] text-sm">Cloud cover increases by 20%</p>
              <p className="text-[#ff0080] text-sm">After 5 PM: 2-3 kW (Battery takeover)</p>
            </CardContent>
          </Card>
        </div>

        {/* 24H Summary */}
        <Card className="bg-black border-[#00ffff]/30 shadow-lg shadow-[#00ffff]/10">
          <CardHeader>
            <CardTitle className="text-[#00ffff]">24-Hour Summary Values</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-[#00ffff]/60 text-sm">Peak Expected Solar</p>
              <p className="text-[#00ff41] text-2xl font-bold">38 kW</p>
            </div>
            <div>
              <p className="text-[#00ffff]/60 text-sm">Avg 24h Solar Availability</p>
              <p className="text-[#ffdd00] text-2xl font-bold">18.5 kW</p>
            </div>
            <div>
              <p className="text-[#00ffff]/60 text-sm">Cloud Cover Impact</p>
              <p className="text-[#ff6600] text-2xl font-bold">12-22%</p>
            </div>
            <div>
              <p className="text-[#00ffff]/60 text-sm">Grid Fallback Probability</p>
              <p className="text-[#ff0080] text-2xl font-bold">22%</p>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Forecast */}
        <Card className="bg-black border-[#00ff41]/30 shadow-lg shadow-[#00ff41]/10">
          <CardHeader>
            <CardTitle className="text-[#00ffff] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#00ff41]" />
              Next 7 Days Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#00ffff]/20">
                    <TableHead className="text-[#00ffff]">Day</TableHead>
                    <TableHead className="text-[#00ffff]">Expected Solar (kWh/day)</TableHead>
                    <TableHead className="text-[#00ffff]">Solar Score (1-100)</TableHead>
                    <TableHead className="text-[#00ffff]">Weather</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weeklyForecast.map((day, idx) => (
                    <TableRow key={idx} className="border-[#00ffff]/20 hover:bg-[#00ffff]/5">
                      <TableCell className="text-[#00ffff] font-medium">{day.day}</TableCell>
                      <TableCell className="text-[#00ff41] font-bold">{day.kwh} kWh</TableCell>
                      <TableCell>
                        <span
                          className={`font-bold ${day.score >= 85
                            ? "text-[#00ff41]"
                            : day.score >= 70
                              ? "text-[#ffdd00]"
                              : "text-[#ff6600]"
                            }`}
                        >
                          {day.score}
                        </span>
                      </TableCell>
                      <TableCell className="text-[#00ffff]/70">{day.weather}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 p-4 bg-black border border-[#00ffff]/20 rounded-lg space-y-2">
              <p className="text-[#00ffff] font-semibold">Weekly Summary:</p>
              <p className="text-[#00ff41] text-sm">Best day: Thursday (160 kWh, clear sky)</p>
              <p className="text-[#ff0080] text-sm">Worst day: Saturday (110 kWh, rain)</p>
              <p className="text-[#ffdd00] text-sm">Overall efficiency: 76% weekly solar efficiency</p>
              <p className="text-[#ff6600] text-sm">Grid fallback average: 18-28%</p>
            </div>
          </CardContent>
        </Card>

        {/* Station-Level Forecast */}
        <Card className="bg-black border-[#ff00ff]/30 shadow-lg shadow-[#ff00ff]/10">
          <CardHeader>
            <CardTitle className="text-[#00ffff] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#ff00ff]" />
              Station-Level Solar Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#00ffff]/20">
                    <TableHead className="text-[#00ffff]">Station</TableHead>
                    <TableHead className="text-[#00ffff]">Location</TableHead>
                    <TableHead className="text-[#00ffff]">Peak Solar (kW)</TableHead>
                    <TableHead className="text-[#00ffff]">Forecast Quality</TableHead>
                    <TableHead className="text-[#00ffff]">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stationForecasts.map((forecast, idx) => (
                    <TableRow key={idx} className="border-[#00ffff]/20 hover:bg-[#00ffff]/5">
                      <TableCell className="text-[#00ffff] font-medium">{forecast.station}</TableCell>
                      <TableCell className="text-[#00ffff]/70">{forecast.location}</TableCell>
                      <TableCell className="text-[#00ff41] font-bold">{forecast.peak} kW</TableCell>
                      <TableCell className={getQualityColor(forecast.quality)}>{forecast.quality}</TableCell>
                      <TableCell className="text-[#00ffff]/70">{forecast.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="bg-black border-[#ff00ff]/30 shadow-lg shadow-[#ff00ff]/10">
          <CardHeader>
            <CardTitle className="text-[#ff00ff] flex items-center gap-2">
              <Activity className="w-5 h-5" />
              AI-Based Forecast Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-[#00ff41] mt-0.5 flex-shrink-0" />
              <p className="text-[#00ffff]/90">
                High solar window from 9AM–2PM across all stations — enable solar-only mode for maximum efficiency
              </p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-[#ffdd00] mt-0.5 flex-shrink-0" />
              <p className="text-[#00ffff]/90">
                Low solar expected at S5 (Ratnapura) and S10 (Badulla) — switch to hybrid mode after 3PM
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CloudRain className="w-5 h-5 text-[#ff0080] mt-0.5 flex-shrink-0" />
              <p className="text-[#00ffff]/90">
                Heavy rain predicted tomorrow 2PM-6PM — prepare storage backup and charge batteries to 85% tonight
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-[#00ff41] mt-0.5 flex-shrink-0" />
              <p className="text-[#00ffff]/90">
                Weekend demand spike expected — ensure all stations have minimum 60% battery SOC by Friday evening
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ==================== TAB 5: SETTINGS ==================== */}
      <TabsContent value="settings" className="space-y-6">
        <Card className="bg-black border-[#ff00ff]/30 shadow-lg shadow-[#ff00ff]/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Global Charging Modes (Network-Wide Override)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Button className="h-24 flex flex-col items-center justify-center gap-2 bg-[#00ff41]/50 hover:bg-[#00cc33]/90">
                <Sun className="w-6 h-6" />
                <span className="font-semibold text-center">Solar-Only Mode</span>
              </Button>

              <Button className="h-24 flex flex-col items-center justify-center gap-2 bg-[#ff6600]/50 hover:bg-[#dd5500]/90">
                <Battery className="w-6 h-6" />
                <span className="font-semibold text-center">Storage-Only Mode</span>
              </Button>

              <Button className="h-24 flex flex-col items-center justify-center gap-2 bg-[#ffdd00]/50 hover:bg-[#eedd00]/90">
                <Activity className="w-6 h-6" />
                <span className="font-semibold text-center">Hybrid Mode</span>
              </Button>

              <Button className="h-24 flex flex-col items-center justify-center gap-2 bg-[#0080ff]/50 hover:bg-[#0066cc]/90">
                <Zap className="w-6 h-6" />
                <span className="font-semibold text-center">Grid Priority Mode</span>
              </Button>

              <Button className="h-24 flex flex-col items-center justify-center gap-2 bg-[#ff00ff]/50 hover:bg-[#dd00dd]/90">
                <TrendingUp className="w-6 h-6" />
                <span className="font-semibold text-center">Smart Auto Mode</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-[#ff00ff]/30 shadow-lg shadow-[#ff00ff]/10">
          <CardHeader>
            <CardTitle className="text-white">Station-Level Mode Control</CardTitle>
            <p className="text-gray-400 text-sm">Change charging mode for entire stations (affects all chargers)</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stationsData.stations.map((station) => (
                <div key={station.id} className="p-4 bg-black rounded-lg border border-[#ff00ff]/20">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-white font-semibold flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {station.id} - {station.location}
                      </h4>
                      <p className="text-sm text-[#00ffff]/70">{station.totalChargers} chargers</p>
                    </div>
                    <Badge className="bg-[#ff00ff]/20 text-[#ff00ff] border-[#ff00ff]/50">
                      {stationModes[station.id]}
                    </Badge>
                  </div>
                  <Select
                    value={stationModes[station.id]}
                    onValueChange={(value: ChargingMode) => {
                      setStationModes((prev) => ({ ...prev, [station.id]: value }))
                    }}
                  >
                    <SelectTrigger className="bg-black border-[#ff00ff]/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-[#ff00ff]/20">
                      <SelectItem value="Solar-Only" className="text-white">
                        Solar-Only
                      </SelectItem>
                      <SelectItem value="Storage-Only" className="text-white">
                        Storage-Only
                      </SelectItem>
                      <SelectItem value="Hybrid" className="text-white">
                        Hybrid (Solar + Grid)
                      </SelectItem>
                      <SelectItem value="Grid-Priority" className="text-white">
                        Grid Priority
                      </SelectItem>
                      <SelectItem value="Smart-Auto" className="text-white">
                        Smart Auto
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Power Availability Indicators */}
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-[#00ff41]">
                      <Sun className="w-3 h-3" />
                      <span>{station.solarPV} kW</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#ff6600]">
                      <Battery className="w-3 h-3" />
                      <span>{station.storagesolarpower} kWh</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#0080ff]">
                      <Zap className="w-3 h-3" />
                      <span>{station.maxFeederCapacity} kW</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-[#ff00ff]/30 shadow-lg shadow-[#ff00ff]/10">
          <CardHeader>
            <CardTitle className="text-white">Charger-Level Mode Control</CardTitle>
            <p className="text-gray-400 text-sm">Individual control for each charger at every station</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {stationsData.stations.map((station) => (
              <details key={station.id} className="bg-black rounded-lg border border-[#ff00ff]/20">
                <summary className="p-4 cursor-pointer text-white font-semibold flex items-center justify-between hover:bg-[#ff00ff]/5">
                  <span className="flex items-center gap-2">
                    <Power className="w-4 h-4" />
                    {station.id} - {station.location} ({station.totalChargers} chargers)
                  </span>
                  <span className="text-[#00ffff]/70 text-sm">Click to expand</span>
                </summary>
                <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {station.chargers.map((charger) => {
                    const chargerId = `${station.id}-${charger.id}`
                    const currentMode = chargerModes[chargerId] || stationModes[station.id]

                    return (
                      <div key={charger.id} className="p-3 bg-black rounded border border-[#ff00ff]/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{charger.id}</span>
                            <Badge
                              className={
                                charger.status === "In Use"
                                  ? "bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]/50 text-xs"
                                  : "bg-[#808080]/20 text-[#808080] border-[#808080]/50 text-xs"
                              }
                            >
                              {charger.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-[#00ffff]/70 mb-2">
                          {charger.chargerType} • {charger.power} kW
                        </p>
                        <Select
                          value={currentMode}
                          onValueChange={(value: ChargingMode) => {
                            setChargerModes((prev) => ({ ...prev, [chargerId]: value }))
                          }}
                        >
                          <SelectTrigger className="bg-black border-[#ff00ff]/20 text-white text-xs h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-[#ff00ff]/20">
                            <SelectItem value="Solar-Only" className="text-white text-xs">
                              Solar-Only
                            </SelectItem>
                            <SelectItem value="Storage-Only" className="text-white text-xs">
                              Storage-Only
                            </SelectItem>
                            <SelectItem value="Hybrid" className="text-white text-xs">
                              Hybrid
                            </SelectItem>
                            <SelectItem value="Grid-Priority" className="text-white text-xs">
                              Grid Priority
                            </SelectItem>
                            <SelectItem value="Smart-Auto" className="text-white text-xs">
                              Smart Auto
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )
                  })}
                </div>
              </details>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-black border-[#ff00ff]/30 shadow-lg shadow-[#ff00ff]/10">
          <CardHeader>
            <CardTitle className="text-white">Safety & Logic Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-black rounded-lg border border-[#ff00ff]/20">
                <Label className="text-white mb-2 block">Minimum Battery Reserve %</Label>
                <Select defaultValue="20">
                  <SelectTrigger className="bg-black border-[#ff00ff]/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-[#ff00ff]/20">
                    <SelectItem value="10" className="text-white">
                      10%
                    </SelectItem>
                    <SelectItem value="15" className="text-white">
                      15%
                    </SelectItem>
                    <SelectItem value="20" className="text-white">
                      20%
                    </SelectItem>
                    <SelectItem value="25" className="text-white">
                      25%
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-black rounded-lg border border-[#ff00ff]/20">
                <Label className="text-white mb-2 block">Maximum Grid Usage Limit (kW)</Label>
                <Select defaultValue="500">
                  <SelectTrigger className="bg-black border-[#ff00ff]/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-[#ff00ff]/20">
                    <SelectItem value="300" className="text-white">
                      300 kW
                    </SelectItem>
                    <SelectItem value="400" className="text-white">
                      400 kW
                    </SelectItem>
                    <SelectItem value="500" className="text-white">
                      500 kW
                    </SelectItem>
                    <SelectItem value="600" className="text-white">
                      600 kW
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-black rounded-lg border border-[#ff00ff]/20">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Smart Switching Rules</Label>
                  <Switch defaultChecked />
                </div>
                <p className="text-xs text-[#00ffff]/70 mt-2">Auto-switch modes based on solar availability</p>
              </div>

              <div className="p-4 bg-black rounded-lg border border-[#ff00ff]/20">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Peak-Hour Override Rules</Label>
                  <Switch defaultChecked />
                </div>
                <p className="text-xs text-[#00ffff]/70 mt-2">Prioritize solar during peak electricity rates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

  )
}
