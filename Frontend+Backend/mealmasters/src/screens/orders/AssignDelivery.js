import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { assignDelivery, getDeliveryPartners } from '../../services/vendor'

export default function AssignDelivery({ route, navigation }) {
  const { orderId } = route.params

  const [deliveryList, setDeliveryList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDeliveryPartners()
  }, [])

  /* ================= LOAD DELIVERY ================= */
  const loadDeliveryPartners = async () => {
    const result = await getDeliveryPartners()

    if (result?.status === 'success') {
      setDeliveryList(result.data)
    } else {
      setDeliveryList([])
    }

    setLoading(false)
  }

  /* ================= ASSIGN ================= */
  const handleAssign = async (deliveryId) => {
    const confirm = Platform.OS === 'web'
      ? window.confirm('Assign this delivery partner?')
      : true

    if (!confirm) return

    const result = await assignDelivery(orderId, deliveryId)

    if (result?.status === 'success') {
      Platform.OS === 'web'
        ? alert('Delivery Assigned')
        : Alert.alert('Success', 'Delivery Assigned')

      navigation.goBack()
    } else {
      Platform.OS === 'web'
        ? alert(result?.error || 'Failed')
        : Alert.alert('Error', result?.error || 'Failed')
    }
  }

  /* ================= RENDER ================= */
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phone}>📞 {item.mobile}</Text>
      </View>

      <TouchableOpacity
        style={styles.assignBtn}
        onPress={() => handleAssign(item.delivery_id)}
      >
        <Text style={styles.assignText}>Assign</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#FF9F43', '#FF7A00']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Assign Delivery</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {loading ? (
        <ActivityIndicator size="large" color="#FF7A00" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={deliveryList}
          keyExtractor={(item) => item.delivery_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.empty}>No delivery partners available</Text>
          }
        />
      )}
    </View>
  )
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFF3E8'
  },

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
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold'
  },

  phone: {
    color: '#555',
    marginTop: 4
  },

  assignBtn: {
    backgroundColor: '#FF7A00',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8
  },

  assignText: {
    color: '#fff',
    fontWeight: 'bold'
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#777'
  }
})
