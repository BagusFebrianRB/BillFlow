import { InvoiceWithItems } from "@/types/database"

export function calculateInvoiceStats(invoices: InvoiceWithItems[]) {
  const stats = {
    USD: { revenue: 0, pending: 0, overdue: 0, revenueCount: 0, pendingCount: 0, overdueCount: 0 },
    IDR: { revenue: 0, pending: 0, overdue: 0, revenueCount: 0, pendingCount: 0, overdueCount: 0 }
  }

  invoices.forEach(inv => {
    const curr = inv.currency as 'USD' | 'IDR'
    
    if (inv.status === 'paid') {
      stats[curr].revenue += inv.total
      stats[curr].revenueCount++
    } else if (inv.status === 'sent') {
      stats[curr].pending += inv.total
      stats[curr].pendingCount++
    } else if (inv.status === 'overdue') {
      stats[curr].overdue += inv.total
      stats[curr].overdueCount++
    }
  })

  return stats
}