"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Download, Printer, Copy } from "lucide-react"
import { printDocument, downloadAsJSON, generateFilename } from "@/lib/export-utils"

interface ExportActionsProps {
  documentType: "invoice" | "quotation"
  documentNumber: string
  date: string
  previewRef: React.RefObject<HTMLDivElement | null>
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

  const handleDownloadPDF = () => {
    // We now use the native print dialog which offers "Save as PDF"
    // This removes the need for heavy 3rd party libraries
    try {
      printDocument()
    } catch (error) {
      alert("Failed to open print dialog. Please try again.")
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
  const containerClass = variant === "stacked" ? "flex flex-col gap-2 no-print" : "flex gap-2 no-print"

  return (
    <div className={containerClass}>
      <Button
        onClick={handlePrint}
        variant="outline"
        size="sm"
        className={`border-input text-foreground hover:bg-accent hover:text-accent-foreground bg-transparent ${buttonClass}`}
      >
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>
      <Button onClick={handleDownloadPDF} size="sm" className={`bg-primary hover:bg-primary/90 text-primary-foreground ${buttonClass}`}>
        <Download className="mr-2 h-4 w-4" />
        Save as PDF
      </Button>
      {showJSON && (
        <Button
          onClick={handleDownloadJSON}
          variant="outline"
          size="sm"
          className={`border-input text-foreground hover:bg-accent hover:text-accent-foreground bg-transparent ${buttonClass}`}
        >
          <Copy className="mr-2 h-4 w-4" />
          Export JSON
        </Button>
      )}
    </div>
  )
}
