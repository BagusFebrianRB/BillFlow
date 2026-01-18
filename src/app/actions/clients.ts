"use server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Client } from "@/types/database";
import { clientSchema } from "@/lib/validations/client";

export async function getClients(): Promise<Client[]> {
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getClient(id: string): Promise<Client | null> {
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data;
}

export async function createClient(formData: unknown) {
  // VALIDATION
  const validatedData = clientSchema.parse(formData);

  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("clients")
    .insert({
      user_id: user.id,
      name: validatedData.name,
      email: validatedData.email || null,
      company: validatedData.company || null,
      address: validatedData.address || null,
      phone: validatedData.phone || null,
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/dashboard/clients");
  return data;
}

export async function updateClient(id: string, formData: unknown) {
  // VALIDATION
  const validatedData = clientSchema.parse(formData);

  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("clients")
    .update({
      name: validatedData.name,
      email: validatedData.email || null,
      company: validatedData.company || null,
      address: validatedData.address || null,
      phone: validatedData.phone || null,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/dashboard/clients");
  return data;
}

export async function deleteClient(id: string) {
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;

  revalidatePath("/dashboard/clients");
}
