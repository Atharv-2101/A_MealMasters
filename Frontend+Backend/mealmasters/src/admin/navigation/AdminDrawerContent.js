import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SectionTitle = ({ title }) => (
  <View style={styles.sectionWrap}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const DrawerItem = ({ label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.item, active ? styles.itemActive : null]}
    activeOpacity={0.85}
  >
    <Text style={[styles.itemText, active ? styles.itemTextActive : null]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const DropdownHeader = ({ label, expanded, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.dropdownHeader}>
    <Text style={styles.dropdownText}>{label}</Text>
    <Text style={styles.dropdownArrow}>{expanded ? "▾" : "▸"}</Text>
  </TouchableOpacity>
);

export default function AdminDrawerContent({ state, navigation }) {
  const nav = useNavigation();

  // Determine active route name
  const activeRouteName = useMemo(() => {
    const route = state?.routes?.[state.index];
    return route?.name || "";
  }, [state]);

  const [tiffinOpen, setTiffinOpen] = useState(true);
  const [ordersOpen, setOrdersOpen] = useState(true);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false)


  const go = (screen) => {
    if (
      screen === "NewOrders" ||
      screen === "ConfirmedOrders" ||
      screen === "CancelledOrders" ||
      screen === "AllOrders"
    ) {
      navigation.navigate("Orders", { screen });
    } else {
      navigation.navigate(screen);
    }

    nav.dispatch(DrawerActions.closeDrawer());
  };


  return (
    <View style={styles.container}>
      {/* Top Admin Profile */}
      <View style={styles.profileArea}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>A</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.adminName}>Admin </Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>
      </View>

      {/* Menu */}
      <ScrollView style={styles.menu} contentContainerStyle={{ paddingBottom: 30 }}>
        <SectionTitle title="GENERAL" />

        <DrawerItem
          label="Dashboard"
          active={activeRouteName === "AdminDashboard"}
          onPress={() => go("AdminDashboard")}
        />

        {/* TIFFIN dropdown */}
        <DropdownHeader
          label="Tiffin"
          expanded={tiffinOpen}
          onPress={() => setTiffinOpen((p) => !p)}
        />
        {tiffinOpen ? (
          <View style={styles.dropdownArea}>
            <DrawerItem
              label="Add Tiffin"
              active={activeRouteName === "AddTiffin"}
              onPress={() => go("AddTiffin")}
            />
            <DrawerItem
              label="Manage Tiffin"
              active={activeRouteName === "ManageTiffin"}
              onPress={() => go("ManageTiffin")}
            />
          </View>
        ) : null}

        {/* TIFFIN ORDER dropdown */}
        <DropdownHeader
          label="Tiffin Order"
          expanded={ordersOpen}
          onPress={() => setOrdersOpen((p) => !p)}
        />
        {ordersOpen ? (
          <View style={styles.dropdownArea}>
            <DrawerItem
              label="New Orders"
              active={activeRouteName === "NewOrders"}
              onPress={() => go("Orders")}
            />
            <DrawerItem
              label="Confirmed Orders"
              active={activeRouteName === "ConfirmedOrders"}
              onPress={() => go("Orders")}
            />
            <DrawerItem
              label="Cancelled Orders"
              active={activeRouteName === "CancelledOrders"}
              onPress={() => go("Orders")}
            />
            <DrawerItem
              label="All Orders"
              active={activeRouteName === "AllOrders"}
              onPress={() => go("Orders")}
            />
          </View>
        ) : null}

        <DrawerItem
          label="Invoices"
          active={activeRouteName === "InvoiceList" || activeRouteName === "InvoiceDetails"}
          onPress={() => go("InvoiceList")}
        />

        {/* ================= USERS DROPDOWN ================= */}
        <DropdownHeader
          label="Users"
          expanded={usersOpen}
          onPress={() => setUsersOpen((p) => !p)}
        />

        {usersOpen ? (
          <View style={styles.dropdownArea}>

            <DrawerItem
              label="Vendors Pending Status List"
              active={activeRouteName === "VendorListScreen"}
              onPress={() => go("VendorListScreen")}
            />

            <DrawerItem
              label="Registered Users"
              active={
                activeRouteName === "RegisteredUsers" ||
                activeRouteName === "UserDetails"
              }
              onPress={() => go("RegisteredUsers")}
            />

            <DrawerItem
              label="Vendor Users"
              active={
                activeRouteName === "VendorUsers" ||
                activeRouteName === "UserDetails"
              }
              onPress={() => go("VendorUsers")}
            />

            <DrawerItem
              label="Add New Delivery Person"
              active={activeRouteName === "AddDeliveryScreen"}
              onPress={() => go("AddDeliveryScreen")}
            />

          </View>
        ) : null}


        <DrawerItem
          label="Search Order"
          active={activeRouteName === "SearchOrder"}
          onPress={() => go("SearchOrder")}
        />

        <DrawerItem
          label="Search Invoice"
          active={activeRouteName === "SearchInvoice"}
          onPress={() => go("SearchInvoice")}
        />

        {/* Reports dropdown */}
        <DropdownHeader
          label="Reports"
          expanded={reportsOpen}
          onPress={() => setReportsOpen((p) => !p)}
        />
        {reportsOpen ? (
          <View style={styles.dropdownArea}>
            <DrawerItem
              label="Reports"
              active={activeRouteName === "Reports"}
              onPress={() => go("Reports")}
            />
          </View>
        ) : null}

        {/* Optional Logout */}
        <View style={{ height: 16 }} />
        <DrawerItem
          label="Logout"
          active={false}
          onPress={async () => {
            // clear login data
            await AsyncStorage.clear()

            // reset navigation to Home
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }]
            })
          }}
        />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f2233" },

  profileArea: {
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  avatarCircle: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: "#1a3b57",
    marginRight: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 22 },

  adminName: { color: "#fff", fontSize: 16, fontWeight: "700" },
  onlineRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  onlineDot: {
    height: 8,
    width: 8,
    borderRadius: 99,
    backgroundColor: "#2dd36f",
    marginRight: 6,
  },
  onlineText: { color: "#91c5a8", fontSize: 12 },

  menu: { flex: 1, paddingTop: 8 },

  sectionWrap: { paddingHorizontal: 16, paddingVertical: 10 },
  sectionTitle: { color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: "700" },

  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemActive: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderLeftWidth: 3,
    borderLeftColor: "#ff5a2c",
  },
  itemText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontWeight: "600",
  },
  itemTextActive: { color: "#fff" },

  dropdownHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: { color: "rgba(255,255,255,0.9)", fontWeight: "800" },
  dropdownArrow: { color: "rgba(255,255,255,0.8)", fontSize: 16, fontWeight: "800" },

  dropdownArea: {
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255,255,255,0.08)",
    marginLeft: 16,
    marginBottom: 6,
  },
});
