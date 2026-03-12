"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface Item {
  id: number
  name: string
  quantity: number
  unitPrice: number
}

interface ItemsTableProps {
  items: Item[]
  onItemsChange: (items: Item[]) => void
  editable?: boolean
  showAddButton?: boolean
}

export default function ItemsTable({ items, onItemsChange, editable = false, showAddButton = true }: ItemsTableProps) {
  const handleItemChange = (id: number, field: string, value: any) => {
    const updatedItems = items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    onItemsChange(updatedItems)
  }

  const removeItem = (id: number) => {
    onItemsChange(items.filter((item) => item.id !== id))
  }

  const addItem = () => {
    // Validate the last item before adding a new one
    if (items.length > 0) {
      const lastItem = items[items.length - 1]
      if (!lastItem.name.trim()) {
        alert("Please fill in the Item Name / Description for the current item before adding a new one.")
        return
      }
    }

    const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1
    onItemsChange([...items, { id: newId, name: "", quantity: 1, unitPrice: 0 }])
  }

  // Editable mode - for form input
  if (editable) {
    return (
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="space-y-2 rounded-lg border border-border p-3">
            <div>
              <Label className="text-xs text-muted-foreground">Item Name / Description</Label>
              <Input
                value={item.name}
                onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
                placeholder="e.g., Installation service"
                className="border-input bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Quantity</Label>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))}
                  min="1"
                  className="border-input bg-background text-foreground"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Unit Price (Rs)</Label>
                <Input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(item.id, "unitPrice", Number(e.target.value))}
                  min="0"
                  step="0.01"
                  className="border-input bg-background text-foreground"
                />
              </div>
              <div className="flex flex-col">
                <Label className="text-xs text-muted-foreground">Total (Rs)</Label>
                <div className="flex items-center rounded border border-input bg-muted px-3 py-2 text-foreground">
                  {(item.quantity * item.unitPrice).toFixed(2)}
                </div>
              </div>
            </div>
            {items.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Item
              </Button>
            )}
          </div>
        ))}
        {showAddButton && (
          <Button
            variant="outline"
            onClick={addItem}
            className="w-full border-input text-foreground hover:bg-accent hover:text-accent-foreground bg-transparent"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        )}
      </div>
    )
  }

  // Display mode - for preview/print
  return (
    <div className="border-b border-slate-200 pb-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-300 bg-slate-50/50">
            <th className="px-2 py-1.5 text-left font-semibold text-slate-700">Item / Service</th>
            <th className="px-2 py-1.5 text-right font-semibold text-slate-700">Qty</th>
            <th className="px-2 py-1.5 text-right font-semibold text-slate-700">Unit Price (Rs)</th>
            <th className="px-2 py-1.5 text-right font-semibold text-slate-700">Total (Rs)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-slate-100/50 hover:bg-slate-50/50">
              <td className="px-2 py-1.5 text-slate-600">{item.name}</td>
              <td className="px-2 py-1.5 text-right text-slate-600">{item.quantity}</td>
              <td className="px-2 py-1.5 text-right text-slate-600">{item.unitPrice.toFixed(2)}</td>
              <td className="px-2 py-1.5 text-right font-medium text-slate-800">
                {(item.quantity * item.unitPrice).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
