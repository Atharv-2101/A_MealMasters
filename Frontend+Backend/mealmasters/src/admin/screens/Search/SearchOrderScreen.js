import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import AdminScreen from "../../components/AdminScreen";
import AdminTable from "../../components/AdminTable";

export default function SearchOrderScreen({ navigation }) {
  const [orderNo, setOrderNo] = useState("");
  const [searched, setSearched] = useState(false);

  const columns = ["S.NO", "Order No", "Customer Name", "Mobile", "Order Date", "Status", "Action"];

  const rows = searched
    ? [
        [
          "1",
          orderNo || "1021",
          "Rahul Farke",
          "9876543210",
          "2026-01-23",
          "New",
          {
            type: "button",
            label: "View Details",
            variant: "success",
            onPress: () => navigation.navigate("OrderDetails", { orderNo: orderNo || "1021" }),
          },
        ],
      ]
    : [];

  return (
    <AdminScreen title="Search Order">
      <View style={styles.card}>
        <Text style={styles.label}>Search by Order Number</Text>
        <View style={styles.row}>
          <TextInput
            value={orderNo}
            onChangeText={setOrderNo}
            style={styles.input}
            placeholder="Enter order number"
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
