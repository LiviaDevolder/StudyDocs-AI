import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface LogoProps extends ViewProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const SIZES = {
  small: 40,
  medium: 80,
  large: 120,
};

const FONT_SIZES = {
  small: 18,
  medium: 32,
  large: 48,
};

export function Logo({ size = 'medium', showText = true, style }: LogoProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const iconSize = SIZES[size];
  const fontSize = FONT_SIZES[size];

  return (
    <ThemedView style={[styles.container, style]}>
      <IconSymbol 
        name="doc.text.fill" 
        size={iconSize} 
        color={Colors[colorScheme].tint}
      />
      {showText && (
        <ThemedText 
          type={size === 'large' ? 'title' : 'defaultSemiBold'} 
          style={[styles.text, { fontSize }]}
        >
          StudyDocs AI
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  text: {
    textAlign: 'center',
  },
});
