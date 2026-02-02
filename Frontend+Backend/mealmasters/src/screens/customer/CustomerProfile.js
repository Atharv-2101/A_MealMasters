import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUserProfile,updateUserProfile } from '../../services/customer'

const showAlert = (title, message) => {
  Platform.OS === 'web'
    ? window.alert(`${title}\n\n${message}`)
    : Alert.alert(title, message)
}

export default function CustomerProfile({ navigation }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  /* ================= LOAD PROFILE ================= */
  const loadProfile = async () => {
    try {
      const result = await getUserProfile()

      if (result.status === 'success') {
        setName(result.data.name || '')
        setPhone(result.data.phone || '')
        setAddress(result.data.address || '')
      }
    } catch (err) {
      showAlert('Error', 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  /* ================= UPDATE PROFILE ================= */
  const handleUpdate = async () => {
    if (!name || !phone || !address) {
      showAlert('Error', 'All fields are required')
      return
    }

    try {
      setSaving(true)
      const result = await updateUserProfile({ name, phone, address })

      if (result.status === 'success') {
        await AsyncStorage.setItem('userName', name)
        showAlert('Success', 'Profile updated successfully')
        loadProfile()
      }
    } catch (err) {
      showAlert('Error', 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <View style={styles.root}>
      {/* ================= HEADER ================= */}
      <LinearGradient colors={['#FF9F43', '#FF7A00']} style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>My Profile</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {loading ? (
        <ActivityIndicator size="large" color="#FF7A00" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.card}>
          {/* NAME */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter full name"
          />

          {/* PHONE */}
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
          />

          {/* ADDRESS */}
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter address"
          />

          {/* UPDATE BUTTON */}
          <TouchableOpacity
            style={styles.updateBtn}
            onPress={handleUpdate}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.updateText}>Update Details</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
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
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 5
  },

  label: {
    fontSize: 14,
    color: '#555',
    marginTop: 12
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
    fontSize: 15
  },

  textArea: {
    height: 90,
    textAlignVertical: 'top'
  },

  updateBtn: {
    backgroundColor: '#FF7A00',
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center'
  },

  updateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
})
