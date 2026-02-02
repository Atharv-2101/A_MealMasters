import React, { useEffect, useState } from "react"
import {
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  RefreshControl,
} from "react-native"
import AdminScreen from "../../components/AdminScreen"
import { getOrdersByStatus } from "../../services/orders"

export default function ConfirmedOrdersScreen() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true)

      const res = await getOrdersByStatus("APPROVED")

      if (res.data.status === "success" && Array.isArray(res.data.data)) {
        setOrders(res.data.data)
      } else {
        setOrders([])
      }
    } catch (err) {
      console.log("Confirmed Orders Error:", err)
      setOrders([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />
  }

  return (
    <AdminScreen title="Confirmed Orders">
      <FlatList
        data={orders}
        keyExtractor={(item) => item.order_id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true)
              loadOrders(true)
            }}
          />
        }
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No confirmed orders found
          </Text>
        }
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
  )
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
})
