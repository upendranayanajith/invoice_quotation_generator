"use client"

import { Button } from "@/components/ui/button"
import { Printer, Download } from "lucide-react"

interface ExportActionsProps {
    documentType?: "invoice" | "quotation" | null
    documentNumber?: string
    date?: string
    previewRef?: any
    formData?: any
    variant?: string
}

export default function ExportActions({ documentType, documentNumber, date, previewRef, formData, variant }: ExportActionsProps) {
    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="flex gap-2 print:hidden">
            <Button variant={variant as any || "outline"} onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print / Save as PDF
            </Button>
        </div>
    )
}
