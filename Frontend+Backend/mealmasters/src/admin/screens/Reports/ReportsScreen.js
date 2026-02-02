import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import AdminScreen from "../../components/AdminScreen";
import AdminTable from "../../components/AdminTable";

export default function ReportsScreen() {
  const [fromDate, setFromDate] = useState("2026-01-01");
  const [toDate, setToDate] = useState("2026-01-23");
  const [generated, setGenerated] = useState(false);

  const columns = ["S.NO", "Order No", "Customer Name", "Order Date", "Status", "Amount"];

  const rows = generated
    ? [
        ["1", "1012", "Sneha Kulkarni", "2026-01-10", "Confirmed", "₹180"],
        ["2", "1015", "Vishal Deshmukh", "2026-01-15", "Cancelled", "₹120"],
        ["3", "1021", "Rahul Farke", "2026-01-23", "New", "₹200"],
      ]
    : [];

  return (
    <AdminScreen title="Reports">
      <View style={styles.card}>
        <Text style={styles.title}>Report Filter</Text>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>From Date</Text>
            <TextInput
              value={fromDate}
              onChangeText={setFromDate}
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#8ea0af"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>To Date</Text>
            <TextInput
              value={toDate}
              onChangeText={setToDate}
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#8ea0af"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.btn} onPress={() => setGenerated(true)} activeOpacity={0.85}>
          <Text style={styles.btnText}>Generate Report</Text>
        </TouchableOpacity>
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
  title: { fontSize: 16, fontWeight: "900", color: "#12212d", marginBottom: 12 },
  row: { flexDirection: "row", gap: 10, marginBottom: 12 },

  label: { fontWeight: "900", marginBottom: 6, color: "#273545" },
  input: {
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
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "900" },
});
