import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, ActivityIndicator } from "react-native"
import AdminScreen from "../../components/AdminScreen"
import { getUserDetails } from "../../services/orders"

export default function UserDetailsScreen({ route }) {
  const userId = route?.params?.userId

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = () => {
    getUserDetails(userId)
      .then(res => {
        if (res.data.status === "success") {
          setUser(res.data.data)
        }
      })
      .catch(err => console.log("User details error:", err))
      .finally(() => setLoading(false))
  }

  return (
    <AdminScreen title={`User Details (${userId})`}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : !user ? (
        <Text style={{ textAlign: "center" }}>User not found</Text>
      ) : (
        <View style={styles.card}>

          <Text style={styles.title}>User Information</Text>

          <Row label="Name" value={user.name} />
          <Row label="Mobile" value={user.phone} />
          <Row label="Email" value={user.email} />
          <Row label="Address" value={user.address} />
          <Row
            label="Registered On"
            value={user.created_at?.split("T")[0]}
          />
          <Row label="Status" value={user.status} />
          <Row label="Role" value={user.role} />

        </View>
      )}
    </AdminScreen>
  )
}

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.k}>{label}:</Text>
    <Text style={[styles.v, { flex: 1, textAlign: "right" }]}>
      {value || "-"}
    </Text>
  </View>
)

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
    color: "#12212d",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  k: { fontWeight: "900", color: "#3c4a57" },
  v: { fontWeight: "700", color: "#12212d" },
})
