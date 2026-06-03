import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';

import '@/global.css';
import { Colors } from '@/constants/theme';
import { AppProviders } from '@/providers/auth-provider';

export default function RootLayout() {
  const colors = Colors.light;
  const navTheme = DefaultTheme;

  return (
    <AppProviders>
      <ThemeProvider
        value={{
          ...navTheme,
          colors: {
            ...navTheme.colors,
            background: colors.background,
            card: colors.surface,
            text: colors.text,
            border: colors.border,
            primary: colors.primary,
          },
        }}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerTintColor: colors.text,
            headerStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.background },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
          <Stack.Screen name="register" options={{ title: 'Register', headerShown: false }} />
          <Stack.Screen name="auth/google/callback" options={{ title: 'Google Sign-In', headerShown: false }} />
          <Stack.Screen name="runners" options={{ title: 'Puncak Runners', headerShown: false }} />
          <Stack.Screen name="stays" options={{ title: 'Puncak Menginap', headerShown: false }} />
          <Stack.Screen name="camping" options={{ title: 'Puncak In', headerShown: false }} />
          <Stack.Screen name="events/[slug]" options={{ title: 'Event Details', headerShown: false }} />
          <Stack.Screen name="places/[id]" options={{ title: 'Place Details', headerShown: false }} />
          <Stack.Screen name="bookings/[reference]" options={{ title: 'Booking Details', headerShown: false }} />
          <Stack.Screen name="account-preferences" options={{ title: 'Account Preferences', headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </AppProviders>
  );
}
