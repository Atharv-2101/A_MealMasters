import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { addSubscriptionPlan } from '../../services/vendor'

export default function AddSubscriptionPlanScreen() {
  const navigation = useNavigation()
  const route = useRoute()

  const { tiffin_id, tiffin_title } = route.params

  const [planType, setPlanType] = useState('DAILY')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('')
  const [meals, setMeals] = useState('1')

  const submit = async () => {
    if (!price || !duration) {
      Alert.alert('Validation', 'All fields are required')
      return
    }

    const payload = {
      tiffin_id,
      plan_type: planType,
      price,
      duration_days: duration,
      meals_per_day: meals
    }

    const result = await addSubscriptionPlan(payload)

    if (result?.status === 'success') {
      Alert.alert('Success', 'Subscription plan added')
      navigation.goBack()
    } else {
      Alert.alert('Error', result?.error || 'Failed to add plan')
    }
  }

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Add Plan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.card}>
        <Text style={styles.tiffin}>{tiffin_title}</Text>

        {/* PLAN TYPE */}
        <Text style={styles.label}>Plan Type</Text>
        <View style={styles.planRow}>
          {['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.planBtn,
                planType === type && styles.activePlan
              ]}
              onPress={() => {
                setPlanType(type)

                // auto-fill duration
                if (type === 'DAILY') setDuration('1')
                if (type === 'WEEKLY') setDuration('7')
                if (type === 'MONTHLY') setDuration('30')
                if (type === 'YEARLY') setDuration('365')
              }}
            >
              <Text
                style={[
                  styles.planText,
                  planType === type && styles.activeText
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

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
        />

        {/* MEALS */}
        <Text style={styles.label}>Meals per day</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={meals}
          onChangeText={setMeals}
        />

        <TouchableOpacity style={styles.btn} onPress={submit}>
          <Text style={styles.btnText}>ADD PLAN</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF7F0' },

  header: {
    backgroundColor: '#FF7A00',
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },

  card: {
    padding: 20
  },

  tiffin: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF7A00',
    marginBottom: 20
  },

  label: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd'
  },

  planRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },

  planBtn: {
    borderWidth: 1,
    borderColor: '#FF7A00',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20
  },

  activePlan: {
    backgroundColor: '#FF7A00'
  },

  planText: {
    color: '#FF7A00',
    fontWeight: '600'
  },

  activeText: {
    color: '#fff'
  },

  btn: {
    marginTop: 30,
    backgroundColor: '#FF7A00',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center'
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold'
  }
})
