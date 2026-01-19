import { getClients } from "@/app/actions/clients";
import InvoiceForm from "@/components/invoices/invoice-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";

export default async function NewInvoicePage() {
  const clients = await getClients();

  if (clients.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>No Clients Found</CardTitle>
              <CardDescription>
                You need to add at least one client before creating an invoice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/clients/new">
                <Button>Add Your First Client</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton href="/dashboard/invoices" label="Back to Invoices" />
        <div className="mb-6 mt-4">
          <h1 className="text-3xl font-bold text-slate-900">Create Invoice</h1>
          <p className="text-slate-600 mt-1">Fill in the details below</p>
        </div>
        <InvoiceForm clients={clients} />
      </div>
    </div>
  );
}
