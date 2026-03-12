export interface Item {
  id: number
  name: string
  quantity: number
  unitPrice: number
}

export interface Section {
  id: number
  title: string
  items: Item[]
}

interface CalculationResults {
  itemsTotal: number
  subtotal: number
  discount: number
  tax?: number
  grandTotal: number
  perItemTotals: Record<number, number>
  perSectionTotals: Record<number, number>
}

export function calculateItemsTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
}

export function calculateDiscount(
  subtotal: number,
  discountValue: number,
  discountType: "percentage" | "fixed",
): number {
  if (discountValue <= 0) return 0

  if (discountType === "percentage") {
    return (subtotal * discountValue) / 100
  }

  // Fixed amount discount
  return Math.min(discountValue, subtotal)
}

export function calculateTax(amount: number, taxRate = 0): number {
  if (taxRate <= 0) return 0
  return (amount * taxRate) / 100
}

export function calculateGrandTotal(subtotal: number, discount: number, tax = 0): number {
  return Math.max(0, subtotal - discount + tax)
}

export function calculateItemTotal(quantity: number, unitPrice: number): number {
  return quantity * unitPrice
}

export function getAllCalculations(
  sections: Section[],
  discountValue: number,
  discountType: "percentage" | "fixed",
  taxRate = 0,
): CalculationResults {
  const perSectionTotals: Record<number, number> = {}
  const perItemTotals: Record<number, number> = {}

  let itemsTotal = 0

  sections.forEach((section) => {
    const sectionTotal = calculateItemsTotal(section.items)
    perSectionTotals[section.id] = sectionTotal
    itemsTotal += sectionTotal

    section.items.forEach((item) => {
      perItemTotals[item.id] = calculateItemTotal(item.quantity, item.unitPrice)
    })
  })

  const subtotal = itemsTotal
  const discount = calculateDiscount(subtotal, discountValue, discountType)
  const tax = calculateTax(subtotal - discount, taxRate)
  const grandTotal = calculateGrandTotal(subtotal, discount, tax)

  return {
    itemsTotal,
    subtotal,
    discount,
    tax,
    grandTotal,
    perItemTotals,
    perSectionTotals,
  }
}

export function formatCurrency(amount: number, currency = "Rs"): string {
  return `${currency} ${amount.toFixed(2)}`
}
