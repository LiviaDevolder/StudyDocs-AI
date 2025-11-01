import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { NativeBaseProvider, extendTheme } from 'native-base';
import { ApolloProvider } from '@apollo/client/react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { apolloClient } from '@/lib/apollo-client';

export const unstable_settings = {
  anchor: '(tabs)',
};

const theme = extendTheme({
  config: {
    useSystemColorMode: true,
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <NativeBaseProvider theme={theme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>

          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </NativeBaseProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}