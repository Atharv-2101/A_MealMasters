import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function AdminEntry({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.replace("Admin")}>
        <Text style={styles.btnText}>Open Admin Interface</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 18 },
  btn: {
    backgroundColor: "#0d6efd",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontWeight: "700" },
});
