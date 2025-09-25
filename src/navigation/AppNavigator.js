import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

import { COLORS, SIZES } from '../utils/theme';
import { SCREEN_NAMES } from '../utils/constants';
import { useApp } from '../context/AppContext';

// Import screens (we'll create these next)
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProductListScreen from '../screens/ProductListScreen';
import SearchScreen from '../screens/SearchScreen';
import WishlistScreen from '../screens/WishlistScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Temporary placeholder component for screens we haven't created yet
const PlaceholderScreen = ({ title }) => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>{title} Screen</Text>
    <Text style={styles.placeholderSubText}>Coming soon...</Text>
  </View>
);

// Bottom Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case SCREEN_NAMES.HOME:
              iconName = focused ? 'home' : 'home-outline';
              break;
            case SCREEN_NAMES.CATEGORIES:
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case SCREEN_NAMES.CART:
              iconName = focused ? 'bag' : 'bag-outline';
              break;
            case SCREEN_NAMES.PROFILE:
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.lightGray,
          height: SIZES.tabBarHeight,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: SIZES.xs,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name={SCREEN_NAMES.HOME} 
        component={() => <PlaceholderScreen title="Home" />} 
      />
      <Tab.Screen 
        name={SCREEN_NAMES.CATEGORIES} 
        component={() => <PlaceholderScreen title="Categories" />} 
      />
      <Tab.Screen 
        name={SCREEN_NAMES.CART} 
        component={() => <PlaceholderScreen title="Cart" />} 
      />
      <Tab.Screen 
        name={SCREEN_NAMES.PROFILE} 
        component={() => <PlaceholderScreen title="Profile" />} 
      />
    </Tab.Navigator>
  );
}

// Auth Stack Navigator (Login/Register screens)
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: SIZES.lg,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name={SCREEN_NAMES.LOGIN} 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.REGISTER} 
        component={RegisterScreen}
        options={{ 
          title: 'Create Account',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

// Main Stack Navigator
function AppNavigator() {
  const { isLoggedIn } = useApp();

  return (
    <NavigationContainer>
      {!isLoggedIn ? (
        <AuthStack />
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.white,
            },
            headerTintColor: COLORS.textPrimary,
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: SIZES.lg,
            },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen 
            name="MainTabs" 
            component={TabNavigator} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name={SCREEN_NAMES.PRODUCT_DETAIL} 
            component={() => <PlaceholderScreen title="Product Detail" />}
            options={{ title: 'Product Details' }}
          />
          <Stack.Screen 
            name={SCREEN_NAMES.PRODUCT_LIST} 
            component={() => <PlaceholderScreen title="Product List" />}
            options={{ title: 'Products' }}
          />
          <Stack.Screen 
            name={SCREEN_NAMES.SEARCH} 
            component={() => <PlaceholderScreen title="Search" />}
            options={{ title: 'Search Products' }}
          />
          <Stack.Screen 
            name={SCREEN_NAMES.WISHLIST} 
            component={() => <PlaceholderScreen title="Wishlist" />}
            options={{ title: 'My Wishlist' }}
          />
          <Stack.Screen 
            name={SCREEN_NAMES.CHECKOUT} 
            component={() => <PlaceholderScreen title="Checkout" />}
            options={{ title: 'Checkout' }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  placeholderText: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin / 2,
  },
  placeholderSubText: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
  },
});

export default AppNavigator;
