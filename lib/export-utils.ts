interface ExportOptions {
  filename: string
  documentType: "invoice" | "quotation"
  margin?: number
  orientation?: "portrait" | "landscape"
  format?: "a4" | "letter"
}

export async function exportToPDF(element: HTMLElement, options: ExportOptions): Promise<void> {
  try {
    const html2canvas = (await import("html2canvas")).default
    // Dynamically import html2pdf to avoid SSR issues
    const html2pdf = (await import("html2pdf.js")).default

    const elementClone = element.cloneNode(true) as HTMLElement

    // Convert oklch colors to rgb for html2canvas compatibility
    convertOklchToRgb(elementClone)

    const opt = {
      margin: options.margin || 10,
      filename: `${options.filename}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        allowTaint: true,
        useCORS: true,
        // Ignore errors for unsupported CSS features
        onclone: (clonedDocument: Document) => {
          // Remove or convert problematic color values
          const styles = clonedDocument.querySelectorAll("[style]")
          styles.forEach((el) => {
            const element = el as HTMLElement
            if (element.style.backgroundColor && element.style.backgroundColor.includes("oklch")) {
              element.style.backgroundColor = "#ffffff"
            }
            if (element.style.color && element.style.color.includes("oklch")) {
              element.style.color = "#000000"
            }
            if (element.style.borderColor && element.style.borderColor.includes("oklch")) {
              element.style.borderColor = "#e5e7eb"
            }
          })
        },
      },
      jsPDF: {
        orientation: options.orientation || "portrait",
        unit: "mm",
        format: options.format || "a4",
      },
    }

    html2pdf().set(opt).from(elementClone).save()
  } catch (error) {
    console.error("Error exporting to PDF:", error)
    throw new Error("Failed to export PDF")
  }
}

function convertOklchToRgb(element: HTMLElement): void {
  // Apply inline styles that convert CSS variables to standard colors
  const style = document.createElement("style")
  style.textContent = `
    * {
      background-color: var(--bg-print, inherit) !important;
      color: var(--text-print, inherit) !important;
      border-color: var(--border-print, inherit) !important;
    }
  `

  // For the cloned element, walk through and update computed styles
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, null)

  let currentNode = walker.currentNode as HTMLElement
  while (currentNode) {
    const computed = window.getComputedStyle(currentNode)
    const bgColor = computed.backgroundColor
    const textColor = computed.color
    const borderColor = computed.borderColor

    // Convert oklch to white/black fallback for PDF
    if (bgColor && bgColor.includes("oklch")) {
      currentNode.style.backgroundColor = "#ffffff"
    }
    if (textColor && textColor.includes("oklch")) {
      currentNode.style.color = "#000000"
    }
    if (borderColor && borderColor.includes("oklch")) {
      currentNode.style.borderColor = "#e5e7eb"
    }

    currentNode = walker.nextNode() as HTMLElement
  }
}

export function printDocument(): void {
  try {
    window.print()
  } catch (error) {
    console.error("Error printing document:", error)
    throw new Error("Failed to print document")
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
