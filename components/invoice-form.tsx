"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import ItemsTable from "@/components/items-table"
import { ClientSelector } from "@/components/client-selector"
import { db } from "@/lib/db"

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

  const handleClientSelect = (client: any) => {
    // Auto-fill form
    onFormChange({
      ...formData,
      clientName: client.name,
      clientAddress: client.address || "",
      clientEmail: client.email || "",
      clientPhone: client.phone || ""
    })

    // Save to registry (update timestamp or create if new)
    db.saveClient(client);
  }

  return (
    <div className="space-y-6">
      {/* Document Details */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Document Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">{documentType === "invoice" ? "Invoice" : "Quotation"} Number</Label>
            <Input
              value={formData.documentNumber}
              onChange={(e) => handleInputChange("documentNumber", e.target.value)}
              placeholder="e.g., INV-001"
              className="border-input bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <Label className="text-muted-foreground">Date</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="border-input bg-background text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Client Details */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Client Details</h3>
        <div>
          <Label className="text-muted-foreground">Client Name</Label>
          <ClientSelector
            value={formData.clientName}
            onSelect={handleClientSelect}
          />
        </div>
        <div>
          <Label className="text-muted-foreground">Address</Label>
          <Textarea
            value={formData.clientAddress}
            onChange={(e) => handleInputChange("clientAddress", e.target.value)}
            placeholder="Enter client address"
            className="border-input bg-background text-foreground placeholder:text-muted-foreground"
            rows={2}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">Email (Optional)</Label>
            <Input
              value={formData.clientEmail}
              onChange={(e) => handleInputChange("clientEmail", e.target.value)}
              placeholder="email@example.com"
              className="border-input bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <Label className="text-muted-foreground">Phone (Optional)</Label>
            <Input
              value={formData.clientPhone}
              onChange={(e) => handleInputChange("clientPhone", e.target.value)}
              placeholder="+94 XX XXX XXXX"
              className="border-input bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label className="text-muted-foreground">Project Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Enter project or service description"
          className="border-input bg-background text-foreground placeholder:text-muted-foreground"
          rows={3}
        />
      </div>

      {/* Additional Note */}
      <div className="space-y-2">
        <Label className="text-muted-foreground">Note (Optional)</Label>
        <Textarea
          value={formData.additionalNote}
          onChange={(e) => handleInputChange("additionalNote", e.target.value)}
          placeholder="Enter additional notes, terms, or comments..."
          className="border-input bg-background text-foreground placeholder:text-muted-foreground"
          rows={3}
        />
      </div>

      {/* Items */}
      <div className="space-y-4">
        {/* <h3 className="font-semibold text-foreground">Items / Services</h3> */}
        <ItemsTable items={formData.items} onItemsChange={handleItemsChange} editable={true} showAddButton={true} />
      </div>

      {/* Discount */}
      <div className="space-y-4 rounded-lg border border-border p-4">
        <h3 className="font-semibold text-foreground">Discount</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">Type</Label>
            <select
              value={formData.discountType}
              onChange={(e) => handleInputChange("discountType", e.target.value as "percentage" | "fixed")}
              className="w-full rounded border border-input bg-background px-3 py-2 text-foreground"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (Rs)</option>
            </select>
          </div>
          <div>
            <Label className="text-muted-foreground">Value</Label>
            <Input
              type="number"
              value={formData.discountValue}
              onChange={(e) => handleInputChange("discountValue", Number(e.target.value))}
              min="0"
              step="0.01"
              className="border-input bg-background text-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
