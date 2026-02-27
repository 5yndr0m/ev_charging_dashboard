"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Download, FileText, FileSpreadsheet, Calendar, Filter } from "lucide-react"

interface ExportReportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ExportReportModal({ isOpen, onClose }: ExportReportModalProps) {
  const [exportFormat, setExportFormat] = useState("csv")
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  })
  const [filters, setFilters] = useState({
    status: "",
    source: "",
    stationId: "",
    paymentStatus: "",
  })
  const [includeFilters, setIncludeFilters] = useState({
    status: false,
    source: false,
    station: false,
    payment: false,
  })
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append("format", exportFormat)

      if (dateRange.startDate) params.append("startDate", dateRange.startDate)
      if (dateRange.endDate) params.append("endDate", dateRange.endDate)

      if (includeFilters.status && filters.status) params.append("status", filters.status)
      if (includeFilters.source && filters.source) params.append("source", filters.source)
      if (includeFilters.station && filters.stationId) params.append("stationId", filters.stationId)
      if (includeFilters.payment && filters.paymentStatus) params.append("paymentStatus", filters.paymentStatus)

      const response = await fetch(`/api/bookings/export?${params}`)

      if (exportFormat === "json" || exportFormat === "pdf") {
        const result = await response.json()
        if (exportFormat === "pdf") {
          console.log("PDF Report Data:", result)
          alert("PDF generation would be implemented with a PDF library. Check console for data.")
        } else {
          // Download JSON file
          const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `bookings-export-${new Date().toISOString().split("T")[0]}.json`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        }
      } else {
        // Handle CSV/Excel download
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `bookings-export-${new Date().toISOString().split("T")[0]}.${exportFormat === "excel" ? "xlsx" : "csv"}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }

      onClose()
    } catch (error) {
      console.error("Error exporting report:", error)
      alert("Failed to export report. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-400" />
            Export Booking Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Export Format</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: "csv", label: "CSV", icon: FileText, desc: "Comma-separated values" },
                { value: "excel", label: "Excel", icon: FileSpreadsheet, desc: "Excel compatible" },
                { value: "json", label: "JSON", icon: FileText, desc: "With statistics" },
                { value: "pdf", label: "PDF", icon: FileText, desc: "Report format" },
              ].map((format) => {
                const Icon = format.icon
                return (
                  <Card
                    key={format.value}
                    className={`cursor-pointer transition-colors ${
                      exportFormat === format.value
                        ? "bg-blue-600/20 border-blue-500"
                        : "bg-gray-800/50 border-gray-700 hover:bg-gray-800"
                    }`}
                    onClick={() => setExportFormat(format.value)}
                  >
                    <CardContent className="p-3 text-center">
                      <Icon className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                      <p className="font-medium text-sm">{format.label}</p>
                      <p className="text-xs text-gray-500">{format.desc}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-medium">
              <Calendar className="h-4 w-4 text-orange-400" />
              Date Range (Optional)
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Start Date</Label>
                <Input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">End Date</Label>
                <Input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-medium">
              <Filter className="h-4 w-4 text-purple-400" />
              Additional Filters (Optional)
            </Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="status-filter"
                    checked={includeFilters.status}
                    onCheckedChange={(checked) => setIncludeFilters((prev) => ({ ...prev, status: !!checked }))}
                  />
                  <Label htmlFor="status-filter" className="text-sm">
                    Filter by Status
                  </Label>
                </div>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                  disabled={!includeFilters.status}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="No Show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Source Filter */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="source-filter"
                    checked={includeFilters.source}
                    onCheckedChange={(checked) => setIncludeFilters((prev) => ({ ...prev, source: !!checked }))}
                  />
                  <Label htmlFor="source-filter" className="text-sm">
                    Filter by Source
                  </Label>
                </div>
                <Select
                  value={filters.source}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, source: value }))}
                  disabled={!includeFilters.source}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Mobile App">Mobile App</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Admin Panel">Admin Panel</SelectItem>
                    <SelectItem value="RFID">RFID</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Status Filter */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="payment-filter"
                    checked={includeFilters.payment}
                    onCheckedChange={(checked) => setIncludeFilters((prev) => ({ ...prev, payment: !!checked }))}
                  />
                  <Label htmlFor="payment-filter" className="text-sm">
                    Filter by Payment
                  </Label>
                </div>
                <Select
                  value={filters.paymentStatus}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, paymentStatus: value }))}
                  disabled={!includeFilters.payment}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                    <SelectItem value="Refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Exporting..." : "Export Report"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
