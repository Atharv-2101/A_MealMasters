import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AdminScreen from "../../components/AdminScreen";
import { updateOrderStatus } from "../../services/orders";

export default function OrderDetailsScreen({ route, navigation }) {
  const { order } = route.params;

  const changeStatus = async (status) => {
    try {
      await updateOrderStatus(order.order_id, status);
      Alert.alert("Success", `Order ${status}`);
      navigation.goBack();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to update order");
    }
  };

  return (
    <AdminScreen title="Order Details">
      <View style={styles.card}>
        <Text style={styles.title}>{order.tiffin_name}</Text>

        <Text>Customer: {order.customer_name}</Text>
        <Text>Vendor: {order.vendor_name}</Text>
        <Text>Plan: {order.plan_type}</Text>
        <Text>Price: ₹{order.price}</Text>
        <Text>Status: {order.status}</Text>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "green" }]}
            onPress={() => changeStatus("APPROVED")}
          >
            <Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "red" }]}
            onPress={() => changeStatus("CANCELLED")}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  btn: {
    padding: 12,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
