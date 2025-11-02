import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { NativeBaseProvider, extendTheme } from 'native-base';
import { ApolloProvider } from '@apollo/client/react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { apolloClient } from '@/lib/apollo-client';
import { AuthProvider, useAuth } from '@/contexts/auth-context';

const theme = extendTheme({
  config: {
    useSystemColorMode: true,
  },
});

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();
  const colorScheme = useColorScheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>

      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <NativeBaseProvider theme={theme}>
            <RootLayoutNav />
          </NativeBaseProvider>
        </ThemeProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}