import React from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface TextLinkProps extends TouchableOpacityProps {
  children: string;
}

export function TextLink({ children, style, ...rest }: TextLinkProps) {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <TouchableOpacity style={[styles.container, style]} {...rest}>
      <ThemedText style={[styles.text, { color: Colors[colorScheme].tint }]}>
        {children}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
