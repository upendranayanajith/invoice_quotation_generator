"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Download, Save, Copy } from "lucide-react"
import { toast } from "sonner"
import { printDocument, downloadAsJSON, generateFilename } from "@/lib/export-utils"
import { db } from "@/lib/db"
import { getAllCalculations } from "@/lib/calculations"

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
  const handleSaveToDB = async () => {
    if (formData) {
      try {
        const calculations = getAllCalculations(formData.items, formData.discountValue, formData.discountType)
        await db.save(formData, documentType, calculations.grandTotal)
        toast.success("Document saved successfully")
      } catch (error) {
        toast.error("Failed to save document")
        console.error(error)
      }
    }
  }

  const handleDownloadPDF = async () => {
    // We use the native print dialog which offers "Save as PDF"
    // ensuring high fidelity rendering
    try {
      // Auto-save before downloading
      if (formData) {
        const calculations = getAllCalculations(formData.items, formData.discountValue, formData.discountType)
        await db.save(formData, documentType, calculations.grandTotal)
      }
      printDocument(documentNumber)
    } catch (error) {
      toast.error("Failed to open print dialog")
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
        onClick={handleSaveToDB}
        variant="outline"
        size="sm"
        className={`border-input text-foreground hover:bg-accent hover:text-accent-foreground bg-transparent ${buttonClass}`}
      >
        <Save className="mr-2 h-4 w-4" />
        Save
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
