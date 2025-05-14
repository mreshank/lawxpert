import { Redirect } from 'expo-router';

export default function Index() {
  // This file is needed for the Expo Router to work with SDK 53
  // It simply redirects to our main app component
  return <Redirect href="/home" />;
} 