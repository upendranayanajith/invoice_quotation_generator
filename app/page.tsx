"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import DocumentTypeSelector from "@/components/document-type-selector"
import InvoiceForm from "@/components/invoice-form"
import InvoicePreview from "@/components/invoice-preview"
import { generateInvoiceNumber, generateTodayDate } from "@/lib/invoice-number-generator"

export default function Page() {
  const [documentType, setDocumentType] = useState<"invoice" | "quotation" | null>(null)
  const [showPreview, setShowPreview] = useState(false)
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
          <Button
            variant="outline"
            onClick={() => setDocumentType(null)}
            className="border-input text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            Change Type
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border bg-card p-6 shadow-lg no-print text-card-foreground">
            <InvoiceForm documentType={documentType} formData={formData} onFormChange={setFormData} />
            <Button className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setShowPreview(true)}>
              Preview Document
            </Button>
          </Card>

          {showPreview && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg text-black">
              <InvoicePreview documentType={documentType} formData={formData} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
