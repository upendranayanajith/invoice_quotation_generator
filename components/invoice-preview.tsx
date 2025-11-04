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
        ref={previewRef}
        className="space-y-6 rounded-lg border border-slate-600 bg-white p-8 text-black print:border-0"
      >
        <DocumentHeader
          documentType={documentType}
          documentNumber={formData.documentNumber}
          date={formData.date}
          companyName="Pravega Electricals"
        />

        {/* Company Details */}
        <div className="grid grid-cols-2 gap-8 border-b border-slate-200 pb-6">
          <div>
            <h3 className="font-bold text-slate-900">FROM:</h3>
            <div className="mt-2 space-y-1 text-sm text-slate-700">
              <p className="font-semibold">Pravega Electricals</p>
              <p>No. 61/10, Rupasinghe Park</p>
              <p>Thihariya, Kalagedihena</p>
              <p>Email: pravegaelectrical99@gmail.com</p>
              <p>Phone: +94 70 516 0007</p>
              <p>+94 77 897 9066 / +94 71 491 3220</p>
              <p className="mt-2">
                <span className="font-semibold">Proprietor:</span> J. P. Rajadisena
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">BILL TO:</h3>
            <div className="mt-2 space-y-1 text-sm text-slate-700">
              <p className="font-semibold">{formData.clientName || "Client Name"}</p>
              <p>{formData.clientAddress}</p>
              {formData.clientEmail && <p>Email: {formData.clientEmail}</p>}
              {formData.clientPhone && <p>Phone: {formData.clientPhone}</p>}
            </div>
          </div>
        </div>

        {/* Description */}
        {formData.description && (
          <div className="border-b border-slate-200 pb-4">
            <p className="text-sm text-slate-700">
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

        {/* Footer */}
        <div className="border-t-2 border-slate-300 pt-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="mb-2 font-bold text-slate-900">Bank Details:</h4>
              <div className="space-y-1 text-sm text-slate-700">
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
            <div className="flex flex-col items-center justify-center rounded border-2 border-dashed border-slate-300 bg-slate-50 p-8">
              <p className="text-sm font-semibold text-slate-700">Company Seal / Signature</p>
              <div className="mt-2 h-16 w-16 border border-slate-300"></div>
            </div>
          </div>
          {documentType === "invoice" && (
            <p className="mt-4 text-center text-xs text-slate-600">Payment due within 7 days of issue</p>
          )}
        </div>
      </div>
    </div>
  )
}
