import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';
import Button from './Button';

const ProductCard = ({ 
  product, 
  onPress, 
  showAddToCart = true,
  showWishlist = true,
  style 
}) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, getCartItemCount } = useApp();
  
  const inWishlist = isInWishlist(product.id);
  const cartCount = getCartItemCount(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const renderDiscount = () => {
    if (product.discount > 0) {
      return (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{product.discount}%</Text>
        </View>
      );
    }
    return null;
  };

  const renderStockStatus = () => {
    if (!product.inStock) {
      return (
        <View style={styles.outOfStockBadge}>
          <Text style={styles.outOfStockText}>Out of Stock</Text>
        </View>
      );
    }
    return null;
  };

  const renderRating = () => {
    const stars = [];
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={14} color={COLORS.warning} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={14} color={COLORS.warning} />
      );
    }

    const remainingStars = 5 - Math.ceil(product.rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={14} color={COLORS.gray} />
      );
    }

    return (
      <View style={styles.ratingContainer}>
        <View style={styles.stars}>{stars}</View>
        <Text style={styles.ratingText}>({product.reviews})</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress && onPress(product)}
      activeOpacity={0.8}
    >
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.image}
          resizeMode="contain"
        />
        
        {/* Badges */}
        {renderDiscount()}
        {renderStockStatus()}
        
        {/* New Badge */}
        {product.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newText}>New</Text>
          </View>
        )}
        
        {/* Wishlist Button */}
        {showWishlist && (
          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={handleWishlistToggle}
          >
            <Ionicons
              name={inWishlist ? "heart" : "heart-outline"}
              size={20}
              color={inWishlist ? COLORS.primary : COLORS.gray}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.brandText}>{product.brand}</Text>
        <Text style={styles.nameText} numberOfLines={2}>
          {product.name}
        </Text>
        
        {/* Rating */}
        {renderRating()}
        
        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>${product.price}</Text>
          {product.originalPrice && product.originalPrice > product.price && (
            <Text style={styles.originalPriceText}>${product.originalPrice}</Text>
          )}
        </View>
        
        {/* Add to Cart Button */}
        {showAddToCart && product.inStock && (
          <Button
            title={cartCount > 0 ? `In Cart (${cartCount})` : "Add to Cart"}
            onPress={handleAddToCart}
            variant={cartCount > 0 ? "secondary" : "primary"}
            size="small"
            style={styles.addToCartButton}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    ...SHADOWS.light,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    backgroundColor: COLORS.lightGray,
    padding: SIZES.padding,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: SIZES.radius / 2,
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    color: COLORS.white,
    fontSize: SIZES.xs,
    fontWeight: 'bold',
  },
  newBadge: {
    position: 'absolute',
    top: 10,
    right: 50,
    backgroundColor: COLORS.success,
    borderRadius: SIZES.radius,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  newText: {
    color: COLORS.white,
    fontSize: SIZES.xs,
    fontWeight: 'bold',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: COLORS.white,
    fontSize: SIZES.base,
    fontWeight: 'bold',
  },
  wishlistButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  infoContainer: {
    padding: SIZES.padding,
  },
  brandText: {
    fontSize: SIZES.xs,
    color: COLORS.gray,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  nameText: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    fontSize: SIZES.xs,
    color: COLORS.gray,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceText: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: 8,
  },
  originalPriceText: {
    fontSize: SIZES.sm,
    color: COLORS.gray,
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    marginTop: 4,
  },
});

export default ProductCard;
