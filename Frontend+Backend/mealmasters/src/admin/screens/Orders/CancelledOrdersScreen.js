import React, { useEffect, useState } from "react";
import { FlatList, Text, StyleSheet, ActivityIndicator, View } from "react-native";
import AdminScreen from "../../components/AdminScreen";
import { getOrdersByStatus } from "../../services/orders";

export default function CancelledOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getOrdersByStatus("CANCELLED");
      if (res.data.status === "success") {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.log("Cancelled Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <AdminScreen title="Cancelled Orders">
      <FlatList
        data={orders}
        keyExtractor={(item) => item.order_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.tiffin_name}</Text>
            <Text>Customer: {item.customer_name}</Text>
            <Text>Vendor: {item.vendor_name}</Text>
            <Text>Plan: {item.plan_type}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  title: { fontWeight: "bold" },
});
