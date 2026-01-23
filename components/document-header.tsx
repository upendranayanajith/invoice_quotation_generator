"use client"

interface DocumentHeaderProps {
  documentType: "invoice" | "quotation"
  documentNumber: string
  date: string
  companyName?: string
  companyLogo?: string
  regNo?: string
}

export default function DocumentHeader({
  documentType,
  documentNumber,
  date,
  companyName = "Pravega Electricals",
  companyLogo = "/pravega-logo.png",
  regNo,
}: DocumentHeaderProps) {
  const title = documentType === "invoice" ? "INVOICE" : "QUOTATION"
  const labelText = documentType === "invoice" ? "Invoice" : "Quotation"

  return (
    <div className="flex justify-between border-b-2 border-primary/20 pb-6">
      {/* Left side: Logo and Company */}
      <div className="flex items-center gap-4">
        {companyLogo && (
          <img src={companyLogo || "/placeholder.svg"} alt={companyName} className="h-16 object-contain" />
        )}
        <div className="flex flex-col">
          <h2 className="text-4xl font-bold text-primary">{companyName}</h2>
          <h1 className="text-3xl font-semi bold text-primary">{title}</h1>
        </div>
      </div>

      {/* Right side: Document details */}
      <div className="text-right text-sm text-muted-foreground">
        <p>
          <span className="font-semibold text-primary">{labelText} #:</span> {documentNumber}
        </p>
        <p className="mt-2">
          <span className="font-semibold text-primary">Date:</span> {date}
        </p>
        <p className="mt-2 font-medium text-gray-400 ">
          Reg No. WIATT/L/1439
        </p>
      </div>
    </div>
  )
}
