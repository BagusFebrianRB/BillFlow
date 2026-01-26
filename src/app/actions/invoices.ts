"use server";

import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { InvoiceWithItems } from "@/types/database";
import { invoiceSchema } from "@/lib/validations/invoice";

// Generate invoice number
async function generateInvoiceNumber(userId: string): Promise<string> {
  const supabase = await createSupabaseClient();

  const { count } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const invoiceNumber = `INV-${String((count || 0) + 1).padStart(4, "0")}`;
  return invoiceNumber;
}

export async function getInvoices(): Promise<InvoiceWithItems[]> {
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      client:clients(*),
      invoice_items(*)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // AUTO-CALCULATE OVERDUE
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time
  return (data || []).map((invoice) => {
    const dueDate = new Date(invoice.due_date);
    const isOverdue = invoice.status === "sent" && dueDate < today;

    return {
      ...invoice,
      status: isOverdue ? "overdue" : invoice.status,
    } as InvoiceWithItems;
  });
}

export async function getInvoice(id: string): Promise<InvoiceWithItems | null> {
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      client:clients(*),
      invoice_items(*)
    `,
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  // AUTO-CALCULATE OVERDUE
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(data.due_date);
  const isOverdue = data.status === "sent" && dueDate < today;

  return {
    ...data,
    status: isOverdue ? "overdue" : data.status,
  } as InvoiceWithItems;
}

export async function createInvoice(formData: unknown) {
  const validatedData = invoiceSchema.parse(formData);

  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Generate invoice number
  const invoiceNumber = await generateInvoiceNumber(user.id);

  // Calculate totals
  const subtotal = validatedData.items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0,
  );
  const tax = subtotal * ((validatedData.tax_rate || 0) / 100);

  let discountAmount = 0;
  if (validatedData.discount_type === "percentage") {
    discountAmount = subtotal * ((validatedData.discount || 0) / 100);
  } else {
    discountAmount = validatedData.discount || 0;
  }
  const total = subtotal + tax - discountAmount;

  // ✅ ROUND SEMUA ANGKA (2 decimals)
  const roundedSubtotal = Math.round(subtotal * 100) / 100;
  const roundedTax = Math.round(tax * 100) / 100;
  const roundedDiscount = Math.round(discountAmount * 100) / 100;
  const roundedTotal = Math.round(total * 100) / 100;

  // Create invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      user_id: user.id,
      client_id: validatedData.client_id,
      invoice_number: invoiceNumber,
      date: validatedData.date,
      due_date: validatedData.due_date,
      status: "draft",
      subtotal: roundedSubtotal,
      tax: roundedTax,
      discount: roundedDiscount || 0,
      discount_type: validatedData.discount_type,
      currency: validatedData.currency,
      total: roundedTotal,
      notes: validatedData.notes || null,
      terms: validatedData.terms || null,
    })
    .select()
    .single();

  if (invoiceError) throw invoiceError;

  // Create invoice items
  const itemsToInsert = validatedData.items.map((item) => ({
    invoice_id: invoice.id,
    description: item.description,
    quantity: item.quantity,
    rate: item.rate,
    amount: item.quantity * item.rate,
  }));

  const { error: itemsError } = await supabase
    .from("invoice_items")
    .insert(itemsToInsert);

  if (itemsError) throw itemsError;

  revalidatePath("/dashboard/invoices");
  return invoice;
}

export async function updateInvoiceStatus(
  id: string,
  status: "draft" | "sent" | "paid" | "overdue",
) {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const updateData: Record<string, string | Date> = { status };
  if (status === "paid") {
    updateData.paid_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("invoices")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/dashboard/invoices");
  return data;
}

// update invoice
export async function updateInvoice(id: string, formData: unknown) {
  const validatedData = invoiceSchema.parse(formData);

  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Check if invoice is draft (only drafts can be edited)
  const { data: existingInvoice } = await supabase
    .from("invoices")
    .select("status")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!existingInvoice) throw new Error("Invoice not found");
  if (existingInvoice.status !== "draft") {
    throw new Error("Only draft invoices can be edited");
  }

  // Calculate totals
  const subtotal = validatedData.items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0,
  );
  const tax = subtotal * ((validatedData.tax_rate || 0) / 100);

  let discountAmount = 0;
  if (validatedData.discount_type === "percentage") {
    discountAmount = subtotal * ((validatedData.discount || 0) / 100);
  } else {
    discountAmount = validatedData.discount || 0;
  }

  const total = subtotal + tax - discountAmount;

  //  ROUND SEMUA ANGKA (2 decimals)
  const roundedSubtotal = Math.round(subtotal * 100) / 100;
  const roundedTax = Math.round(tax * 100) / 100;
  const roundedDiscount = Math.round(discountAmount * 100) / 100;
  const roundedTotal = Math.round(total * 100) / 100;

  // Update invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .update({
      client_id: validatedData.client_id,
      date: validatedData.date,
      due_date: validatedData.due_date,
      subtotal: roundedSubtotal,
      tax: roundedTax,
      discount: roundedDiscount || 0,
      discount_type: validatedData.discount_type,
      currency: validatedData.currency,
      total: roundedTotal,
      notes: validatedData.notes || null,
      terms: validatedData.terms || null,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (invoiceError) throw invoiceError;

  // Delete existing items
  await supabase.from("invoice_items").delete().eq("invoice_id", id);

  // Insert new items
  const itemsToInsert = validatedData.items.map((item) => ({
    invoice_id: id,
    description: item.description,
    quantity: item.quantity,
    rate: item.rate,
    amount: item.quantity * item.rate,
  }));

  const { error: itemsError } = await supabase
    .from("invoice_items")
    .insert(itemsToInsert);

  if (itemsError) throw itemsError;

  revalidatePath("/dashboard/invoices");
  revalidatePath(`/dashboard/invoices/${id}`);
  return invoice;
}

// delete invoice
export async function deleteInvoice(id: string) {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;

  revalidatePath("/dashboard/invoices");
}
