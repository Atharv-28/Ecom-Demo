import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, SIZES, SHADOWS } from '../utils/theme';
import { SCREEN_NAMES } from '../utils/constants';
import { useApp } from '../context/AppContext';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useApp();

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = async () => {
    const { name, email, phone, password, confirmPassword } = formData;

    // Validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newUser = {
        ...MOCK_USER,
        name,
        email,
        phone,
      };
      login(newUser);
      setIsLoading(false);
      Alert.alert('Success', 'Account created successfully!');
    }, 1500);
  };

  const navigateToLogin = () => {
    navigation.navigate(SCREEN_NAMES.LOGIN);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <LinearGradient
              colors={[COLORS.secondary, COLORS.secondaryDark]}
              style={styles.logoContainer}
            >
              <Ionicons name="person-add" size={40} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join us and start your shopping journey</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChangeText={(value) => updateFormData('name', value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChangeText={(value) => updateFormData('phone', value)}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={(value) => updateFormData('password', value)}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={COLORS.gray}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => updateFormData('confirmPassword', value)}
                  secureTextEntry={!isConfirmPasswordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={isConfirmPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={COLORS.gray}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <LinearGradient
                colors={[COLORS.secondary, COLORS.secondaryDark]}
                style={styles.registerButtonGradient}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.registerButtonText}>Creating Account...</Text>
                  </View>
                ) : (
                  <Text style={styles.registerButtonText}>Create Account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Terms and Conditions */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By creating an account, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text style={styles.footerLink} onPress={navigateToLogin}>
                Sign In
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SIZES.padding * 1.5,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: SIZES.padding * 2,
    paddingBottom: SIZES.padding,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.margin,
    ...SHADOWS.medium,
  },
  title: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin / 2,
  },
  subtitle: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  formSection: {
    flex: 1,
    paddingVertical: SIZES.padding,
  },
  inputContainer: {
    marginBottom: SIZES.margin,
  },
  inputLabel: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SIZES.margin / 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 1.5,
    paddingHorizontal: SIZES.padding,
    height: SIZES.inputHeight + 8,
    ...SHADOWS.light,
  },
  inputIcon: {
    marginRight: SIZES.margin / 2,
  },
  textInput: {
    flex: 1,
    fontSize: SIZES.base,
    color: COLORS.textPrimary,
  },
  eyeIcon: {
    padding: 5,
  },
  registerButton: {
    borderRadius: SIZES.radius * 1.5,
    overflow: 'hidden',
    marginTop: SIZES.margin,
    ...SHADOWS.medium,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonGradient: {
    height: SIZES.buttonHeight + 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.white,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  termsContainer: {
    marginTop: SIZES.margin * 1.5,
    paddingHorizontal: SIZES.padding / 2,
  },
  termsText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  footerSection: {
    alignItems: 'center',
    paddingBottom: SIZES.padding,
    marginTop: SIZES.margin,
  },
  footerText: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
  },
  footerLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default RegisterScreen;
