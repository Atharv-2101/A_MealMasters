import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { getMySubscriptions } from '../../services/customer'

export default function MySubscriptions({ navigation }) {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubscriptions()
  }, [])

  const loadSubscriptions = async () => {
    const result = await getMySubscriptions()
    if (result?.status === 'success') {
      // setSubs(result.data.filter(item => item.duration_days >= 1))
      // setSubs(result.data)
      const processedData = result.data.map(item => ({
      ...item,
      duration_days: item.duration_days // Fallback to 0 if null
    }));

    setSubs(processedData);
    console.log("First item data:", result.data[0]);
    }
    setLoading(false)
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN')

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ACTIVE':
        return styles.active
      case 'PENDING':
        return styles.pending
      case 'CANCELLED':
        return styles.cancelled
      default:
        return {}
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* TOP ROW */}
      <View style={styles.rowBetween}>
        <Text style={styles.title}>{item.tiffin_name}</Text>

        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.plan}>
        {item.plan_type}
      </Text>

      {/* INFO ROW */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={14} color="#555" />
          <Text style={styles.meta}>
            {formatDate(item.start_date)}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="calendar-clear-outline" size={14} color="#555" />
          <Text style={styles.meta}>
            {formatDate(item.end_date)}
          </Text>
        </View>
      </View>

      <View style={styles.durationChip}>
        <Ionicons name="time-outline" size={14} color="#FF7A00" />
        <Text style={styles.durationText}>
          {item.duration_days} days subscription
        </Text>
      </View>
    </View>
  )

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <LinearGradient colors={['#FF9F43', '#FF7A00']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Subscriptions</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {loading ? (
        <ActivityIndicator size="large" color="#FF7A00" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={subs}
          keyExtractor={(item) => item.order_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.empty}>No active subscriptions</Text>
          }
        />
      )}
    </View>
  )
}

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
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    elevation: 5
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222'
  },

  plan: {
    marginTop: 6,
    color: '#FF7A00',
    fontWeight: '600'
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },

  meta: {
    color: '#555',
    fontSize: 13
  },

  durationChip: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFF0E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6
  },

  durationText: {
    color: '#FF7A00',
    fontWeight: '600',
    fontSize: 12
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20
  },

  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },

  active: { backgroundColor: '#4CAF50' },
  pending: { backgroundColor: '#FF9800' },
  cancelled: { backgroundColor: '#E53935' },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#777'
  }
})
