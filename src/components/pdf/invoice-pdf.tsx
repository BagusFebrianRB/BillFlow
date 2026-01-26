import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type {  InvoiceWithItems } from "@/types/database";
import { format } from "date-fns";

// ADD THIS TYPE
interface BusinessProfile {
  business_name: string
  logo_url: string | null
  address: string | null
  phone: string | null
  tax_id: string | null
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#F7F7FF",
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
    marginBottom: 5,
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  column: {
    width: "48%",
  },
  label: {
    fontSize: 9,
    color: "#666",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 11,
    marginBottom: 5,
  },
  table: {
    marginTop: 30,
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingVertical: 5,
  },
  tableRow: {
    paddingVertical: 5,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#DEDEDE",
  },
  tableCol1: {
    width: "50%",
  },
  tableCol2: {
    width: "10%",
    textAlign: "right",
  },
  tableCol3: {
    width: "20%",
    textAlign: "right",
  },
  tableCol4: {
    width: "20%",
    textAlign: "right",
  },
  totalsSection: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 10,
  },
  totalValue: {
    fontSize: 10,
    textAlign: "right",
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#000",
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "right",
  },
  notes: {
    marginTop: 40,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#DEDEDE",
    borderBottomWidth: 1,
    borderBottomColor: "#DEDEDE",
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
  },
  notesText: {
    fontSize: 9,
    color: "#666",
    lineHeight: 1.5,
  },
});

interface InvoicePDFProps {
  invoice: InvoiceWithItems;
  businessProfile?: BusinessProfile | null
}

function getCurrencySymbol(currency: string): string {
  return currency === "IDR" ? "Rp" : "$";
}

function formatAmount(amount: number, currency: string): string {
  const symbol = getCurrencySymbol(currency);
  if (currency === "IDR") {
    return `${symbol} ${amount.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }
  return `${symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice,businessProfile }) => {
  const discountAmount =
    invoice.discount_type === "percentage"
      ? invoice.subtotal * (invoice.discount / 100)
      : invoice.discount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.invoiceNumber}>{invoice.invoice_number}</Text>
        </View>

        {businessProfile && (
          <View style={{ marginTop: 20 }}>
            {businessProfile.logo_url && (
              <Image
                src={businessProfile.logo_url}
                style={{ width: 60, height: 60, marginBottom: 10 }}
              />
            )}
            <Text style={styles.value}>{businessProfile.business_name}</Text>
            {businessProfile.address && (
              <Text style={{ fontSize: 9, color: "#666" }}>
                {businessProfile.address}
              </Text>
            )}
            {businessProfile.phone && (
              <Text style={{ fontSize: 9, color: "#666" }}>
                {businessProfile.phone}
              </Text>
            )}
            {businessProfile.tax_id && (
              <Text style={{ fontSize: 9, color: "#666" }}>
                Tax ID: {businessProfile.tax_id}
              </Text>
            )}
          </View>
        )}

        {/* Bill To & Invoice Info */}
        <View
          style={[
            styles.row,
            {
              borderTopWidth: 1,
              borderTopColor: "#000",
              borderBottomWidth: 1,
              borderBottomColor: "#000",
              paddingVertical: 5,
              marginVertical: 10,
            },
          ]}
        >
          <View style={styles.column}>
            <Text style={styles.label}>Bill To:</Text>
            <Text style={styles.value}>{invoice.client?.name}</Text>
            {invoice.client?.company && (
              <Text style={styles.value}>{invoice.client.company}</Text>
            )}
            {invoice.client?.email && (
              <Text style={styles.value}>{invoice.client.email}</Text>
            )}
            {invoice.client?.phone && (
              <Text style={styles.value}>{invoice.client.phone}</Text>
            )}
            {invoice.client?.address && (
              <Text style={styles.value}>{invoice.client.address}</Text>
            )}
          </View>

          <View style={[styles.column, { alignItems: "flex-end" }]}>
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.label}>Invoice Date:</Text>
              <Text style={styles.value}>
                {format(new Date(invoice.date), "MMM dd, yyyy")}
              </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.label}>Due Date:</Text>
              <Text style={styles.value}>
                {format(new Date(invoice.due_date), "MMM dd, yyyy")}
              </Text>
            </View>
            {invoice.paid_at && (
              <View>
                <Text style={styles.label}>Paid On:</Text>
                <Text style={styles.value}>
                  {format(new Date(invoice.paid_at), "MMM dd, yyyy")}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCol1}>Description</Text>
            <Text style={[styles.tableCol2, { textAlign: "center" }]}>Qty</Text>
            <Text style={styles.tableCol3}>Rate</Text>
            <Text style={styles.tableCol4}>Amount</Text>
          </View>

          {invoice.invoice_items?.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableCol1}>{item.description}</Text>
              <Text style={[styles.tableCol2, { textAlign: "center" }]}>
                {item.quantity}
              </Text>
              <Text style={styles.tableCol3}>
                {formatAmount(item.rate, invoice.currency)}
              </Text>
              <Text style={styles.tableCol4}>
                {formatAmount(item.amount, invoice.currency)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>
              {formatAmount(invoice.subtotal, invoice.currency)}
            </Text>
          </View>

          {invoice.tax > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax:</Text>
              <Text style={styles.totalValue}>
                {formatAmount(invoice.tax, invoice.currency)}
              </Text>
            </View>
          )}

          {invoice.discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Discount{" "}
                {invoice.discount_type === "percentage"
                  ? `(${invoice.discount}%)`
                  : ""}
                :
              </Text>
              <Text style={styles.totalValue}>
                -{formatAmount(discountAmount, invoice.currency)}
              </Text>
            </View>
          )}

          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>Total:</Text>
            <Text style={styles.grandTotalValue}>
              {formatAmount(invoice.total, invoice.currency)}
            </Text>
          </View>
        </View>

        {/* Notes & Terms */}
        {(invoice.notes || invoice.terms) && (
          <View style={styles.notes}>
            {invoice.notes && (
              <View style={{ marginBottom: 15 }}>
                <Text style={styles.notesTitle}>Notes:</Text>
                <Text style={styles.notesText}>{invoice.notes}</Text>
              </View>
            )}
            {invoice.terms && (
              <View>
                <Text style={styles.notesTitle}>Terms & Conditions:</Text>
                <Text style={styles.notesText}>{invoice.terms}</Text>
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
};
export default InvoicePDF;
