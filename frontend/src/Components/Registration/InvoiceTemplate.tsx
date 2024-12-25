import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "@/images/logo.png";

interface Service {
  name: string;
  tat: string;
  urgent: boolean;
  price: number;
  total: number;
}

interface InvoiceData {
  invoiceNumber: string;
  patient: {
    name: string;
    phone: string;
  };
  paymentMode: string;
  staffName: string;
  services: Service[];
  subtotal: number;
  discount: number;
  discountName: string;
  afterDiscount: number;
  homeVisitCharges: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
  },
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 24,
    color: "#1a56db",
    marginBottom: 8,
  },
  companyDetails: {
    color: "#666",
    fontSize: 10,
  },
  invoiceTitle: {
    fontSize: 24,
    textAlign: "right" as const,
  },
  invoiceDetails: {
    textAlign: "right" as const,
    color: "#666",
    fontSize: 10,
  },
  section: {
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    backgroundColor: "#f3f6ff",
    padding: 8,
    marginBottom: 10,
    color: "#1a56db",
    fontSize: 14,
  },
  table: {
    width: "100%",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row" as const,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    minHeight: 25,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#f9fafb",
  },
  tableCell: {
    flex: 1,
    padding: 5,
    textAlign: "center" as const,
  },
  totalRow: {
    flexDirection: "row" as const,
    justifyContent: "flex-end",
    marginTop: 5,
  },
  totalLabel: {
    width: 150,
    textAlign: "right" as const,
    paddingRight: 10,
  },
  totalValue: {
    width: 100,
    textAlign: "right" as const,
  },
  signatureSection: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    marginTop: 50,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    width: 200,
    marginTop: 40,
  },
  signatureText: {
    fontSize: 10,
    textAlign: "center" as const,
    marginTop: 5,
  },
});

const InvoiceTemplate: React.FC<{ data: InvoiceData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <Image src="/logo.png" />
          <Text style={styles.companyName}>ProLabs Diagnostics</Text>
        </View>
        <View>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <Text style={styles.invoiceDetails}>
            Invoice #: {data.invoiceNumber}
          </Text>
          <Text style={styles.invoiceDetails}>
            Date: {new Date().toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Bill To Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Invoice Details</Text>
        <Text style={{ marginLeft: 10 }}>
          Patient Name: {data.patient?.name || ""}
        </Text>
        <Text style={{ marginLeft: 10 }}>
          Age/Sex: {data?.patient?.age || ""}/ {data.patient?.gender || ""}
        </Text>
        <Text style={{ marginLeft: 10 }}>
          Phone: {data?.patient?.phone || ""}
        </Text>
        <Text style={{ marginLeft: 10 }}>Referral: {data?.referral || ""}</Text>
      </View>

      {/* Test Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Details</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Test Name</Text>
            <Text style={styles.tableCell}>TAT</Text>
            <Text style={styles.tableCell}>Urgent</Text>
            <Text style={styles.tableCell}>Price</Text>
            <Text style={styles.tableCell}>Total</Text>
          </View>
          {data?.services?.map((service, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{service.name}</Text>
              <Text style={styles.tableCell}>{service.tat || "Standard"}</Text>
              <Text style={styles.tableCell}>
                {service.urgent ? "Yes" : "No"}
              </Text>
              <Text style={styles.tableCell}>₹{service.price.toFixed(2)}</Text>
              <Text style={styles.tableCell}>₹{service.total.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>₹{data.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Discount ({data.discountName}):</Text>
          <Text style={styles.totalValue}>-₹{data.discount.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>After Discount:</Text>
          <Text style={styles.totalValue}>
            ₹{data.afterDiscount.toFixed(2)}
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Home Visit Charges:</Text>
          <Text style={styles.totalValue}>
            ₹{data.homeVisitCharges.toFixed(2)}
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>₹{data.totalAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Amount Paid:</Text>
          <Text style={styles.totalValue}>₹{data.amountPaid.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Balance Due:</Text>
          <Text style={styles.totalValue}>₹{data.balanceDue.toFixed(2)}</Text>
        </View>
      </View>

      {/* Payment Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <Text style={{ marginLeft: 10 }}>Mode: {data.paymentMode || ""}</Text>
        <Text style={{ marginLeft: 10 }}>
          Date: {new Date().toLocaleDateString()}
        </Text>
        <Text style={{ marginLeft: 10 }}>Staff: {data.staffName || ""}</Text>
      </View>

      {/* Signature Section */}
      <View style={styles.signatureSection}>
        <View>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>Authorized Signature</Text>
        </View>
        <View>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>Patient/Guardian Signature</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default InvoiceTemplate;
