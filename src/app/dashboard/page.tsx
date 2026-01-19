import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Users, FileText, DollarSign, Clock } from "lucide-react";
import { getClients } from "@/app/actions/clients";
import { getInvoices } from "@/app/actions/invoices";
import { formatCurrency } from "@/lib/utils/currency";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [clients, invoices] = await Promise.all([getClients(), getInvoices()]);

  const totalRevenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.total, 0);

  const pendingAmount = invoices
    .filter((inv) => inv.status === "sent" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.total, 0);
  const draftCount = invoices.filter((inv) => inv.status === "draft").length;
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">Welcome back, {user.email}</p>
          </div>
          <form action="/auth/signout" method="post">
            <Button type="submit" variant="outline">
              Sign out
            </Button>
          </form>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clients
              </CardTitle>
              <Users className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Invoices
              </CardTitle>
              <FileText className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoices.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalRevenue, "IDR")}
              </div>
              <p className="text-xs text-slate-600 mt-1">Paid invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(pendingAmount, "IDR")}
              </div>
              <p className="text-xs text-slate-600 mt-1">{draftCount} drafts</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/dashboard/clients">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clients</CardTitle>
                <Users className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Manage Clients</div>
                <p className="text-xs text-slate-600 mt-1">
                  Add and manage your clients
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/invoices">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Invoices</CardTitle>
                <FileText className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Manage Invoices</div>
                <p className="text-xs text-slate-600 mt-1">
                  Create and manage invoices
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
