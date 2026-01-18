"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient, updateClient } from "@/app/actions/clients";
import { toast } from "sonner";
import type { Client } from "@/types/database";
import { clientSchema, type ClientFormData } from "@/lib/validations/client";
import { Loader2 } from "lucide-react";

interface ClientFormProps {
  client?: Client;
  mode: "create" | "edit";
}

export default function ClientForm({ client, mode }: ClientFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client?.name || "",
      email: client?.email || "",
      company: client?.company || "",
      address: client?.address || "",
      phone: client?.phone || "",
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        await createClient(data);
        toast.success("Client created successfully");
      } else {
        await updateClient(client!.id, data);
        toast.success("Client updated successfully");
      }
      router.push("/dashboard/clients");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(`Failed to ${mode} client`);
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Add New Client" : "Edit Client"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              {...form.register("name")}
              disabled={isSubmitting}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              disabled={isSubmitting}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              {...form.register("company")}
              disabled={isSubmitting}
            />
            {form.formState.errors.company && (
              <p className="text-sm text-red-600">
                {form.formState.errors.company.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...form.register("phone")}
              disabled={isSubmitting}
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-600">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              {...form.register("address")}
              rows={3}
              disabled={isSubmitting}
            />
            {form.formState.errors.address && (
              <p className="text-sm text-red-600">
                {form.formState.errors.address.message}
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : mode === "create" ? (
                "Create Client"
              ) : (
                "Update Client"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/clients")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
