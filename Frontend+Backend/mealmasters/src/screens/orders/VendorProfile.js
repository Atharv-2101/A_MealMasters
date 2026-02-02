import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { createVendorProfile, getVendorProfiile, getVendorProfile } from '../../services/vendor'
import { config } from '../../services/config'

export default function VendorProfile({ navigation }) {
  const [businessName, setBusinessName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      const result = await getVendorProfile() // You'll need to create this service
      if (result && result.status === 'success') {
        // Populate the inputs with existing data
        setBusinessName(result.data.business_name || '')
        setDescription(result.data.business_description || '')
        if (result.data.image) {
        // Use your config.url (e.g., http://192.168.x.x:4000)
        const fullUrl = `${config.url}/profile_images/${result.data.image}`;
        setImage(fullUrl);
      }
      }
    } catch (err) {
      console.error("Error loading profile:", err)
    } finally {
      setLoading(false)
    }
  }


  /* ================= PICK IMAGE ================= */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  /* ================= SAVE PROFILE ================= */
  const saveProfile = async () => {
    if (!businessName || !description || !image) {
      Alert.alert('Error', 'All fields are required')
      return
    }

    const formData = new FormData()
    formData.append('business_name', businessName)
    formData.append('business_description', description)
    formData.append('image', {
      uri: image,
      name: 'vendor.jpg',
      type: 'image/jpeg'
    })

    try {
      setLoading(true)
      const result = await createVendorProfile(formData)

      if (result.status === 'success') {
        Platform.OS === 'web'
          ? alert('Vendor profile created')
          : Alert.alert('Success', 'Vendor profile created')

        navigation.goBack()
      } else {
        Alert.alert('Error', result.error || 'Failed')
      }
    } catch (err) {
      console.log(err)
      Alert.alert('Error', 'Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#FF9F43', '#FF7A00']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Vendor Profile</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <View style={styles.container}>
        <TouchableOpacity onPress={pickImage} style={styles.imageBox}>
          <Image
            source={{
              uri: image ? image : undefined
            }}
            style={styles.image}
            onError={(e) => console.log("Image Load Error:", e.nativeEvent.error)}
          />
          <Text style={styles.changeText}>Upload Business Image</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Business Name"
          value={businessName}
          onChangeText={setBusinessName}
          style={styles.input}
        />

        <TextInput
          placeholder="Business Description"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, { height: 90 }]}
          multiline
        />

        <TouchableOpacity
          style={styles.btn}
          onPress={saveProfile}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? 'Saving...' : 'Save Profile'}
          </Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 20,
    fontWeight: 'bold'
  },

  container: {
    padding: 20
  },

  imageBox: {
    alignItems: 'center',
    marginBottom: 20
  },

  image: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: '#eee'
  },

  changeText: {
    marginTop: 8,
    color: '#FF7A00',
    fontWeight: '600'
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    backgroundColor: '#fff'
  },

  btn: {
    backgroundColor: '#FF7A00',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center'
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
})
