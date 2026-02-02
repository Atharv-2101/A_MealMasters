// import React, { useCallback, useEffect, useState } from 'react'
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator
// } from 'react-native'
// import { LinearGradient } from 'expo-linear-gradient'
// import { Ionicons } from '@expo/vector-icons'
// import { getVendorOrders } from '../../services/vendor'
// import { useFocusEffect } from '@react-navigation/native'

// /* ================= STATUS TABS ================= */
// const STATUS_TABS = [
//   'ALL',
//   'PENDING',
//   'APPROVED',
//   'DELIVERED',
//   'CANCELLED'
// ]

// export default function OrdersScreen({ navigation }) {
//   const [orders, setOrders] = useState([])
//   const [filteredOrders, setFilteredOrders] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [activeStatus, setActiveStatus] = useState('ALL')

//  useFocusEffect(
//     useCallback(() => {
//       loadOrders();
//     }, [])
//   );

//   useEffect(() => {
//     applyFilter(activeStatus)
//   }, [activeStatus, orders])

//   /* ================= LOAD ORDERS ================= */
//   const loadOrders = async () => {
//     const result = await getVendorOrders()

//     if (result?.status === 'success') {
//       setOrders(result.data)
//       setFilteredOrders(result.data)
//     } else {
//       setOrders([])
//       setFilteredOrders([])
//     }
//     setLoading(false)
//   }

//   /* ================= FILTER ================= */
//   const applyFilter = (status) => {
//     if (status === 'ALL') {
//       setFilteredOrders(orders)
//     } else {
//       setFilteredOrders(
//         orders.filter(
//           o => o.status?.toUpperCase() === status
//         )
//       )
//     }
//   }

//   /* ================= STATUS COLOR ================= */
//   const getStatusColor = (status) => {
//     switch (status?.toUpperCase()) {
//       case 'DELIVERED': return '#2E7D32'
//       case 'APPROVED': return '#1976D2'
//       case 'PENDING': return '#FF7A00'
//       case 'CANCELLED': return 'red'
//       default: return '#555'
//     }
//   }

//   /* ================= RENDER ORDER ================= */
//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       {/* Order Details */}
//       <TouchableOpacity
//         onPress={() =>
//           navigation.navigate('OrderDetails', {
//             orderId: item.order_id
//           })
//         }
//       >
//         <View style={styles.row}>
//           <Text style={styles.customer}>{item.customer_name}</Text>
//           <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
//             {item.status}
//           </Text>
//         </View>

//         <Text style={styles.text}>🍱 {item.tiffin_name}</Text>
//         <Text style={styles.text}>📦 Plan: {item.plan_type}</Text>
//         {/* <Text style={styles.date}>
//           📅 {item.start_date} → {item.end_date}
//         </Text> */}
//         <Text style={styles.date}>
//   📅 {new Date(item.start_date).toLocaleDateString()} ➡️ {new Date(item.end_date).toLocaleDateString()}
// </Text>
//       </TouchableOpacity>

//       {/* 🔥 ASSIGN DELIVERY (ONLY IF PENDING) */}
//       {item.status?.toUpperCase() === 'PENDING' && (
//         <TouchableOpacity
//           style={styles.assignBtn}
//           onPress={() =>
//             navigation.navigate('AssignDelivery', {
//               orderId: item.order_id
//             })
//           }
//         >
//           <Ionicons name="bicycle" size={16} color="#fff" />
//           <Text style={styles.assignText}>Assign Delivery Partner</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   )

//   return (
//     <View style={styles.container}>
//       {/* ================= HEADER ================= */}
//       <LinearGradient colors={['#FF9F43', '#FF7A00']} style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>Vendor Orders</Text>
//         <View style={{ width: 24 }} />
//       </LinearGradient>

//       {/* ================= STATUS TABS ================= */}
//       <View style={styles.tabs}>
//         {STATUS_TABS.map(status => (
//           <TouchableOpacity
//             key={status}
//             style={[
//               styles.tab,
//               activeStatus === status && styles.activeTab
//             ]}
//             onPress={() => setActiveStatus(status)}
//           >
//             <Text
//               style={[
//                 styles.tabText,
//                 activeStatus === status && styles.activeTabText
//               ]}
//             >
//               {status}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* ================= LIST ================= */}
//       {loading ? (
//         <ActivityIndicator
//           size="large"
//           color="#FF7A00"
//           style={{ marginTop: 40 }}
//         />
//       ) : (
//         <FlatList
//           data={filteredOrders}
//           keyExtractor={(item) => item.order_id.toString()}
//           renderItem={renderItem}
//           contentContainerStyle={{ padding: 16 }}
//           ListEmptyComponent={
//             <Text style={styles.empty}>
//               No {activeStatus.toLowerCase()} orders
//             </Text>
//           }
//         />
//       )}
//     </View>
//   )
// }

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFF3E8'
//   },

//   header: {
//     padding: 18,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center'
//   },

//   headerText: {
//     color: '#fff',
//     fontSize: 22,
//     fontWeight: 'bold'
//   },

//   /* TABS */
//   tabs: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     backgroundColor: '#fff',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderColor: '#ddd'
//   },

//   tab: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 20
//   },

//   activeTab: {
//     backgroundColor: '#FF7A00'
//   },

//   tabText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#555'
//   },

//   activeTabText: {
//     color: '#fff'
//   },

//   /* CARD */
//   card: {
//     backgroundColor: '#fff',
//     padding: 14,
//     borderRadius: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#000'
//   },

//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between'
//   },

//   customer: {
//     fontSize: 16,
//     fontWeight: 'bold'
//   },

//   status: {
//     fontSize: 12,
//     fontWeight: 'bold'
//   },

//   text: {
//     fontSize: 14,
//     marginTop: 4
//   },

//   date: {
//     fontSize: 12,
//     marginTop: 6,
//     color: '#555'
//   },

//   /* ASSIGN DELIVERY */
//   assignBtn: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#1976D2',
//     marginTop: 10,
//     paddingVertical: 8,
//     borderRadius: 8
//   },

//   assignText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     marginLeft: 6,
//     fontSize: 13
//   },

//   empty: {
//     textAlign: 'center',
//     marginTop: 40,
//     color: '#777'
//   }
// })





import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { getVendorOrders, markOrderDelivered } from '../../services/vendor' 
import { useFocusEffect } from '@react-navigation/native'

const STATUS_TABS = ['ALL', 'PENDING', 'APPROVED', 'DELIVERED', 'CANCELLED']

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeStatus, setActiveStatus] = useState('ALL')

  // Auto-reload data whenever user navigates back to this screen
  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  // Re-filter the list whenever orders data or active tab changes
  useEffect(() => {
    applyFilter(activeStatus)
  }, [activeStatus, orders])

  const loadOrders = async () => {
    const result = await getVendorOrders()
    if (result?.status === 'success') {
      setOrders(result.data)
    } else {
      setOrders([])
    }
    setLoading(false)
  }

  const applyFilter = (status) => {
    if (status === 'ALL') {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter(o => o.status?.toUpperCase() === status))
    }
  }

  /* ================= MARK AS DELIVERED LOGIC ================= */
  const handleMarkDelivered = async (orderId) => {
    Alert.alert("Confirm Delivery", "Confirm that this tiffin has reached the customer?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: async () => {
          const result = await markOrderDelivered(orderId);
          if (result?.status === 'success') {
            // Refresh the entire list from server to reflect the status change
            await loadOrders();
            // Automatically switch the UI tab to 'DELIVERED' to show the success
            // setActiveStatus('DELIVERED');
          } else {
            Alert.alert("Error", result?.error || "Could not update status");
          }
        }
      }
    ]);
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED': return '#2E7D32'
      case 'APPROVED': return '#1976D2'
      case 'PENDING': return '#FF7A00'
      case 'CANCELLED': return '#C62828'
      default: return '#555'
    }
  }

  const renderItem = ({ item }) => {
    const status = item.status?.toUpperCase();

    return (
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('OrderDetails', { orderId: item.order_id })}
        >
          <View style={styles.row}>
            <Text style={styles.customer}>{item.customer_name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) + '20' }]}>
               <Text style={[styles.status, { color: getStatusColor(status) }]}>{status}</Text>
            </View>
          </View>

          <Text style={styles.text}>🍱 {item.tiffin_name}</Text>
          <Text style={styles.text}>📦 Plan: {item.plan_type}</Text>
          <Text style={styles.date}>
            📅 {new Date(item.start_date).toLocaleDateString()} ➡️ {new Date(item.end_date).toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {/* 1. ASSIGN BUTTON - Only for Pending */}
        {status === 'PENDING' && (
          <TouchableOpacity
            style={styles.assignBtn}
            onPress={() => navigation.navigate('AssignDelivery', { orderId: item.order_id })}
          >
            <Ionicons name="bicycle" size={18} color="#fff" />
            <Text style={styles.btnText}>Assign Delivery Partner</Text>
          </TouchableOpacity>
        )}

        {/* 2. DELIVERED BUTTON - Only for Approved */}
        {status === 'APPROVED' && (
          <TouchableOpacity
            style={styles.deliveredBtn}
            onPress={() => handleMarkDelivered(item.order_id)}
          >
            <Ionicons name="checkmark-circle" size={18} color="#fff" />
            <Text style={styles.btnText}>Mark as Delivered</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#FF9F43', '#FF7A00']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Manage Orders</Text>
        <TouchableOpacity onPress={loadOrders}>
           <Ionicons name="refresh" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={STATUS_TABS}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tab, activeStatus === item && styles.activeTab]}
              onPress={() => setActiveStatus(item)}
            >
              <Text style={[styles.tabText, activeStatus === item && styles.activeTabText]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF7A00" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.order_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.empty}>No {activeStatus.toLowerCase()} orders found</Text>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7F0' },
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 20,
    paddingBottom: 20,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  tabsContainer: { backgroundColor: '#fff', paddingVertical: 12, elevation: 3 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 8 },
  activeTab: { backgroundColor: '#FF7A00' },
  tabText: { fontSize: 13, fontWeight: 'bold', color: '#555' },
  activeTabText: { color: '#fff' },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  customer: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  status: { fontSize: 11, fontWeight: 'bold' },
  text: { fontSize: 14, marginTop: 4, color: '#444' },
  date: { fontSize: 12, marginTop: 8, color: '#777', fontWeight: '500' },
  btnText: { color: '#fff', fontWeight: 'bold', marginLeft: 8, fontSize: 14 },
  assignBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 10
  },
  deliveredBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 10
  },
  empty: { textAlign: 'center', marginTop: 40, color: '#999', fontSize: 16 }
})