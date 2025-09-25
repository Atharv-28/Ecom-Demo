import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SIZES, SHADOWS } from '../utils/theme';
import { SCREEN_NAMES } from '../utils/constants';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import Header from '../components/Header';

const CartScreen = ({ navigation }) => {
  const { 
    cart, 
    totalItems, 
    totalPrice, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useApp();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      Alert.alert(
        'Remove Item',
        'Are you sure you want to remove this item from your cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Remove', 
            onPress: () => removeFromCart(productId),
            style: 'destructive' 
          },
        ]
      );
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId, productName) => {
    Alert.alert(
      'Remove Item',
      `Remove "${productName}" from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          onPress: () => removeFromCart(productId),
          style: 'destructive' 
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          onPress: clearCart,
          style: 'destructive' 
        },
      ]
    );
  };

  const handleCheckout = () => {
    navigation.navigate(SCREEN_NAMES.CHECKOUT);
  };

  const renderCartItem = (item) => (
    <View key={item.id} style={styles.cartItem}>
      <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      
      <View style={styles.productDetails}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
      
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
        >
          <Ionicons name="remove" size={18} color={COLORS.primary} />
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{item.quantity}</Text>
        
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
        >
          <Ionicons name="add" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.id, item.name)}
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          title="Shopping Cart"
          showBack={false}
        />
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-outline" size={80} color={COLORS.gray} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add some products to your cart to see them here
          </Text>
          <Button
            title="Start Shopping"
            onPress={() => navigation.navigate(SCREEN_NAMES.HOME)}
            style={styles.startShoppingButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Shopping Cart"
        subtitle={`${totalItems} item${totalItems !== 1 ? 's' : ''}`}
        showBack={false}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.cartItemsContainer}>
          {cart.map(renderCartItem)}
        </View>
        
        {/* Clear Cart Button */}
        <TouchableOpacity
          style={styles.clearCartButton}
          onPress={handleClearCart}
        >
          <Ionicons name="trash-outline" size={18} color={COLORS.error} />
          <Text style={styles.clearCartText}>Clear Cart</Text>
        </TouchableOpacity>
        
        {/* Order Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({totalItems} items)</Text>
            <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>Free</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${(totalPrice * 0.08).toFixed(2)}</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${(totalPrice * 1.08).toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <Button
          title={`Checkout • $${(totalPrice * 1.08).toFixed(2)}`}
          onPress={handleCheckout}
          style={styles.checkoutButton}
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
  scrollView: {
    flex: 1,
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
  startShoppingButton: {
    paddingHorizontal: SIZES.padding * 2,
  },
  cartItemsContainer: {
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding / 2,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius,
  },
  productDetails: {
    flex: 1,
    marginLeft: SIZES.margin,
  },
  productName: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  productBrand: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.margin,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginHorizontal: SIZES.margin,
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: SIZES.padding / 2,
  },
  clearCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.margin,
    paddingVertical: SIZES.padding / 2,
  },
  clearCartText: {
    fontSize: SIZES.base,
    color: COLORS.error,
    fontWeight: '500',
    marginLeft: 8,
  },
  summaryContainer: {
    backgroundColor: COLORS.white,
    margin: SIZES.padding,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    ...SHADOWS.light,
  },
  summaryTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin / 2,
  },
  summaryLabel: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: SIZES.base,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: SIZES.margin,
    marginTop: SIZES.margin / 2,
  },
  totalLabel: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  checkoutContainer: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    paddingBottom: SIZES.padding + 20,
    ...SHADOWS.medium,
  },
  checkoutButton: {
    marginTop: 0,
  },
});

export default CartScreen;
