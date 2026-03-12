"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import DocumentTypeSelector from "@/components/document-type-selector"
import InvoiceForm from "@/components/invoice-form"
import InvoicePreview from "@/components/invoice-preview"
import { generateInvoiceNumber, generateTodayDate } from "@/lib/invoice-number-generator"
import DocumentSearch from "@/components/document_search"
import { db } from "@/lib/db"

function EditorContent() {
    const searchParams = useSearchParams()
    const docId = searchParams.get("id")
    const typeParam = searchParams.get("type") as "invoice" | "quotation" | null
    const mode = searchParams.get("mode") // 'view', 'copy'

    const [documentType, setDocumentType] = useState<"invoice" | "quotation" | null>(null)

    // const [showPreview, setShowPreview] = useState(false) // Removed as per requirement
    const [formData, setFormData] = useState({
        documentNumber: "",
        date: generateTodayDate(),
        clientName: "",
        clientAddress: "",
        clientEmail: "",
        clientPhone: "",
        description: "",
        sections: [{ id: 1, title: "Standard Items", items: [{ id: 1, name: "", quantity: 1, unitPrice: 0 }] }],
        discountType: "percentage" as "percentage" | "fixed",
        discountValue: 0,
        additionalNote: "",
    })

    // Load document if ID is provided
    useEffect(() => {
        const loadDoc = async () => {
            if (docId) {
                const allDocs = await db.getAll()
                const doc = allDocs.find(d => d.id === docId)
                if (doc) {
                    setDocumentType(doc.type)

                    // SAFE EDITING LOGIC
                    const isViewMode = mode === 'view'
                    const isConvertMode = mode === 'convert'

                    let targetType = doc.type
                    let newDocNumber = doc.documentNumber

                    if (isConvertMode) {
                        targetType = "invoice"
                        newDocNumber = generateInvoiceNumber("invoice")
                    } else if (!isViewMode) {
                        newDocNumber = generateInvoiceNumber(doc.type)
                    }

                    // Migration logic for old documents without sections
                    const migratingData = { ...doc.data };
                    if (migratingData.items && !migratingData.sections) {
                        migratingData.sections = [{
                            id: 1,
                            title: "Items",
                            items: migratingData.items
                        }];
                        delete migratingData.items;
                    }

                    setDocumentType(targetType)
                    setFormData({
                        ...migratingData,
                        documentNumber: newDocNumber,
                        date: isViewMode ? doc.data.date : generateTodayDate(),
                    })
                }
            } else if (typeParam && !documentType) {
                setDocumentType(typeParam)
                setFormData(prev => ({
                    ...prev,
                    documentNumber: generateInvoiceNumber(typeParam)
                }))
            }
        }
        loadDoc()
    }, [docId, typeParam, mode])

    const handleSelectDocumentType = (type: "invoice" | "quotation") => {
        setDocumentType(type)
        setFormData((prev) => ({
            ...prev,
            documentNumber: generateInvoiceNumber(type),
        }))
    }

    const handleLoadDocument = (data: any, type: "invoice" | "quotation") => {
        // Migration logic for loaded documents
        const migratingData = { ...data };
        if (migratingData.items && !migratingData.sections) {
            migratingData.sections = [{
                id: 1,
                title: "Items",
                items: migratingData.items
            }];
            delete migratingData.items;
        }

        setDocumentType(type)
        setFormData(migratingData)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const handleClear = () => {
        if (confirm("Are you sure you want to clear the form?")) {
            setFormData(prev => ({
                ...prev,
                clientName: "",
                clientAddress: "",
                clientEmail: "",
                clientPhone: "",
                description: "",
                sections: [{ id: 1, title: "Standard Items", items: [{ id: 1, name: "", quantity: 1, unitPrice: 0 }] }],
                discountValue: 0,
                additionalNote: "",
                // Keep documentNumber and date
            }))
        }
    }

    const handleNew = () => {
        if (confirm("Create new document? This will generate a new number.")) {
            const newNumber = generateInvoiceNumber(documentType!)
            setFormData({
                documentNumber: newNumber,
                date: generateTodayDate(),
                clientName: "",
                clientAddress: "",
                clientEmail: "",
                clientPhone: "",
                description: "",
                sections: [{ id: 1, title: "Standard Items", items: [{ id: 1, name: "", quantity: 1, unitPrice: 0 }] }],
                discountType: "percentage",
                discountValue: 0,
                additionalNote: "",
            })
        }
    }

    const handleSave = async () => {
        if (!documentType) return;

        // Calculate Grand Total across all sections
        const itemsTotal = formData.sections.reduce((total, section) => {
            return total + section.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        }, 0);

        let discountAmount = 0;
        if (formData.discountType === "percentage") {
            discountAmount = itemsTotal * (formData.discountValue / 100);
        } else {
            discountAmount = formData.discountValue;
        }
        const grandTotal = itemsTotal - discountAmount;

        if (grandTotal <= 0) {
            alert("Error: Total amount is 0.00. Cannot save document.");
            return;
        }

        try {
            await db.save(formData, documentType, grandTotal);

            if (confirm("Document saved! Do you want to download/print the PDF now?")) {
                const originalTitle = document.title;
                document.title = `${documentType === 'invoice' ? 'INV' : 'QT'}-${formData.documentNumber}`;

                setTimeout(() => {
                    window.print();
                    document.title = originalTitle;
                }, 500);
            }

        } catch (error) {
            console.error("Failed to save:", error);
            alert("Failed to save document.");
        }
    }

    if (!documentType) {
        return <DocumentTypeSelector onSelect={handleSelectDocumentType} />
    }

    return (
        <div className="min-h-screen bg-muted/40">
            <div className="container mx-auto px-4 py-8">

                {mode === 'view' && (
                    <div className="mb-4 p-4 bg-blue-50 text-blue-800 rounded-md border border-blue-200 no-print">
                        <strong>Read Only / Reprint Mode:</strong> You are viewing a saved document.
                        <Button variant="link" onClick={() => window.location.href = `/editor?id=${docId}&mode=copy`} className="pl-2">
                            Click here to Create a Copy
                        </Button>
                    </div>
                )}

                <div className="mb-6 flex items-center justify-between no-print">
                    <div>
                        <h1 className="text-4xl font-bold text-primary">
                            {documentType === "invoice" ? "Invoice" : "Quotation"} Generator
                        </h1>
                        <p className="mt-1 text-muted-foreground">{process.env.NEXT_PUBLIC_COMPANY_NAME || "Company Name"}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Save Document
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleClear}
                            className="border-input text-foreground hover:bg-accent hover:text-accent-foreground bg-red-300 text-red-800"
                        >
                            Clear
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleNew}
                            className="border-input text-foreground hover:bg-accent hover:text-accent-foreground bg-green-300 text-green-800"
                        >
                            New
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setDocumentType(null)}
                            className="border-input text-foreground hover:bg-accent hover:text-accent-foreground bg-yellow-200 text-yellow-800"
                        >
                            Change Type
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="border-border bg-card p-6 shadow-lg no-print text-card-foreground">
                        <InvoiceForm documentType={documentType} formData={formData} onFormChange={setFormData} />
                        {/* Preview button removed */}
                    </Card>

                    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg text-black">
                        <InvoicePreview documentType={documentType} formData={formData} />
                    </div>
                </div>

                <div className="mt-8 no-print">
                    <DocumentSearch onLoadDocument={handleLoadDocument} />
                </div>
            </div>
        </div>
    )
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading editor...</div>}>
            <EditorContent />
        </Suspense>
    )
}
