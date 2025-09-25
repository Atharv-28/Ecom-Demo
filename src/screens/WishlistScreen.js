import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../utils/theme';

const WishlistScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wishlist Screen</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin / 2,
  },
  subtitle: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
  },
});

export default WishlistScreen;
