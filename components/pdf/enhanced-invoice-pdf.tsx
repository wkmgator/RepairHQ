import type React from "react"
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer"
import { format } from "date-fns"

// Register fonts for better typography
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2" },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2",
      fontWeight: 700,
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Inter",
    fontSize: 10,
    lineHeight: 1.6,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#e5e7eb",
  },
  logo: {
    width: 120,
    height: 40,
  },
  companyInfo: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 8,
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  invoiceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  billToSection: {
    flex: 1,
    marginRight: 20,
  },
  invoiceMetaSection: {
    flex: 1,
    alignItems: "flex-end",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  customerInfo: {
    marginBottom: 4,
    color: "#4b5563",
  },
  customerName: {
    fontWeight: 700,
    fontSize: 12,
    color: "#1f2937",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    minWidth: 200,
  },
  metaLabel: {
    fontWeight: 700,
    color: "#374151",
  },
  metaValue: {
    color: "#4b5563",
  },
  table: {
    marginTop: 30,
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    minHeight: 40,
  },
  tableColDescription: {
    flex: 3,
    paddingRight: 10,
  },
  tableColQuantity: {
    flex: 1,
    textAlign: "center",
  },
  tableColPrice: {
    flex: 1,
    textAlign: "right",
  },
  tableColTotal: {
    flex: 1,
    textAlign: "right",
  },
  tableHeaderText: {
    fontWeight: 700,
    fontSize: 11,
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  itemName: {
    fontWeight: 700,
    fontSize: 11,
    color: "#1f2937",
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 9,
    color: "#6b7280",
    fontStyle: "italic",
  },
  totalsSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: "#e5e7eb",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  totalLabel: {
    width: 120,
    textAlign: "right",
    marginRight: 20,
    color: "#374151",
  },
  totalValue: {
    width: 100,
    textAlign: "right",
    color: "#4b5563",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
  },
  grandTotalLabel: {
    width: 120,
    textAlign: "right",
    marginRight: 20,
    fontSize: 14,
    fontWeight: 700,
    color: "#1f2937",
  },
  grandTotalValue: {
    width: 100,
    textAlign: "right",
    fontSize: 14,
    fontWeight: 700,
    color: "#1f2937",
  },
  paymentSection: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  paymentTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
    color: "#374151",
  },
  paymentInfo: {
    marginBottom: 4,
    color: "#4b5563",
  },
  gbtSection: {
    backgroundColor: "#dbeafe",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  gbtTitle: {
    fontSize: 12,
    color: "#1e40af",
    fontWeight: 700,
    marginBottom: 4,
  },
  gbtText: {
    fontSize: 10,
    color: "#1e3a8a",
  },
  notesSection: {
    marginTop: 30,
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
    color: "#374151",
  },
  notesText: {
    fontSize: 10,
    color: "#4b5563",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#6b7280",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  qrCodeSection: {
    alignItems: "center",
    marginTop: 30,
  },
  qrCode: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  qrCodeText: {
    fontSize: 8,
    color: "#6b7280",
  },
  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-45deg)",
    fontSize: 60,
    color: "#f3f4f6",
    fontWeight: 700,
    zIndex: -1,
  },
})

interface EnhancedInvoiceData {
  id: string
  invoiceNumber: string
  date: string
  dueDate?: string
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  company: {
    name: string
    address: string
    phone: string
    email: string
    website?: string
    logo?: string
    taxId?: string
  }
  customer: {
    name: string
    email: string
    phone: string
    address?: string
    company?: string
  }
  items: Array<{
    id: string
    name: string
    description?: string
    quantity: number
    price: number
    total: number
    category?: string
    sku?: string
  }>
  subtotal: number
  tax: number
  discount?: number
  total: number
  currency: string
  paymentMethod?: string
  paymentTerms?: string
  gbtEarned?: number
  notes?: string
  qrCodeUrl?: string
  barcode?: string
}

export const EnhancedInvoicePDF: React.FC<{ invoice: EnhancedInvoiceData }> = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Watermark for draft/cancelled invoices */}
      {(invoice.status === "draft" || invoice.status === "cancelled") && (
        <Text style={styles.watermark}>{invoice.status.toUpperCase()}</Text>
      )}

      {/* Header */}
      <View style={styles.header}>
        <View>
          {invoice.company.logo ? (
            <Image style={styles.logo} src={invoice.company.logo || "/placeholder.svg"} />
          ) : (
            <Text style={styles.title}>{invoice.company.name}</Text>
          )}
          <Text style={styles.subtitle}>{invoice.company.address}</Text>
          <Text style={styles.subtitle}>{invoice.company.phone}</Text>
          <Text style={styles.subtitle}>{invoice.company.email}</Text>
          {invoice.company.website && <Text style={styles.subtitle}>{invoice.company.website}</Text>}
          {invoice.company.taxId && <Text style={styles.subtitle}>Tax ID: {invoice.company.taxId}</Text>}
        </View>
        <View style={styles.companyInfo}>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.subtitle}>#{invoice.invoiceNumber}</Text>
        </View>
      </View>

      {/* Invoice Details */}
      <View style={styles.invoiceDetails}>
        <View style={styles.billToSection}>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text style={styles.customerName}>{invoice.customer.name}</Text>
          {invoice.customer.company && <Text style={styles.customerInfo}>{invoice.customer.company}</Text>}
          <Text style={styles.customerInfo}>{invoice.customer.email}</Text>
          <Text style={styles.customerInfo}>{invoice.customer.phone}</Text>
          {invoice.customer.address && <Text style={styles.customerInfo}>{invoice.customer.address}</Text>}
        </View>
        <View style={styles.invoiceMetaSection}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Invoice Date:</Text>
            <Text style={styles.metaValue}>{format(new Date(invoice.date), "MMMM d, yyyy")}</Text>
          </View>
          {invoice.dueDate && (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Due Date:</Text>
              <Text style={styles.metaValue}>{format(new Date(invoice.dueDate), "MMMM d, yyyy")}</Text>
            </View>
          )}
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Status:</Text>
            <Text style={styles.metaValue}>{invoice.status.toUpperCase()}</Text>
          </View>
          {invoice.paymentTerms && (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Payment Terms:</Text>
              <Text style={styles.metaValue}>{invoice.paymentTerms}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Line Items Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableColDescription, styles.tableHeaderText]}>Description</Text>
          <Text style={[styles.tableColQuantity, styles.tableHeaderText]}>Qty</Text>
          <Text style={[styles.tableColPrice, styles.tableHeaderText]}>Price</Text>
          <Text style={[styles.tableColTotal, styles.tableHeaderText]}>Total</Text>
        </View>
        {invoice.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableColDescription}>
              <Text style={styles.itemName}>{item.name}</Text>
              {item.description && <Text style={styles.itemDescription}>{item.description}</Text>}
              {item.sku && <Text style={styles.itemDescription}>SKU: {item.sku}</Text>}
            </View>
            <Text style={styles.tableColQuantity}>{item.quantity}</Text>
            <Text style={styles.tableColPrice}>
              {invoice.currency}
              {item.price.toFixed(2)}
            </Text>
            <Text style={styles.tableColTotal}>
              {invoice.currency}
              {item.total.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totalsSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>
            {invoice.currency}
            {invoice.subtotal.toFixed(2)}
          </Text>
        </View>
        {invoice.discount && invoice.discount > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Discount:</Text>
            <Text style={styles.totalValue}>
              -{invoice.currency}
              {invoice.discount.toFixed(2)}
            </Text>
          </View>
        )}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax:</Text>
          <Text style={styles.totalValue}>
            {invoice.currency}
            {invoice.tax.toFixed(2)}
          </Text>
        </View>
        <View style={styles.grandTotalRow}>
          <Text style={styles.grandTotalLabel}>Total:</Text>
          <Text style={styles.grandTotalValue}>
            {invoice.currency}
            {invoice.total.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Payment Information */}
      {invoice.paymentMethod && (
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Payment Information</Text>
          <Text style={styles.paymentInfo}>Payment Method: {invoice.paymentMethod}</Text>
          {invoice.status === "paid" && (
            <Text style={styles.paymentInfo}>✓ Payment received on {format(new Date(), "MMMM d, yyyy")}</Text>
          )}
        </View>
      )}

      {/* GBT Rewards Section */}
      {invoice.gbtEarned && invoice.gbtEarned > 0 && (
        <View style={styles.gbtSection}>
          <Text style={styles.gbtTitle}>🎉 You earned {invoice.gbtEarned} GBT tokens with this purchase!</Text>
          <Text style={styles.gbtText}>
            Use your GBT tokens for discounts on future repairs or trade them in the Gatorverse marketplace. Visit our
            Web3 portal to manage your tokens and explore exclusive NFT rewards.
          </Text>
        </View>
      )}

      {/* Notes */}
      {invoice.notes && (
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Notes:</Text>
          <Text style={styles.notesText}>{invoice.notes}</Text>
        </View>
      )}

      {/* QR Code */}
      {invoice.qrCodeUrl && (
        <View style={styles.qrCodeSection}>
          <Image style={styles.qrCode} src={invoice.qrCodeUrl || "/placeholder.svg"} />
          <Text style={styles.qrCodeText}>Scan for digital receipt and payment options</Text>
        </View>
      )}

      {/* Footer */}
      <Text style={styles.footer}>
        Thank you for choosing {invoice.company.name}!
        {invoice.company.website && ` • Visit us at ${invoice.company.website}`}
        {" • Questions? Contact "}
        {invoice.company.email}
      </Text>
    </Page>
  </Document>
)
