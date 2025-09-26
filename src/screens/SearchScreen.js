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
    // Handle search submission if needed
  };

  const renderProductItem = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
      style={styles.productCard}
    />
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
        // Default State - Show trending products or empty state
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            {loading ? (
              <ProductGridSkeleton numItems={4} />
            ) : error ? (
              <Text style={styles.errorText}>Failed to load trending products</Text>
            ) : (
              <FlatList
                data={allProducts.slice(0, 6)}
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
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.textPrimary,
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
