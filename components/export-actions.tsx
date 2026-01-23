"use client"

import { Button } from "@/components/ui/button"
import { Printer, Download } from "lucide-react"

export default function ExportActions() {
    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="flex gap-2 print:hidden">
            <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print / Save as PDF
            </Button>
            {/* 
            <Button variant="outline" onClick={() => alert("Download feature coming soon!")}>
                <Download className="mr-2 h-4 w-4" />
                Download
            </Button> 
            */}
        </div>
    )
}
