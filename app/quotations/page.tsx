"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import DocumentList from "@/components/document-list"
import { db, SavedDocument } from "@/lib/db"

export default function QuotationsPage() {
    const [quotations, setQuotations] = useState<SavedDocument[]>([])
    const [loading, setLoading] = useState(true)

    const loadQuotations = async () => {
        setLoading(true)
        const all = await db.getAll()
        setQuotations(all.filter(d => d.type === 'quotation'))
        setLoading(false)
    }

    useEffect(() => {
        loadQuotations()
    }, [])

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Quotations</h1>
                    <p className="text-muted-foreground">Manage your quotations.</p>
                </div>
                <Link href="/editor?type=quotation">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create Quotation
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <DocumentList documents={quotations} onDelete={loadQuotations} />
            )}
        </div>
    )
}
