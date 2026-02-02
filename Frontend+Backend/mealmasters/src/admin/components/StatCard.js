import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function StatCard({ icon = "■", value = "0", label = "Label" }) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    minHeight: 110,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  icon: {
    fontSize: 32,
    marginBottom: 6,
  },
  value: {
    fontSize: 22,
    fontWeight: "800",
    color: "#12212d",
    marginBottom: 2,
  },
  label: {
    fontSize: 13,
    color: "#738494",
    fontWeight: "700",
    textAlign: "center",
  },
});
