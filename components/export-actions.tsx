"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Download, Printer, Copy } from "lucide-react"
import { exportToPDF, printDocument, downloadAsJSON, generateFilename } from "@/lib/export-utils"

interface ExportActionsProps {
  documentType: "invoice" | "quotation"
  documentNumber: string
  date: string
  previewRef: React.RefObject<HTMLDivElement>
  formData?: any
  showJSON?: boolean
  variant?: "inline" | "stacked"
}

export default function ExportActions({
  documentType,
  documentNumber,
  date,
  previewRef,
  formData,
  showJSON = false,
  variant = "inline",
}: ExportActionsProps) {
  const handlePrint = () => {
    try {
      printDocument()
    } catch (error) {
      alert("Failed to print. Please try again.")
    }
  }

  const handleDownloadPDF = async () => {
    if (!previewRef.current) {
      alert("Preview not available")
      return
    }

    try {
      const filename = generateFilename(documentType, documentNumber, date)
      await exportToPDF(previewRef.current, {
        filename,
        documentType,
        margin: 10,
        orientation: "portrait",
        format: "a4",
      })
    } catch (error) {
      alert("Failed to download PDF. Please try again.")
    }
  }

  const handleDownloadJSON = () => {
    if (!formData) {
      alert("Form data not available")
      return
    }

    try {
      const filename = generateFilename(documentType, documentNumber, date)
      downloadAsJSON(formData, filename)
    } catch (error) {
      alert("Failed to download JSON. Please try again.")
    }
  }

  const buttonClass = variant === "stacked" ? "w-full" : ""
  const containerClass = variant === "stacked" ? "flex flex-col gap-2" : "flex gap-2"

  return (
    <div className={containerClass}>
      <Button
        onClick={handlePrint}
        variant="outline"
        size="sm"
        className={`border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent ${buttonClass}`}
      >
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>
      <Button onClick={handleDownloadPDF} size="sm" className={`bg-blue-600 hover:bg-blue-700 ${buttonClass}`}>
        <Download className="mr-2 h-4 w-4" />
        Download PDF
      </Button>
      {showJSON && (
        <Button
          onClick={handleDownloadJSON}
          variant="outline"
          size="sm"
          className={`border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent ${buttonClass}`}
        >
          <Copy className="mr-2 h-4 w-4" />
          Export JSON
        </Button>
      )}
    </div>
  )
}
