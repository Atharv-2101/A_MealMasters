import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { config } from '../../services/config'

export default function TiffinDetails({ route, navigation }) {
  const { tiffin } = route.params

  const imageUrl = tiffin.image
    ? `${config.url}/uploads/tiffin_images/${tiffin.image}`
    : 'https://via.placeholder.com/400'

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
        <Text style={styles.headerText}>Tiffin Details</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* IMAGE */}
        <Image source={{ uri: imageUrl }} style={styles.image} />

        {/* DETAILS */}
        <View style={styles.content}>
          <Text style={styles.title}>{tiffin.title}</Text>
          <Text style={styles.vendor}>{tiffin.business_name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹ {tiffin.cost}</Text>
            <Text style={styles.badge}>Best Seller</Text>
          </View>

          <Text style={styles.section}>About this meal</Text>
          <Text style={styles.desc}>{tiffin.description}</Text>

          {/* ADD BUTTON */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.addBtn}
            onPress={() =>
              navigation.navigate('TiffinPlans', {
                tiffinId: tiffin.tiffin_id,
                title: tiffin.title
              })
            }
          >
            <Text style={styles.addText}>ADD TO CART</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFF7F0'
  },

  /* HEADER */
  header: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold'
  },

  /* IMAGE */
  image: {
    paddingTop:18,
    width: '100%',
    height: 260,
    resizeMode: 'cover'
  },

  /* CONTENT */
  content: {
    backgroundColor: '#fff',
    marginTop: -24,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 20,
    elevation: 6
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222'
  },

  vendor: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#FF7A00'
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14
  },

  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000'
  },

  badge: {
    marginLeft: 10,
    backgroundColor: '#E8FFF0',
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },

  section: {
    marginTop: 22,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },

  desc: {
    marginTop: 6,
    fontSize: 14,
    color: '#555',
    lineHeight: 22
  },

  /* ADD BUTTON */
  addBtn: {
    marginTop: 30,
    backgroundColor: '#FF7A00',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 4
  },

  addText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1
  }
})
