import React, { useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from "react-native";
import AdminScreen from "../../components/AdminScreen";
import { getAllOrders } from "../../services/orders";
import { TouchableOpacity } from "react-native";

export default function AllOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getAllOrders();

      if (res.data.status === "success") {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.log("All Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
<TouchableOpacity
  style={styles.card}
  onPress={() => navigation.navigate("OrderDetails", { order: item })}
>
      <Text style={styles.title}>{item.tiffin_name}</Text>

      <Text>Customer: {item.customer_name}</Text>
      <Text>Vendor: {item.vendor_name}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Plan: {item.plan_type}</Text>
      <Text>Price: ₹{item.price}</Text>

      <Text>
        From {item.start_date} → {item.end_date}
      </Text>
    </TouchableOpacity>

  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <AdminScreen title="All Orders">
      <FlatList
        data={orders}
        keyExtractor={(item) => item.order_id.toString()}
        renderItem={renderItem}
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
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
});
