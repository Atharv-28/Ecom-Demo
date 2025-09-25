import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES } from '../utils/theme';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useApi';
import { LoadingSpinner, ProductGridSkeleton, ErrorMessage } from '../components/Loading';

const SearchScreen = ({ navigation }) => {
  const { addToCart, toggleWishlist, wishlist } = useApp();
  const { products: allProducts, loading, error } = useProducts();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([
    'iPhone 14',
    'Running Shoes',
    'Wireless Headphones',
    'Smart Watch',
  ]);
  const [popularSearches] = useState([
    'Electronics',
    'Fashion',
    'Sports',
    'Books',
    'Home & Garden',
    'Beauty',
  ]);

  const handleSearch = (text) => {
    setSearchText(text);
    
    if (text.length > 0) {
      const results = allProducts.filter(product =>
        product.name.toLowerCase().includes(text.toLowerCase()) ||
        product.category.toLowerCase().includes(text.toLowerCase()) ||
        product.description.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = () => {
    if (searchText.trim() && !recentSearches.includes(searchText.trim())) {
      setRecentSearches(prev => [searchText.trim(), ...prev.slice(0, 4)]);
    }
  };

  const handleRecentSearchPress = (searchTerm) => {
    setSearchText(searchTerm);
    handleSearch(searchTerm);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const renderProductItem = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
      style={styles.productCard}
    />
  );

  const renderRecentSearch = (item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.searchItem}
      onPress={() => handleRecentSearchPress(item)}
    >
      <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
      <Text style={styles.searchItemText}>{item}</Text>
      <TouchableOpacity
        onPress={() => {
          setRecentSearches(prev => prev.filter((_, i) => i !== index));
        }}
      >
        <Ionicons name="close" size={16} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderPopularSearch = (item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.popularTag}
      onPress={() => handleRecentSearchPress(item)}
    >
      <Text style={styles.popularTagText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchText}
            onChangeText={handleSearch}
            onSubmitEditing={handleSearchSubmit}
            autoFocus
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchText('');
                setSearchResults([]);
              }}
            >
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      {searchResults.length > 0 ? (
        // Search Results
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>
            {searchResults.length} Results for "{searchText}"
          </Text>
          <FlatList
            data={searchResults}
            renderItem={renderProductItem}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.productRow}
            contentContainerStyle={styles.productList}
          />
        </View>
      ) : searchText.length > 0 ? (
        // No Results
        <View style={styles.noResults}>
          <Ionicons name="search" size={64} color={COLORS.textSecondary} />
          <Text style={styles.noResultsTitle}>No results found</Text>
          <Text style={styles.noResultsText}>
            Try searching for something else or check your spelling
          </Text>
        </View>
      ) : (
        // Default State - Recent & Popular Searches
        <View style={styles.content}>
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={clearRecentSearches}>
                  <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
              </View>
              {recentSearches.map((item, index) => renderRecentSearch(item, index))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Searches</Text>
            <View style={styles.popularTags}>
              {popularSearches.map((item, index) => renderPopularSearch(item, index))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            {loading ? (
              <ProductGridSkeleton numItems={4} />
            ) : error ? (
              <Text style={styles.errorText}>Failed to load trending products</Text>
            ) : (
              <FlatList
                data={allProducts.slice(0, 4)}
                renderItem={renderProductItem}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={styles.productRow}
              />
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.margin,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    marginRight: SIZES.margin,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.margin,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.base,
    color: COLORS.textPrimary,
    marginLeft: SIZES.margin / 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  section: {
    marginTop: SIZES.margin,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin / 2,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  clearText: {
    fontSize: SIZES.base,
    color: COLORS.primary,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.margin / 2,
    paddingHorizontal: SIZES.margin,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.margin / 2,
  },
  searchItemText: {
    flex: 1,
    fontSize: SIZES.base,
    color: COLORS.textPrimary,
    marginLeft: SIZES.margin / 2,
  },
  popularTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  popularTag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.margin,
    paddingVertical: SIZES.margin / 2,
    borderRadius: SIZES.radius * 2,
    marginRight: SIZES.margin / 2,
    marginBottom: SIZES.margin / 2,
  },
  popularTagText: {
    fontSize: SIZES.base,
    color: COLORS.white,
  },
  productList: {
    paddingTop: SIZES.margin,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  noResultsTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: SIZES.margin,
    marginBottom: SIZES.margin / 2,
  },
  noResultsText: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorText: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: SIZES.margin,
  },
});

export default SearchScreen;
