"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  MoreVertical,
  Send,
  CheckCircle,
  Trash2,
  Loader2,
  Edit,
} from "lucide-react";
import { updateInvoiceStatus, deleteInvoice } from "@/app/actions/invoices";
import { toast } from "sonner";
import type { InvoiceWithItems } from "@/types/database";
import { Download } from "lucide-react";

export default function InvoiceActions({
  invoice,
}: {
  invoice: InvoiceWithItems;
}) {
  const router = useRouter();
  const [isActioning, setIsActioning] = useState(false);

  const handleStatusChange = async (status: "sent" | "paid") => {
    setIsActioning(true);
    try {
      await updateInvoiceStatus(invoice.id, status);
      toast.success(`Invoice marked as ${status}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update invoice");
      console.error(error);
    } finally {
      setIsActioning(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete invoice ${invoice.invoice_number}?`)) return;

    setIsActioning(true);
    try {
      await deleteInvoice(invoice.id);
      toast.success("Invoice deleted");
      router.push("/dashboard/invoices");
    } catch (error) {
      toast.error("Failed to delete invoice");
      console.error(error);
    } finally {
      setIsActioning(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isActioning}>
          {isActioning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <MoreVertical className="mr-2 h-4 w-4" />
              Actions
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link href={`/api/invoices/${invoice.id}/pdf`} target="_blank">
          <DropdownMenuItem>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
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

        {invoice.status === "draft" && (
          <DropdownMenuItem onClick={() => handleStatusChange("sent")}>
            <Send className="mr-2 h-4 w-4" />
            Mark as Sent
          </DropdownMenuItem>
        )}

        {(invoice.status === "sent" || invoice.status === "overdue") && (
          <DropdownMenuItem onClick={() => handleStatusChange("paid")}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark as Paid
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
