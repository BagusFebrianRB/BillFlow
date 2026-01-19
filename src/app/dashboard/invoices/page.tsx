import { getInvoices } from "@/app/actions/invoices";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Plus } from "lucide-react";
import InvoicesList from "@/components/invoices/invoices-list";
import BackButton from "@/components/ui/back-button";

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <BackButton href="/dashboard" label="Back to Dashboard" />
        <div className="flex justify-between items-center mb-8 mt-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Invoices</h1>
            <p className="text-slate-600 mt-1">Manage your invoices</p>
          </div>
          <Link href="/dashboard/invoices/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </Link>
        </div>

        {invoices.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No invoices yet</CardTitle>
              <CardDescription>
                Get started by creating your first invoice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/invoices/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first invoice
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <InvoicesList invoices={invoices} />
        )}
      </div>
    </div>
  );
}
