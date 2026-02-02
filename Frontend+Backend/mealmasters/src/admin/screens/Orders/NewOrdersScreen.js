import React, { useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from "react-native";
import AdminScreen from "../../components/AdminScreen";
import { getOrdersByStatus } from "../../services/orders";

export default function NewOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getOrdersByStatus("PENDING");
      if (res.data.status === "success") {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.log("New Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <AdminScreen title="New Orders">
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
