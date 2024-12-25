import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  header: {
    marginBottom: 30,
    borderBottom: 1,
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E40AF",
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4B5563",
    borderBottom: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: "30%",
    fontSize: 10,
    color: "#6B7280",
  },
  value: {
    width: "70%",
    fontSize: 10,
    color: "#374151",
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    padding: 8,
    fontWeight: "bold",
    fontSize: 10,
    color: "#1E40AF",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    fontSize: 10,
  },
  col1: { width: "40%" },
  col2: { width: "20%", textAlign: "center" },
  col3: { width: "20%", textAlign: "right" },
  col4: { width: "20%", textAlign: "right" },
  totalsSection: {
    marginTop: 20,
    borderTop: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 10,
    color: "#4B5563",
  },
  totalValue: {
    fontSize: 10,
    color: "#374151",
  },
  grandTotal: {
    marginTop: 10,
    borderTop: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 5,
    fontWeight: "bold",
    fontSize: 12,
    color: "#1E40AF",
  },
  paymentSection: {
    marginTop: 30,
    padding: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
  },
  paymentTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4B5563",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#6B7280",
    borderTop: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
  },
});

interface PaymentDetailsProps {
  data: {
    invoiceNumber: string;
    invoiceDate: string;
    billTo: {
      name: string;
      organization: string;
    };
    services: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
    paymentDetails: {
      mode: string;
      amount: number;
      date: string;
      staffName: string;
    };
  };
}

const PaymentDetailsTemplate: React.FC<PaymentDetailsProps> = ({ data }) => {
  console.log("DAta for pdf", data);
  const calculateTotals = () => {
    const subtotal = data?.services?.reduce(
      (sum, service) => sum + service?.total,
      0
    );
    const tax = subtotal * 0.085;
    const total = subtotal + tax;
    const balance = total - data?.paymentDetails?.amount;
    return { subtotal, tax, total, balance };
  };

  const { subtotal, tax, total, balance } = calculateTotals();

  return (
    <Document>
      <Page size="A4" style={styles?.page}>
        {/* Header */}
        <View style={styles?.header}>
          <View style={styles?.headerRow}>
            <View>
              <Text style={styles?.title}>Payment Details</Text>
              <Text style={styles?.subtitle}>
                Invoice #: {data?.invoiceNumber}
              </Text>
            </View>
            <View>
              <Text style={styles?.subtitle}>Date: {data?.invoiceDate}</Text>
            </View>
          </View>
        </View>

        {/* Patient Information */}
        <View style={styles?.section}>
          <Text style={styles?.sectionTitle}>Patient Information</Text>
          <View style={styles?.row}>
            <Text style={styles?.label}>Name:</Text>
            <Text style={styles?.value}>{data?.billTo?.name}</Text>
          </View>
          <View style={styles?.row}>
            <Text style={styles?.label}>Referred By:</Text>
            <Text style={styles?.value}>{data?.billTo?.organization}</Text>
          </View>
        </View>

        {/* Tests Breakdown */}
        <View style={styles?.section}>
          <Text style={styles?.sectionTitle}>Tests Breakdown</Text>
          <View style={styles?.table}>
            <View style={styles?.tableHeader}>
              <Text style={styles?.col1}>Test Name</Text>
              <Text style={styles?.col2}>Quantity</Text>
              <Text style={styles?.col3}>Price</Text>
              <Text style={styles?.col4}>Total</Text>
            </View>
            {data?.services?.map((service, index) => (
              <View key={index} style={styles?.tableRow}>
                <Text style={styles?.col1}>{service?.description}</Text>
                <Text style={styles?.col2}>{service?.quantity}</Text>
                <Text style={styles?.col3}>
                  ��{service?.unitPrice?.toFixed(2)}
                </Text>
                <Text style={styles?.col4}>₹{service?.total?.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles?.totalsSection}>
          <Text style={styles?.sectionTitle}>Payment Summary</Text>
          <View style={styles?.totalRow}>
            <Text style={styles?.totalLabel}>Subtotal:</Text>
            <Text style={styles?.totalValue}>₹{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles?.totalRow}>
            <Text style={styles?.totalLabel}>Tax (8.5%):</Text>
            <Text style={styles?.totalValue}>₹{tax?.toFixed(2)}</Text>
          </View>
          <View style={styles?.totalRow}>
            <Text style={styles?.totalLabel}>Total Amount:</Text>
            <Text style={styles?.totalValue}>₹{total?.toFixed(2)}</Text>
          </View>
          <View style={styles?.totalRow}>
            <Text style={styles?.totalLabel}>Amount Paid:</Text>
            <Text style={styles?.totalValue}>
              ₹{data?.paymentDetails?.amount.toFixed(2)}
            </Text>
          </View>
          <View style={[styles?.totalRow, styles?.grandTotal]}>
            <Text style={styles?.totalLabel}>Balance Due:</Text>
            <Text style={styles?.totalValue}>₹{balance?.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles?.paymentSection}>
          <Text style={styles?.paymentTitle}>Payment Information</Text>
          <View style={styles?.row}>
            <Text style={styles?.label}>Payment Mode:</Text>
            <Text style={styles?.value}>{data?.paymentDetails?.mode}</Text>
          </View>
          <View style={styles?.row}>
            <Text style={styles?.label}>Payment Date:</Text>
            <Text style={styles?.value}>{data?.paymentDetails?.date}</Text>
          </View>
          <View style={styles?.row}>
            <Text style={styles?.label}>Staff Name:</Text>
            <Text style={styles?.value}>{data?.paymentDetails?.staffName}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles?.footer}>
          <Text>
            This is a computer-generated document. No signature is required.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PaymentDetailsTemplate;
