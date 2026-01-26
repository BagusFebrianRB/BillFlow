import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getInvoice } from "@/app/actions/invoices";
import InvoicePDF from "@/components/pdf/invoice-pdf";
import { createClient } from "@/lib/supabase/server";
import React from "react";
import { getBusinessProfile } from "@/app/actions/business-profile";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [invoice, businessProfile] = await Promise.all([
      getInvoice(id),
      getBusinessProfile().catch(() => null),
    ]);
    
    if (!invoice || invoice.user_id !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const buffer = await renderToBuffer(<InvoicePDF invoice={invoice} businessProfile={businessProfile} />);

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${invoice.invoice_number}.pdf"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "PDF error" }, { status: 500 });
  }
}
