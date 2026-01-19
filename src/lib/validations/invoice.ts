import { z } from "zod";

export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  rate: z.number().min(0, "Rate must be positive"),
});

export const invoiceSchema = z.object({
  client_id: z.string().min(1, "Client is required"),
  date: z.string().min(1, "Date is required"),
  due_date: z.string().min(1, "Due date is required"),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  notes: z.string().optional().or(z.literal("")),
  terms: z.string().optional().or(z.literal("")),
  tax_rate: z.number().min(0).max(100),
  discount: z.number().min(0),
  discount_type: z.enum(["percentage", "fixed"]),
  currency: z.string().min(3).max(3),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
export type InvoiceItemFormData = z.infer<typeof invoiceItemSchema>;
