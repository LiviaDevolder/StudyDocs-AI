import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const openAddDocumentRef: { current: (() => void) | null } = { current: null };

export default function ProjectLayout() {
  const colorScheme = useColorScheme();

  const handleAddPress = () => {
    if (openAddDocumentRef.current) {
      openAddDocumentRef.current();
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
          borderTopColor: colorScheme === 'dark' ? '#333333' : '#e5e5e5',
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documentos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <View style={styles.addButtonContainer}>
              <View style={[styles.addButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
                <Ionicons name="add" size={28} color="white" />
              </View>
            </View>
          ),
          tabBarButton: (props) => {
            const { onPress, ...restProps } = props;
            return (
              <HapticTab
                {...restProps}
                onPress={handleAddPress}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size || 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addButtonContainer: {
    position: 'relative',
    top: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
