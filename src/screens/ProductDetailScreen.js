import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES } from '../utils/theme';
import Button from '../components/Button';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart, toggleWishlist, wishlist } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  
  const isInWishlist = wishlist.some(item => item.id === product.id);
  const sizes = ['S', 'M', 'L', 'XL'];
  
  const handleAddToCart = () => {
    if (product.category === 'Clothing' && !selectedSize) {
      Alert.alert('Size Required', 'Please select a size for this item.');
      return;
    }
    
    addToCart({
      ...product,
      quantity,
      size: selectedSize,
    });
    
    Alert.alert('Added to Cart', `${product.name} has been added to your cart.`);
  };
  
  const handleWishlistToggle = () => {
    toggleWishlist(product);
  };
  
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={handleWishlistToggle}
          >
            <Ionicons
              name={isInWishlist ? "heart" : "heart-outline"}
              size={24}
              color={isInWishlist ? COLORS.error : COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>
        
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
        </View>
        
        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
          
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>
            {product.description || 'Premium quality product with excellent features and modern design. Perfect for everyday use with comfortable fit and durable materials.'}
          </Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>${product.originalPrice}</Text>
            )}
            {product.discount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{product.discount}% OFF</Text>
              </View>
            )}
          </View>
          
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < Math.floor(product.rating) ? "star" : "star-outline"}
                  size={16}
                  color={COLORS.primary}
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviews || 128} reviews)
            </Text>
          </View>
          
          {/* Size Selection for Clothing */}
          {product.category === 'Clothing' && (
            <View style={styles.sizeSection}>
              <Text style={styles.sectionTitle}>Size</Text>
              <View style={styles.sizeOptions}>
                {sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeOption,
                      selectedSize === size && styles.selectedSize
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text style={[
                      styles.sizeText,
                      selectedSize === size && styles.selectedSizeText
                    ]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          
          {/* Quantity Selection */}
          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={decreaseQuantity}
              >
                <Ionicons name="remove" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={increaseQuantity}
              >
                <Ionicons name="add" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.features}>
              <View style={styles.feature}>
                <Ionicons name="shield-checkmark" size={16} color={COLORS.success} />
                <Text style={styles.featureText}>Quality Guaranteed</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="car" size={16} color={COLORS.success} />
                <Text style={styles.featureText}>Free Shipping</Text>
              </View>
              <View style={styles.feature}>
                <Ionicons name="refresh" size={16} color={COLORS.success} />
                <Text style={styles.featureText}>30 Day Returns</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <View style={styles.totalPrice}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${(product.price * quantity).toFixed(2)}</Text>
        </View>
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          style={styles.addToCartButton}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.margin,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishlistButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 300,
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.margin,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    backgroundColor: COLORS.lightGray,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.margin / 2,
    paddingVertical: SIZES.margin / 4,
    borderRadius: SIZES.radius / 2,
    marginBottom: SIZES.margin / 2,
  },
  categoryText: {
    fontSize: SIZES.small,
    color: COLORS.white,
    fontWeight: '600',
  },
  productName: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin / 2,
  },
  productDescription: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SIZES.margin,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.margin / 2,
  },
  price: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: SIZES.margin / 2,
  },
  originalPrice: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
    marginRight: SIZES.margin / 2,
  },
  discountBadge: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SIZES.margin / 2,
    paddingVertical: SIZES.margin / 4,
    borderRadius: SIZES.radius / 2,
  },
  discountText: {
    fontSize: SIZES.small,
    color: COLORS.white,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  stars: {
    flexDirection: 'row',
    marginRight: SIZES.margin / 2,
  },
  ratingText: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
  },
  sizeSection: {
    marginBottom: SIZES.margin,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin / 2,
  },
  sizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sizeOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.margin / 2,
    marginBottom: SIZES.margin / 2,
  },
  selectedSize: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sizeText: {
    fontSize: SIZES.base,
    color: COLORS.textPrimary,
  },
  selectedSizeText: {
    color: COLORS.white,
  },
  quantitySection: {
    marginBottom: SIZES.margin,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginHorizontal: SIZES.margin,
  },
  featuresSection: {
    marginBottom: SIZES.margin,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.margin,
    marginBottom: SIZES.margin / 2,
  },
  featureText: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginLeft: SIZES.margin / 2,
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.margin,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  totalPrice: {
    flex: 1,
    marginRight: SIZES.margin,
  },
  totalLabel: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  totalAmount: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  addToCartButton: {
    flex: 1,
  },
});

export default ProductDetailScreen;
