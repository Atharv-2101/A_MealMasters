import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Pressable
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getAllTiffins } from '../../services/auth'
import { config } from '../../services/config'

export default function CustomerDashboard({ navigation }) {
  const [tiffins, setTiffins] = useState([])
  const [filteredTiffins, setFilteredTiffins] = useState([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [activeFilter, setActiveFilter] = useState('ALL')

  useEffect(() => {
    loadUser()
    loadTiffins()
  }, [])

  /* ================= LOAD USER ================= */
  const loadUser = async () => {
    const name = await AsyncStorage.getItem('userName')
    if (name) setUserName(name)
  }

  /* ================= LOAD TIFFINS ================= */
  const loadTiffins = async () => {
    try {
      const result = await getAllTiffins()
      if (result?.status === 'success') {
        setTiffins(result.data)
        setFilteredTiffins(result.data)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  /* ================= FILTER ================= */
  const applyFilter = (type) => {
    setActiveFilter(type)
    if (type === 'ALL') {
      setFilteredTiffins(tiffins)
    } else {
      setFilteredTiffins(
        tiffins.filter(
          item => item.type?.toUpperCase() === type
        )
      )
    }
  }

  /* ================= LOGOUT ================= */
  const logout = async () => {
    await AsyncStorage.clear()
    navigation.reset({
      index: 0,
      routes: [{ name: 'Signin' }]
    })
  }

  /* ================= TIFFIN CARD ================= */
  const renderItem = ({ item }) => {
    const imageUrl = item.image
      ? `${config.url}/uploads/tiffin_images/${item.image}`
      : 'https://via.placeholder.com/300'

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate('TiffinDetails', { tiffin: item })
        }
      >
        <View style={styles.tiffinCard}>
          <Image source={{ uri: imageUrl }} style={styles.tiffinImage} />

          <View style={styles.tiffinInfo}>
            <Text style={styles.tiffinTitle}>{item.title}</Text>

            {/* VEG / NONVEG */}
            <View style={styles.typeRow}>
              <View
                style={[
                  styles.typeDot,
                  item.type === 'VEG'
                    ? styles.vegDot
                    : styles.nonVegDot
                ]}
              />
              <Text style={styles.typeText}>
                {item.type === 'VEG' ? 'Veg' : 'Non-Veg'}
              </Text>
            </View>

            <Text style={styles.vendor}>{item.business_name}</Text>

            <Text style={styles.desc} numberOfLines={2}>
              {item.description}
            </Text>

            <Text style={styles.extraInfo}>
              🍛 Home-style • Fresh • Hygienic
            </Text>

            <View style={styles.bottomRow}>
              <Text style={styles.price}>₹ {item.cost}</Text>

              <TouchableOpacity
                style={styles.cartBtn}
                onPressIn={(e) => e.stopPropagation?.()}
                onPress={() =>
                  navigation.navigate('TiffinPlans', {
                    tiffinId: item.tiffin_id,
                    title: item.title
                  })
                }
              >
                <Text style={styles.cartText}>ADD</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <Pressable style={styles.root} onPress={() => setShowMenu(false)}>
      {/* ================= HEADER ================= */}
      <LinearGradient colors={['#FF9F43', '#FF7A00']} style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome back 👋</Text>
          <Text style={styles.username}>{userName}</Text>
          <Text style={styles.subWelcome}>
            What would you like to eat today?
          </Text>
        </View>

        <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
          <Ionicons name="person-circle-outline" size={44} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* ================= MENU ================= */}
      {showMenu && (
        <View style={styles.menu}>
          <MenuItem icon="person" label="My Profile" onPress={() => navigation.navigate('CustomerProfile')} />
          <MenuItem icon="restaurant" label="Tiffin List" onPress={() => setShowMenu(false)} />
          <MenuItem icon="receipt" label="Order History" onPress={() => navigation.navigate('OrderHistory')} />
          <MenuItem icon="calendar" label="Subscriptions" onPress={() => navigation.navigate('MySubscriptions')} />

          <MenuItem icon="log-out" label="Logout" onPress={logout} />
        </View>
      )}

      {/* ================= FILTER CHIPS ================= */}
      <View style={styles.filterRow}>
        <FilterBtn label="All" active={activeFilter === 'ALL'} onPress={() => applyFilter('ALL')} />
        <FilterBtn label="Veg 🌱" active={activeFilter === 'VEG'} onPress={() => applyFilter('VEG')} />
        <FilterBtn label="Non-Veg 🍗" active={activeFilter === 'NONVEG'} onPress={() => applyFilter('NONVEG')} />
      </View>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <ActivityIndicator size="large" color="#FF7A00" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredTiffins}
          keyExtractor={(item) => item.tiffin_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.empty}>No items found</Text>
          }
        />
      )}
    </Pressable>
  )
}

/* ================= FILTER BUTTON ================= */
const FilterBtn = ({ label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.filterBtn, active && styles.filterActive]}
  >
    <Text style={[styles.filterText, active && styles.filterTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
)

/* ================= MENU ITEM ================= */
const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={18} color="#333" />
    <Text style={styles.menuText}>{label}</Text>
  </TouchableOpacity>
)

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF7F0' },

  header: {
    paddingTop: 24,
    paddingBottom: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 6
  },

  welcome: { color: '#FFE6D5', fontSize: 16,fontWeight: 'bold' },
  username: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  subWelcome: { color: '#FFF0E5', fontSize: 12 },

  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 10
  },

  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FF7A00'
  },

  filterActive: { backgroundColor: '#FF7A00' },
  filterText: { color: '#FF7A00', fontWeight: '600' },
  filterTextActive: { color: '#fff' },

  tiffinCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 20,
    padding: 14,
    elevation: 6
  },

  tiffinImage: { width: 120, height: 120, borderRadius: 14 },
  tiffinInfo: { flex: 1, paddingLeft: 14 },

  tiffinTitle: { fontSize: 17, fontWeight: 'bold', color: '#222' },
  vendor: { fontSize: 13, color: '#FF7A00', fontWeight: '600' },
  desc: { fontSize: 13, color: '#666', marginTop: 4 },
  extraInfo: { fontSize: 12, color: '#888', marginTop: 4 },

  typeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  typeDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  vegDot: { backgroundColor: '#2E7D32' },
  nonVegDot: { backgroundColor: '#C62828' },
  typeText: { fontSize: 12, fontWeight: '600', color: '#555' },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },

  price: { fontSize: 16, fontWeight: 'bold' },

  cartBtn: {
    borderWidth: 1.5,
    borderColor: '#FF7A00',
    paddingVertical: 6,
    paddingHorizontal: 22,
    borderRadius: 20
  },

  cartText: { color: '#FF7A00', fontWeight: 'bold', fontSize: 13 },

  menu: {
    position: 'absolute',
    top: 80,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 200,
    zIndex: 999,
    borderWidth: 1,
    borderColor: '#ddd'
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 0.5,
    borderColor: '#eee'
  },

  menuText: { marginLeft: 10, fontWeight: '600' },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#777'
  }
})
