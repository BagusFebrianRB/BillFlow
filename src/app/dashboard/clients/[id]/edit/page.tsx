import { getClient } from "@/app/actions/clients";
import ClientForm from "@/components/clients/client-form";
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
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mt-4">
          <ClientForm client={client} mode="edit" />
        </div>
      </div>
    </div>
  );
}
