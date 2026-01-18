"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Mail,
  Building2,
  Phone,
  MapPin,
  Loader2,
} from "lucide-react";
import type { Client } from "@/types/database";
import { deleteClient } from "@/app/actions/clients";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ClientsList({ clients }: { clients: Client[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    setDeletingId(id);
    try {
      await deleteClient(id);
      toast.success("Client deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete client");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {clients.map((client) => (
        <Card key={client.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg text-slate-900">
                {client.name}
              </h3>
              {client.company && (
                <div className="flex items-center text-sm text-slate-600 mt-1">
                  <Building2 className="h-3 w-3 mr-1" />
                  {client.company}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {client.email && (
              <div className="flex items-center text-sm text-slate-600">
                <Mail className="h-3 w-3 mr-2" />
                {client.email}
              </div>
            )}
            {client.phone && (
              <div className="flex items-center text-sm text-slate-600">
                <Phone className="h-3 w-3 mr-2" />
                {client.phone}
              </div>
            )}
            {client.address && (
              <div className="flex items-center text-sm text-slate-600">
                <MapPin className="h-3 w-3 mr-2" />
                {client.address}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Link
              href={`/dashboard/clients/${client.id}/edit`}
              className="flex-1"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={deletingId === client.id}
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(client.id, client.name)}
              disabled={deletingId === client.id}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {deletingId === client.id ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
