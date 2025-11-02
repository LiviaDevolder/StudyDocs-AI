import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({ 
  title, 
  variant = 'primary', 
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...rest 
}: ButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const isDisabled = disabled || loading;

  const getBackgroundColor = () => {
    if (variant === 'outline') return 'transparent';
    if (variant === 'secondary') return Colors[colorScheme].background;
    return Colors[colorScheme].tint;
  };

  const getTextColor = () => {
    if (variant === 'outline' || variant === 'secondary') {
      return Colors[colorScheme].tint;
    }
    return '#ffffff';
  };

  const getBorderColor = () => {
    if (variant === 'outline') return Colors[colorScheme].tint;
    return 'transparent';
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          opacity: isDisabled ? 0.6 : 1,
        },
        fullWidth && styles.fullWidth,
        variant === 'outline' && styles.outline,
        style,
      ]}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <ThemedText 
          style={[
            styles.text,
            { color: getTextColor() },
          ]}
        >
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    borderWidth: 0,
  },
  outline: {
    borderWidth: 1.5,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
