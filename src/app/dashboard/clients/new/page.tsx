import ClientForm from "@/components/clients/client-form";
import DashboardLayout from "@/components/layout/dashboard-layout";
import BackButton from "@/components/ui/back-button";

export default function NewClientPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-8">
        <BackButton href="/dashboard/clients" label="Back to Clients" />
        <div className="max-w-2xl mx-auto">
          <div className="mt-4">
            <ClientForm mode="create" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
