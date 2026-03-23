"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import ItemsTable from "@/components/items-table"
import { ClientSelector } from "@/components/client-selector"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

export interface Item {
  id: number
  name: string
  quantity: number
  unitPrice: number
}

export interface Section {
  id: number
  title: string
  items: Item[]
  multiplier: number
}

export interface FormData {
  documentNumber: string
  date: string
  clientName: string
  clientAddress: string
  clientEmail: string
  clientPhone: string
  description: string
  sections: Section[]
  discountType: "percentage" | "fixed"
  discountValue: number
  additionalNote: string
}

interface InvoiceFormProps {
  documentType: "invoice" | "quotation"
  formData: FormData
  onFormChange: (data: FormData | any) => void
}

export default function InvoiceForm({ documentType, formData, onFormChange }: InvoiceFormProps) {
  const handleInputChange = (field: string, value: any) => {
    onFormChange({
      ...formData,
      [field]: value,
    })
  }

  const handleSectionChange = (sectionId: number, field: string, value: any) => {
    const updatedSections = formData.sections.map(section =>
      section.id === sectionId ? { ...section, [field]: value } : section
    );
    onFormChange({ ...formData, sections: updatedSections });
  }

  const handleSectionItemsChange = (sectionId: number, items: Item[]) => {
    const updatedSections = formData.sections.map(section =>
      section.id === sectionId ? { ...section, items } : section
    );
    onFormChange({ ...formData, sections: updatedSections });
  }

  const addSection = () => {
    const newId = formData.sections.length > 0 ? Math.max(...formData.sections.map(s => s.id)) + 1 : 1;
    const newSection: Section = {
      id: newId,
      title: `Section ${newId}`,
      items: [{ id: Date.now(), name: "", quantity: 1, unitPrice: 0 }],
      multiplier: 1,
    };
    onFormChange({ ...formData, sections: [...formData.sections, newSection] });
  }

  const removeSection = (sectionId: number) => {
    if (formData.sections.length <= 1) return;
    onFormChange({
      ...formData,
      sections: formData.sections.filter(s => s.id !== sectionId)
    });
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

      {/* Sections */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Items & Sections</h3>
        </div>

        {formData.sections.map((section, index) => (
          <div key={section.id} className="space-y-4 rounded-xl border-2 border-slate-100 p-6 shadow-sm bg-slate-50/30">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Section Title</Label>
                <Input
                  value={section.title}
                  onChange={(e) => handleSectionChange(section.id, "title", e.target.value)}
                  placeholder="e.g., Labor Charges, Material Costs..."
                  className="mt-1 border-slate-200 bg-white font-semibold text-slate-800"
                />
              </div>
              <div className="w-32 shrink-0">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Multiplier (×)</Label>
                <Input
                  type="number"
                  min={1}
                  step={1}
                  value={section.multiplier ?? 1}
                  onChange={(e) => handleSectionChange(section.id, "multiplier", Math.max(1, Number(e.target.value)))}
                  className="mt-1 border-slate-200 bg-white text-slate-800 text-center font-semibold"
                />
              </div>
              {formData.sections.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSection(section.id)}
                  className="mt-6 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            </div>

            <ItemsTable
              items={section.items}
              onItemsChange={(items) => handleSectionItemsChange(section.id, items)}
              editable={true}
              showAddButton={true}
            />
          </div>
        ))}

        <Button onClick={addSection} variant="outline" className="w-full bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 border-dashed">
          <Plus className="mr-2 h-4 w-4" /> Add New Section
        </Button>
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
