import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import CustomersScreen from '../screens/CustomersScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderItemsScreen from '../screens/OrderItemsScreen';
import SimpleListScreen from '../screens/SimpleListScreen';

import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1E3A5F',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: '#F4F7FB',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Strona główna' }}
        />
        <Stack.Screen
          name="Products"
          component={ProductsScreen}
          options={{ title: 'Products' }}
        />
        <Stack.Screen
          name="Customers"
          component={CustomersScreen}
          options={{ title: 'Customers' }}
        />
        <Stack.Screen
          name="Categories"
          component={CategoriesScreen}
          options={{ title: 'Categories' }}
        />
        <Stack.Screen
          name="Orders"
          component={OrdersScreen}
          options={{ title: 'Orders' }}
        />
        <Stack.Screen
          name="OrderItems"
          component={OrderItemsScreen}
          options={{ title: 'Order Items' }}
        />
        <Stack.Screen
          name="SimpleList"
          component={SimpleListScreen}
          options={{ title: 'Lista encji' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;