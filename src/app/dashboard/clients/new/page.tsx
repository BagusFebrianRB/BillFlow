import ClientForm from "@/components/clients/client-form";
import BackButton from "@/components/ui/back-button";

export default function NewClientPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <BackButton href="/dashboard/clients" label="Back to Clients" />
        <div className="mt-4">
          <ClientForm mode="create" />
        </div>
      </div>
    </div>
  );
}
