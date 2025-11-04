"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface DocumentTypeSelectorProps {
  onSelect: (type: "invoice" | "quotation") => void
}

export default function DocumentTypeSelector({ onSelect }: DocumentTypeSelectorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-2xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white">Pravega Electricals</h1>
          <p className="mt-4 text-xl text-slate-400">Select Document Type</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card
            className="group cursor-pointer border-slate-700 bg-slate-800 p-8 transition-all hover:border-blue-500 hover:bg-slate-700"
            onClick={() => onSelect("invoice")}
          >
            <div className="mb-4 text-4xl font-bold text-blue-500">📋</div>
            <h2 className="text-2xl font-bold text-white">Invoice</h2>
            <p className="mt-2 text-slate-400">Create an invoice for completed work or delivered goods</p>
            <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700">Create Invoice</Button>
          </Card>

          <Card
            className="group cursor-pointer border-slate-700 bg-slate-800 p-8 transition-all hover:border-emerald-500 hover:bg-slate-700"
            onClick={() => onSelect("quotation")}
          >
            <div className="mb-4 text-4xl font-bold text-emerald-500">💼</div>
            <h2 className="text-2xl font-bold text-white">Quotation</h2>
            <p className="mt-2 text-slate-400">Create a quotation for a potential project or service</p>
            <Button className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700">Create Quotation</Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
