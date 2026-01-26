"use server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getBusinessProfile() {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function upsertBusinessProfile(formData: {
  business_name: string;
  address?: string;
  phone?: string;
  tax_id?: string;
  currency?: string;
  default_tax_rate?: number;
}) {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Check if exists
  const { data: existing } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    // UPDATE
    const { data, error } = await supabase
      .from("business_profiles")
      .update({
        business_name: formData.business_name,
        address: formData.address || null,
        phone: formData.phone || null,
        tax_id: formData.tax_id || null,
        currency: formData.currency || "USD",
        default_tax_rate: formData.default_tax_rate || 0,
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/dashboard/settings");
    return data;
  } else {
    // INSERT
    const { data, error } = await supabase
      .from("business_profiles")
      .insert({
        user_id: user.id,
        business_name: formData.business_name,
        address: formData.address || null,
        phone: formData.phone || null,
        tax_id: formData.tax_id || null,
        currency: formData.currency || "USD",
        default_tax_rate: formData.default_tax_rate || 0,
      })
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/dashboard/settings");
    return data;
  }
}

export async function uploadLogo(file: File) {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Delete old logo if exists
  if (existingProfile?.logo_url) {
    const oldPath = existingProfile.logo_url.split("/").pop();
    await supabase.storage.from("logos").remove([`${user.id}/${oldPath}`]);
  }

  // Upload new logo
  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}/logo-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("logos")
    .upload(fileName, file, { upsert: true });

  if (uploadError) throw uploadError;

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("logos").getPublicUrl(fileName);

  // UPDATE (bukan upsert) - hanya update logo_url
  if (existingProfile) {
    const { error: updateError } = await supabase
      .from("business_profiles")
      .update({ logo_url: publicUrl })
      .eq("user_id", user.id);

    if (updateError) throw updateError;
  } else {
    // Create minimal profile with logo
    const { error: insertError } = await supabase
      .from("business_profiles")
      .insert({
        user_id: user.id,
        business_name: "My Business", // Temporary
        logo_url: publicUrl,
      });

    if (insertError) throw insertError;
  }

  revalidatePath("/dashboard/settings");
  return publicUrl;
}
