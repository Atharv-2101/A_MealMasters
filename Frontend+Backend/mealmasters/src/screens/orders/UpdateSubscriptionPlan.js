import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { updateSubscriptionPlan } from '../../services/vendor'

export default function UpdateSubscriptionPlanScreen() {
  const navigation = useNavigation()
  const route = useRoute()

  const { plan } = route.params

  const [planType, setPlanType] = useState(plan.plan_type)
  const [price, setPrice] = useState(String(plan.price))
  const [duration, setDuration] = useState(String(plan.duration_days))
  const [meals, setMeals] = useState(String(plan.meals_per_day))
  const [loading, setLoading] = useState(false)

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    if (!planType || !price || !duration || !meals) {
      showAlert('Validation', 'All fields are required')
      return
    }

    setLoading(true)

    const payload = {
      plan_id: plan.plan_id,
      plan_type: planType,
      price: Number(price),
      duration_days: Number(duration),
      meals_per_day: Number(meals)
    }

    try {
      const result = await updateSubscriptionPlan(payload)

      if (result?.status === 'success') {
        showAlert('Success', 'Subscription plan updated')
        navigation.goBack()
      } else {
        showAlert('Error', result?.error || 'Update failed')
      }
    } catch {
      showAlert('Error', 'Server error')
    } finally {
      setLoading(false)
    }
  }

  const showAlert = (title, msg) => {
    Platform.OS === 'web'
      ? alert(`${title}\n\n${msg}`)
      : Alert.alert(title, msg)
  }

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Edit Subscription</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.card}>
        {/* PLAN TYPE */}
        <Text style={styles.label}>Plan Type</Text>
        <TextInput
          style={styles.input}
          value={planType}
          onChangeText={setPlanType}
          placeholder="Monthly / Weekly / One Day"
        />

        {/* PRICE */}
        <Text style={styles.label}>Price (₹)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
        />

        {/* DURATION */}
        <Text style={styles.label}>Duration (Days)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={duration}
          onChangeText={setDuration}
          placeholder="e.g. 30"
        />

        {/* MEALS */}
        <Text style={styles.label}>Meals Per Day</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={meals}
          onChangeText={setMeals}
          placeholder="e.g. 2"
        />

        {/* BUTTON */}
        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.7 }]}
          onPress={handleUpdate}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? 'Updating...' : 'Update Plan'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
    backgroundColor: '#FF7A00',
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },

  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 18,
    elevation: 6
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginTop: 14
  },

  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    fontSize: 15
  },

  btn: {
    backgroundColor: '#FF7A00',
    marginTop: 28,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center'
  },

  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
})
