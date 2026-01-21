"use client";

import { useState } from "react";
import InvoiceFilters from "./invoice-filters";
import InvoicesList from "./invoices-list";
import type { InvoiceWithItems } from "@/types/database";

export default function InvoicesListWithFilters({
  invoices,
}: {
  invoices: InvoiceWithItems[];
}) {
  const [filteredInvoices, setFilteredInvoices] = useState(invoices);

  return (
    <>
      <InvoiceFilters
        invoices={invoices}
        onFilterChange={setFilteredInvoices}
      />

      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600">No invoices match your filters</p>
        </div>
      ) : (
        <InvoicesList invoices={filteredInvoices} />
      )}
    </>
  );
}
