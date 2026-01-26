import type { InvoiceWithItems } from "@/types/database";

type RevenueEntry = {
  month: string;
  year: number;
  IDR: number;
  USD: number;
};

export function getLast6MonthsRevenue(
  invoices: InvoiceWithItems[],
): RevenueEntry[] {
  const map = new Map<string, RevenueEntry>()

  // 1️⃣ Init 6 bulan terakhir
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)

    const month = d.toLocaleString('en-US', { month: 'short' })
    const year = d.getFullYear()
    const key = `${year}-${d.getMonth()}`

    map.set(key, {
      month,
      year,
      IDR: 0,
      USD: 0
    })
  }

  // 2️⃣ Aggregate invoice PAID
  for (const inv of invoices) {
    if (inv.status !== 'paid') continue

    const d = new Date(inv.date)
    const key = `${d.getFullYear()}-${d.getMonth()}`

    const entry = map.get(key)
    if (!entry) continue

    if (inv.currency === 'IDR') {
      entry.IDR += inv.total
    }

    if (inv.currency === 'USD') {
      entry.USD += inv.total
    }
  }

  return Array.from(map.values())
}
