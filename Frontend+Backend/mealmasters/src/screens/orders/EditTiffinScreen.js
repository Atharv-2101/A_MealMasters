import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { updateTiffin } from '../../services/vendor'

export default function EditTiffinScreen() {
  const navigation = useNavigation()
  const route = useRoute()

  const { tiffin } = route.params

  const [title, setTitle] = useState(tiffin.title)
  const [type, setType] = useState(tiffin.type)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [description, setDescription] = useState(tiffin.description)
  const [cost, setCost] = useState(String(tiffin.cost))

  /* ================= UPDATE HANDLER ================= */
  const handleUpdate = async () => {
    if (!title || !type || !cost) {
      Alert.alert('Validation', 'All fields are required')
      return
    }

    const payload = {
      tiffin_id: tiffin.tiffin_id,
      title,
      type,
      description,
      cost
    }

    const result = await updateTiffin(payload)

    if (result?.status === 'success') {
      Platform.OS === 'web'
        ? alert('Tiffin updated successfully')
        : Alert.alert('Success', 'Tiffin updated successfully')

      navigation.goBack()
    } else {
      Platform.OS === 'web'
        ? alert(result?.error || 'Update failed')
        : Alert.alert('Error', result?.error || 'Update failed')
    }
  }

  return (
    <View style={styles.root}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Edit Tiffin</Text>
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
              {type === 'VEG' ? '🌱 Veg' : type === 'NONVEG' ? '🍗 Non-Veg' : 'Select Type'}
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
          value={description}
          onChangeText={setDescription}
          multiline
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

        {/* UPDATE BUTTON */}
        <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
          <Text style={styles.updateText}>UPDATE TIFFIN</Text>
        </TouchableOpacity>

        {/* CANCEL */}
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
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
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
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
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
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
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
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

  /* BUTTONS */
  updateBtn: {
    marginTop: 26,
    backgroundColor: '#FF7A00',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center'
  },

  updateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },

  cancelBtn: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FF7A00',
    alignItems: 'center'
  },

  cancelText: {
    color: '#FF7A00',
    fontWeight: 'bold'
  }
})
