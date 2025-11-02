import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function CreateProjectScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Criar Novo Projeto
        </Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Configure seu projeto de estudos
        </Text>
      </View>

      <View style={styles.placeholder}>
        <Text style={[styles.placeholderIcon, { color: colors.text }]}>📝</Text>
        <Text style={[styles.placeholderText, { color: colors.text }]}>
          Formulário de criação em breve
        </Text>
        <Text style={[styles.placeholderSubtext, { color: colors.tabIconDefault }]}>
          Aqui você poderá criar novos projetos, adicionar documentos e configurar seu estudo com IA
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});
