import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  StatusBar,
  Platform,
  Alert
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'

/* ================= SAFE STATUS BAR ================= */
const STATUS_BAR_HEIGHT =
  Platform.OS === 'android' && typeof StatusBar.currentHeight === 'number'
    ? StatusBar.currentHeight
    : 0

/* ================= LOCAL IMAGES ================= */

const sliderImages = [
  require('../../assets/menus/tiffin1.jpg'),
  require('../../assets/menus/tiffin2.jpg'),
  require('../../assets/menus/tiffin3.jpeg')
]

const services = [
  { title: 'Home Made Food', img: require('../../assets/menus/tiffin1.jpg') },
  { title: 'Monthly Plans', img: require('../../assets/services/hygenic.jpg') },
  { title: 'Fast Delivery', img: require('../../assets/services/delivery.png') },
  { title: 'Hygienic Packing', img: require('../../assets/services/hygenic.jpg') }
]

const todaysMenu = [
  { title: 'Veg Thali', img: require('../../assets/menus/tiffin1.jpg') },
  { title: 'Dal Rice', img: require('../../assets/menus/tiffin2.jpg') },
  { title: 'Chapati Sabji', img: require('../../assets/menus/tiffin3.jpeg') }
]

/* ================= SCREEN ================= */

export default function HomeScreen() {
  const navigation = useNavigation()
  const { width } = useWindowDimensions()
  const scrollRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [showSignup, setShowSignup] = useState(false)

  //Contact Us
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // Check if any field is empty or just whitespace
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert("Error", "Please fill in all fields before submitting.");
      return;
    }

    // Basic Email Validation
    if (!email.includes('@')) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    // 3. Success Action
    Alert.alert("Success", "Your message has been sent!");
    
    // Clear the fields after success
    setName('');
    setEmail('');
    setMessage('');
  };

  /* ===== AUTO SLIDER ===== */
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => {
        const next = (prev + 1) % sliderImages.length
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            x: next * width,
            animated: true
          })
        }
        return next
      })
    }, 3000)

    return () => clearInterval(timer)
  }, [width])

  return (
    <View style={[styles.root, { paddingTop: STATUS_BAR_HEIGHT }]}>
      {/* ================= HEADER ================= */}
      <LinearGradient colors={['#FF9F43', '#FF7A00']} style={styles.header}>
        <Text style={styles.logo}>MealMasters</Text>

        <View style={styles.headerButtons}>
          <HeaderButton
            title="Login"
            onPress={() => navigation.navigate('Signin')}
          />

          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => setShowSignup(!showSignup)}
            activeOpacity={0.7}
          >
            <Text style={styles.headerBtnText}>Signup ▼</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* ================= SIGNUP DROPDOWN ================= */}
      {showSignup === true && (
        <View
          style={[
            styles.dropdownFloating,
            {
              top: STATUS_BAR_HEIGHT + 60,
              width: Math.min(width * 0.45, 180)
            }
          ]}
        >
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              setShowSignup(false)
              navigation.navigate('Signup')
            }}
          >
            <Text style={styles.dropdownText}>Customer Signup</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              setShowSignup(false)
              navigation.navigate('VendorSignUp')
            }}
          >
            <Text style={styles.dropdownText}>Vendor Signup</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ================= CONTENT ================= */}
      <ScrollView style={styles.container}>
        {/* ===== SLIDER ===== */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        >
          {sliderImages.map((img, i) => (
            <Image
              key={i}
              source={img}
              style={{ width, height: width * 0.6 }}
            />
          ))}
        </ScrollView>

        {/* ===== ABOUT ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleCenter}>About Us</Text>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutText}>
              MealMasters connects you with local home chefs to deliver fresh, hygienic, and affordable tiffin meals daily. 
              We bridge the gap between busy lives and the comfort of home-cooked food, prioritizing nutrition and authentic 
              flavors over commercial fast food. By empowering local culinary talent, we bring wholesome, balanced dining straight 
              to your doorstep. It’s more than just a meal; it’s the warmth and quality of home in every tiffin box.
            </Text>
            <Image source={sliderImages[0]} style={styles.aboutImg} />
          </View>
        </View>

        {/* ===== SERVICES ===== */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitleCenterWhite}>Our Services</Text>
          <View style={styles.serviceRow}>
            {services.map((item, i) => (
              <View key={i} style={styles.serviceCard}>
                <Image source={item.img} style={styles.serviceImg} />
                <Text style={styles.serviceText}>{item.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ===== TODAY MENU ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleCenter}>Today's Menu</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {todaysMenu.map((item, i) => (
              <View key={i} style={styles.menuCard}>
                <Image source={item.img} style={styles.menuImg} />
                <Text style={styles.menuText}>{item.title}</Text>
                <TouchableOpacity
                  style={styles.orderBtn}
                  onPress={() => navigation.navigate('Signin')}
                >
                  <Text style={styles.orderBtnText}>Order Now</Text>
                </TouchableOpacity>

              </View>
            ))}
          </ScrollView>
        </View>

        {/* ===== CONTACT ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleCenter}>Contact Us</Text>
          <TextInput 
        placeholder="Name" 
        style={styles.input} 
        value={name}
        onChangeText={setName} 
      />
      
      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput 
        placeholder="Message" 
        multiline 
        style={styles.textArea} 
        value={message}
        onChangeText={setMessage}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
        </View>

        {/* ===== FOOTER ===== */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 MealMasters</Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  )
}

/* ================= HEADER BUTTON ================= */

const HeaderButton = ({ title, onPress }) => (
  <TouchableOpacity
    style={styles.headerBtn}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.headerBtnText}>{title}</Text>
  </TouchableOpacity>
)

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { backgroundColor: '#FFF7F0' },

  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  logo: { color: '#fff', fontSize: 21, fontWeight: 'bold' },
  headerButtons: { flexDirection: 'row' },

  headerBtn: {
    marginLeft: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8
  },

  headerBtnText: { color: '#FF7A00', fontWeight: 'bold' },

  dropdownFloating: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 10,
    zIndex: 999
  },

  dropdownItem: {
    paddingVertical: 13,
    borderBottomWidth: 0.5,
    borderColor: '#eee'
  },

  dropdownText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600'
  },

  section: { paddingVertical: 26, paddingHorizontal: 20 },

  sectionTitleCenter: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18
  },

  sectionTitleCenterWhite: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff'
  },

  aboutRow: { flexDirection: 'row', flexWrap: 'wrap' },
  aboutText: { flex: 1, color: '#555', paddingRight: 10, fontWeight:'' },
  aboutImg: { flex: 1, height: 150, borderRadius: 12 },

  servicesSection: {
    backgroundColor: '#FF7A00',
    paddingVertical: 30,
    paddingHorizontal: 20
  },

  serviceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },

  serviceCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    alignItems: 'center'
  },

  serviceImg: { width: '100%', height: 90, borderRadius: 10 },
  serviceText: { marginTop: 10, fontWeight: 'bold' },

  menuCard: {
    marginRight: 16,
    backgroundColor: '#FFF2E8',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    minHeight: 220,
    width: 160
  },

  menuImg: { width: '100%', height: 100, borderRadius: 12 },
  menuText: { marginTop: 10, fontWeight: 'bold' },

  orderBtn: {
    marginTop: 10,
    backgroundColor: '#FF7A00',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20
  },

  orderBtnText: { color: '#fff', fontWeight: 'bold' },

  input: {
    backgroundColor: '#f4f2f1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12
  },

  textArea: {
    height: 90,
    backgroundColor: '#f4f2f1',
    borderRadius: 10,
    padding: 12,
    textAlignVertical: 'top'
  },

  footer: {
    padding: 16,
    backgroundColor: '#FFE8D6',
    alignItems: 'center'
  },

  footerText: { color: '#666' },
  submitBtn: { backgroundColor: '#FF7A00', padding: 15, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: 'bold' }
})