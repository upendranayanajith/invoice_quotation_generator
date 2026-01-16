"use client"

import { useRef } from "react"

import DocumentHeader from "@/components/document-header"
import ItemsTable from "@/components/items-table"
import TotalsSummary from "@/components/totals-summary"
import ExportActions from "@/components/export-actions"
import { getAllCalculations } from "@/lib/calculations"

interface Item {
  id: number
  name: string
  quantity: number
  unitPrice: number
}

interface FormData {
  documentNumber: string
  date: string
  clientName: string
  clientAddress: string
  clientEmail: string
  clientPhone: string
  description: string
  items: Item[]
  discountType: "percentage" | "fixed"
  discountValue: number
  additionalNote: string
}

interface InvoicePreviewProps {
  documentType: "invoice" | "quotation"
  formData: FormData
}

export default function InvoicePreview({ documentType, formData }: InvoicePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)

  const calculations = getAllCalculations(formData.items, formData.discountValue, formData.discountType)

  const handleItemsChange = () => {
    // Items are managed at the page level, this is read-only in preview
  }

  return (
    <div className="space-y-4">
      <ExportActions
        documentType={documentType}
        documentNumber={formData.documentNumber}
        date={formData.date}
        previewRef={previewRef}
        formData={formData}
        variant="inline"
      />

      <div
        id="printable-invoice"
        ref={previewRef}
        className="space-y-6 rounded-lg border border-border bg-white p-8 text-black print:shadow-none print:border-0 print:rounded-none print:p-8 print:m-0 print:w-full print:max-w-none"
      >
        <DocumentHeader
          documentType={documentType}
          documentNumber={formData.documentNumber}
          date={formData.date}
          companyName="Pravega Electricals"
        />

        {/* Company Details */}
        <div className="grid grid-cols-2 gap-8 border-b border-border pb-6">
          <div>
            <h3 className="font-bold text-foreground">FROM:</h3>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p className="font-semibold">Pravega Electricals</p>
              <p>No. 61/10, Rupasinghe Park</p>
              <p>Thihariya, Kalagedihena</p>

            </div>
          </div>
          <div>
            <h3 className="font-bold text-foreground">BILL TO:</h3>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p className="font-semibold">{formData.clientName || "Client Name"}</p>
              <p>{formData.clientAddress}</p>
              {formData.clientEmail && <p>Email: {formData.clientEmail}</p>}
              {formData.clientPhone && <p>Phone: {formData.clientPhone}</p>}
            </div>
          </div>
        </div>

        {/* Description */}
        {formData.description && (
          <div className="border-b border-border pb-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Description:</span> {formData.description}
            </p>
          </div>
        )}

        <ItemsTable items={formData.items} onItemsChange={handleItemsChange} editable={false} showAddButton={false} />

        <TotalsSummary
          subtotal={calculations.subtotal}
          discount={calculations.discount}
          grandTotal={calculations.grandTotal}
          discountType={formData.discountType}
          discountValue={formData.discountValue}
        />

        {/* Additional Note */}
        {formData.additionalNote && (
          <div className="border-t border-border pt-4">
            <h4 className="mb-2 font-bold text-foreground">Note:</h4>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{formData.additionalNote}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t-2 border-border pt-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="mb-2 font-bold text-foreground">Bank Details:</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold">Account Name:</span> J. P. Rajadisena
                </p>
                <p>
                  <span className="font-semibold">Bank:</span> Peoples Bank – Nittambuwa Branch
                </p>
                <p>
                  <span className="font-semibold">Account Number:</span> 278200128206775
                </p>
              </div>
            </div>
            {<div className="space-y-1 text-sm text-muted-foreground">
              <h4 className="mb-2 font-bold text-foreground">Contact Details:</h4>

              <p>
                <span className="font-semibold">Email:</span> pravegaelectrical99@gmail.com</p>
              <p>
                <span className="font-semibold">Phone:</span> +94 77 897 9066 / +94 71 491 3220</p>
            </div>}
          </div>
          {documentType === "invoice" && (
            <p className="mt-4 text-center text-xs text-muted-foreground">Payment due within 7 days of issue</p>
          )}
        </div>
      </div>
    </div>
  )
}
