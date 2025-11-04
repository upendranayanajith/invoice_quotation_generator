"use client"

interface DocumentHeaderProps {
  documentType: "invoice" | "quotation"
  documentNumber: string
  date: string
  companyName?: string
  companyLogo?: string
}

export default function DocumentHeader({
  documentType,
  documentNumber,
  date,
  companyName = "Pravega Electricals",
  companyLogo = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-11-04%20114232-LvNp9rRQmc4lNig5hrnl4fiIN5JW0Z.png",
}: DocumentHeaderProps) {
  const title = documentType === "invoice" ? "INVOICE" : "QUOTATION"
  const labelText = documentType === "invoice" ? "Invoice" : "Quotation"

  return (
    <div className="flex justify-between border-b-2 border-blue-200 pb-6">
      {/* Left side: Logo and Company */}
      <div className="flex flex-col">
        {companyLogo && (
          <img src={companyLogo || "/placeholder.svg"} alt={companyName} className="mb-3 h-16 object-contain" />
        )}
        <h1 className="text-4xl font-bold text-blue-900">{title}</h1>
      </div>

      {/* Right side: Document details */}
      <div className="text-right text-sm text-slate-700">
        <p>
          <span className="font-semibold text-blue-900">{labelText} #:</span> {documentNumber}
        </p>
        <p className="mt-2">
          <span className="font-semibold text-blue-900">Date:</span> {date}
        </p>
      </div>
    </div>
  )
}
