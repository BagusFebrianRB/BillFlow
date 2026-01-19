"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createInvoice } from "@/app/actions/invoices";
import { toast } from "sonner";
import type { Client } from "@/types/database";
import { invoiceSchema, type InvoiceFormData } from "@/lib/validations/invoice";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  CURRENCIES,
  formatCurrency,
  getCurrencySymbol,
} from "@/lib/utils/currency";

interface InvoiceFormProps {
  clients: Client[];
}

export default function InvoiceForm({ clients }: InvoiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      client_id: "",
      date: format(new Date(), "yyyy-MM-dd"),
      due_date: format(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd"
      ),
      items: [{ description: "", quantity: 1, rate: 0 }],
      notes: "",
      terms: "",
      tax_rate: 0,
      discount: 0,
      discount_type: "percentage", // ← BARU
      currency: "USD", // ← BARU
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Watch values
  const items = form.watch("items");
  const taxRate = form.watch("tax_rate");
  const discount = form.watch("discount");
  const discountType = form.watch("discount_type"); // ← BARU
  const currency = form.watch("currency"); // ← BARU

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.quantity || 0) * (item.rate || 0);
  }, 0);

  const tax = subtotal * ((taxRate || 0) / 100);

  // Calculate discount based on type
  const discountAmount =
    discountType === "percentage"
      ? subtotal * ((discount || 0) / 100)
      : discount || 0;

  const total = subtotal + tax - discountAmount;

  const currencySymbol = getCurrencySymbol(currency);

  const onSubmit = async (data: InvoiceFormData) => {
    setIsSubmitting(true);

    try {
      await createInvoice(data);
      toast.success("Invoice created successfully");
      router.push("/dashboard/invoices");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create invoice");
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client_id">Client *</Label>
              <Select
                value={form.watch("client_id")}
                onValueChange={(value) => form.setValue("client_id", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder="Select client"
                    className="truncate"
                  />
                </SelectTrigger>

                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} {client.company && `(${client.company})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.client_id && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.client_id.message}
                </p>
              )}
            </div>

            {/* CURRENCY SELECTOR  */}
            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <Select
                value={form.watch("currency")}
                onValueChange={(value) => form.setValue("currency", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.code} - {curr.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Invoice Date *</Label>
              <Input
                id="date"
                type="date"
                {...form.register("date")}
                disabled={isSubmitting}
              />
              {form.formState.errors.date && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date *</Label>
              <Input
                id="due_date"
                type="date"
                {...form.register("due_date")}
                disabled={isSubmitting}
              />
              {form.formState.errors.due_date && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.due_date.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Line Items</CardTitle>
          <Button
            type="button"
            size="sm"
            onClick={() => append({ description: "", quantity: 1, rate: 0 })}
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Item {index + 1}</h4>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={isSubmitting}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-3 space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    {...form.register(`items.${index}.description`)}
                    placeholder="Item description"
                    disabled={isSubmitting}
                    rows={2}
                  />
                  {form.formState.errors.items?.[index]?.description && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.items[index]?.description?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Quantity *</Label>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    {...form.register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rate ({currencySymbol}) *</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    {...form.register(`items.${index}.rate`, {
                      valueAsNumber: true,
                    })}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    value={formatCurrency(
                      (items[index]?.quantity || 0) * (items[index]?.rate || 0),
                      currency
                    )}
                    disabled
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* DISCOUNT TYPE - BARU */}
            <div className="space-y-2 col-start-2">
              <Label htmlFor="discount_type">Discount Type</Label>
              <Select
                value={form.watch("discount_type")}
                onValueChange={(value: "percentage" | "fixed") =>
                  form.setValue("discount_type", value)
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">
                    Fixed Amount ({currencySymbol})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="tax_rate">Tax Rate (%)</Label>
              <Input
                id="tax_rate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                {...form.register("tax_rate", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2 col-start-2">
              <Label htmlFor="discount">
                Discount{" "}
                {discountType === "percentage" ? "(%)" : `(${currencySymbol})`}
              </Label>
              <Input
                id="discount"
                type="number"
                min="0"
                step="0.01"
                max={discountType === "percentage" ? 100 : undefined}
                {...form.register("discount", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              {...form.register("terms")}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {/* Totals Summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span className="font-medium">
                {formatCurrency(subtotal, currency)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax ({taxRate}%):</span>
              <span className="font-medium">
                {formatCurrency(tax, currency)}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span>
                  Discount{" "}
                  {discountType === "percentage" ? `(${discount}%)` : ""}:
                </span>
                <span className="font-medium text-red-600">
                  -{formatCurrency(discountAmount, currency)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>{formatCurrency(total, currency)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Invoice"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/invoices")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
