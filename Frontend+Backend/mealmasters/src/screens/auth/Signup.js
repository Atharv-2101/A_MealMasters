import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native'

import { customerSignup } from '../../services/auth'

/* ===== Cross-platform alert ===== */
const showAlert = (title, message, callback) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`)
    callback && callback()
  } else {
    Alert.alert(title, message, [{ text: 'OK', onPress: callback }])
  }
}

export default function Signup({ navigation }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [password_hash, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    if (!name || !email || !phone || !address || !password_hash || !confirmPassword) {
      showAlert('Error', 'All fields are required')
      return
    }

    if (password_hash !== confirmPassword) {
      showAlert('Error', 'Passwords do not match')
      return
    }

    setLoading(true)

    const result = await customerSignup(
      name,
      email,
      phone,
      address,
      password_hash
    )

    setLoading(false)

    if (result && result.status === 'success') {
      showAlert(
        'Success',
        'Account created successfully. Please login.',
        () => navigation.replace('Signin')   // ✅ MOVE TO SIGNIN
      )
    } else {
      showAlert('Error', result?.error || 'Signup failed')
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>

        {/* 🔙 BACK BUTTON */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>


        <Text style={styles.title}>Customer Signup</Text>

        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
        />

        <TextInput
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password_hash}
          onChangeText={setPassword}
          style={styles.input}
        />

        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.7 }]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* 👉 MOVE TO SIGNIN MANUALLY */}
        <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
          <Text style={styles.link}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF3E8',
    justifyContent: 'center',
    padding: 20
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
    borderColor: '#FFB26B',
    elevation: 6
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF7A00',
    textAlign: 'center',
    marginBottom: 24
  },

  input: {
    borderWidth: 1,
    borderColor: '#FFD1A6',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    backgroundColor: '#fff'
  },

  btn: {
    backgroundColor: '#FF7A00',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },

    /* 🔙 BACK */
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 10
  },

  backText: {
    color: '#FF7A00',
    fontWeight: 'bold',
    fontSize: 16
  },

  link: {
    marginTop: 16,
    textAlign: 'center',
    color: '#FF7A00',
    fontWeight: 'bold'
  }
})