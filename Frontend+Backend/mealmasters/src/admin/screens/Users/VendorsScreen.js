import React, { useEffect, useState } from "react"
import { View, ActivityIndicator, Text } from "react-native"
import AdminScreen from "../../components/AdminScreen"
import AdminTable from "../../components/AdminTable"
import { getVendors } from "../../services/orders"

export default function VendorsScreen({ navigation }) {
  const columns = ["S.NO", "Name", "Mobile", "Email", "Reg Date", "Status", "Action"]

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVendors()
  }, [])

  const loadVendors = () => {
    setLoading(true)

    getVendors()
      .then(res => {
        if (res.data.status === "success") {
          const tableRows = res.data.data.map((user, index) => ([
            index + 1,
            user.name || "-",
            user.phone || "-",
            user.email || "-",
            user.status || "pending",
            user.created_at,
            {
              type: "button",
              label: "View",
              variant: "success",
              onPress: () =>
                navigation.navigate("UserDetails", {
                  userId: user.id,
                }),
            },
          ]))

          setRows(tableRows)
        } else {
          setRows([])
        }
      })
      .catch(err => {
        console.log("Vendor list error:", err)
        setRows([])
      })
      .finally(() => setLoading(false))
  }

  return (
    <AdminScreen title="Vendors">
      <View style={{ flex: 1 }}>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : rows.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No vendors found
          </Text>
        ) : (
          <AdminTable columns={columns} rows={rows} />
        )}

      </View>
    </AdminScreen>
  )
}
