"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, RefreshCcw } from "lucide-react"
import DocumentList from "@/components/document-list"
import { db, SavedDocument } from "@/lib/db"

function SearchPageContent() {
    const searchParams = useSearchParams()
    const initialQuery = searchParams.get("q") || ""

    const [query, setQuery] = useState(initialQuery)
    const [documents, setDocuments] = useState<SavedDocument[]>([])
    const [loading, setLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)

    const handleSearch = async () => {
        if (!query.trim()) return

        setLoading(true)
        setHasSearched(true)
        const results = await db.search(query)
        setDocuments(results)
        setLoading(false)
    }

    // Auto-search if query param exists
    useEffect(() => {
        if (initialQuery) {
            handleSearch()
        }
    }, [initialQuery])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Search Documents</h1>
                <p className="text-muted-foreground">Find invoices and quotations by number or client name.</p>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by Document Number (e.g., INV-001) or Client Name..."
                                className="pl-10"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <Button onClick={handleSearch} disabled={loading}>
                            {loading ? "Searching..." : "Search"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {hasSearched && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Results ({documents.length})</h2>
                    <DocumentList documents={documents} onDelete={handleSearch} />
                </div>
            )}
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading search...</div>}>
            <SearchPageContent />
        </Suspense>
    )
}
