import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AdminScreen from "../../components/AdminScreen";
import api from "../../services/api";

export default function VendorListScreen() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    const res = await api.get("/admin/pendingVendors");
    if (res.data.status === "success") setVendors(res.data.data);
  };

  const approveVendor = async (id) => {
    await api.put(`/admin/approveVendor/${id}`);
    loadVendors();
  };

  const deleteVendor = async (id) => {
    Alert.alert("Confirm", "Delete vendor?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          await api.delete(`/admin/deleteVendor/${id}`);
          loadVendors();
        },
      },
    ]);
  };

  return (
    <AdminScreen title="Vendors">
      <FlatList
        data={vendors}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>{item.email}</Text>
            <Text>Status: {item.status}</Text>

            <View style={styles.row}>
              {item.status !== "active" && (
                <TouchableOpacity onPress={() => approveVendor(item.id)}>
                  <Text style={{ color: "green" }}>Approve</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => deleteVendor(item.id)}>
                <Text style={{ color: "red" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
  },
  title: { fontWeight: "bold" },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
});