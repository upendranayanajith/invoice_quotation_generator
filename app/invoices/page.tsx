"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import DocumentList from "@/components/document-list"
import { db, SavedDocument } from "@/lib/db"

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<SavedDocument[]>([])
    const [loading, setLoading] = useState(true)

    const loadInvoices = async () => {
        setLoading(true)
        const all = await db.getAll()
        setInvoices(all.filter(d => d.type === 'invoice'))
        setLoading(false)
    }

    useEffect(() => {
        loadInvoices()
    }, [])

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Invoices</h1>
                    <p className="text-muted-foreground">Manage your issued invoices.</p>
                </div>
                <Link href="/editor?type=invoice">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create Invoice
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <DocumentList documents={invoices} onDelete={loadInvoices} />
            )}
        </div>
    )
}
