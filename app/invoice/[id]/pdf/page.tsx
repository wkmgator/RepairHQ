"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PDFDownloadLink, pdf } from "@react-pdf/renderer"
import { InvoicePDF } from "@/components/pdf/invoice-pdf"
import { PDFViewer } from "@/components/pdf-viewer"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ArrowLeft, Download, Printer } from "lucide-react"

export default function InvoicePDFPage() {
  const params = useParams()
  const router = useRouter()
  const [invoice, setInvoice] = useState<any>(null)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [loading, setLoading] = useState(true)
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

        // Generate PDF blob
        const doc = <InvoicePDF invoice={data} />
        const asPdf = pdf(doc)
        const blob = await asPdf.toBlob()
        setPdfBlob(blob)
      }
      setLoading(false)
    }

    fetchInvoice()
  }, [params.id, supabase])

  const handlePrint = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob)
      const printWindow = window.open(url)
      if (printWindow) {
        printWindow.addEventListener("load", () => {
          printWindow.print()
        })
      }
    }
  }

  const handleDownload = () => {
    if (pdfBlob && invoice) {
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `invoice-${invoice.id}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!invoice || !pdfBlob) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Invoice not found</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push(`/invoice/${params.id}/print`)}>
            <Printer className="mr-2 h-4 w-4" />
            Thermal Receipt
          </Button>

          <PDFDownloadLink document={<InvoicePDF invoice={invoice} />} fileName={`invoice-${invoice.id}.pdf`}>
            {({ loading }) => (
              <Button disabled={loading}>
                <Download className="mr-2 h-4 w-4" />
                {loading ? "Generating..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-6">Invoice #{invoice.id}</h1>

      <PDFViewer file={pdfBlob} onPrint={handlePrint} onDownload={handleDownload} className="max-w-4xl mx-auto" />
    </div>
  )
}
