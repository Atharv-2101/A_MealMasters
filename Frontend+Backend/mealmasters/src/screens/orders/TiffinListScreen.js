import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { getTiffinDetails, deleteTiffin } from '../../services/vendor'

export default function TiffinListScreen() {
  const [tiffins, setTiffins] = useState([])
  const navigation = useNavigation()

  useFocusEffect(
    useCallback(() => {
      loadTiffins();
    }, [])
  );

  const loadTiffins = async () => {
    try {
      const result = await getTiffinDetails()
      if (result?.status === 'success') {
        setTiffins(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch tiffins:", error);
    }
  }

  /* ================= DELETE ================= */
  const confirmDelete = (id) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Delete this tiffin?')) handleDelete(id)
      return
    }

    Alert.alert('Delete Tiffin', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => handleDelete(id) }
    ])
  }

  const handleDelete = async (id) => {
    const result = await deleteTiffin(id)
    if (result?.status === 'success') {
      setTiffins(prevTiffins => prevTiffins.filter(tiffin => tiffin.tiffin_id !== id));
      Alert.alert('Deleted', 'Tiffin deleted')
    }
  }

  /* ================= CARD ================= */
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* TITLE */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.badge}>
          {item.type === 'VEG' ? '🌱 Veg' : '🍗 Non-Veg'}
        </Text>
      </View>

      <Text style={styles.vendor}>🏪 {item.business_name}</Text>

      {/* PRICE + ACTIONS */}
      <View style={styles.bottomRow}>
        <Text style={styles.price}>₹ {item.cost}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('EditTiffin', { tiffin: item })
            }
          >
            <Ionicons name="create-outline" size={18} color="#FF7A00" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => confirmDelete(item.tiffin_id)}
          >
            <Ionicons name="trash-outline" size={18} color="#C62828" />
          </TouchableOpacity>
        </View>
      </View>

      {/* VIEW SUBSCRIPTIONS */}
      <TouchableOpacity
        style={styles.subBtn}
        onPress={() =>
          navigation.navigate('SubscriptionPlans', {
            tiffin_id: item.tiffin_id,
            tiffin_title: item.title
          })
        }
      >
        <Ionicons name="list-outline" size={18} color="#FF7A00" />
        <Text style={styles.subText}>View Subscription Plans</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <LinearGradient colors={['#FF9F43', '#FF7A00']} style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>My Tiffins</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {/* LIST */}
      <FlatList
        data={tiffins}
        keyExtractor={(i) => i.tiffin_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
      />

      {/* ADD TIFFIN */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTiffin')}
      >
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF7F0' },

  header: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    elevation: 6
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  title: { fontSize: 16, fontWeight: 'bold', color: '#222' },

  badge: { fontSize: 12, fontWeight: '600' },

  vendor: { marginTop: 6, color: '#FF7A00', fontWeight: '600' },

  bottomRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  price: { fontWeight: 'bold', fontSize: 15 },

  actions: { flexDirection: 'row', gap: 16 },

  /* SUB BUTTON */
  subBtn: {
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: '#FF7A00',
    borderRadius: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6
  },

  subText: {
    color: '#FF7A00',
    fontWeight: 'bold',
    fontSize: 14
  },

  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF7A00',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
