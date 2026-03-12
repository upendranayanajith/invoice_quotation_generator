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
        const originalTitle = document.title;
        if (formData && documentType) {
            const typeCode = documentType === "invoice" ? "I" : "Q";
            const safeClientName = (formData.clientName || "Unknown_Client").replace(/[^a-zA-Z0-9\s]/g, "").trim();
            const safeDate = (formData.date || date || "").replace(/[^a-zA-Z0-9-]/g, "");
            document.title = `${safeClientName}_${safeDate}_${typeCode}`;
        }

        setTimeout(() => {
            window.print()
            document.title = originalTitle;
        }, 100);
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
