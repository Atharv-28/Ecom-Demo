import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES } from '../utils/theme';
import Button from '../components/Button';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  const profileMenuItems = [
    {
      id: 'wishlist',
      title: 'My Wishlist',
      icon: 'heart-outline',
      subtitle: 'View your favorite items',
      onPress: () => navigation.navigate('Wishlist'),
    },
    {
      id: 'orders',
      title: 'My Orders',
      icon: 'bag-outline',
      subtitle: 'View your order history',
      onPress: () => Alert.alert('Coming Soon', 'Order history feature coming soon!'),
    },
    {
      id: 'addresses',
      title: 'Addresses',
      icon: 'location-outline',
      subtitle: 'Manage shipping addresses',
      onPress: () => Alert.alert('Coming Soon', 'Address management feature coming soon!'),
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      icon: 'card-outline',
      subtitle: 'Manage your payment cards',
      onPress: () => Alert.alert('Coming Soon', 'Payment management feature coming soon!'),
    },
    {
      id: 'support',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      subtitle: 'Get help and contact support',
      onPress: () => Alert.alert('Support', 'Email: support@ecomdemo.com(false_id)\nPhone: +91 xxxxxxxxxx'),
    },
    {
      id: 'about',
      title: 'About',
      icon: 'information-circle-outline',
      subtitle: 'App version and info',
      onPress: () => Alert.alert('About', 'Ecom-Demo App\nVersion 1.0.0\nBuilt with React Native & Expo'),
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  const renderMenuItem = (item) => (
    <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuItemIcon}>
          <Ionicons name={item.icon} size={24} color={COLORS.primary} />
        </View>
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemTitle}>{item.title}</Text>
          <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {profileMenuItems.map(renderMenuItem)}
        </View>
        

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            title="Logout"
            onPress={handleLogout}
            style={styles.logoutButton}
            textStyle={styles.logoutButtonText}
          />
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Ecom Demo v1.0.0</Text>
          <Text style={styles.appInfoText}>Made with React Native by ATHARV TAMBEKAR</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.margin,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.margin * 1.5,
    backgroundColor: COLORS.white,
    marginTop: SIZES.margin / 2,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.margin,
  },
  userAvatarText: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin / 4,
  },
  userEmail: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: SIZES.margin,
    marginTop: SIZES.margin / 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.margin / 4,
  },
  statLabel: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SIZES.margin / 2,
  },
  menuSection: {
    backgroundColor: COLORS.white,
    marginTop: SIZES.margin / 2,
    paddingVertical: SIZES.margin / 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.margin,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.margin,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin / 4,
  },
  menuItemSubtitle: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  settingsSection: {
    backgroundColor: COLORS.white,
    marginTop: SIZES.margin / 2,
    paddingVertical: SIZES.margin,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.textPrimary,
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.margin / 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.margin / 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: SIZES.base,
    color: COLORS.textPrimary,
    marginLeft: SIZES.margin,
  },
  logoutSection: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.margin * 1.5,
  },
  logoutButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  logoutButtonText: {
    color: COLORS.error,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: SIZES.margin,
  },
  appInfoText: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: SIZES.margin / 4,
  },
});

export default ProfileScreen;
