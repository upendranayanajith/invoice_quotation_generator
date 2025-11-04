"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import ItemsTable from "@/components/items-table"

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

interface InvoiceFormProps {
  documentType: "invoice" | "quotation"
  formData: FormData
  onFormChange: (data: FormData) => void
}

export default function InvoiceForm({ documentType, formData, onFormChange }: InvoiceFormProps) {
  const handleInputChange = (field: string, value: any) => {
    onFormChange({
      ...formData,
      [field]: value,
    })
  }

  const handleItemsChange = (items: Item[]) => {
    onFormChange({
      ...formData,
      items,
    })
  }

  return (
    <div className="space-y-6">
      {/* Document Details */}
      <div className="space-y-4">
        <h3 className="font-semibold text-white">Document Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">{documentType === "invoice" ? "Invoice" : "Quotation"} Number</Label>
            <Input
              value={formData.documentNumber}
              onChange={(e) => handleInputChange("documentNumber", e.target.value)}
              placeholder="e.g., INV-001"
              className="border-slate-600 bg-slate-700 text-white placeholder-slate-500"
            />
          </div>
          <div>
            <Label className="text-slate-300">Date</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="border-slate-600 bg-slate-700 text-white"
            />
          </div>
        </div>
      </div>

      {/* Client Details */}
      <div className="space-y-4">
        <h3 className="font-semibold text-white">Client Details</h3>
        <div>
          <Label className="text-slate-300">Client Name</Label>
          <Input
            value={formData.clientName}
            onChange={(e) => handleInputChange("clientName", e.target.value)}
            placeholder="Enter client name"
            className="border-slate-600 bg-slate-700 text-white placeholder-slate-500"
          />
        </div>
        <div>
          <Label className="text-slate-300">Address</Label>
          <Textarea
            value={formData.clientAddress}
            onChange={(e) => handleInputChange("clientAddress", e.target.value)}
            placeholder="Enter client address"
            className="border-slate-600 bg-slate-700 text-white placeholder-slate-500"
            rows={2}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">Email</Label>
            <Input
              value={formData.clientEmail}
              onChange={(e) => handleInputChange("clientEmail", e.target.value)}
              placeholder="email@example.com"
              className="border-slate-600 bg-slate-700 text-white placeholder-slate-500"
            />
          </div>
          <div>
            <Label className="text-slate-300">Phone</Label>
            <Input
              value={formData.clientPhone}
              onChange={(e) => handleInputChange("clientPhone", e.target.value)}
              placeholder="+94 XX XXX XXXX"
              className="border-slate-600 bg-slate-700 text-white placeholder-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label className="text-slate-300">Project Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Enter project or service description"
          className="border-slate-600 bg-slate-700 text-white placeholder-slate-500"
          rows={3}
        />
      </div>

      {/* Items */}
      <div className="space-y-4">
        <h3 className="font-semibold text-white">Items / Services</h3>
        <ItemsTable items={formData.items} onItemsChange={handleItemsChange} editable={true} showAddButton={true} />
      </div>

      {/* Discount */}
      <div className="space-y-4 rounded-lg border border-slate-600 p-4">
        <h3 className="font-semibold text-white">Discount</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">Type</Label>
            <select
              value={formData.discountType}
              onChange={(e) => handleInputChange("discountType", e.target.value as "percentage" | "fixed")}
              className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-white"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (Rs)</option>
            </select>
          </div>
          <div>
            <Label className="text-slate-300">Value</Label>
            <Input
              type="number"
              value={formData.discountValue}
              onChange={(e) => handleInputChange("discountValue", Number(e.target.value))}
              min="0"
              step="0.01"
              className="border-slate-600 bg-slate-700 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
