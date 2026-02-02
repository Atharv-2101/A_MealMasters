import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AdminScreen from "../../components/AdminScreen";
import AdminTable from "../../components/AdminTable";

export default function InvoiceDetailsScreen({ route }) {
  const invoiceNo = route?.params?.invoiceNo || "N/A";

  const columns = ["S.NO", "Tiffin Name", "Qty", "Price", "Total"];
  const rows = [
    ["1", "Veg Thali", "1", "₹80", "₹80"],
    ["2", "Dal Rice Combo", "2", "₹60", "₹120"],
  ];

  return (
    <AdminScreen title={`Invoice Details (${invoiceNo})`}>
      <View style={styles.topCard}>
        <Text style={styles.infoTitle}>Invoice Summary</Text>

        <View style={styles.infoRow}>
          <Text style={styles.k}>Invoice No:</Text>
          <Text style={styles.v}>{invoiceNo}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.k}>Order No:</Text>
          <Text style={styles.v}>1021</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.k}>Customer Name:</Text>
          <Text style={styles.v}>Rahul Farke</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.k}>Date:</Text>
          <Text style={styles.v}>2026-01-23</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.k}>Grand Total:</Text>
          <Text style={[styles.v, styles.total]}>₹200</Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <AdminTable columns={columns} rows={rows} />
      </View>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  topCard: {
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    padding: 14,
    marginBottom: 12,
  },
  infoTitle: { fontSize: 16, fontWeight: "900", color: "#12212d", marginBottom: 10 },

  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  k: { fontWeight: "800", color: "#3c4a57" },
  v: { fontWeight: "700", color: "#12212d" },
  total: { color: "#198754" },
});
