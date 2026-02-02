import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import NewOrdersScreen from "../screens/Orders/NewOrdersScreen";
import ConfirmedOrdersScreen from "../screens/Orders/ConfirmedOrdersScreen";
import CancelledOrdersScreen from "../screens/Orders/CancelledOrdersScreen";
import AllOrdersScreen from "../screens/Orders/AllOrdersScreen";
import OrderDetailsScreen from "../screens/Orders/OrderDetailsScreen";

const Stack = createNativeStackNavigator();

export default function OrdersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NewOrders" component={NewOrdersScreen} />
      <Stack.Screen name="ConfirmedOrders" component={ConfirmedOrdersScreen} />
      <Stack.Screen name="CancelledOrders" component={CancelledOrdersScreen} />
      <Stack.Screen name="AllOrders" component={AllOrdersScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
    </Stack.Navigator>
  );
}
