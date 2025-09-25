import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';

const Header = ({
  title,
  subtitle,
  showBack = false,
  showSearch = false,
  showCart = false,
  showProfile = false,
  onBackPress,
  onSearchPress,
  onCartPress,
  onProfilePress,
  style,
}) => {
  const { totalItems, user } = useApp();

  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <View style={styles.container}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onBackPress}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          )}
        </View>

        {/* Center Section - Title when showing back button */}
        {showBack && (
          <View style={styles.centerSection}>
            <Text style={styles.centerTitle}>{title}</Text>
          </View>
        )}

        {/* Right Section */}
        <View style={styles.rightSection}>
          {showSearch && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onSearchPress}
            >
              <Ionicons name="search-outline" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          )}

          {showCart && (
            <TouchableOpacity
              style={[styles.iconButton, styles.cartButton]}
              onPress={onCartPress}
            >
              <Ionicons name="bag-outline" size={24} color={COLORS.textPrimary} />
              {totalItems > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {totalItems > 99 ? '99+' : totalItems}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {showProfile && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onProfilePress}
            >
              {user?.avatar ? (
                <Image 
                  source={{ uri: user.avatar }} 
                  style={styles.profileImage}
                />
              ) : (
                <Ionicons name="person-outline" size={24} color={COLORS.textPrimary} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding / 2,
    height: SIZES.headerHeight,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  centerTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  cartButton: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: 6,
    top: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

export default Header;
