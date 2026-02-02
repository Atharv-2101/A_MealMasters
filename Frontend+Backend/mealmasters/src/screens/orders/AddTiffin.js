import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Platform
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { config } from '../../services/config'

export default function AddTiffinScreen() {
  const navigation = useNavigation()

  const [title, setTitle] = useState('')
  const [type, setType] = useState('')
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [description, setDescription] = useState('')
  const [cost, setCost] = useState('')
  const [image, setImage] = useState(null)

  /* ================= IMAGE PICKER ================= */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7
    })

    if (!result.canceled) {
      setImage(result.assets[0])
    }
  }

  /* ================= ADD TIFFIN ================= */
  const addTiffin = async () => {
    if (!title || !type || !cost) {
      Alert.alert('Error', 'Title, Type and Cost are required')
      return
    }

    try {
      const token = await AsyncStorage.getItem('token')

      const formData = new FormData()
      formData.append('title', title)
      formData.append('type', type)
      formData.append('description', description)
      formData.append('cost', cost)

      if (image) {
        if(Platform.OS == 'web') {
        const response = await fetch(image.uri)
        const blob = await response.blob()
        formData.append('image', blob, 'tiffin.jpg')
        } else {
        formData.append('image', {
        uri: image.uri,
        name: 'tiffin.jpg',
        type: 'image/jpeg'
      })
    }
      }

      await axios.post(`${config.url}/vendor/addTiffin`, formData, {
        headers: {
          token,
          'Content-Type': 'multipart/form-data'
        }
      })

      Alert.alert('Success', 'Tiffin added successfully')
      navigation.goBack()
    } catch (err) {
      Alert.alert('Error', 'Failed to add tiffin')
    }
  }

  return (
    <View style={styles.root}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Add Tiffin</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* TITLE */}
        <Text style={styles.label}>Tiffin Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter tiffin name"
          value={title}
          onChangeText={setTitle}
        />

        {/* TYPE DROPDOWN */}
        <Text style={styles.label}>Type *</Text>
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowTypeDropdown(!showTypeDropdown)}
          >
            <Text style={type ? styles.dropdownText : styles.placeholder}>
              {type || 'Select Veg / Non-Veg'}
            </Text>
            <Ionicons
              name={showTypeDropdown ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#777"
            />
          </TouchableOpacity>

          {showTypeDropdown && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setType('VEG')
                  setShowTypeDropdown(false)
                }}
              >
                <Text style={styles.veg}>🌱 Veg</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setType('NONVEG')
                  setShowTypeDropdown(false)
                }}
              >
                <Text style={styles.nonveg}>🍗 Non-Veg</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* DESCRIPTION */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter description"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        {/* COST */}
        <Text style={styles.label}>Cost *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter price"
          keyboardType="numeric"
          value={cost}
          onChangeText={setCost}
        />

        {/* IMAGE */}
        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
          <Ionicons name="image-outline" size={20} color="#FF7A00" />
          <Text style={styles.imageText}>Pick Image</Text>
        </TouchableOpacity>

        {image && (
          <Image source={{ uri: image.uri }} style={styles.preview} />
        )}

        {/* BUTTONS */}
        <TouchableOpacity style={styles.addBtn} onPress={addTiffin}>
          <Text style={styles.addText}>ADD TIFFIN</Text>
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

  /* HEADER */
  header: {
    backgroundColor: '#FF7A00',
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
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

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
    marginTop: 10
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fff',
    fontSize: 15
  },

  textArea: {
    height: 90,
    textAlignVertical: 'top'
  },

  /* DROPDOWN */
  dropdownWrapper: {
    marginBottom: 14
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  dropdownText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222'
  },

  placeholder: {
    fontSize: 15,
    color: '#999'
  },

  dropdownMenu: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden'
  },

  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1'
  },

  veg: {
    color: '#2E7D32',
    fontWeight: '600'
  },

  nonveg: {
    color: '#C62828',
    fontWeight: '600'
  },

  /* IMAGE */
  imageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF7A00',
    justifyContent: 'center'
  },

  imageText: {
    color: '#FF7A00',
    fontWeight: '600'
  },

  preview: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    marginTop: 12
  },

  /* BUTTONS */
  addBtn: {
    marginTop: 24,
    backgroundColor: '#FF7A00',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center'
  },

  addText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },


})
