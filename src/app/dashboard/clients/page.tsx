import { getClients } from "@/app/actions/clients";
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
import ClientsList from "@/components/clients/clients-list";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Clients</h1>
            <p className="text-slate-600 mt-1">Manage your clients</p>
          </div>
          <Link href="/dashboard/clients/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </Link>
        </div>

        {clients.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No clients yet</CardTitle>
              <CardDescription>
                Get started by adding your first client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/clients/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add your first client
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <ClientsList clients={clients} />
        )}
      </div>
    </div>
  );
}
