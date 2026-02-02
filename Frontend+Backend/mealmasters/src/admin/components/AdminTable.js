import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

/**
 * Usage:
 * <AdminTable
 *   columns={["S.NO", "Order No", "Customer Name", "Action"]}
 *   rows={[
 *     ["1", "123", "Rahul", { type:"button", label:"View Details", onPress: ()=>{} }],
 *   ]}
 * />
 */

export default function AdminTable({ columns = [], rows = [] }) {
  return (
    <View style={styles.outer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.headerRow}>
            {columns.map((c, idx) => (
              <View key={idx} style={[styles.cell, styles.headerCell]}>
                <Text style={styles.headerText}>{c}</Text>
              </View>
            ))}
          </View>

          {/* Rows */}
          {rows.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No records found</Text>
            </View>
          ) : (
            rows.map((row, rIdx) => (
              <View
                key={rIdx}
                style={[
                  styles.dataRow,
                  rIdx % 2 === 0 ? styles.altRow : null,
                ]}
              >
                {row.map((col, cIdx) => {
                  // If column contains special action object
                  if (col && typeof col === "object" && col.type === "button") {
                    return (
                      <View key={cIdx} style={[styles.cell, styles.actionCell]}>
                        <TouchableOpacity
                          onPress={col.onPress}
                          style={[
                            styles.actionBtn,
                            col.variant === "success" ? styles.btnSuccess : styles.btnPrimary,
                          ]}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.btnText}>{col.label}</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }

                  return (
                    <View key={cIdx} style={styles.cell}>
                      <Text style={styles.cellText}>{String(col ?? "")}</Text>
                    </View>
                  );
                })}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    overflow: "hidden",
  },

  table: { minWidth: 920 },

  headerRow: {
    flexDirection: "row",
    backgroundColor: "#0b1f2e",
  },

  dataRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },

  altRow: { backgroundColor: "#fafbfc" },

  cell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    minWidth: 120,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "rgba(0,0,0,0.06)",
  },

  headerCell: { paddingVertical: 12 },
  headerText: { color: "#fff", fontWeight: "900", fontSize: 13 },

  cellText: { color: "#22313f", fontWeight: "600", fontSize: 13 },

  emptyWrap: { paddingVertical: 18, alignItems: "center" },
  emptyText: { color: "#6b7a88", fontWeight: "700" },

  actionCell: { minWidth: 160 },
  actionBtn: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnPrimary: { backgroundColor: "#0d6efd" },
  btnSuccess: { backgroundColor: "#198754" },
  btnText: { color: "#fff", fontWeight: "900", fontSize: 12 },
});
