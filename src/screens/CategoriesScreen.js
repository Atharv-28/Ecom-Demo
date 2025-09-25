import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SIZES, SHADOWS } from '../utils/theme';
import { SCREEN_NAMES } from '../utils/constants';
import { useCategories, useProducts } from '../hooks/useApi';
import { LoadingSpinner, ErrorMessage } from '../components/Loading';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';

const CategoriesScreen = ({ navigation }) => {
  const { categories, loading, error, refetch } = useCategories();
  const { products } = useProducts();

  const handleCategoryPress = (category) => {
    navigation.navigate(SCREEN_NAMES.PRODUCT_LIST, {
      category: category.name,
      categoryId: category.id,
      apiCategory: category.apiName,
    });
  };

  const handleSearchPress = () => {
    navigation.navigate(SCREEN_NAMES.SEARCH);
  };

  const getCategoryProductCount = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return 0;
    return products.filter(product => 
      product.category.toLowerCase() === category.name.toLowerCase()
    ).length;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Categories" />
        <LoadingSpinner text="Loading categories..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Categories" />
        <ErrorMessage 
          message="Failed to load categories. Please try again."
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  const renderCategory = ({ item }) => {
    const productCount = getCategoryProductCount(item.id);
    const categoryProducts = products.filter(p => 
      p.category.toLowerCase() === item.name.toLowerCase()
    ).slice(0, 3);

    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => handleCategoryPress(item)}
      >
        <View style={styles.categoryHeader}>
          <View style={styles.categoryIconContainer}>
            <Ionicons name={item.icon} size={28} color={COLORS.primary} />
          </View>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.productCount}>{productCount} products</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
        </View>

        {/* Sample Products */}
        <View style={styles.sampleProducts}>
          {categoryProducts.map((product, index) => (
            <View key={product.id} style={styles.sampleProduct}>
              <Image source={{ uri: product.images[0] }} style={styles.sampleImage} />
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Categories"
        subtitle="Shop by category"
        showSearch={true}
        showCart={true}
        onSearchPress={handleSearchPress}
        onCartPress={() => navigation.navigate(SCREEN_NAMES.CART)}
      />

      <View style={styles.content}>
        <SearchBar onSearch={handleSearchPress} />
        
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refetch}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  categoriesList: {
    paddingBottom: SIZES.padding * 2,
  },
  categoryCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 1.5,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    ...SHADOWS.light,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.margin,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  productCount: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  sampleProducts: {
    flexDirection: 'row',
  },
  sampleProduct: {
    marginRight: SIZES.margin / 2,
  },
  sampleImage: {
    width: 60,
    height: 60,
    borderRadius: SIZES.radius,
  },
});

export default CategoriesScreen;
