export function generateInvoiceNumber(documentType: "invoice" | "quotation"): string {
  if (typeof window === "undefined") return ""

  const prefix = documentType === "invoice" ? "INV" : "QT"
  const dateObj = new Date()
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, "0")
  const day = String(dateObj.getDate()).padStart(2, "0")
  const todayStr = `${year}${month}${day}`

  const storageKey = "pravega_doc_sequence"
  const defaultData = { date: todayStr, invoiceCount: 0, quotationCount: 0 }

  let data = defaultData
  try {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      data = JSON.parse(stored)
    }
  } catch (e) {
    console.error("Failed to read sequence from storage", e)
  }

  // Reset if date changed
  if (data.date !== todayStr) {
    data = { ...defaultData, date: todayStr }
  }

  // Increment
  if (documentType === "invoice") {
    data.invoiceCount++
  } else {
    data.quotationCount++
  }

  // Save
  localStorage.setItem(storageKey, JSON.stringify(data))

  const count = documentType === "invoice" ? data.invoiceCount : data.quotationCount
  const sequence = String(count).padStart(3, "0")

  return `${prefix}-${todayStr}-${sequence}`
}

export function generateTodayDate(): string {
  return new Date().toISOString().split("T")[0]
}
