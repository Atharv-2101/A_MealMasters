import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import AdminScreen from "../../components/AdminScreen";
import StatCard from "../../components/StatCard";
import api from "../../services/api";

export default function DashboardScreen() {
  const [stats, setStats] = useState({
    totalTiffin: 0,
    newOrders: 0,
    confirmedOrders: 0,
    cancelledOrders: 0,
    allOrders: 0,
    totalUsers: 0,
    totalInvoices: 0,
  });

  useEffect(() => {
    api.get("/admin/dashboard")
      .then(res => {
        console.log("DASHBOARD FRONTEND:", res.data);
        if (res.data.status === "success") {
          setStats(res.data.data);
        }
      })
      .catch(err => console.log("Dashboard error:", err));
  }, []);

  return (
    <AdminScreen title="Dashboard">
      <View style={styles.grid}>

        <View style={styles.row}>
          <StatCard icon="🍱" value={stats.totalTiffin} label="Total Listed Tiffin" />
          <StatCard icon="🆕" value={stats.newOrders} label="New Order" />
        </View>

        <View style={styles.row}>
          <StatCard icon="✅" value={stats.confirmedOrders} label="Confirmed Order" />
          <StatCard icon="❌" value={stats.cancelledOrders} label="Canceled Order" />
        </View>

        <View style={styles.row}>
          <StatCard icon="📦" value={stats.allOrders} label="All Order" />
          <StatCard icon="👤" value={stats.totalUsers} label="Total Registered Users" />
        </View>

        <View style={styles.row}>
          <StatCard icon="🧾" value={stats.totalInvoices} label="Total Invoice Generated" />
          <View style={{ flex: 1 }} />
        </View>

      </View>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  grid: { flex: 1, gap: 12 },
  row: { flexDirection: "row", gap: 12 },
});
