import React from "react";
import { View } from "react-native";
import AdminScreen from "../../components/AdminScreen";
import AdminTable from "../../components/AdminTable";

export default function InvoiceListScreen({ navigation }) {
  const columns = ["S.NO", "Invoice No", "Order No", "Customer Name", "Invoice Date", "Amount", "Action"];

  const rows = [
    [
      "1",
      "INV-5001",
      "1021",
      "Rahul Farke",
      "2026-01-23",
      "₹200",
      {
        type: "button",
        label: "View",
        variant: "success",
        onPress: () => navigation.navigate("InvoiceDetails", { invoiceNo: "INV-5001" }),
      },
    ],
    [
      "2",
      "INV-5002",
      "1016",
      "Vishal Deshmukh",
      "2026-01-22",
      "₹120",
      {
        type: "button",
        label: "View",
        variant: "success",
        onPress: () => navigation.navigate("InvoiceDetails", { invoiceNo: "INV-5002" }),
      },
    ],
  ];

  return (
    <AdminScreen title="Invoices">
      <View style={{ flex: 1 }}>
        <AdminTable columns={columns} rows={rows} />
      </View>
    </AdminScreen>
  );
}
