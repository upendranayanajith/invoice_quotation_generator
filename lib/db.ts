import { db as firestore } from "./firebase"
import { collection, getDocs, addDoc, updateDoc, doc, query, where, orderBy } from "firebase/firestore"

export interface SavedDocument {
    id: string
    createdAt: string
    updatedAt?: string
    type: "invoice" | "quotation"
    documentNumber: string
    clientName: string
    grandTotal: number
    status: 'active' | 'inactive' // Soft delete status
    data: any
}

export const dbService = {
    getAll: async (): Promise<SavedDocument[]> => {
        try {
            // Only fetch active documents
            const q = query(
                collection(firestore, "documents"),
                where("status", "==", "active"),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as SavedDocument))
        } catch (error) {
            console.error("DB Error getAll:", error)
            return []
        }
    },

    save: async (document: any, type: "invoice" | "quotation", grandTotal: number) => {
        try {
            const collectionRef = collection(firestore, "documents");

            // Check if document already exists to update it
            const q = query(collectionRef, where("documentNumber", "==", document.documentNumber));
            const querySnapshot = await getDocs(q);


            const payload = {
                type,
                documentNumber: document.documentNumber,
                clientName: document.clientName,
                date: document.date,
                grandTotal,
                data: document,
                status: 'active', // Ensure it's active on save
                updatedAt: new Date().toISOString()
            }

            if (!querySnapshot.empty) {
                // Update existing
                const docId = querySnapshot.docs[0].id;
                await updateDoc(doc(firestore, "documents", docId), payload);
            } else {
                // Create new
                await addDoc(collectionRef, {
                    ...payload,
                    createdAt: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error("DB Save Error:", error)
        }
    },

    search: async (qText: string): Promise<SavedDocument[]> => {
        try {
            // Search by Document Number (exact match preferred for Firestore)
            // or Client Name (exact match)
            // Note: Firestore doesn't support "contains" natively without external services like Algolia.
            // We will implement a basic exact match search here, or client-side filtering if dataset is small.
            // For robust "contains" search on client side, we might need to fetch all active docs.
            // Let's rely on fetching all active docs and filtering client-side for now as it's safer for small apps.

            const allDocs = await dbService.getAll();
            const lowerQuery = qText.toLowerCase();

            return allDocs.filter(d =>
                d.documentNumber.toLowerCase().includes(lowerQuery) ||
                d.clientName.toLowerCase().includes(lowerQuery)
            );

        } catch (error) {
            console.error("DB Search Error:", error)
            return []
        }
    },

    delete: async (id: string) => {
        try {
            // Soft delete: Mark as inactive
            await updateDoc(doc(firestore, "documents", id), {
                status: 'inactive',
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("DB Delete Error:", error)
        }
    }
}

// Export as 'db' to maintain backward compatibility
export const db = dbService
