export function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value)
}

export function truncate(text: string, max = 80) {
  if (text.length <= max) return text
  return text.slice(0, max - 1) + "…"
}
