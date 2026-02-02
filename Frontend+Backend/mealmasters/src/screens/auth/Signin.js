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
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { config } from '../../services/config'

const showAlert = (title, message) => {
  Platform.OS === 'web'
    ? window.alert(`${title}\n\n${message}`)
    : Alert.alert(title, message)
}

export default function Signin({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignin = async () => {
    if (!email || !password) {
      showAlert('Error', 'Email and password are required')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(
        `${config.url}/user/signin`,
        { email, password_hash: password }
      )

      setLoading(false)

      if (response.data.status === 'success') {
        const user = response.data.data
        await AsyncStorage.setItem('token', user.token)

        if (user.role === 'customer') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'CustomerDashboard' }]
          })
        } else if (user.role === 'vendor') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'VendorDashboard' }]
          })
        } else if (user.role === 'admin') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'AdminDrawer' }]
          })
        }

      } else {
        showAlert('Error', response.data.error)
      }
    } catch (err) {
      setLoading(false)
      showAlert('Error', 'Server error. Please try again')
    }
  }

  return (
    <LinearGradient
      colors={['#FF9F43', '#FFB26B']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={styles.card}>
          {/* BACK */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="arrow-back" size={22} color="#FF7A00" />
          </TouchableOpacity>

          <Text style={styles.title}>Welcome Back 👋</Text>
          <Text style={styles.subtitle}>
            Sign in to continue
          </Text>

          {/* EMAIL */}
          <View style={styles.inputBox}>
            <Ionicons name="mail-outline" size={20} color="#777" />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* PASSWORD */}
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={20} color="#777" />
            <TextInput
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.7 }]}
            onPress={handleSignin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 26,
    borderRadius: 20,
    elevation: 8
  },

  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 10
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center'
  },

  subtitle: {
    textAlign: 'center',
    color: '#777',
    marginBottom: 24
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15
  },

  btn: {
    backgroundColor: '#FF7A00',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 10,
    alignItems: 'center'
  },

  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
})
