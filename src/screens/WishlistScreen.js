import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';

const WishlistScreen = ({ navigation }) => {
  const { wishlist, removeFromWishlist, addToCart } = useApp();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  if (wishlist.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color={COLORS.gray} />
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add products to your wishlist to see them here
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>My Wishlist ({wishlist.length})</Text>
        
        {wishlist.map((item) => (
          <View key={item.id} style={styles.wishlistItem}>
            <View style={styles.itemContainer}>
              {/* Product Image */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
              </View>
              
              {/* Product Info */}
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.title || item.name}
                </Text>
                <Text style={styles.productCategory}>
                  {item.category}
                </Text>
                <Text style={styles.productPrice}>${item.price}</Text>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() => handleAddToCart(item)}
              >
                <Ionicons name="bag-outline" size={18} color={COLORS.white} />
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveFromWishlist(item.id)}
              >
                <Ionicons name="heart" size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
    paddingHorizontal: SIZES.padding,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginVertical: SIZES.margin,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding * 2,
  },
  emptyTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: SIZES.margin,
    marginBottom: SIZES.margin / 2,
  },
  emptySubtitle: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.margin * 2,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius * 2,
    ...SHADOWS.medium,
  },
  shopButtonText: {
    color: COLORS.white,
    fontSize: SIZES.base,
    fontWeight: '600',
  },
  wishlistItem: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    ...SHADOWS.light,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.lightGray,
    marginRight: SIZES.margin,
    padding: SIZES.padding / 2,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
    lineHeight: 20,
  },
  productCategory: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  productPrice: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding / 2,
    borderRadius: SIZES.radius,
    flex: 1,
    marginRight: SIZES.margin,
    justifyContent: 'center',
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: SIZES.sm,
    fontWeight: '600',
    marginLeft: 8,
  },
  removeButton: {
    padding: SIZES.padding / 2,
  },
});

export default WishlistScreen;
