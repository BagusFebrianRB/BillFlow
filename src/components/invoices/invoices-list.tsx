"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreVertical,
  Eye,
  Trash2,
  Send,
  CheckCircle,
  Loader2,
  Edit,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { InvoiceWithItems } from "@/types/database";
import { deleteInvoice, updateInvoiceStatus } from "@/app/actions/invoices";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/currency";
import { Download } from "lucide-react";

const statusColors = {
  draft: "bg-slate-100 text-slate-800",
  sent: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
};

export default function InvoicesList({
  invoices,
}: {
  invoices: InvoiceWithItems[];
}) {
  const router = useRouter();
  const [actioningId, setActioningId] = useState<string | null>(null);

  const handleDelete = async (id: string, number: string) => {
    if (!confirm(`Are you sure you want to delete invoice ${number}?`)) return;

    setActioningId(id);
    try {
      await deleteInvoice(id);
      toast.success("Invoice deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete invoice");
      console.error(error);
    } finally {
      setActioningId(null);
    }
  };

  const handleStatusChange = async (id: string, status: "sent" | "paid") => {
    setActioningId(id);
    try {
      await updateInvoiceStatus(id, status);
      toast.success(`Invoice marked as ${status}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update invoice");
      console.error(error);
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <Card key={invoice.id} className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">
                  {invoice.invoice_number}
                </h3>
                <Badge className={statusColors[invoice.status]}>
                  {invoice.status.toUpperCase()}
                </Badge>
              </div>

              <div className="text-sm text-slate-600 space-y-1">
                <p>
                  <span className="font-medium">Client:</span>{" "}
                  {invoice.client?.name || "Unknown"}
                  {invoice.client?.company && ` (${invoice.client.company})`}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {format(new Date(invoice.date), "MMM dd, yyyy")}
                </p>
                <p>
                  <span className="font-medium">Due:</span>{" "}
                  {format(new Date(invoice.due_date), "MMM dd, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(invoice.total, invoice.currency)}
                </p>
                <p className="text-sm text-slate-500">
                  {invoice.invoice_items?.length || 0} item(s)
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={actioningId === invoice.id}
                  >
                    {actioningId === invoice.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MoreVertical className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href={`/dashboard/invoices/${invoice.id}`}>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                  </Link>

                  {invoice.status === "draft" && (
                    <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </Link>
                  )}

                  <Link
                    href={`/api/invoices/${invoice.id}/pdf`}
                    target="_blank"
                  >
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </DropdownMenuItem>
                  </Link>

                  {invoice.status === "draft" && (
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(invoice.id, "sent")}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Mark as Sent
                    </DropdownMenuItem>
                  )}

                  {(invoice.status === "sent" ||
                    invoice.status === "overdue") && (
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(invoice.id, "paid")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Paid
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={() =>
                      handleDelete(invoice.id, invoice.invoice_number)
                    }
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
