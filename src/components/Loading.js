import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../utils/theme';

const LoadingSpinner = ({ 
  size = 'large', 
  color = COLORS.primary, 
  text = 'Loading...',
  style = {} 
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const ProductGridSkeleton = ({ numItems = 6 }) => {
  return (
    <View style={styles.gridContainer}>
      {Array.from({ length: numItems }, (_, index) => (
        <View key={index} style={styles.skeletonCard}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonTextContainer}>
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonSubtitle} />
            <View style={styles.skeletonPrice} />
          </View>
        </View>
      ))}
    </View>
  );
};

const ErrorMessage = ({ 
  message = 'Something went wrong', 
  onRetry = null,
  style = {} 
}) => {
  return (
    <View style={[styles.errorContainer, style]}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorTitle}>Oops!</Text>
      <Text style={styles.errorMessage}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  text: {
    marginTop: SIZES.margin,
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: SIZES.padding,
  },
  skeletonCard: {
    width: '48%',
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.margin,
    padding: SIZES.margin / 2,
  },
  skeletonImage: {
    width: '100%',
    height: 150,
    backgroundColor: COLORS.gray,
    borderRadius: SIZES.radius / 2,
    marginBottom: SIZES.margin / 2,
  },
  skeletonTextContainer: {
    gap: SIZES.margin / 3,
  },
  skeletonTitle: {
    height: 16,
    backgroundColor: COLORS.gray,
    borderRadius: 4,
    width: '100%',
  },
  skeletonSubtitle: {
    height: 12,
    backgroundColor: COLORS.gray,
    borderRadius: 4,
    width: '70%',
  },
  skeletonPrice: {
    height: 14,
    backgroundColor: COLORS.gray,
    borderRadius: 4,
    width: '40%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
    backgroundColor: COLORS.background,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: SIZES.margin,
  },
  errorTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin / 2,
  },
  errorMessage: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SIZES.margin * 2,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding * 1.5,
    paddingVertical: SIZES.margin,
    borderRadius: SIZES.radius,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: SIZES.base,
    fontWeight: '600',
  },
});

export { LoadingSpinner, ProductGridSkeleton, ErrorMessage };
