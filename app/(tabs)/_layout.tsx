import { Tabs, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AlertDialog, Button, Text } from 'native-base';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/auth-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { signOut, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const cancelRef = React.useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
  };

  const confirmLogout = async () => {
    setIsLogoutDialogOpen(false);
    try {
      await signOut();
    } catch (error) {
      console.error('Erro no signOut:', error);
    }
  };

  const cancelLogout = () => {
    setIsLogoutDialogOpen(false);
  };

  return (
    <>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
          borderTopColor: colorScheme === 'dark' ? '#333333' : '#e5e5e5',
          borderTopWidth: 1,
          height: 65,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Projetos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="folder" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.addButtonContainer,
              { 
                backgroundColor: focused 
                  ? Colors[colorScheme ?? 'light'].tint 
                  : Colors[colorScheme ?? 'light'].tint,
                shadowColor: focused 
                  ? Colors[colorScheme ?? 'light'].tint 
                  : '#000',
              }
            ]}>
              <Ionicons 
                name="add" 
                size={32} 
                color="#ffffff" 
              />
            </View>
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={[props.style, { top: -10 }]}
              activeOpacity={0.7}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Sair',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size || 24} color={color} />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              activeOpacity={0.7}
            />
          ),
        }}
      />
    </Tabs>
    
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isLogoutDialogOpen}
      onClose={cancelLogout}
    >
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        <AlertDialog.Header>Sair</AlertDialog.Header>
        <AlertDialog.Body>
          Tem certeza que deseja sair da sua conta?
        </AlertDialog.Body>
        <AlertDialog.Footer>
          <Button.Group space={2}>
            <Button
              variant="unstyled"
              colorScheme="coolGray"
              onPress={cancelLogout}
              ref={cancelRef}
            >
              Cancelar
            </Button>
            <Button colorScheme="danger" onPress={confirmLogout}>
              Sair
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  </>
  );
}

const styles = StyleSheet.create({
  addButtonContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
