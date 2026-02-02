import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import {
  getSubscriptionPlans,
  deleteSubscriptionPlan
} from '../../services/vendor'

export default function SubscriptionPlansScreen({ route, navigation }) {
  const { tiffin_id, tiffin_title } = route.params
  const [plans, setPlans] = useState([])

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
  console.log("Fetching plans for Tiffin ID:", tiffin_id); // LOG 1
  const result = await getSubscriptionPlans(tiffin_id);
  console.log("API Result:", result); // LOG 2
  
  if (result?.status === 'success') {
    setPlans(result.data);
  } else {
    console.error("Fetch failed:", result?.error);
  }
}

  const confirmDelete = (id) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Delete this plan?')) handleDelete(id)
      return
    }

    Alert.alert('Delete Plan', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => handleDelete(id) }
    ])
  }

  const handleDelete = async (id) => {
    const result = await deleteSubscriptionPlan(id)
    if (result?.status === 'success') {
      Alert.alert('Deleted', 'Plan deleted')
      loadPlans()
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.type}>{item.plan_type}</Text>
      <Text style={styles.meta}>
        {item.duration_days} days · {item.meals_per_day} meals/day
      </Text>
      <Text style={styles.price}>₹ {item.price}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('UpdateSubscriptionPlanScreen', { plan: item })
          }
        >
          <Ionicons name="create-outline" size={18} color="#FF7A00" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => confirmDelete(item.plan_id)}>
          <Ionicons name="trash-outline" size={18} color="#C62828" />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#FF9F43', '#FF7A00']} style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>{tiffin_title}</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <FlatList
        data={plans}
        keyExtractor={(i) => i.plan_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF7F0' },
  header: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16
  },
  type: { fontSize: 16, fontWeight: 'bold' },
  meta: { color: '#555', marginTop: 4 },
  price: { marginTop: 6, fontWeight: 'bold' },
  actions: { flexDirection: 'row', gap: 16, marginTop: 10 }
})
