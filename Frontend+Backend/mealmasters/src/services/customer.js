import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { config } from './config'


export const getUserProfile = async () => {
  const token = await AsyncStorage.getItem('token')

  if (!token) throw new Error('Token missing')

  const res = await axios.get(
    `${config.url}/customer/profile`,
    {
      headers: { token }
    }
  )

  return res.data
}

export const updateUserProfile = async (data) => {
  const token = await AsyncStorage.getItem('token')

  if (!token) throw new Error('Token missing')

  const res = await axios.put(
    `${config.url}/customer/updateProfile`,
    data,
    {
      headers: { token }
    }
  )

  return res.data
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
          token: token   // 🔥 MUST MATCH BACKEND
        }
      }
    )

    return response.data
  } catch (error) {
    console.log('Tiffin List Error:', error.response?.data || error)
    return null
  }
}

export async function getTiffinPlans(tiffin_id) {
  try {
    const token = await AsyncStorage.getItem('token')

    const response = await axios.get(
      `${config.url}/customer/tiffinPlans/${tiffin_id}`,
      {
        headers: {
          token
        }
      }
    )

    return response.data
  } catch (error) {
    console.log('Tiffin Plans Error:', error)
    return null
  }
}

export async function getOrderHistory() {
  try {
    const token = await AsyncStorage.getItem('token')

    const response = await axios.get(
      `${config.url}/customer/orderHistory`,
      { headers: { token } }
    )

    return response.data
  } catch (error) {
    console.log('Order history error', error)
    return null
  }
}

export async function placeOrder(tiffin_id, plan_id) {
  try {
    const token = await AsyncStorage.getItem('token')

    const response = await axios.post(
      `${config.url}/customer/placeOrder`,
      {
        tiffin_id,
        plan_id,
        start_date: new Date().toISOString().slice(0, 10)
      },
      {
        headers: { token }
      }
    )

    return response.data
  } catch (err) {
    console.log('Place Order Error:', err)
    return null
  }
}


export const cancelOrder = async (orderId) => {
  const token = await AsyncStorage.getItem('token')

  const response = await axios.put(
    `${config.url}/customer/order/${orderId}/cancel`,
    {}, // 👈 EMPTY BODY (IMPORTANT)
    {
      headers: {
        token: token
      }
    }
  )

  return response.data
}

export const getMySubscriptions = async () => {
  const token = await AsyncStorage.getItem('token')

  const response = await axios.get(
    `${config.url}/customer/orderHistory`,
    {
      headers: { token }
    }
  )

  return response.data
}

export const getDeliveryDetails = async (orderId) => {
  const token = await AsyncStorage.getItem('token')

  const response = await axios.get(
    `${config.url}/customer/order/${orderId}/delivery`,
    {
      headers: { token }
    }
  )

  return response.data
}
