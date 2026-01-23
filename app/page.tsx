"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import DocumentTypeSelector from "@/components/document-type-selector"
import InvoiceForm from "@/components/invoice-form"
import InvoicePreview from "@/components/invoice-preview"
import { generateInvoiceNumber, generateTodayDate } from "@/lib/invoice-number-generator"
import DocumentSearch from "@/components/document_search"

export default function Page() {
  const [documentType, setDocumentType] = useState<"invoice" | "quotation" | null>(null)

  // const [showPreview, setShowPreview] = useState(false) // Removed as per requirement
  const [formData, setFormData] = useState({
    documentNumber: "",
    date: generateTodayDate(),
    clientName: "",
    clientAddress: "",
    clientEmail: "",
    clientPhone: "",
    description: "",
    items: [{ id: 1, name: "", quantity: 1, unitPrice: 0 }],
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 0,
    additionalNote: "",
  })

  const handleSelectDocumentType = (type: "invoice" | "quotation") => {
    setDocumentType(type)
    setFormData((prev) => ({
      ...prev,
      documentNumber: generateInvoiceNumber(type),
    }))
  }

  const handleLoadDocument = (data: any, type: "invoice" | "quotation") => {
    setDocumentType(type)
    setFormData(data)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleClear = () => {
    if (confirm("Are you sure you want to clear the form?")) {
      setFormData(prev => ({
        ...prev,
        clientName: "",
        clientAddress: "",
        clientEmail: "",
        clientPhone: "",
        description: "",
        items: [{ id: 1, name: "", quantity: 1, unitPrice: 0 }],
        discountValue: 0,
        additionalNote: "",
        // Keep documentNumber and date
      }))
    }
  }

  const handleNew = () => {
    if (confirm("Create new document? This will generate a new number.")) {
      const newNumber = generateInvoiceNumber(documentType!)
      setFormData({
        documentNumber: newNumber,
        date: generateTodayDate(),
        clientName: "",
        clientAddress: "",
        clientEmail: "",
        clientPhone: "",
        description: "",
        items: [{ id: 1, name: "", quantity: 1, unitPrice: 0 }],
        discountType: "percentage",
        discountValue: 0,
        additionalNote: "",
      })
    }
  }

  if (!documentType) {
    return <DocumentTypeSelector onSelect={handleSelectDocumentType} />
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between no-print">
          <div>
            <h1 className="text-4xl font-bold text-primary">
              {documentType === "invoice" ? "Invoice" : "Quotation"} Generator
            </h1>
            <p className="mt-1 text-muted-foreground">Pravega Electricals</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleClear}
              className="border-input text-foreground hover:bg-accent hover:text-accent-foreground bg-red-300 text-red-800"
            >
              Clear
            </Button>
            <Button
              variant="outline"
              onClick={handleNew}
              className="border-input text-foreground hover:bg-accent hover:text-accent-foreground bg-green-300 text-green-800"
            >
              New
            </Button>
            <Button
              variant="outline"
              onClick={() => setDocumentType(null)}
              className="border-input text-foreground hover:bg-accent hover:text-accent-foreground bg-yellow-200 text-yellow-800"
            >
              Change Type
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border bg-card p-6 shadow-lg no-print text-card-foreground">
            <InvoiceForm documentType={documentType} formData={formData} onFormChange={setFormData} />
            {/* Preview button removed */}
          </Card>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg text-black">
            <InvoicePreview documentType={documentType} formData={formData} />
          </div>
        </div>

        <div className="mt-8 no-print">
          <DocumentSearch onLoadDocument={handleLoadDocument} />
        </div>
      </div>
    </div>
  )
}
