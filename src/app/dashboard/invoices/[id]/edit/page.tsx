import { getInvoice } from "@/app/actions/invoices";
import { getClients } from "@/app/actions/clients";
import { notFound } from "next/navigation";
import InvoiceForm from "@/components/invoices/invoice-form";
import BackButton from "@/components/ui/back-button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [invoice, clients] = await Promise.all([getInvoice(id), getClients()]);

  if (!invoice) {
    notFound();
  }

  // Only drafts can be edited
  if (invoice.status !== "draft") {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-2xl mx-auto">
          <BackButton
            href={`/dashboard/invoices/${id}`}
            label="Back to Invoice"
          />
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Cannot Edit Invoice</CardTitle>
              <CardDescription>
                Only draft invoices can be edited. This invoice has status:{" "}
                {invoice.status}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton
          href={`/dashboard/invoices/${id}`}
          label="Back to Invoice"
        />

        <div className="mb-6 mt-4">
          <h1 className="text-3xl font-bold text-slate-900">Edit Invoice</h1>
          <p className="text-slate-600 mt-1">
            Update invoice {invoice.invoice_number}
          </p>
        </div>

        <InvoiceForm clients={clients} invoice={invoice} mode="edit" />
      </div>
    </div>
  );
}
