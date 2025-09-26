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


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useApp();

  const DEMO_USER = {
    email: 'test@test.com',
    password: '123456'
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      if (email.toLowerCase() === DEMO_USER.email && password === DEMO_USER.password) {
        const demoUser = {
          id: '1',
          email: DEMO_USER.email,
          name: 'Demo User',
          avatar: null,
        };
        login(demoUser);
        setIsLoading(false);
        Alert.alert('Welcome!', 'Successfully logged in as demo user');
      } else {
        // For demo purposes, accept any other email/password combination
        const user = {
          id: '2',
          email: email,
          name: email.split('@')[0] || 'User',
          avatar: null,
        };
        login(user);
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleDemoLogin = () => {
    setEmail(DEMO_USER.email);
    setPassword(DEMO_USER.password);
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset link will be sent to your email');
  };

  const navigateToRegister = () => {
    Alert.alert('Under Development', 'Sign up feature is currently under development. Please use the demo account for now.');
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
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.logoContainer}
            >
              <Ionicons name="storefront" size={40} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to your account to continue shopping</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
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

            {/* Forgot Password */}
            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.loginButtonGradient}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loginButtonText}>Signing In...</Text>
                  </View>
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Demo Login Button */}
            <TouchableOpacity 
              style={styles.demoButton}
              onPress={handleDemoLogin}
            >
              <Ionicons name="person-circle-outline" size={20} color={COLORS.primary} />
              <Text style={styles.demoButtonText}>Use Demo Account</Text>
            </TouchableOpacity>

            {/* Demo Credentials Info */}
            <View style={styles.demoInfoContainer}>
              <Text style={styles.demoInfoText}>Demo Credentials:</Text>
              <Text style={styles.demoCredentials}>Email: test@test.com</Text>
              <Text style={styles.demoCredentials}>Password: 123456</Text>
            </View>
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text style={styles.footerLink} onPress={navigateToRegister}>
                Sign Up
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
    paddingBottom: SIZES.padding * 1.5,
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
    marginBottom: SIZES.margin * 1.2,
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: SIZES.margin * 1.5,
  },
  forgotPasswordText: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: SIZES.radius * 1.5,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonGradient: {
    height: SIZES.buttonHeight + 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.white,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SIZES.margin * 1.5,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.lightGray,
  },
  dividerText: {
    paddingHorizontal: SIZES.padding,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 1.5,
    height: SIZES.buttonHeight,
    marginBottom: SIZES.margin,
    ...SHADOWS.light,
  },
  socialButtonText: {
    fontSize: SIZES.base,
    color: COLORS.textPrimary,
    fontWeight: '500',
    marginLeft: SIZES.margin / 2,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: SIZES.radius * 1.5,
    paddingVertical: SIZES.margin,
    marginTop: SIZES.margin,
    ...SHADOWS.light,
  },
  demoButtonText: {
    fontSize: SIZES.base,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: SIZES.margin / 2,
  },
  demoInfoContainer: {
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    padding: SIZES.margin,
    marginTop: SIZES.margin,
  },
  demoInfoText: {
    fontSize: SIZES.sm,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SIZES.margin / 2,
  },
  demoCredentials: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
    marginBottom: SIZES.margin / 4,
  },
  footerSection: {
    alignItems: 'center',
    paddingBottom: SIZES.padding,
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

export default LoginScreen;
