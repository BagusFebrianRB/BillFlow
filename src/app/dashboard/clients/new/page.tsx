import ClientForm from "@/components/clients/client-form";

export default function NewClientPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <ClientForm mode="create" />
      </div>
    </div>
  );
}
