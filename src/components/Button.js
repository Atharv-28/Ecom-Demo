import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';

const Button = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline, ghost
  size = 'medium', // small, medium, large
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`${variant}Button`], styles[`${size}Button`]];
    
    if (disabled || loading) {
      baseStyle.push(styles.disabledButton);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${variant}Text`], styles[`${size}Text`]];
    
    if (disabled || loading) {
      baseStyle.push(styles.disabledText);
    }
    
    if (textStyle) {
      baseStyle.push(textStyle);
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? COLORS.white : COLORS.primary} 
        />
      ) : (
        <>
          {icon && icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  
  // Variants
  primaryButton: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.light,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
    ...SHADOWS.light,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  
  // Sizes
  smallButton: {
    paddingVertical: SIZES.padding / 1.5,
    paddingHorizontal: SIZES.padding * 1.2,
    minHeight: 36,
  },
  mediumButton: {
    paddingVertical: SIZES.padding * 1.2,
    paddingHorizontal: SIZES.padding * 2,
    minHeight: SIZES.buttonHeight,
  },
  largeButton: {
    paddingVertical: SIZES.padding * 1.4,
    paddingHorizontal: SIZES.padding * 2.5,
    minHeight: SIZES.buttonHeight + 8,
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: SIZES.base * 1.3,
    paddingHorizontal: 2,
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.primary,
  },
  ghostText: {
    color: COLORS.primary,
  },
  
  // Text sizes
  smallText: {
    fontSize: SIZES.sm,
    lineHeight: SIZES.sm * 1.4,
  },
  mediumText: {
    fontSize: SIZES.base,
    lineHeight: SIZES.base * 1.3,
  },
  largeText: {
    fontSize: SIZES.lg,
    lineHeight: SIZES.lg * 1.2,
  },
  
  // Disabled states
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.8,
  },
});

export default Button;
