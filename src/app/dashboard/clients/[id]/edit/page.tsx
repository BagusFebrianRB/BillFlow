import { getClient } from "@/app/actions/clients";
import ClientForm from "@/components/clients/client-form";
import DashboardLayout from "@/components/layout/dashboard-layout";
import BackButton from "@/components/ui/back-button";
import { notFound } from "next/navigation";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClient(id);

  if (!client) {
    notFound();
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-8">
        <BackButton href="/dashboard/clients" label="Back to Clients" />
        <div className="max-w-2xl mx-auto ">
          <div className="mt-4">
            <ClientForm client={client} mode="edit" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
