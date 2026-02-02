import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { config } from './config'


/* ================= GET VENDOR PROFILE ================= */
export const getVendorProfile = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await axios.get(
      `${config.url}/vendor/getVendorProfile`, 
      {
        headers: {
          token: token // This must match req.user logic in your backend middleware
        }
      }
    );

    return response.data; // Usually { status: 'success', data: { ... } }
  } catch (error) {
    console.log('getVendorProfile error:', error);
    return {
      status: 'error',
      error: 'Unable to fetch profile'
    };
  }
};


/* ================= GET VENDOR ORDERS ================= */
export const getVendorOrders = async () => {
  try {
    const token = await AsyncStorage.getItem('token')

    const response = await axios.get(
      `${config.url}/vendor/orders`,
      {
        headers: {
          token: token // ✅ matches backend (req.headers.token)
        }
      }
    )

    return response.data
  } catch (error) {
    console.log('getVendorOrders error:', error)
    return {
      status: 'error',
      error: 'Unable to fetch orders'
    }
  }
}

export const createVendorProfile = async (formData) => {
  const token = await AsyncStorage.getItem('token')

  const response = await axios.post(
    `${config.url}/vendor/createVendorProfile`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        token: token
      }
    }
  )

  return response.data
}



/* ================= APPROVE ORDER ================= */
export const approveOrder = async (orderId) => {
  const token = await AsyncStorage.getItem('token')

  const res = await axios.put(
    `${config.url}/vendor/updateOrderStatus`,
    { order_id: orderId, status: 'APPROVED' },
    {
      headers: { token }
    }
  )

  return res.data
}

/* ================= MARK DELIVERED ================= */
export const markOrderDelivered = async (orderId) => {
  const token = await AsyncStorage.getItem('token')

  const res = await axios.put(
    `${config.url}/vendor/order/${orderId}/delivered`,
    {},
    {
      headers: { token }
    }
  )

  return res.data
}

export const addTiffin = async (formData) => {
  const token = await AsyncStorage.getItem('token')

  const response = await axios.post(
    `${config.url}/vendor/addTiffin`,
    formData,
    {
      headers: {
        token: token,                 // ✅ matches backend
        'Content-Type': 'multipart/form-data'
      }
    }
  )

  return response.data
}

/* ================= ASSIGN DELIVERY ================= */
export const assignDelivery = async (orderId, deliveryId) => {
  const token = await AsyncStorage.getItem('token')

  const response = await axios.put(
    `${config.url}/vendor/assignDelivery/${orderId}`,
    { delivery_id: deliveryId },
    {
      headers: {
        token: token
      }
    }
  )

  return response.data
}

/* ================= GET DELIVERY PARTNERS ================= */
export const getDeliveryPartners = async () => {
  const token = await AsyncStorage.getItem('token')

  const response = await axios.get(
    `${config.url}/vendor/delivery`,
    {
      headers: {
        token: token
      }
    }
  )

  return response.data
}

export const getTiffinDetails = async () => {
  try {
    const token = await AsyncStorage.getItem('token')

    const response = await axios.get(
      `${config.url}/vendor/getTiffinDetails`,
      {
        headers: {
          token: token   // ✅ REQUIRED
        }
      }
    )

    return response.data
  } catch (error) {
    console.log('getTiffinDetails error:', error)
    return {
      status: 'error',
      error: 'Unable to fetch tiffins'
    }
  }
}

/* ================= DELETE TIFFIN ================= */
export const deleteTiffin = async (tiffinId) => {
  const token = await AsyncStorage.getItem('token')

  const response = await axios.delete(
    `${config.url}/vendor/deleteTiffin`,   // ✅ FIXED URL
    {
      headers: {
        token: token               // ✅ backend uses req.headers.token
      },
      data: {
        tiffin_id: tiffinId
      }
    }
  )

  return response.data
}


export const updateTiffin = async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token')

    const response = await axios.put(
      `${config.url}/vendor/updateTiffin`,
      payload,
      {
        headers: {
          token: token   // ✅ backend uses req.headers.token
        }
      }
    )

    return response.data
  } catch (error) {
    console.log('updateTiffin error:', error)
    return {
      status: 'error',
      error: 'Update failed'
    }
  }
}

export const getSubscriptionPlans = async (tiffin_id) => {
  const token = await AsyncStorage.getItem('token')
  const res = await axios.get(
    `${config.url}/subscription/getSubscriptionPlans/${tiffin_id}`,
    { headers: { token } }
  )
  return res.data
}

export const deleteSubscriptionPlan = async (plan_id) => {
  const token = await AsyncStorage.getItem('token')
  const res = await axios.delete(
    `${config.url}/subscription/deleteSubscriptionPlan`,
    {
      headers: { token },
      data: { plan_id }
    }
  )
  return res.data
}

export const addSubscriptionPlan = async (payload) => {
  const token = await AsyncStorage.getItem('token')

  const response = await axios.post(
    `${config.url}/vendor/addSubscriptionPlan`,
    payload,
    {
      headers: { token }
    }
  )

  return response.data
}
