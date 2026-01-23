"use client"

import Link from "next/link"
import { Edit, FileText, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SavedDocument, db } from "@/lib/db"

interface DocumentListProps {
    documents: SavedDocument[]
    onDelete?: (id: string) => void
}

export default function DocumentList({ documents, onDelete }: DocumentListProps) {

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this document?")) {
            await db.delete(id)
            if (onDelete) onDelete(id) // Callback to refresh parent
        }
    }

    if (documents.length === 0) {
        return (
            <div className="text-center py-10 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">No documents found.</p>
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Number</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {documents.map((doc) => (
                        <TableRow key={doc.id}>
                            <TableCell className="font-medium">{doc.documentNumber}</TableCell>
                            <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{doc.clientName}</TableCell>
                            <TableCell className="text-right">
                                {doc.grandTotal.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    {/* Conversion Button for Quotations */}
                                    {doc.type === 'quotation' && (
                                        <Link href={`/editor?id=${doc.id}&mode=convert`}>
                                            <Button variant="outline" size="sm" title="Convert to Invoice">
                                                Convert to Invoice
                                            </Button>
                                        </Link>
                                    )}

                                    <Link href={`/editor?id=${doc.id}&mode=view&type=${doc.type}`}>
                                        <Button variant="ghost" size="icon" title="View/Edit">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => handleDelete(doc.id)}
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
