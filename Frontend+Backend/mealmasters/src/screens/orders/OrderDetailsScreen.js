import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import {
  getVendorOrders,
  approveOrder,
  markOrderDelivered
} from '../../services/vendor'

export default function OrderDetailsScreen() {
  const navigation = useNavigation()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  /* ================= LOAD ORDERS ================= */
  const loadOrders = async () => {
    try {
      const result = await getVendorOrders()

      if (result?.status === 'success') {
        setOrders(result.data)
      } else {
        setOrders([])
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch orders')
    } finally {
      loadOrders()
      setLoading(false)
    }
  }

  /* ================= APPROVE ================= */
  const handleApprove = async (orderId) => {
    try {
      const result = await approveOrder(orderId)

      if (result?.status === 'success') {
        Alert.alert('Success', 'Order approved')
        loadOrders()
      } else {
        Alert.alert('Error', result?.error || 'Approval failed')
      }
    } catch {
      Alert.alert('Error', 'Server error')
    }
  }

  /* ================= DELIVER ================= */
  const handleDelivered = async (orderId) => {
    try {
      const result = await markOrderDelivered(orderId)

      if (result?.status === 'success') {
        Alert.alert('Delivered', 'Order marked as delivered')
        loadOrders()
      } else {
        Alert.alert('Error', result?.error || 'Update failed')
      }
    } catch {
      Alert.alert('Error', 'Server error')
    } finally {
      handleDelivered()
      setLoading(false)
    }
  }

  /* ================= RENDER ORDER CARD ================= */
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.tiffin_name}</Text>

      <Text>👤 {item.customer_name}</Text>
      <Text>📞 {item.phone}</Text>
      <Text>📦 Plan: {item.plan_type}</Text>
      <Text>Status: {item.status}</Text>

      {item.status === 'PENDING' && (
        <TouchableOpacity
          style={styles.approveBtn}
          onPress={() => handleApprove(item.order_id)}
        >
          <Text style={styles.btnText}>Approve Order</Text>
        </TouchableOpacity>
      )}

      {item.status === 'APPROVED' && (
        <TouchableOpacity
          style={styles.deliverBtn}
          onPress={() => handleDelivered(item.order_id)}
        >
          <Text style={styles.btnText}>Mark Delivered</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF3E8' }}>
      {/* ================= HEADER ================= */}
      <LinearGradient colors={['#FF9F43', '#FF7A00']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Order Details</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <ActivityIndicator size="large" color="#FF7A00" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.order_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15 }}
          ListEmptyComponent={
            <Text style={styles.empty}>No orders found</Text>
          }
        />
      )}
    </View>
  )
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  header: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold'
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#000'
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6
  },

  approveBtn: {
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 8,
    marginTop: 10
  },

  deliverBtn: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    marginTop: 10
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#777'
  }
})
