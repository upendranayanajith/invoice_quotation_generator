"use client"

interface TotalsSummaryProps {
  subtotal: number
  discount: number
  tax?: number
  grandTotal: number
  showTax?: boolean
  discountType?: "percentage" | "fixed"
  discountValue?: number
}

export default function TotalsSummary({
  subtotal,
  discount,
  tax = 0,
  grandTotal,
  showTax = false,
  discountType = "fixed",
  discountValue = 0,
}: TotalsSummaryProps) {
  return (
    <div className="flex justify-end">
      <div className="w-80 space-y-2 border-l-2 border-slate-300 pl-6">
        {/* Subtotal */}
        <div className="flex justify-between text-sm text-slate-700">
          <span>Subtotal (Rs):</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-sm text-slate-700">
            <span>Discount ({discountType === "percentage" ? `${discountValue}%` : "Rs"}):</span>
            <span>- {discount.toFixed(2)}</span>
          </div>
        )}

        {/* Tax */}
        {showTax && tax > 0 && (
          <div className="flex justify-between text-sm text-slate-700">
            <span>Tax:</span>
            <span>+ {tax.toFixed(2)}</span>
          </div>
        )}

        {/* Grand Total */}
        <div className="flex justify-between border-t-2 border-slate-300 pt-2 text-lg font-bold text-blue-900">
          <span>Grand Total (Rs):</span>
          <span>{grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
