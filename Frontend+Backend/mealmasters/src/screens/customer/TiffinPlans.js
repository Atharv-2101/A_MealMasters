import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { getTiffinPlans, placeOrder } from '../../services/customer'

export default function TiffinPlans({ route, navigation }) {
  const { tiffinId, title } = route.params
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    const result = await getTiffinPlans(tiffinId)

    if (result?.status === 'success' && result.data.length > 0) {
      setPlans(result.data)
    } else {
      setPlans([
        {
          plan_id: 0,
          plan_type: 'One Day',
          duration_days: 1,
          meals_per_day: 1,
          price: title?.price || 0,
          isDefault: true
        }
      ])
    }
    setLoading(false)
  }

  /* ================= ALERT ================= */
  const showAlert = (title, message) => {
    Platform.OS === 'web'
      ? window.alert(`${title}\n\n${message}`)
      : Alert.alert(title, message)
  }

  /* ================= PLACE ORDER ================= */
  const handleOrder = async (plan_id) => {
    try {
      const result = await placeOrder(tiffinId, plan_id)
      if (result?.status === 'success') {
        showAlert('Success', 'Order placed successfully')
        navigation.replace('OrderHistory')
      } else {
        showAlert('Error', result?.error || 'Failed to place order')
      }
    } catch (err) {
      showAlert('Error', 'Server error while placing order')
    }
  }

  /* ================= PLAN CARD ================= */
  const renderItem = ({ item }) => (
    <View style={[styles.planCard, item.isDefault && styles.defaultCard]}>
      {item.duration_days >= 30 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Best Value</Text>
        </View>
      )}

      <Text style={styles.planType}>{item.plan_type}</Text>

      <Text style={styles.description}>
        {item.isDefault
          ? 'Single day tiffin without subscription'
          : `Enjoy ${item.meals_per_day} meals per day for ${item.duration_days} days`}
      </Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="calendar" size={16} color="#FF7A00" />
          <Text style={styles.detail}>{item.duration_days} Day(s)</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="restaurant" size={16} color="#FF7A00" />
          <Text style={styles.detail}>{item.meals_per_day} Meal(s)</Text>
        </View>
      </View>

      <Text style={styles.price}>₹ {item.price}</Text>

      {item.isDefault ? (
        <TouchableOpacity
          style={styles.addBtn}
          activeOpacity={0.85}
          onPress={() => handleOrder(0)}
        >
          <Text style={styles.addText}>ADD TO CART</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.subscribeBtn}
          activeOpacity={0.85}
          onPress={() => handleOrder(item.plan_id)}
        >
          <Text style={styles.subscribeText}>Subscribe</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <LinearGradient colors={['#FF9F43', '#FF7A00']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Choose Your Plan</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FF7A00"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(item, index) =>
            item.plan_id ? item.plan_id.toString() : index.toString()
          }
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
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
    paddingTop: 22,
    paddingBottom: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 6
  },

  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold'
  },

  planCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    elevation: 6,
    position: 'relative'
  },

  defaultCard: {
    borderWidth: 1.5,
    borderColor: '#FF7A00'
  },

  badge: {
    position: 'absolute',
    top: -10,
    right: 14,
    backgroundColor: '#FF7A00',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },

  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold'
  },

  planType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF7A00'
  },

  description: {
    marginTop: 6,
    fontSize: 13,
    color: '#666'
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },

  detail: {
    fontSize: 14,
    fontWeight: '600'
  },

  price: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#000'
  },

  subscribeBtn: {
    marginTop: 16,
    backgroundColor: '#FF7A00',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center'
  },

  addBtn: {
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: '#FF7A00',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center'
  },

  addText: {
    color: '#FF7A00',
    fontWeight: 'bold',
    fontSize: 16
  },

  subscribeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
})
