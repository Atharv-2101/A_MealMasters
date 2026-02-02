import React, { useState, useCallback } from "react";
import { FlatList, Text, StyleSheet, TouchableOpacity, View, Alert } from "react-native";
import AdminScreen from "../../components/AdminScreen";
import { getTiffins, deleteTiffin } from "../../services/tiffin";
import { useFocusEffect } from "@react-navigation/native";

export default function ManageTiffinScreen() {
  const [tiffins, setTiffins] = useState([]);

  // Load tiffins
  const loadTiffins = async () => {
    try {
      const res = await getTiffins();
      if (res.data.status === "success") {
        setTiffins(res.data.data || []);
      } else {
        setTiffins([]);
      }
    } catch (err) {
      console.log("Tiffin Load Error:", err);
      setTiffins([]);
    }
  };

  // Reload whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadTiffins();
    }, [])
  );

  const removeTiffin = (id) => {
    Alert.alert("Confirm", "Delete this tiffin?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          await deleteTiffin(id);
          Alert.alert("Deleted");
          loadTiffins();
        },
      },
    ]);
  };

  return (
    <AdminScreen title="Manage Tiffins">
      {tiffins.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 40 }}>
          No tiffins found
        </Text>
      ) : (
        <FlatList
          data={tiffins}
          keyExtractor={(i) => i.tiffin_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text>Type: {item.type}</Text>
              <Text>Vendor: {item.business_name || "N/A"}</Text>
              <Text>₹ {item.cost}</Text>

              <View style={styles.actions}>
                <TouchableOpacity onPress={() => removeTiffin(item.tiffin_id)}>
                  <Text style={{ color: "red" }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
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
  title: {
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    marginTop: 6,
  },
});
