import jsPDF from "jspdf"
import "jspdf-autotable"

export interface InvoicePDFData {
  invoiceNumber: string
  date: string
  dueDate: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
  }
  business: {
    name: string
    address: string
    phone: string
    email: string
  }
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  tax: number
  total: number
  notes?: string
}

export class PDFGenerator {
  static generateInvoice(data: InvoicePDFData): jsPDF {
    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.text("INVOICE", 20, 30)

    // Invoice details
    doc.setFontSize(12)
    doc.text(`Invoice #: ${data.invoiceNumber}`, 20, 50)
    doc.text(`Date: ${data.date}`, 20, 60)
    doc.text(`Due Date: ${data.dueDate}`, 20, 70)

    // Business info
    doc.text("From:", 20, 90)
    doc.text(data.business.name, 20, 100)
    doc.text(data.business.address, 20, 110)
    doc.text(data.business.phone, 20, 120)
    doc.text(data.business.email, 20, 130)

    // Customer info
    doc.text("Bill To:", 120, 90)
    doc.text(data.customer.name, 120, 100)
    doc.text(data.customer.address, 120, 110)
    doc.text(data.customer.phone, 120, 120)
    doc.text(data.customer.email, 120, 130)

    // Items table
    const tableData = data.items.map((item) => [
      item.description,
      item.quantity.toString(),
      `$${item.unitPrice.toFixed(2)}`,
      `$${item.total.toFixed(2)}`,
    ])
    ;(doc as any).autoTable({
      head: [["Description", "Qty", "Unit Price", "Total"]],
      body: tableData,
      startY: 150,
      theme: "grid",
    })

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 20
    doc.text(`Subtotal: $${data.subtotal.toFixed(2)}`, 120, finalY)
    doc.text(`Tax: $${data.tax.toFixed(2)}`, 120, finalY + 10)
    doc.setFontSize(14)
    doc.text(`Total: $${data.total.toFixed(2)}`, 120, finalY + 25)

    // Notes
    if (data.notes) {
      doc.setFontSize(10)
      doc.text("Notes:", 20, finalY + 40)
      doc.text(data.notes, 20, finalY + 50)
    }

    return doc
  }

  static generateReceipt(data: any): jsPDF {
    const doc = new jsPDF({
      format: [80, 200], // Thermal receipt size
      unit: "mm",
    })

    doc.setFontSize(12)
    doc.text("RECEIPT", 25, 20)
    doc.setFontSize(8)
    doc.text(`Receipt #: ${data.receiptNumber}`, 5, 30)
    doc.text(`Date: ${data.date}`, 5, 35)

    // Items
    let y = 45
    data.items.forEach((item: any) => {
      doc.text(item.name, 5, y)
      doc.text(`${item.quantity} x $${item.price}`, 5, y + 3)
      doc.text(`$${item.total}`, 60, y + 3)
      y += 8
    })

    // Total
    doc.text(`Total: $${data.total}`, 5, y + 10)

    return doc
  }

  static generateLabel(data: any): jsPDF {
    const doc = new jsPDF({
      format: [62, 29], // Standard label size
      unit: "mm",
    })

    doc.setFontSize(10)
    doc.text(data.itemName, 2, 8)
    doc.setFontSize(8)
    doc.text(`SKU: ${data.sku}`, 2, 15)
    doc.text(`Price: $${data.price}`, 2, 22)

    return doc
  }
}
