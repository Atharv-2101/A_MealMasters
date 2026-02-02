import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import AdminScreen from "../../components/AdminScreen";
import AdminTable from "../../components/AdminTable";

export default function SearchInvoiceScreen({ navigation }) {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [searched, setSearched] = useState(false);

  const columns = ["S.NO", "Invoice No", "Order No", "Customer Name", "Invoice Date", "Amount", "Action"];

  const rows = searched
    ? [
        [
          "1",
          invoiceNo || "INV-5001",
          "1021",
          "Rahul Farke",
          "2026-01-23",
          "₹200",
          {
            type: "button",
            label: "View",
            variant: "success",
            onPress: () => navigation.navigate("InvoiceDetails", { invoiceNo: invoiceNo || "INV-5001" }),
          },
        ],
      ]
    : [];

  return (
    <AdminScreen title="Search Invoice">
      <View style={styles.card}>
        <Text style={styles.label}>Search by Invoice Number</Text>
        <View style={styles.row}>
          <TextInput
            value={invoiceNo}
            onChangeText={setInvoiceNo}
            style={styles.input}
            placeholder="Enter invoice number"
            placeholderTextColor="#8ea0af"
          />
          <TouchableOpacity style={styles.btn} onPress={() => setSearched(true)} activeOpacity={0.85}>
            <Text style={styles.btnText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginTop: 12 }}>
        <AdminTable columns={columns} rows={rows} />
      </View>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    padding: 14,
  },
  label: { fontWeight: "900", marginBottom: 8, color: "#273545" },
  row: { flexDirection: "row", gap: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontWeight: "600",
    color: "#1a2b3b",
    backgroundColor: "#fff",
  },
  btn: {
    backgroundColor: "#0d6efd",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 6,
    justifyContent: "center",
  },
  btnText: { color: "#fff", fontWeight: "900" },
});
