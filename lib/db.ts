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
    },

    getDashboardStats: async () => {
        try {
            const allDocs = await dbService.getAll();
            const invoices = allDocs.filter(d => d.type === 'invoice');
            const quotations = allDocs.filter(d => d.type === 'quotation');

            const totalRevenue = invoices.reduce((sum, doc) => sum + (doc.grandTotal || 0), 0);
            const totalQuotedValue = quotations.reduce((sum, doc) => sum + (doc.grandTotal || 0), 0);

            // Calculate monthly stats
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();

            const thisMonthDocs = allDocs.filter(d => {
                const date = new Date(d.createdAt);
                return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            });

            const monthlyRevenue = thisMonthDocs
                .filter(d => d.type === 'invoice')
                .reduce((sum, doc) => sum + (doc.grandTotal || 0), 0);

            const monthlyQuotedValue = thisMonthDocs
                .filter(d => d.type === 'quotation')
                .reduce((sum, doc) => sum + (doc.grandTotal || 0), 0);

            return {
                totalInvoices: invoices.length,
                totalQuotations: quotations.length,
                totalRevenue,
                totalQuotedValue,
                monthlyRevenue,
                monthlyQuotedValue,
                recentDocuments: allDocs.slice(0, 5)
            };
        } catch (error) {
            console.error("DB Stats Error:", error);
            return {
                totalInvoices: 0,
                totalQuotations: 0,
                totalRevenue: 0,
                totalQuotedValue: 0,
                monthlyRevenue: 0,
                monthlyQuotedValue: 0,
                recentDocuments: []
            };
        }
    },

    getAnalyticsData: async () => {
        try {
            const allDocs = await dbService.getAll();
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const currentYear = new Date().getFullYear();

            // Initialize 12 months data
            const chartData = months.map(m => ({ name: m, invoiceAmount: 0, quotationAmount: 0 }));

            // Aggregate data
            allDocs.forEach(doc => {
                const docDate = new Date(doc.createdAt);
                if (docDate.getFullYear() === currentYear) {
                    const monthIndex = docDate.getMonth();
                    if (doc.type === 'invoice') {
                        chartData[monthIndex].invoiceAmount += doc.grandTotal;
                    } else {
                        chartData[monthIndex].quotationAmount += doc.grandTotal;
                    }
                }
            });

            // Simple Forecast Logic (Moving Average of last 3 months with data)
            // We'll add a 'forecast' key to the next month after the last active month
            const currentMonthIndex = new Date().getMonth();
            const last3Months = chartData.slice(Math.max(0, currentMonthIndex - 2), currentMonthIndex + 1);

            const avgInvoice = last3Months.reduce((sum, d) => sum + d.invoiceAmount, 0) / (last3Months.length || 1);

            // Allow forecast to show on the chart for the current + next month context
            // Actually, let's just return the chartData and a forecastValue separately to keep it clean.

            // Top Clients Logic
            const clientRevenue: Record<string, number> = {};
            allDocs.forEach(doc => {
                const name = doc.clientName || "Unknown";
                clientRevenue[name] = (clientRevenue[name] || 0) + doc.grandTotal;
            });

            // Convert to array and sort
            const topClients = Object.entries(clientRevenue)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 5); // Take top 5

            return {
                chartData,
                forecastNextMonth: avgInvoice,
                topClients
            };

        } catch (error) {
            console.error("Analytics Error:", error);
            return { chartData: [], forecastNextMonth: 0, topClients: [] };
        }
    },

    // --- Client Registry ---

    getAllClients: async () => {
        try {
            const q = query(
                collection(firestore, "clients"),
                orderBy("name", "asc")
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as any[];
        } catch (error) {
            console.error("Get Clients Error:", error);
            return [];
        }
    },

    saveClient: async (client: { name: string, address: string, email: string, phone: string }) => {
        try {
            // Check if client exists by name (exact match)
            const q = query(collection(firestore, "clients"), where("name", "==", client.name));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                // Create new
                await addDoc(collection(firestore, "clients"), {
                    ...client,
                    createdAt: new Date().toISOString()
                });
            } else {
                // Update existing
                const docId = querySnapshot.docs[0].id;
                await updateDoc(doc(firestore, "clients", docId), {
                    ...client,
                    updatedAt: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error("Save Client Error:", error);
        }
    }
}

// Export as 'db' to maintain backward compatibility
export const db = dbService
