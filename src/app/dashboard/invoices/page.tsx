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
import InvoicesListWithFilters from "@/components/invoices/invoices-list-with-filters";

import DashboardLayout from "@/components/layout/dashboard-layout";

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8 ">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Invoices</h1>
            <p className="text-slate-600 mt-1">Manage your invoices</p>
          </div>
          <Link href="/dashboard/invoices/new">
            <Button className="bg-teal-500 hover:bg-teal-600">
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
                <Button className="bg-teal-500 hover:bg-teal-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first invoice
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <InvoicesListWithFilters invoices={invoices} />
        )}
      </div>
    </DashboardLayout>
  );
}
