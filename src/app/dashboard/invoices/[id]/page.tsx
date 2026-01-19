import { getInvoice } from "@/app/actions/invoices";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import InvoiceActions from "@/components/invoices/invoice-actions";
import { formatCurrency } from "@/lib/utils/currency";

const statusColors = {
  draft: "bg-slate-100 text-slate-800",
  sent: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
};

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoice(id);

  if (!invoice) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard/invoices">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Invoices
            </Button>
          </Link>

          <InvoiceActions invoice={invoice} />
        </div>

        {/* Invoice Card */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">
                  {invoice.invoice_number}
                </CardTitle>
                <Badge className={statusColors[invoice.status]}>
                  {invoice.status.toUpperCase()}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">Amount Due</p>
                <p className="text-4xl font-bold text-slate-900">
                  {formatCurrency(invoice.total, invoice.currency)}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Bill To / From */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-2">
                  Bill To:
                </h3>
                <div className="text-slate-900">
                  <p className="font-semibold">{invoice.client?.name}</p>
                  {invoice.client?.company && (
                    <p className="text-sm text-slate-600">
                      {invoice.client.company}
                    </p>
                  )}
                  {invoice.client?.email && (
                    <p className="text-sm text-slate-600">
                      {invoice.client.email}
                    </p>
                  )}
                  {invoice.client?.phone && (
                    <p className="text-sm text-slate-600">
                      {invoice.client.phone}
                    </p>
                  )}
                  {invoice.client?.address && (
                    <p className="text-sm text-slate-600 mt-1">
                      {invoice.client.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-600">Invoice Date: </span>
                    <span className="font-medium">
                      {format(new Date(invoice.date), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Due Date: </span>
                    <span className="font-medium">
                      {format(new Date(invoice.due_date), "MMM dd, yyyy")}
                    </span>
                  </div>
                  {invoice.paid_at && (
                    <div>
                      <span className="text-slate-600">Paid On: </span>
                      <span className="font-medium text-green-600">
                        {format(new Date(invoice.paid_at), "MMM dd, yyyy")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 text-sm font-semibold text-slate-600">
                      Description
                    </th>
                    <th className="text-right py-3 text-sm font-semibold text-slate-600 w-20">
                      Qty
                    </th>
                    <th className="text-right py-3 text-sm font-semibold text-slate-600 w-28">
                      Rate
                    </th>
                    <th className="text-right py-3 text-sm font-semibold text-slate-600 w-28">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.invoice_items?.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-4 text-slate-900">
                        {item.description}
                      </td>
                      <td className="py-4 text-right text-slate-600">
                        {item.quantity}
                      </td>
                      <td className="py-4 text-right text-slate-600">
                        {formatCurrency(item.rate, invoice.currency)}
                      </td>
                      <td className="py-4 text-right font-medium text-slate-900">
                        {formatCurrency(item.amount, invoice.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-medium">
                    {formatCurrency(invoice.subtotal, invoice.currency)}
                  </span>
                </div>
                {invoice.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Tax:</span>
                    <span className="font-medium">
                      {formatCurrency(invoice.tax, invoice.currency)}
                    </span>
                  </div>
                )}
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Discount:</span>
                    <span className="font-medium text-red-600">
                      -{formatCurrency(invoice.discount, invoice.currency)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">Total:</span>
                  <span className="text-xl font-bold">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes & Terms */}
            {(invoice.notes || invoice.terms) && (
              <div className="space-y-4 pt-4 border-t">
                {invoice.notes && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-600 mb-1">
                      Notes:
                    </h4>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                      {invoice.notes}
                    </p>
                  </div>
                )}
                {invoice.terms && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-600 mb-1">
                      Terms & Conditions:
                    </h4>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                      {invoice.terms}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
