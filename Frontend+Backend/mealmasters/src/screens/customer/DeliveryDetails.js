import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { getDeliveryDetails } from '../../services/customer'

export default function DeliveryDetails({ route, navigation }) {
  const { orderId } = route.params
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDetails()
  }, [])

  const loadDetails = async () => {
    const result = await getDeliveryDetails(orderId)
    if (result?.status === 'success') {
      setData(result.data)
    }
    setLoading(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return '#2E7D32'
      case 'PENDING':
        return '#FF7A00'
      default:
        return '#777'
    }
  }

  return (
    <View style={styles.root}>
      {/* ================= HEADER ================= */}
      <LinearGradient colors={['#FF9F43', '#FF7A00']} style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={26}
          color="#fff"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Delivery Details</Text>
        <View style={{ width: 26 }} />
      </LinearGradient>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FF7A00"
          style={{ marginTop: 60 }}
        />
      ) : data ? (
        <View style={styles.card}>
          {/* STATUS */}
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Order Status</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(data.status) }
              ]}
            >
              <Text style={styles.statusText}>{data.status}</Text>
            </View>
          </View>

          {/* DELIVERY PARTNER */}
          <View style={styles.infoRow}>
            <Ionicons name="person-circle" size={26} color="#FF7A00" />
            <View style={styles.infoText}>
              <Text style={styles.label}>Delivery Partner</Text>
              <Text style={styles.value}>
                {data.delivery_name || 'Not Assigned'}
              </Text>
            </View>
          </View>

          {/* CONTACT */}
          <View style={styles.infoRow}>
            <Ionicons name="call" size={22} color="#FF7A00" />
            <View style={styles.infoText}>
              <Text style={styles.label}>Contact Number</Text>
              <Text style={styles.value}>
                {data.delivery_mobile || 'N/A'}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <Text style={styles.empty}>No delivery assigned yet</Text>
      )}
    </View>
  )
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFF7F0'
  },

  header: {
    paddingTop: 26,
    paddingBottom: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 6
  },

  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold'
  },

  card: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 18,
    elevation: 6
  },

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },

  statusLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600'
  },

  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20
  },

  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18
  },

  infoText: {
    marginLeft: 12
  },

  label: {
    fontSize: 13,
    color: '#777'
  },

  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222'
  },

  empty: {
    textAlign: 'center',
    marginTop: 60,
    color: '#777',
    fontSize: 15
  }
})
