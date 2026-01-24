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
          <h1 className="text-4xl font-bold text-white">{process.env.NEXT_PUBLIC_COMPANY_NAME || "Company Name"}</h1>
          <p className="mt-4 text-xl text-slate-400">Select Document Type</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card
            className="group cursor-pointer border-slate-700 bg-slate-800 p-8 transition-all hover:border-primary hover:bg-slate-700"
            onClick={() => onSelect("invoice")}
          >
            <div className="mb-4 text-4xl font-bold text-primary">📋</div>
            <h2 className="text-2xl font-bold text-white">Invoice</h2>
            <p className="mt-2 text-slate-400">Create an invoice for completed work or delivered goods</p>
            <Button className="mt-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground">Create Invoice</Button>
          </Card>

          <Card
            className="group cursor-pointer border-slate-700 bg-slate-800 p-8 transition-all hover:border-secondary hover:bg-slate-700"
            onClick={() => onSelect("quotation")}
          >
            <div className="mb-4 text-4xl font-bold text-secondary">💼</div>
            <h2 className="text-2xl font-bold text-white">Quotation</h2>
            <p className="mt-2 text-slate-400">Create a quotation for a potential project or service</p>
            <Button className="mt-6 w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">Create Quotation</Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
