import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native";

export default function AdminScreen({
  title = "",
  children,
  footer = true,
}) {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        {/* Hamburger */}
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          activeOpacity={0.8}
        >
          <Text style={styles.menuBtnText}>≡</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Online Tiffin Service System</Text>
        </View>

        {/* Right area (Notification + Admin) */}
        <View style={styles.headerRight}>
          <View style={styles.bellWrap}>
            <Text style={styles.bell}>🔔</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>0</Text>
            </View>
          </View>

          <View style={styles.userWrap}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>A</Text>
            </View>
            <Text style={styles.userText}>Admin</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentWrap}>
        {title ? <Text style={styles.pageTitle}>{title}</Text> : null}

        <View style={styles.pageBody}>{children}</View>

        {footer ? (
          <View style={styles.footer}>
            <Text style={styles.footerText}>Online Tiffin Service System</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f2f4f7" },

  header: {
    height: 58,
    backgroundColor: "#0b1f2e",
    flexDirection: "row",
    alignItems: "center",
  },

  menuBtn: {
    width: 58,
    height: 58,
    backgroundColor: "#ff5a2c",
    alignItems: "center",
    justifyContent: "center",
  },
  menuBtnText: { fontSize: 26, fontWeight: "900", color: "#fff", marginTop: -2 },

  headerCenter: { flex: 1, paddingHorizontal: 12 },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "800" },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingRight: 10,
  },

  bellWrap: { position: "relative", paddingHorizontal: 8, paddingVertical: 4 },
  bell: { fontSize: 18 },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    height: 16,
    minWidth: 16,
    borderRadius: 10,
    backgroundColor: "#ff3b30",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },

  userWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff5a2c",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  userAvatar: {
    height: 26,
    width: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  userAvatarText: { color: "#fff", fontWeight: "900" },
  userText: { color: "#fff", fontWeight: "800" },

  contentWrap: { flex: 1, paddingHorizontal: 16, paddingTop: 14 },

  pageTitle: { fontSize: 22, fontWeight: "800", marginBottom: 12, color: "#12212d" },

  pageBody: { flex: 1 },

  footer: {
    height: 44,
    backgroundColor: "#fff",
    marginTop: 16,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  footerText: { color: "#617486", fontWeight: "700" },
});
