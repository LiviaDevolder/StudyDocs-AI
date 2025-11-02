import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...rest }: InputProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const hasError = !!error;

  return (
    <ThemedView style={styles.container}>
      {label && (
        <ThemedText style={styles.label}>{label}</ThemedText>
      )}
      <TextInput
        style={[
          styles.input,
          {
            color: Colors[colorScheme].text,
            borderColor: hasError 
              ? '#ef4444' 
              : Colors[colorScheme].icon,
            backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#f5f5f5',
          },
          style,
        ]}
        placeholderTextColor={Colors[colorScheme].icon}
        {...rest}
      />
      {hasError && (
        <ThemedText style={styles.error}>{error}</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    color: '#ef4444',
  },
});
