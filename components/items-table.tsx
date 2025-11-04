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
    const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1
    onItemsChange([...items, { id: newId, name: "", quantity: 1, unitPrice: 0 }])
  }

  // Editable mode - for form input
  if (editable) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-white">Items / Services</h3>
        {items.map((item) => (
          <div key={item.id} className="space-y-2 rounded-lg border border-slate-600 p-3">
            <div>
              <Label className="text-xs text-slate-400">Item Name / Description</Label>
              <Input
                value={item.name}
                onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
                placeholder="e.g., Installation service"
                className="border-slate-600 bg-slate-700 text-white placeholder-slate-500"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs text-slate-400">Quantity</Label>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))}
                  min="1"
                  className="border-slate-600 bg-slate-700 text-white"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-400">Unit Price (Rs)</Label>
                <Input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(item.id, "unitPrice", Number(e.target.value))}
                  min="0"
                  step="0.01"
                  className="border-slate-600 bg-slate-700 text-white"
                />
              </div>
              <div className="flex flex-col">
                <Label className="text-xs text-slate-400">Total (Rs)</Label>
                <div className="flex items-center rounded border border-slate-600 bg-slate-700 px-3 py-2 text-white">
                  {(item.quantity * item.unitPrice).toFixed(2)}
                </div>
              </div>
            </div>
            {items.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="w-full text-red-400 hover:bg-red-950 hover:text-red-300"
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
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
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
    <div className="border-b border-slate-200 pb-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-slate-300 bg-slate-100">
            <th className="px-4 py-3 text-left font-semibold text-slate-900">Description</th>
            <th className="px-4 py-3 text-right font-semibold text-slate-900">Qty</th>
            <th className="px-4 py-3 text-right font-semibold text-slate-900">Unit Price (Rs)</th>
            <th className="px-4 py-3 text-right font-semibold text-slate-900">Total (Rs)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
              <td className="px-4 py-3 text-slate-700">{item.name}</td>
              <td className="px-4 py-3 text-right text-slate-700">{item.quantity}</td>
              <td className="px-4 py-3 text-right text-slate-700">{item.unitPrice.toFixed(2)}</td>
              <td className="px-4 py-3 text-right font-semibold text-slate-900">
                {(item.quantity * item.unitPrice).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
