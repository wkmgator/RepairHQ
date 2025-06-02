import type React from "react"
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer"
import { format } from "date-fns"

// Register fonts
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
    lineHeight: 1.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontWeight: 700,
    marginRight: 10,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    paddingBottom: 5,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableCol: {
    flex: 1,
  },
  tableColWide: {
    flex: 2,
  },
  tableColRight: {
    flex: 1,
    textAlign: "right",
  },
  tableHeaderText: {
    fontWeight: 700,
    fontSize: 11,
  },
  totalsSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: "#000",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 5,
  },
  totalLabel: {
    width: 100,
    textAlign: "right",
    marginRight: 20,
  },
  totalValue: {
    width: 100,
    textAlign: "right",
  },
  grandTotal: {
    fontSize: 14,
    fontWeight: 700,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#000",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#666",
  },
  qrCode: {
    width: 80,
    height: 80,
    marginTop: 20,
  },
  gbtSection: {
    backgroundColor: "#f0f9ff",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  gbtText: {
    fontSize: 12,
    color: "#0369a1",
    fontWeight: 700,
  },
})

interface InvoiceData {
  id: string
  date: string
  dueDate?: string
  customer: {
    name: string
    email: string
    phone: string
    address?: string
  }
  items: Array<{
    name: string
    description?: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  tax: number
  total: number
  gbtEarned?: number
  notes?: string
  qrCodeUrl?: string
}

export const InvoicePDF: React.FC<{ invoice: InvoiceData }> = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.subtitle}>#{invoice.id}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontSize: 16, fontWeight: 700 }}>RepairHQ</Text>
          <Text>support@repairhq.io</Text>
          <Text>1-800-REPAIR-HQ</Text>
        </View>
      </View>

      {/* Customer Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bill To:</Text>
        <Text style={{ fontWeight: 700 }}>{invoice.customer.name}</Text>
        <Text>{invoice.customer.email}</Text>
        <Text>{invoice.customer.phone}</Text>
        {invoice.customer.address && <Text>{invoice.customer.address}</Text>}
      </View>

      {/* Invoice Details */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text>
            <Text style={styles.label}>Invoice Date:</Text>
            {format(new Date(invoice.date), "MMMM d, yyyy")}
          </Text>
          {invoice.dueDate && (
            <Text>
              <Text style={styles.label}>Due Date:</Text>
              {format(new Date(invoice.dueDate), "MMMM d, yyyy")}
            </Text>
          )}
        </View>
      </View>

      {/* Line Items */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableColWide, styles.tableHeaderText]}>Item</Text>
          <Text style={[styles.tableCol, styles.tableHeaderText, { textAlign: "center" }]}>Qty</Text>
          <Text style={[styles.tableColRight, styles.tableHeaderText]}>Price</Text>
          <Text style={[styles.tableColRight, styles.tableHeaderText]}>Total</Text>
        </View>
        {invoice.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableColWide}>
              <Text style={{ fontWeight: 700 }}>{item.name}</Text>
              {item.description && <Text style={{ fontSize: 9, color: "#666" }}>{item.description}</Text>}
            </View>
            <Text style={[styles.tableCol, { textAlign: "center" }]}>{item.quantity}</Text>
            <Text style={styles.tableColRight}>${item.price.toFixed(2)}</Text>
            <Text style={styles.tableColRight}>${item.total.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totalsSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>${invoice.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax:</Text>
          <Text style={styles.totalValue}>${invoice.tax.toFixed(2)}</Text>
        </View>
        <View style={[styles.totalRow, styles.grandTotal]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${invoice.total.toFixed(2)}</Text>
        </View>
      </View>

      {/* GBT Rewards Section */}
      {invoice.gbtEarned && invoice.gbtEarned > 0 && (
        <View style={styles.gbtSection}>
          <Text style={styles.gbtText}>🎉 You earned {invoice.gbtEarned} GBT tokens with this purchase!</Text>
          <Text style={{ fontSize: 10, marginTop: 5 }}>
            Use your GBT tokens for discounts on future repairs or trade them in the Gatorverse marketplace.
          </Text>
        </View>
      )}

      {/* Notes */}
      {invoice.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes:</Text>
          <Text>{invoice.notes}</Text>
        </View>
      )}

      {/* QR Code */}
      {invoice.qrCodeUrl && (
        <View style={{ alignItems: "center", marginTop: 30 }}>
          <Image style={styles.qrCode} src={invoice.qrCodeUrl || "/placeholder.svg"} />
          <Text style={{ fontSize: 9, marginTop: 5 }}>Scan for digital receipt</Text>
        </View>
      )}

      {/* Footer */}
      <Text style={styles.footer}>Thank you for choosing RepairHQ! • Questions? Contact support@repairhq.io</Text>
    </Page>
  </Document>
)
