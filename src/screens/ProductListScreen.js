import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SIZES, SHADOWS } from '../utils/theme';
import { SORT_OPTIONS, FILTER_OPTIONS, SCREEN_NAMES } from '../utils/constants';
import { useProducts } from '../hooks/useApi';
import { LoadingSpinner, ProductGridSkeleton, ErrorMessage } from '../components/Loading';
import { apiService } from '../services/api';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

const ProductListScreen = ({ navigation, route }) => {
  const { category, categoryId, featured, isNew, apiCategory } = route.params || {};
  
  // Use different hook based on whether we're filtering by category
  const { 
    products: allProducts, 
    loading, 
    error, 
    refreshing, 
    refresh 
  } = useProducts({ category: apiCategory });

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('popular');
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [priceFilter, setPriceFilter] = useState(null);
  const [ratingFilter, setRatingFilter] = useState(null);

  useEffect(() => {
    let filtered = allProducts;

    if (category && !apiCategory) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (featured) {
      filtered = filtered.filter(product => product.isFeatured);
    }
    if (isNew) {
      filtered = filtered.filter(product => product.isNew);
    }

    setFilteredProducts(filtered);
  }, [allProducts, category, categoryId, featured, isNew, apiCategory]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [allProducts, sortOption, priceFilter, ratingFilter]);

  const applyFiltersAndSort = () => {
    let filtered = [...allProducts];

    // Filter by category if not using API category filter
    if (category && !apiCategory) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (featured) {
      filtered = filtered.filter(product => product.isFeatured);
    }
    if (isNew) {
      filtered = filtered.filter(product => product.isNew);
    }

    // Apply price filter
    if (priceFilter) {
      filtered = filtered.filter(product => {
        if (priceFilter.max === null) {
          return product.price >= priceFilter.min;
        }
        return product.price >= priceFilter.min && product.price <= priceFilter.max;
      });
    }

    // Apply rating filter
    if (ratingFilter) {
      filtered = filtered.filter(product => product.rating >= ratingFilter);
    }

    // Apply sorting
    switch (sortOption) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.isNew - a.isNew);
        break;
      default:
        filtered.sort((a, b) => b.reviews - a.reviews);
    }

    setFilteredProducts(filtered);
  };

  const handleProductPress = (product) => {
    navigation.navigate(SCREEN_NAMES.PRODUCT_DETAIL, { product });
  };

  const handleSortSelect = (option) => {
    setSortOption(option.value);
    setShowSortModal(false);
  };

  const handlePriceFilterSelect = (filter) => {
    setPriceFilter(filter);
  };

  const clearFilters = () => {
    setPriceFilter(null);
    setRatingFilter(null);
    setShowFilterModal(false);
  };

  const renderProduct = ({ item }) => (
    <ProductCard
      product={item}
      onPress={handleProductPress}
      style={styles.productCard}
    />
  );

  const renderSortOption = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.modalOption,
        sortOption === item.value && styles.selectedOption
      ]}
      onPress={() => handleSortSelect(item)}
    >
      <Text style={[
        styles.modalOptionText,
        sortOption === item.value && styles.selectedOptionText
      ]}>
        {item.label}
      </Text>
      {sortOption === item.value && (
        <Ionicons name="checkmark" size={20} color={COLORS.primary} />
      )}
    </TouchableOpacity>
  );

  const renderPriceFilter = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.modalOption,
        priceFilter === item && styles.selectedOption
      ]}
      onPress={() => handlePriceFilterSelect(item)}
    >
      <Text style={[
        styles.modalOptionText,
        priceFilter === item && styles.selectedOptionText
      ]}>
        {item.label}
      </Text>
      {priceFilter === item && (
        <Ionicons name="checkmark" size={20} color={COLORS.primary} />
      )}
    </TouchableOpacity>
  );

  const getTitle = () => {
    if (category) return category;
    if (featured) return 'Featured Products';
    if (isNew) return 'New Arrivals';
    return 'Products';
  };

  // Loading state
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title={getTitle()}
          showBack={true}
          onBackPress={() => navigation.goBack()}
        />
        <ProductGridSkeleton numItems={8} />
      </SafeAreaView>
    );
  }

  // Error state
  if (error && !refreshing && allProducts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title={getTitle()}
          showBack={true}
          onBackPress={() => navigation.goBack()}
        />
        <ErrorMessage 
          message="Failed to load products. Please try again."
          onRetry={refresh}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={getTitle()}
        subtitle={`${filteredProducts.length} products`}
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      {/* Filter and Sort Bar */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowSortModal(true)}
        >
          <Ionicons name="swap-vertical-outline" size={18} color={COLORS.textPrimary} />
          <Text style={styles.filterButtonText}>Sort</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="filter-outline" size={18} color={COLORS.textPrimary} />
          <Text style={styles.filterButtonText}>Filter</Text>
          {(priceFilter || ratingFilter) && (
            <View style={styles.filterBadge} />
          )}
        </TouchableOpacity>
      </View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={SORT_OPTIONS}
              renderItem={renderSortOption}
              keyExtractor={(item) => item.value}
            />
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Price Filter */}
            <Text style={styles.filterSectionTitle}>Price Range</Text>
            <FlatList
              data={FILTER_OPTIONS.PRICE_RANGES}
              renderItem={renderPriceFilter}
              keyExtractor={(item, index) => index.toString()}
            />

            {/* Rating Filter */}
            <Text style={styles.filterSectionTitle}>Minimum Rating</Text>
            <View style={styles.ratingFilters}>
              {FILTER_OPTIONS.RATINGS.map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingFilter,
                    ratingFilter === rating && styles.selectedRatingFilter
                  ]}
                  onPress={() => setRatingFilter(rating)}
                >
                  <Text style={[
                    styles.ratingFilterText,
                    ratingFilter === rating && styles.selectedRatingFilterText
                  ]}>
                    {rating}+ ⭐
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.filterActions}>
              <Button
                title="Clear All"
                onPress={clearFilters}
                variant="outline"
                style={styles.clearButton}
              />
              <Button
                title="Apply Filters"
                onPress={() => setShowFilterModal(false)}
                style={styles.applyButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding / 2,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding / 2,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.lightGray,
    marginRight: SIZES.margin,
    position: 'relative',
  },
  filterButtonText: {
    marginLeft: 8,
    fontSize: SIZES.base,
    color: COLORS.textPrimary,
  },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  productsList: {
    paddingHorizontal: SIZES.padding / 2,
    paddingTop: SIZES.padding / 2,
    paddingBottom: SIZES.padding * 2,
  },
  productCard: {
    flex: 1,
    margin: SIZES.margin / 2,
    maxWidth: '48%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  selectedOption: {
    backgroundColor: COLORS.lightGray,
  },
  modalOptionText: {
    fontSize: SIZES.base,
    color: COLORS.textPrimary,
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  filterSectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
    paddingBottom: SIZES.padding / 2,
  },
  ratingFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding,
  },
  ratingFilter: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding / 2,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.lightGray,
    marginRight: SIZES.margin,
    marginBottom: SIZES.margin / 2,
  },
  selectedRatingFilter: {
    backgroundColor: COLORS.primary,
  },
  ratingFilterText: {
    fontSize: SIZES.base,
    color: COLORS.textPrimary,
  },
  selectedRatingFilterText: {
    color: COLORS.white,
  },
  filterActions: {
    flexDirection: 'row',
    padding: SIZES.padding,
    gap: SIZES.margin,
  },
  clearButton: {
    flex: 1,
  },
  applyButton: {
    flex: 1,
  },
});

export default ProductListScreen;
