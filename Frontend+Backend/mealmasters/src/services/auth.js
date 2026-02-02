import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { config } from './config'

/* ================= CUSTOMER SIGNUP ================= */
export async function customerSignup(
    name,
    email,
    phone,
    address,
    password_hash
) {
    try {
        const response = await axios.post(
            `${config.url}/user/customer/signup`,
            { name, email, phone, address, password_hash }
        )
        return response.data
    } catch (error) {
        console.log('Customer Signup Error:', error)
        return null
    }
}

/* ================= VENDOR SIGNUP ================= */
export async function vendorSignup(
    name,
    email,
    phone,
    address,
    password_hash
) {
    try {
        const response = await axios.post(
            `${config.url}/user/vendor/signup`,
            { name, email, phone, address, password_hash }
        )
        return response.data
    } catch (error) {
        console.log('Vendor Signup Error:', error)
        return null
    }
}

/* ================= SIGNIN ================= */
export async function signinUser(email, password) {
  try {
    const response = await axios.post(
      `${config.url}/user/signin`,
      { email, password_hash: password }
    )

    if (response.data.status === 'success') {
      await AsyncStorage.setItem('token', response.data.data.token)
    }

    return response.data
  } catch (error) {
    console.log('Signin API Error:', error)
    return null
  }
}

/* ✅ FETCH TIFFINS */
export async function getAllTiffins() {
  try {
    const token = await AsyncStorage.getItem('token')

    if (!token) {
      console.log('❌ TOKEN NOT FOUND')
      return null
    }

    const response = await axios.get(
      `${config.url}/customer/tiffinsList`,
      {
        headers: {
          token: token  
        }
      }
    )

    return response.data
  } catch (error) {
    console.log('Tiffin List Error:', error.response?.data || error)
    return null
  }
}