import React, { useState } from "react"
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native"
import AdminScreen from "../../components/AdminScreen"
import { addDeliveryPerson } from "../../services/orders"

export default function AddDeliveryScreen({ navigation }) {
  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!name || !mobile) {
      Alert.alert("Validation", "Please enter name and mobile")
      return
    }

    if (mobile.length !== 10) {
      Alert.alert("Validation", "Enter valid 10-digit mobile number")
      return
    }

    try {
      setLoading(true)
      const res = await addDeliveryPerson({ name, mobile })

      if (res.data.status === "success") {
        Alert.alert("Success", "Delivery person added")
        setName("")
        setMobile("")
        navigation.goBack()
      } else {
        Alert.alert("Error", res.data.error || "Failed to add delivery person")
      }
    } catch (err) {
      console.log("Add delivery error:", err)
      Alert.alert("Error", "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminScreen title="Add Delivery Person">
      <View style={styles.card}>

        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="Enter delivery person name"
        />

        <Text style={styles.label}>Mobile</Text>
        <TextInput
          value={mobile}
          onChangeText={setMobile}
          style={styles.input}
          placeholder="Enter mobile number"
          keyboardType="number-pad"
          maxLength={10}
        />

        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.6 }]}
          onPress={submit}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? "Adding..." : "Add Delivery Person"}
          </Text>
        </TouchableOpacity>

      </View>
    </AdminScreen>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
  },
  label: {
    fontWeight: "700",
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
  },
  btn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "800",
  },
})
