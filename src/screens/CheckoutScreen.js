import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES } from '../utils/theme';
import Button from '../components/Button';

const CheckoutScreen = ({ navigation }) => {
  const { cart, clearCart } = useApp();
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const addresses = [
    {
      id: 1,
      name: 'Home',
      address: '123 Main Street, New York, NY 10001',
      phone: '+1 (555) 123-4567',
    },
    {
      id: 2,
      name: 'Office',
      address: '456 Business Ave, New York, NY 10002',
      phone: '+1 (555) 987-6543',
    },
  ];

  const paymentMethods = [
    {
      id: 1,
      type: 'card',
      name: 'Credit Card',
      details: '**** **** **** 1234',
      icon: 'card-outline',
    },
    {
      id: 2,
      type: 'paypal',
      name: 'PayPal',
      details: 'user@example.com',
      icon: 'logo-paypal',
    },
    {
      id: 3,
      type: 'apple',
      name: 'Apple Pay',
      details: 'Touch ID or Face ID',
      icon: 'logo-apple',
    },
  ];

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax - discount;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setDiscount(subtotal * 0.1);
      Alert.alert('Promo Applied!', '10% discount has been applied.');
    } else if (promoCode.toLowerCase() === 'freeship') {
      setDiscount(shipping);
      Alert.alert('Promo Applied!', 'Free shipping discount applied.');
    } else {
      Alert.alert('Invalid Code', 'Please enter a valid promo code.');
    }
  };

  const handlePlaceOrder = () => {
    Alert.alert(
      'Order Placed!',
      'Your order has been placed successfully. You will receive a confirmation email shortly.',
      [
        {
          text: 'Continue Shopping',
          onPress: () => {
            clearCart();
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  const renderCartItem = (item) => (
    <View key={`${item.id}-${item.size || ''}`} style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.size && <Text style={styles.itemSize}>Size: {item.size}</Text>}
        <Text style={styles.itemPrice}>
          ${item.price} x {item.quantity}
        </Text>
      </View>
      <Text style={styles.itemTotal}>
        ${(item.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  const renderAddress = (address, index) => (
    <TouchableOpacity
      key={address.id}
      style={[
        styles.addressCard,
        selectedAddress === index && styles.selectedCard,
      ]}
      onPress={() => setSelectedAddress(index)}
    >
      <View style={styles.addressHeader}>
        <Text style={styles.addressName}>{address.name}</Text>
        <View style={styles.radioButton}>
          {selectedAddress === index && <View style={styles.radioButtonSelected} />}
        </View>
      </View>
      <Text style={styles.addressText}>{address.address}</Text>
      <Text style={styles.addressPhone}>{address.phone}</Text>
    </TouchableOpacity>
  );

  const renderPaymentMethod = (method, index) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentCard,
        selectedPayment === index && styles.selectedCard,
      ]}
      onPress={() => setSelectedPayment(index)}
    >
      <View style={styles.paymentHeader}>
        <View style={styles.paymentLeft}>
          <Ionicons name={method.icon} size={24} color={COLORS.primary} />
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentName}>{method.name}</Text>
            <Text style={styles.paymentDetails}>{method.details}</Text>
          </View>
        </View>
        <View style={styles.radioButton}>
          {selectedPayment === index && <View style={styles.radioButtonSelected} />}
        </View>
      </View>
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
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cart.map(renderCartItem)}
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity>
              <Text style={styles.addButton}>+ Add New</Text>
            </TouchableOpacity>
          </View>
          {addresses.map(renderAddress)}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity>
              <Text style={styles.addButton}>+ Add New</Text>
            </TouchableOpacity>
          </View>
          {paymentMethods.map(renderPaymentMethod)}
        </View>

        {/* Promo Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promo Code</Text>
          <View style={styles.promoContainer}>
            <TextInput
              style={styles.promoInput}
              placeholder="Enter promo code"
              value={promoCode}
              onChangeText={setPromoCode}
            />
            <TouchableOpacity style={styles.promoButton} onPress={handleApplyPromo}>
              <Text style={styles.promoButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.promoHint}>Try: SAVE10 or FREESHIP</Text>
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping</Text>
            <Text style={styles.priceValue}>
              {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
            </Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tax</Text>
            <Text style={styles.priceValue}>${tax.toFixed(2)}</Text>
          </View>
          
          {discount > 0 && (
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: COLORS.success }]}>Discount</Text>
              <Text style={[styles.priceValue, { color: COLORS.success }]}>
                -${discount.toFixed(2)}
              </Text>
            </View>
          )}
          
          <View style={styles.divider} />
          
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <View style={styles.totalSummary}>
          <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
          <Text style={styles.itemCount}>{cart.length} items</Text>
        </View>
        <Button
          title="Place Order"
          onPress={handlePlaceOrder}
          style={styles.placeOrderButton}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.margin,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: SIZES.margin / 2,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.margin,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin,
  },
  addButton: {
    fontSize: SIZES.base,
    color: COLORS.primary,
    fontWeight: '600',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.margin / 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin / 4,
  },
  itemSize: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: SIZES.margin / 4,
  },
  itemPrice: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  itemTotal: {
    fontSize: SIZES.base,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  addressCard: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    padding: SIZES.margin,
    marginBottom: SIZES.margin / 2,
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin / 2,
  },
  addressName: {
    fontSize: SIZES.base,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  addressText: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    marginBottom: SIZES.margin / 4,
  },
  addressPhone: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  paymentCard: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    padding: SIZES.margin,
    marginBottom: SIZES.margin / 2,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentInfo: {
    marginLeft: SIZES.margin,
  },
  paymentName: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin / 4,
  },
  paymentDetails: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  promoContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.margin / 2,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.margin,
    paddingVertical: SIZES.margin / 2,
    fontSize: SIZES.base,
    marginRight: SIZES.margin / 2,
  },
  promoButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.margin,
    paddingVertical: SIZES.margin / 2,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoButtonText: {
    fontSize: SIZES.base,
    color: COLORS.white,
    fontWeight: '600',
  },
  promoHint: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin / 2,
  },
  priceLabel: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
  },
  priceValue: {
    fontSize: SIZES.base,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SIZES.margin / 2,
  },
  totalLabel: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
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
  totalSummary: {
    flex: 1,
    marginRight: SIZES.margin,
  },
  totalText: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  itemCount: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  placeOrderButton: {
    flex: 1,
  },
});

export default CheckoutScreen;
