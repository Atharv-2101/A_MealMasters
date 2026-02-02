import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { getOrderHistory, cancelOrder } from '../../services/customer'
import { config } from '../../services/config'

export default function OrderHistory({ navigation }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  /* ================= LOAD ORDERS ================= */
  const loadOrders = async () => {
    try {
      const result = await getOrderHistory()
      if (result?.status === 'success' && Array.isArray(result.data)) {
        setOrders(result.data)
      } else {
        setOrders([])
      }
    } catch (err) {
      console.log('Load orders error', err)
    } finally {
      setLoading(false)
    }
  }

  /* ================= FORMAT DATE (MYSQL SAFE) ================= */
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'

    const date = new Date(dateStr) // YYYY-MM-DD works fine

    if (isNaN(date.getTime())) return 'N/A'

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  /* ================= CONFIRM CANCEL ================= */
  const confirmCancel = (orderId) => {
    if (Platform.OS === 'web') {
      const ok = window.confirm('Do you want to cancel this order?')
      if (ok) handleCancel(orderId)
      return
    }

    Alert.alert(
      'Cancel Order',
      'Do you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', style: 'destructive', onPress: () => handleCancel(orderId) }
      ]
    )
  }

  /* ================= CANCEL ORDER ================= */
  const handleCancel = async (orderId) => {
    try {
      const result = await cancelOrder(orderId)
      if (result?.status === 'success') {
        Platform.OS === 'web'
          ? alert('Order cancelled successfully')
          : Alert.alert('Cancelled', 'Order cancelled successfully')
        loadOrders()
      } else {
        const msg = result?.error || 'Unable to cancel order'
        Platform.OS === 'web' ? alert(msg) : Alert.alert('Error', msg)
      }
    } catch {
      Platform.OS === 'web'
        ? alert('Server error while cancelling')
        : Alert.alert('Error', 'Server error while cancelling')
    }
  }

  /* ================= STATUS STYLE ================= */
  const statusStyle = (status) => {
    switch (status) {
      case 'PENDING':
        return styles.pending
      case 'APPROVED':
        return styles.approved
      case 'DELIVERED':
        return styles.delivered
      case 'CANCELLED':
        return styles.cancelled
      default:
        return {}
    }
  }

  /* ================= RENDER ORDER ================= */
  const renderItem = ({ item }) => {

    const hasImage = item.image && item.image.trim() !== "";
    const baseUrl = config.url.endsWith('/') ? config.url.slice(0, -1) : config.url;

    const imageUrl = hasImage
      ? `${baseUrl}/uploads/tiffin_images/${item.image}`
      : `${baseUrl}/uploads/default_food.png`

    return (
      <View style={styles.card}>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.image} 
          resizeMode="cover"
          // Add an error handler to see what's wrong in the console
          onError={(e) => console.log(`Image load error for ${item.tiffin_name}:`, e.nativeEvent.error)}
        />
        <View style={styles.info}>
          <View style={styles.topRow}>
            <Text style={styles.title}>{item.tiffin_name}</Text>
            <View style={[styles.statusPill, statusStyle(item.status)]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>

          <Text style={styles.vendor}>{item.business_name}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.meta}>
              Plan: {item.plan_type || 'One Day'}
            </Text>
            <Text style={styles.meta}>₹ {item.price}</Text>
          </View>

          {/* DATE */}
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color="#777" />
            <Text style={styles.date}>
              {formatDate(item.start_date)}
            </Text>
          </View>


          {/* ACTION BUTTONS */}
          {item.status === 'PENDING' && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => confirmCancel(item.order_id)}
            >
              <Text style={styles.cancelText}>Cancel Order</Text>
            </TouchableOpacity>
          )}

          {item.status === 'APPROVED' && (
            <TouchableOpacity
              style={styles.deliveryBtn}
              onPress={() =>
                navigation.navigate('DeliveryDetails', {
                  orderId: item.order_id
                })
              }
            >
              <Text style={styles.deliveryText}>Delivery Details</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <LinearGradient colors={['#FF9F43', '#FF7A00']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Order History</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {/* CONTENT */}
      {loading ? (
        <ActivityIndicator size="large" color="#FF7A00" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.order_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.empty}>No orders placed yet</Text>
          }
        />
      )}
    </View>
  )
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF7F0' },

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
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 18,
    elevation: 6
  },

  image: {
    width: 95,
    height: 95,
    borderRadius: 12
  },

  info: {
    flex: 1,
    paddingLeft: 14
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    flex: 1
  },

  vendor: {
    color: '#FF7A00',
    fontWeight: '600',
    marginVertical: 2
  },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  meta: {
    fontSize: 13,
    color: '#555'
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },

  date: {
    fontSize: 12,
    color: '#777',
    marginLeft: 6
  },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 6
  },

  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff'
  },

  pending: { backgroundColor: '#FF9800' },
  approved: { backgroundColor: '#4CAF50' },
  delivered: { backgroundColor: '#2E7D32' },
  cancelled: { backgroundColor: '#C62828' },

  cancelBtn: {
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: '#C62828',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center'
  },

  cancelText: {
    color: '#C62828',
    fontWeight: 'bold'
  },

  deliveryBtn: {
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center'
  },

  deliveryText: {
    color: '#4CAF50',
    fontWeight: 'bold'
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#777'
  }
})
