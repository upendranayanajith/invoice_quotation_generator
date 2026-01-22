

export function printDocument(filename?: string): void {
  const originalTitle = document.title
  try {
    if (filename) {
      document.title = filename
    }
    window.print()
  } catch (error) {
    console.error("Error printing document:", error)
    throw new Error("Failed to print document")
  } finally {
    if (filename) {
      // Restore title after a short delay to ensure print dialog picks up the new name
      setTimeout(() => {
        document.title = originalTitle
      }, 100)
    }
  }
}

export function downloadAsJSON(data: any, filename: string): void {
  try {
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${filename}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error downloading JSON:", error)
    throw new Error("Failed to download JSON")
  }
}

export function generateFilename(documentType: "invoice" | "quotation", documentNumber: string, date: string): string {
  const dateStr = date.replace(/\//g, "-")
  const type = documentType === "invoice" ? "INV" : "QT"
  return `${type}-${documentNumber}-${dateStr}`
}
