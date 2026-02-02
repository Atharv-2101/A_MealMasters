import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Pressable
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { config } from '../../services/config'
import { useFocusEffect } from '@react-navigation/native'

const BASE_URL = config.url

export default function VendorDashboard({ navigation }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token')

      const res = await axios.get(`${config.url}/vendor/orders`, {
        headers: { token }
      })

      if (res.data?.status === 'success') {
        setOrders(res.data.data)
      } else {
        setOrders([])
      }
    } catch (err) {
      console.log('Vendor dashboard fetch error:', err)
      setOrders([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  /* ================= STATS ================= */
  const totalOrders = orders.length
  const deliveredOrders = orders.filter(
    o => o.status?.toUpperCase() === 'DELIVERED'
  ).length
 const pendingOrders = orders.filter(o => {
  const s = o.status?.toUpperCase();
  return s !== 'DELIVERED' && s !== 'CANCELLED';
}).length;

const cancelledOrders = orders.filter(
  o => o.status?.toUpperCase() === 'CANCELLED'
).length;

  /* ================= STATUS CHIP ================= */
  const StatusChip = ({ status }) => {
    const color =
      status === 'DELIVERED'
        ? '#2E7D32'
        : status === 'PENDING'
          ? '#FF7A00'
          : '#1976D2'

    return (
      <View style={[styles.chip, { backgroundColor: color }]}>
        <Text style={styles.chipText}>{status}</Text>
      </View>
    )
  }

  /* ================= ORDER CARD ================= */
  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderRow}>
        <Text style={styles.orderId}>#{item.order_id}</Text>
        <StatusChip status={item.status} />
      </View>

      <Text style={styles.customer}>{item.customer_name}</Text>
      <Text style={styles.meta}>🍱 {item.tiffin_name}</Text>
      <Text style={styles.meta}>📦 {item.plan_type || 'One Day'}</Text>
    </View>
  )

  return (
    <Pressable style={styles.container} onPress={() => setShowMenu(false)}>
      {/* ================= HEADER ================= */}
      <LinearGradient colors={['#FF9F43', '#FF7A00']} style={styles.header}>
        <Text style={styles.title}>Vendor Dashboard</Text>

        <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
          <Ionicons name="person-circle-outline" size={38} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* ================= MENU ================= */}
      {showMenu && (
        <View style={styles.menu}>
          <MenuItem
            icon="person"
            label="My Profile"
            onPress={() => navigation.navigate('VendorProfile')}
          />

          <MenuItem
            icon="add-circle"
            label="Tiffin List"
            onPress={() => {
              setShowMenu(false)
              navigation.navigate('TiffinListScreen')
            }}
          />

          <MenuItem
            icon="add-circle"
            label="Add Tiffin"
            onPress={() => {
              setShowMenu(false)
              navigation.navigate('AddTiffin')
            }}
          />
          <MenuItem
            icon="receipt"
            label="All Orders"
            onPress={() => navigation.navigate('OrdersScreen')}
          />
          <MenuItem
            icon="log-out"
            label="Logout"
            onPress={async () => {
              await AsyncStorage.clear()
              navigation.reset({
                index: 0,
                routes: [{ name: 'Signin' }]
              })
            }}
          />
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#FF7A00" style={{ marginTop: 40 }} />
      ) : (
        <>
          {/* ================= STATS ================= */}
          <View style={styles.statsRow}>
            <StatCard label="Total Orders" value={totalOrders} />
            <StatCard label="Pending" value={pendingOrders} />
          </View>

          <View style={styles.statsRow}>
            <StatCard label="Delivered" value={deliveredOrders} />
            <StatCard label="Cancelled" value={cancelledOrders} />
          </View>

          {/* ================= VIEW ALL ================= */}
          <TouchableOpacity
            style={styles.viewOrdersBtn}
            onPress={() => navigation.navigate('OrdersScreen')}
          >
            <Text style={styles.viewOrdersText}>View All Orders</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>

          {/* ================= RECENT ORDERS ================= */}
          <Text style={styles.sectionTitle}>Recent Orders</Text>

          <FlatList
            data={orders.slice(0, 4)}
            keyExtractor={item => item.order_id.toString()}
            renderItem={renderOrder}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true)
                  fetchOrders()
                }}
                colors={['#FF7A00']}
              />
            }
            ListEmptyComponent={
              <Text style={styles.empty}>No orders yet</Text>
            }
          />
        </>
      )}
    </Pressable>
  )
}

/* ================= REUSABLE ================= */

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={18} color="#333" />
    <Text style={styles.menuText}>{label}</Text>
  </TouchableOpacity>
)

const StatCard = ({ label, value }) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
)

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF3E8' },

  header: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  title: { fontSize: 22, fontWeight: 'bold', color: '#fff' },

  menu: {
    position: 'absolute',
    top: 70,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 180,
    elevation: 10,
    zIndex: 999,
    borderWidth: 1,
    borderColor: '#ddd'
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 0.5,
    borderColor: '#eee'
  },

  menuText: { marginLeft: 10, fontWeight: '600' },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 14
  },

  statCard: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#000'
  },

  statLabel: { color: '#777', fontSize: 13 },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#FF7A00' },

  viewOrdersBtn: {
    margin: 16,
    backgroundColor: '#FF7A00',
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  viewOrdersText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 8
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 10
  },

  orderCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000'
  },

  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  orderId: { fontWeight: 'bold' },
  customer: { marginTop: 6, fontSize: 14 },
  meta: { fontSize: 13, color: '#555' },

  chip: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12
  },

  chipText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold'
  },

  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: '#777'
  }
})
