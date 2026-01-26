export interface Client {
  id: string
  user_id: string
  name: string
  email: string | null
  company: string | null
  address: string | null
  phone: string | null
  created_at: string
}

export interface Invoice {
  id: string;
  user_id: string;
  client_id: string | null;
  invoice_number: string;
  date: string;
  due_date: string;
  status: "draft" | "sent" | "paid" | "overdue";
  subtotal: number;
  tax: number;
  discount: number;
  discount_type: "percentage" | "fixed";
  total: number;
  currency: string;
  notes: string | null;
  terms: string | null;
  stripe_payment_intent_id: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  created_at: string;
}

export interface InvoiceWithItems extends Invoice {
  client?: Client | null;
  invoice_items: InvoiceItem[];
}

