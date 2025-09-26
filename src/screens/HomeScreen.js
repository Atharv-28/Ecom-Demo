import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, SIZES, SHADOWS } from '../utils/theme';
import { CATEGORIES, SCREEN_NAMES } from '../utils/constants';
import { useApp } from '../context/AppContext';
import { useProducts } from '../hooks/useApi';
import { LoadingSpinner, ProductGridSkeleton, ErrorMessage } from '../components/Loading';

import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user, totalItems } = useApp();
  
  // Fetch products from API
  const { 
    products: allProducts, 
    loading, 
    error, 
    refreshing, 
    refresh 
  } = useProducts();

  const featuredProducts = allProducts.filter(product => product.isFeatured);
  const newProducts = allProducts.filter(product => product.isNew);

  // If there's an error and no products (not using fallback), show error message
  if (error && !refreshing && allProducts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header navigation={navigation} />
        <ErrorMessage 
          message="Failed to load products. Please check your internet connection."
          onRetry={refresh}
        />
      </SafeAreaView>
    );
  }

  const handleProductPress = (product) => {
    navigation.navigate(SCREEN_NAMES.PRODUCT_DETAIL, { product });
  };

  const handleCategoryPress = (category) => {
    navigation.navigate(SCREEN_NAMES.PRODUCT_LIST, { 
      category: category.name,
      categoryId: category.id 
    });
  };

  const handleSearchPress = () => {
    navigation.navigate(SCREEN_NAMES.SEARCH);
  };

  const handleCartPress = () => {
    navigation.navigate(SCREEN_NAMES.CART);
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item)}
    >
      <View style={styles.categoryIcon}>
        <Ionicons name={item.icon} size={24} color={COLORS.primary} />
      </View>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProductCard = ({ item }) => (
    <ProductCard
      product={item}
      onPress={handleProductPress}
      style={styles.productCard}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={user ? `Hello, ${user.name.split(' ')[0]}!` : 'Welcome!'}
        subtitle="What are you looking for?"
        showSearch={true}
        showCart={true}
        onSearchPress={handleSearchPress}
        onCartPress={handleCartPress}
      />

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Offline Banner */}
        {error && allProducts.length > 0 && (
          <View style={styles.offlineBanner}>
            <Ionicons name="cloud-offline-outline" size={16} color={COLORS.warning} />
            <Text style={styles.offlineBannerText}>
              Using offline data. Pull to refresh when online.
            </Text>
          </View>
        )}
        {/* Search Bar */}
        <View style={styles.section}>
          <SearchBar onSearch={handleSearchPress} />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(SCREEN_NAMES.PRODUCT_LIST, { featured: true })}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {loading && !refreshing ? (
            <ProductGridSkeleton numItems={6} />
          ) : (
            <FlatList
              data={featuredProducts.length > 0 ? featuredProducts : allProducts.slice(0, 10)}
              renderItem={renderProductCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsList}
            />
          )}
        </View>

        {/* New Arrivals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Arrivals</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(SCREEN_NAMES.PRODUCT_LIST, { isNew: true })}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {loading && !refreshing ? (
            <ProductGridSkeleton numItems={6} />
          ) : (
            <FlatList
              data={newProducts.length > 0 ? newProducts : allProducts.slice(10)}
              renderItem={renderProductCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsList}
            />
          )}
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: SIZES.margin * 1.5,
    paddingHorizontal: SIZES.padding,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  sectionTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  seeAllText: {
    fontSize: SIZES.base,
    color: COLORS.primary,
    fontWeight: '600',
  },
  bannerContainer: {
    width: width - (SIZES.padding * 2),
    marginRight: SIZES.margin,
  },
  banner: {
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding * 1.5,
    height: 150,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: SIZES.base,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SIZES.margin,
  },
  bannerButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding / 2,
    borderRadius: SIZES.radius,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: SIZES.sm,
  },
  bannerImage: {
    width: 100,
    height: 100,
    borderRadius: SIZES.radius,
  },
  categoriesList: {
    paddingRight: SIZES.padding,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: SIZES.margin * 1.5,
    width: 70,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.margin / 2,
    ...SHADOWS.light,
  },
  categoryText: {
    fontSize: SIZES.xs,
    color: COLORS.textPrimary,
    textAlign: 'center',
    fontWeight: '500',
  },
  productsList: {
    paddingRight: SIZES.padding,
  },
  productCard: {
    width: 180,
    marginRight: SIZES.margin,
  },
  bottomPadding: {
    height: SIZES.padding * 2,
  },
  offlineBanner: {
    backgroundColor: COLORS.warning + '20', // 20% opacity
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.margin / 2,
    paddingHorizontal: SIZES.padding,
    marginHorizontal: SIZES.padding,
    marginTop: SIZES.margin / 2,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.warning + '40',
  },
  offlineBannerText: {
    fontSize: SIZES.xs,
    color: COLORS.warning,
    marginLeft: SIZES.margin / 2,
    fontWeight: '500',
  },
});

export default HomeScreen;
