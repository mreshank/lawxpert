import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible until the app is ready
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  useEffect(() => {
    // Hide splash screen when layout is mounted
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    
    hideSplash();
  }, []);

  // This Stack Navigator is used by Expo Router
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    />
  );
} 