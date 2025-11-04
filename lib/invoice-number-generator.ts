export function generateInvoiceNumber(documentType: "invoice" | "quotation"): string {
  const prefix = documentType === "invoice" ? "INV" : "QT"
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  const number = String(timestamp % 1000000).padStart(6, "0")
  return `${prefix}-${number}`
}

export function generateTodayDate(): string {
  return new Date().toISOString().split("T")[0]
}
