import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native"
import AdminScreen from "../../components/AdminScreen"
import { addTiffin } from "../../services/tiffin"
import api from "../../services/api"

export default function AddTiffinScreen({ navigation }) {
  const [vendors, setVendors] = useState([])
  const [vendorId, setVendorId] = useState("")
  const [vendorOpen, setVendorOpen] = useState(false)

  const [title, setTitle] = useState("")
  const [type, setType] = useState("VEG")
  const [description, setDescription] = useState("")
  const [cost, setCost] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get("/admin/vendorList").then(res => {
      if (res.data.status === "success") {
        setVendors(res.data.data)
      }
    })
  }, [])

  const submit = async () => {
    if (!vendorId || !title || !description || !cost) {
      Alert.alert("Validation", "All fields are required")
      return
    }

    setLoading(true)

    try {
      const res = await addTiffin({
        vendor_id: vendorId,
        title,
        type,
        description,
        cost,
        image: null,
      })

      if (res.data.status === "success") {
        Alert.alert("Success", "Tiffin added successfully")
        navigation.goBack()
      } else {
        Alert.alert("Error", res.data.error || "Failed to add tiffin")
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const selectedVendor = vendors.find(v => v.id === vendorId)

  return (
    <AdminScreen title="Add Tiffin">
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.card}>

          {/* VENDOR DROPDOWN */}
          <Text style={styles.label}>Select Vendor</Text>

          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => setVendorOpen(p => !p)}
          >
            <Text style={{ fontWeight: "600" }}>
              {selectedVendor
                ? `${selectedVendor.name} (ID: ${selectedVendor.id})`
                : "Choose Vendor"}
            </Text>
          </TouchableOpacity>

          {vendorOpen && (
            <View style={styles.dropdown}>
              {vendors.map(v => (
                <TouchableOpacity
                  key={v.id}
                  style={styles.vendorItem}
                  onPress={() => {
                    setVendorId(v.id)
                    setVendorOpen(false)
                  }}
                >
                  <Text style={styles.vendorText}>
                    {v.name} (ID: {v.id})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* TITLE */}
          <Text style={styles.label}>Tiffin Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter tiffin title"
            value={title}
            onChangeText={setTitle}
          />

          {/* TYPE */}
          <Text style={styles.label}>Type</Text>
          <View style={styles.typeRow}>
            {["VEG", "NON-VEG"].map(t => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.typeBtn,
                  type === t && styles.activeType,
                ]}
                onPress={() => setType(t)}
              >
                <Text
                  style={[
                    styles.typeText,
                    type === t && styles.activeTypeText,
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* DESCRIPTION */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            value={description}
            onChangeText={setDescription}
          />

          {/* COST */}
          <Text style={styles.label}>Cost (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={cost}
            onChangeText={setCost}
          />

          {/* SUBMIT */}
          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.7 }]}
            onPress={submit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Add Tiffin</Text>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </AdminScreen>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
  },

  label: {
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
  },

  textArea: {
    height: 80,
    textAlignVertical: "top",
  },

  dropdownHeader: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f9f9f9",
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 6,
    maxHeight: 180,
  },

  vendorItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  vendorText: {
    fontWeight: "600",
  },

  typeRow: {
    flexDirection: "row",
    gap: 12,
  },

  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
  },

  activeType: {
    backgroundColor: "#FF7A00",
    borderColor: "#FF7A00",
  },

  typeText: {
    fontWeight: "700",
  },

  activeTypeText: {
    color: "#fff",
  },

  btn: {
    backgroundColor: "#FF7A00",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 24,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
})
