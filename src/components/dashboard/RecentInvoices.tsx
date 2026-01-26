"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils/currency";
import type { InvoiceWithItems } from "@/types/database";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  CheckCircle,
  Download,
  Edit,
  Eye,
  Loader2,
  MoreVertical,
  Send,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { deleteInvoice, updateInvoiceStatus } from "@/app/actions/invoices";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const statusColors = {
  draft: "bg-slate-100 text-slate-800",
  sent: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
};

export function RecentInvoices({ invoices }: { invoices: InvoiceWithItems[] }) {
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
    <div>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-100">
            <TableHead>Client</TableHead>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell>{inv.client?.name}</TableCell>
              <TableCell>{inv.invoice_number}</TableCell>
              <TableCell>{formatCurrency(inv.total, inv.currency)}</TableCell>
              <TableCell>{inv.due_date}</TableCell>
              <TableCell>
                <Badge className={statusColors[inv.status]}>
                  {inv.status.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={actioningId === inv.id}
                    >
                      {actioningId === inv.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MoreVertical className="h-4 w-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/dashboard/invoices/${inv.id}`}>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                    </Link>

                    {inv.status === "draft" && (
                      <Link href={`/dashboard/invoices/${inv.id}/edit`}>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </Link>
                    )}

                    <Link href={`/api/invoices/${inv.id}/pdf`} target="_blank">
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </DropdownMenuItem>
                    </Link>

                    {inv.status === "draft" && (
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(inv.id, "sent")}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Mark as Sent
                      </DropdownMenuItem>
                    )}

                    {(inv.status === "sent" || inv.status === "overdue") && (
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(inv.id, "paid")}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Paid
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem
                      onClick={() =>
                        handleDelete(inv.id, inv.invoice_number)
                      }
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
