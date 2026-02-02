import React, { useEffect, useState } from "react"
import { View, ActivityIndicator, Text } from "react-native"
import AdminScreen from "../../components/AdminScreen"
import AdminTable from "../../components/AdminTable"
import { getRegisteredUsers } from "../../services/orders"

export default function RegisteredUsersScreen({ navigation }) {
  const columns = ["S.NO", "Name", "Mobile", "Email", "Reg Date", "Action"]

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    setLoading(true)

    getRegisteredUsers()
      .then(res => {
        if (res.data.status === "success") {
          const tableRows = res.data.data.map((user, index) => ([
            index + 1,
            user.name || "-",
            user.phone || "-",
            user.email || "-",
            user.created_at
              ? user.created_at.split("T")[0]
              : "-",
            {
              type: "button",
              label: "View",
              variant: "success",
              onPress: () =>
                navigation.navigate("UserDetails", { userId: user.id }),
            },
          ]))

          setRows(tableRows)
        } else {
          setRows([])
        }
      })
      .catch(err => {
        console.log("Registered users error:", err)
        setRows([])
      })
      .finally(() => setLoading(false))
  }

  return (
    <AdminScreen title="Registered Users">
      <View style={{ flex: 1 }}>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : rows.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No registered users found
          </Text>
        ) : (
          <AdminTable columns={columns} rows={rows} />
        )}

      </View>
    </AdminScreen>
  )
}
