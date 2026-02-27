"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { generateReport, type ExportOptions } from "@/lib/export-utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ExportButtonProps {
  endpoint: string
  filename?: string
  dateRange?: { start: Date; end: Date }
  filters?: Record<string, any>
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
}

export function ExportButton({
  endpoint,
  filename,
  dateRange,
  filters,
  variant = "outline",
  size = "sm",
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleExport = async (format: "csv" | "excel" | "json" | "pdf") => {
    setIsExporting(true)
    setProgress(0)

    try {
      const options: ExportOptions = {
        format,
        filename,
        dateRange,
        filters,
      }

      await generateReport(endpoint, options, setProgress)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
      setProgress(0)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {progress}%
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport("csv")}>Export as CSV</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")}>Export as Excel</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")}>Export as JSON</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("pdf")}>Export as PDF</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
