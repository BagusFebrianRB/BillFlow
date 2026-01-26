import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Users,
  DollarSign,
  Clock,
  ClockAlert,
  ChartLine,
  Lightbulb,
  FilePlus,
  UserRoundPlus,
  Settings,
} from "lucide-react";
import { getClients } from "@/app/actions/clients";
import { getInvoices } from "@/app/actions/invoices";
import { formatCurrency } from "@/lib/utils/currency";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { calculateInvoiceStats } from "@/lib/utils/invoice-stats";
import { getLast6MonthsRevenue } from "@/lib/utils/chart-data";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { RecentInvoices } from "@/components/dashboard/RecentInvoices";

export default async function DashboardPage() {
  const [clients, invoices] = await Promise.all([getClients(), getInvoices()]);

  const stats = calculateInvoiceStats(invoices);
  const chartData = getLast6MonthsRevenue(invoices);

  const recentInvoices = invoices
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Overview of your business</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-5 w-5 text-teal-600" />
            </CardHeader>
            <CardContent>
              {stats.USD.revenue > 0 && (
                <div>
                  <div className="text-teal-600 font-bold text-2xl">
                    {formatCurrency(stats.USD.revenue, "USD")}
                  </div>
                </div>
              )}
              <p className="text-xs text-slate-600 mt-1">
                USD • {stats.USD.revenueCount} Invoices
              </p>
              {stats.IDR.revenue > 0 && (
                <div>
                  <div className="text-teal-600 font-bold text-2xl">
                    {formatCurrency(stats.IDR.revenue, "IDR")}
                  </div>
                </div>
              )}
              <p className="text-xs text-slate-600 mt-1">
                IDR • {stats.IDR.revenueCount} Invoices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Amount
              </CardTitle>
              <Clock className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              {stats.USD.pending > 0 && (
                <div>
                  <div className="text-amber-600 font-bold text-2xl">
                    {formatCurrency(stats.USD.pending, "USD")}
                  </div>
                </div>
              )}
              <p className="text-xs text-slate-600 mt-1">
                USD • {stats.USD.pendingCount} Pending Invoices
              </p>
              {stats.IDR.pending > 0 && (
                <div>
                  <div className="text-amber-600 font-bold text-2xl">
                    {formatCurrency(stats.IDR.pending, "IDR")}
                  </div>
                </div>
              )}
              <p className="text-xs text-slate-600 mt-1">
                IDR • {stats.IDR.pendingCount} Pending Invoices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <ClockAlert className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              {stats.USD.overdue > 0 && (
                <div>
                  <div className="text-red-600 font-bold text-2xl">
                    {formatCurrency(stats.USD.overdue, "USD")}
                  </div>
                </div>
              )}
              <p className="text-xs text-slate-600 mt-1">
                USD • {stats.USD.overdueCount} Overdue Invoices
              </p>
              {stats.IDR.overdue > 0 && (
                <div>
                  <div className="text-red-600 font-bold text-2xl">
                    {formatCurrency(stats.IDR.overdue, "IDR")}
                  </div>
                </div>
              )}
              <p className="text-xs text-slate-600 mt-1">
                IDR • {stats.IDR.overdueCount} Overdue Invoices
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="h-full col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">
                Cash Flow Trends
              </CardTitle>
              <ChartLine className="h-5 w-5 text-teal-600" />
            </CardHeader>
            <CardContent>
              <RevenueChart chartData={chartData} />
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
              <Lightbulb className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Link href="/dashboard/invoices/new">
                <Card className="cursor-pointer bg-white text-slate-600 text-sm transition hover:shadow-md hover:bg-slate-200">
                  <CardContent className="flex flex-row items-center space-x-2">
                    <FilePlus className="h-5 w-5" />
                    <CardTitle>Create New Invoice</CardTitle>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/dashboard/clients/new">
                <Card className="cursor-pointer bg-white text-slate-600 text-sm transition hover:shadow-md hover:bg-slate-200">
                  <CardContent className="flex flex-row items-center space-x-2">
                    <UserRoundPlus className="h-5 w-5" />
                    <CardTitle>Add New Client</CardTitle>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/dashboard/clients/new">
                <Card className="cursor-pointer bg-white text-slate-600 text-sm transition hover:shadow-md hover:bg-slate-200">
                  <CardContent className="flex flex-row items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <CardTitle>Setting</CardTitle>
                  </CardContent>
                </Card>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className=" h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-bold">Recent Invoices</CardTitle>
              <Link href="/dashboard/invoices" className="text-teal-700 text-base">View All</Link>
            </CardHeader>
            <CardContent>
              <RecentInvoices invoices={recentInvoices} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
