import 'react-native-gesture-handler' // MUST be first

import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

/* ================= SCREENS ================= */

// Home
import Home from './src/screens/Home'

// Auth
import Signin from './src/screens/auth/Signin'
import Signup from './src/screens/auth/Signup'
import VendorSignUp from './src/screens/auth/VendorSignUp'

// Dashboards
import CustomerDashboard from './src/screens/dashboards/CustomerDashboard'
import VendorDashboard from './src/screens/dashboards/VendorDashboard'

// Customer
import TiffinPlans from './src/screens/customer/TiffinPlans'
import OrderHistory from './src/screens/customer/OrderHistory'
import CustomerProfile from './src/screens/customer/CustomerProfile'
import MySubscriptions from './src/screens/customer/MySubscriptions'
import DeliveryDetails from './src/screens/customer/DeliveryDetails'
import TiffinDetails from './src/screens/customer/TiffinDetails'

// Admin
import AdminDrawer from './src/admin/navigation/AdminDrawer'
import AdminEntry from './src/admin/navigation/AdminEntry'
import OrdersScreen from './src/screens/orders/OrdersScreen'
import OrderDetailsScreen from './src/screens/orders/OrderDetailsScreen'
import VendorProfile from './src/screens/orders/VendorProfile'
import AddTiffin from './src/screens/orders/AddTiffin'
import AssignDelivery from './src/screens/orders/AssignDelivery'
import TiffinListScreen from './src/screens/orders/TiffinListScreen'
import EditTiffinScreen from './src/screens/orders/EditTiffinScreen'
import SubscriptionPlansScreen from './src/screens/orders/SubscriptionPlansScreen'
import UpdateSubscriptionPlanScreen from './src/screens/orders/UpdateSubscriptionPlan'
import { StatusBar } from 'react-native'



const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={false} />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Home"
        >
          {/* ===== PUBLIC ===== */}
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Signin" component={Signin} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="VendorSignUp" component={VendorSignUp} />

          {/* ===== USER DASHBOARDS ===== */}
          <Stack.Screen name="CustomerDashboard" component={CustomerDashboard} />
          <Stack.Screen name="VendorDashboard" component={VendorDashboard} />

          {/* ===== CUSTOMER FLOWS ===== */}
          <Stack.Screen name="TiffinDetails" component={TiffinDetails} />
          <Stack.Screen name="TiffinPlans" component={TiffinPlans} />
          <Stack.Screen name="OrderHistory" component={OrderHistory} />
          <Stack.Screen name="CustomerProfile" component={CustomerProfile} />
          <Stack.Screen name="MySubscriptions" component={MySubscriptions} />
          <Stack.Screen name="DeliveryDetails" component={DeliveryDetails} />

          <Stack.Screen name='OrdersScreen' component={OrdersScreen}/>
          <Stack.Screen name='OrderDetails' component={OrderDetailsScreen}/>
          <Stack.Screen name='VendorProfile' component={VendorProfile}/>
          <Stack.Screen name='AddTiffin' component={AddTiffin}/>
          <Stack.Screen name="AssignDelivery" component={AssignDelivery} />
          <Stack.Screen name='TiffinListScreen' component={TiffinListScreen}/>
          <Stack.Screen name='EditTiffin' component={EditTiffinScreen}/>
          <Stack.Screen name="SubscriptionPlans" component={SubscriptionPlansScreen} />
          <Stack.Screen name='UpdateSubscriptionPlanScreen' component={UpdateSubscriptionPlanScreen}/>



          {/* ===== ADMIN ===== */}
          <Stack.Screen name="AdminEntry" component={AdminEntry} />
          <Stack.Screen name="AdminDrawer" component={AdminDrawer} />

        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}
