"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format } from "date-fns"

export default function ReceiptPrintPage() {
  const params = useParams()
  const [invoice, setInvoice] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchInvoice() {
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          customer:customers(*),
          items:invoice_items(*)
        `)
        .eq("id", params.id)
        .single()

      if (!error && data) {
        setInvoice(data)
        // Auto-print after loading
        setTimeout(() => window.print(), 500)
      }
    }

    fetchInvoice()
  }, [params.id, supabase])

  if (!invoice) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: 72mm 297mm;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
          }
          .receipt-container {
            width: 72mm !important;
            max-width: 72mm !important;
            font-size: 12px !important;
            padding: 5mm !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="receipt-container w-[72mm] mx-auto p-4 font-mono text-xs">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-lg font-bold">RepairHQ</h1>
          <p className="text-[10px]">support@repairhq.io</p>
          <p className="text-[10px]">1-800-REPAIR-HQ</p>
        </div>

        <div className="border-t border-dashed border-black my-2"></div>

        {/* Invoice Info */}
        <div className="mb-4">
          <p className="font-bold">Invoice #{invoice.id}</p>
          <p>{format(new Date(invoice.date), "MM/dd/yyyy HH:mm")}</p>
        </div>

        {/* Customer Info */}
        <div className="mb-4">
          <p className="font-bold">{invoice.customer.name}</p>
          <p className="text-[10px]">{invoice.customer.phone}</p>
        </div>

        <div className="border-t border-dashed border-black my-2"></div>

        {/* Line Items */}
        <div className="mb-4">
          {invoice.items.map((item: any, i: number) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between">
                <span className="flex-1 pr-2">{item.name}</span>
                <span>${item.total.toFixed(2)}</span>
              </div>
              <div className="text-[10px] text-gray-600">
                {item.quantity} x ${item.price.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-black my-2"></div>

        {/* Totals */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${invoice.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${invoice.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-sm pt-1">
            <span>TOTAL:</span>
            <span>${invoice.total.toFixed(2)}</span>
          </div>
        </div>

        {/* GBT Rewards */}
        {invoice.gbtEarned > 0 && (
          <>
            <div className="border-t border-dashed border-black my-2"></div>
            <div className="text-center">
              <p className="font-bold">🎉 GBT Earned: {invoice.gbtEarned}</p>
              <p className="text-[10px]">Use for future discounts!</p>
            </div>
          </>
        )}

        <div className="border-t border-dashed border-black my-2"></div>

        {/* Footer */}
        <div className="text-center text-[10px] mt-4">
          <p>Thank you for choosing RepairHQ!</p>
          <p className="mt-2">**** CUSTOMER COPY ****</p>
        </div>

        {/* QR Code placeholder */}
        <div className="text-center mt-4">
          <div className="inline-block w-16 h-16 bg-black"></div>
          <p className="text-[8px] mt-1">Scan for digital receipt</p>
        </div>
      </div>

      {/* Print button (hidden during print) */}
      <div className="no-print fixed bottom-4 right-4">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700"
        >
          Print Receipt
        </button>
      </div>
    </>
  )
}
