"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db, SavedDocument } from "@/lib/db"
import { Search, FileText, Trash2, RefreshCcw } from "lucide-react"

interface DocumentSearchProps {
    onLoadDocument: (data: any, type: "invoice" | "quotation") => void
}

export default function DocumentSearch({ onLoadDocument }: DocumentSearchProps) {
    const [query, setQuery] = useState("")
    const [documents, setDocuments] = useState<SavedDocument[]>([])
    const [filter, setFilter] = useState<"all" | "invoice" | "quotation">("all")

    const [isLoading, setIsLoading] = useState(false)

    const loadDocuments = async () => {
        setIsLoading(true)
        try {
            let docs = await db.search(query)
            if (filter !== "all") {
                docs = docs.filter(d => d.type === filter)
            }
            setDocuments(docs)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadDocuments()
    }, [query, filter])

    // Reload when component mounts to get fresh data
    useEffect(() => {
        loadDocuments()
    }, [])

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this document history?")) {
            await db.delete(id)
            loadDocuments()
        }
    }

    return (
        <Card className="no-print">
            <CardHeader>
                <CardTitle className="text-xl">Document History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by Number or Client..."
                            className="pl-8"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={filter === "all" ? "default" : "outline"}
                            onClick={() => setFilter("all")}
                            size="sm"
                        >
                            All
                        </Button>
                        <Button
                            variant={filter === "invoice" ? "default" : "outline"}
                            onClick={() => setFilter("invoice")}
                            size="sm"
                        >
                            Invoices
                        </Button>
                        <Button
                            variant={filter === "quotation" ? "default" : "outline"}
                            onClick={() => setFilter("quotation")}
                            size="sm"
                        >
                            Quotations
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={loadDocuments}
                            title="Refresh"
                        >
                            <RefreshCcw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="rounded-md border border-border">
                    {isLoading ? (
                        <div className="p-8 text-center text-muted-foreground">
                            Loading documents...
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No documents found. Save or Print a document to see it here.
                        </div>
                    ) : (
                        <div className="max-h-[400px] overflow-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50 text-left">
                                        <th className="p-3 font-medium">Date</th>
                                        <th className="p-3 font-medium">Number</th>
                                        <th className="p-3 font-medium">Client</th>
                                        <th className="p-3 font-medium text-right">Total</th>
                                        <th className="p-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((doc) => (
                                        <tr key={doc.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-3">{new Date(doc.createdAt).toLocaleDateString()}</td>
                                            <td className="p-3 font-medium">{doc.documentNumber}</td>
                                            <td className="p-3">{doc.clientName}</td>
                                            <td className="p-3 text-right">
                                                {doc.grandTotal.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })}
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        onClick={() => onLoadDocument(doc.data, doc.type)}
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8"
                                                    >
                                                        <FileText className="mr-2 h-3 w-3" /> Load
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDelete(doc.id)}
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 text-destructive hover:text-destructive/90"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}