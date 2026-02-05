"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { InvoiceWithItems } from "@/types/database";

interface InvoiceFiltersProps {
  invoices: InvoiceWithItems[];
  onFilterChange: (filtered: InvoiceWithItems[]) => void;
}

export default function InvoiceFilters({
  invoices,
  onFilterChange,
}: InvoiceFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");

  const applyFilters = (query: string, status: string, sort: string) => {
    let filtered = [...invoices];

    // Search filter
    if (query) {
      filtered = filtered.filter(
        (inv) =>
          inv.invoice_number.toLowerCase().includes(query.toLowerCase()) ||
          inv.client?.name.toLowerCase().includes(query.toLowerCase()) ||
          inv.client?.company?.toLowerCase().includes(query.toLowerCase()),
      );
    }

    // Status filter
    if (status !== "all") {
      filtered = filtered.filter((inv) => inv.status === status);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sort) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "duedate-desc":
          return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
        case "duedate-asc":
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        case "amount-desc":
          return b.total - a.total;
        case "amount-asc":
          return a.total - b.total;
        case "number-desc":
          return b.invoice_number.localeCompare(a.invoice_number);
        case "number-asc":
          return a.invoice_number.localeCompare(b.invoice_number);
        default:
          return 0;
      }
    });

    onFilterChange(filtered);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    applyFilters(value, statusFilter, sortBy);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    applyFilters(searchQuery, value, sortBy);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    applyFilters(searchQuery, statusFilter, value);
  };

  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="search"
              placeholder="Invoice number or client..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <Label htmlFor="sort">Sort By</Label>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger id="sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Date (Newest)</SelectItem>
              <SelectItem value="date-asc">Date (Oldest)</SelectItem>
              <SelectItem value="duedate-desc">Due Date (Newest)</SelectItem>
              <SelectItem value="duedate-asc">Due Date (Oldest)</SelectItem>
              <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
              <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
              <SelectItem value="number-desc">Number (Z-A)</SelectItem>
              <SelectItem value="number-asc">Number (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
